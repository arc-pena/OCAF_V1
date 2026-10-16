# -*- coding: utf-8 -*-
"""
Rhino MCP server - run inside Rhino (IronPython 2.7 in Rhino 7, or CPython 3 in Rhino 8).

Speaks the Model Context Protocol (JSON-RPC over "Streamable HTTP") so it can be
added to Claude as a custom connector. Run it with EditPythonScript / RunPythonScript.
Running the script again stops the server (toggle).

Endpoint:  http://127.0.0.1:5500/mcp/<TOKEN>
Claude's connectors call from the internet, so expose it with a tunnel, e.g.
    cloudflared tunnel --url http://127.0.0.1:5500
and give Claude:  https://<random>.trycloudflare.com/mcp/<TOKEN>
"""
import json
import sys
import threading
import traceback

import Rhino
import rhinoscriptsyntax as rs
import scriptcontext as sc
import System

try:  # IronPython 2.7
    from BaseHTTPServer import BaseHTTPRequestHandler, HTTPServer
    from SocketServer import ThreadingMixIn
    from StringIO import StringIO
except ImportError:  # CPython 3
    from http.server import BaseHTTPRequestHandler, HTTPServer
    from socketserver import ThreadingMixIn
    from io import StringIO

HOST = "127.0.0.1"
PORT = 5500
STICKY_KEY = "rhino_mcp_server"
PROTOCOL_VERSION = "2025-06-18"


def _token():
    # Secret path segment; the URL is the only credential, so keep it private.
    tok = sc.sticky.get("rhino_mcp_token")
    if not tok:
        tok = System.Guid.NewGuid().ToString("N")[:16]
        sc.sticky["rhino_mcp_token"] = tok
    return tok


# ---------------------------------------------------------------- UI thread
def on_ui(fn):
    """RhinoCommon is not thread safe: run fn on Rhino's UI thread and wait."""
    box = {}
    done = threading.Event()

    def run():
        try:
            box["value"] = fn()
        except Exception:
            box["error"] = traceback.format_exc()
        finally:
            done.set()

    Rhino.RhinoApp.InvokeOnUiThread(System.Action(run))
    if not done.wait(120):
        raise RuntimeError("Timed out waiting for Rhino UI thread")
    if "error" in box:
        raise RuntimeError(box["error"])
    return box.get("value")


def _doc():
    return Rhino.RhinoDoc.ActiveDoc


# -------------------------------------------------------------------- tools
def tool_document_info(args):
    def f():
        d = _doc()
        return {
            "name": d.Name,
            "path": d.Path,
            "units": str(d.ModelUnitSystem),
            "tolerance": d.ModelAbsoluteTolerance,
            "object_count": d.Objects.Count,
            "layers": [l.FullPath for l in d.Layers if not l.IsDeleted],
            "rhino_version": str(Rhino.RhinoApp.Version),
        }
    return f


def tool_list_objects(args):
    limit = int(args.get("limit", 200))
    layer = args.get("layer")
    selected_only = bool(args.get("selected_only", False))

    def f():
        d = _doc()
        out = []
        for o in d.Objects:
            if o.IsDeleted:
                continue
            if selected_only and not o.IsSelected(False):
                continue
            lname = d.Layers[o.Attributes.LayerIndex].FullPath
            if layer and lname != layer:
                continue
            bb = o.Geometry.GetBoundingBox(True)
            out.append({
                "id": str(o.Id),
                "type": str(o.ObjectType),
                "name": o.Attributes.Name,
                "layer": lname,
                "bbox": [[bb.Min.X, bb.Min.Y, bb.Min.Z], [bb.Max.X, bb.Max.Y, bb.Max.Z]],
            })
            if len(out) >= limit:
                break
        return out
    return f


def tool_run_command(args):
    cmd = args["command"]

    def f():
        ok = Rhino.RhinoApp.RunScript(cmd, bool(args.get("echo", True)))
        _doc().Views.Redraw()
        return {"success": bool(ok)}
    return f


def tool_run_python(args):
    code = args["code"]

    def f():
        buf = StringIO()
        old = sys.stdout
        sys.stdout = buf
        env = {"Rhino": Rhino, "rs": rs, "sc": sc, "System": System, "doc": _doc(), "result": None}
        try:
            exec(code, env)
        finally:
            sys.stdout = old
        _doc().Views.Redraw()
        res = env.get("result")
        try:
            json.dumps(res)
        except Exception:
            res = repr(res)
        return {"stdout": buf.getvalue(), "result": res}
    return f


def tool_delete_objects(args):
    ids = args["ids"]

    def f():
        n = rs.DeleteObjects(ids)
        _doc().Views.Redraw()
        return {"deleted": n}
    return f


def tool_capture_view(args):
    path = args.get("path") or System.IO.Path.Combine(System.IO.Path.GetTempPath(), "rhino_mcp_view.png")
    w, h = int(args.get("width", 1200)), int(args.get("height", 800))

    def f():
        view = _doc().Views.ActiveView
        bmp = view.CaptureToBitmap(System.Drawing.Size(w, h))
        bmp.Save(path)
        return {"saved": path, "view": view.ActiveViewport.Name}
    return f


TOOLS = {
    "document_info": (tool_document_info, "Info about the active Rhino document: units, layers, object count.",
                      {"type": "object", "properties": {}}),
    "list_objects": (tool_list_objects, "List objects (id, type, name, layer, bounding box).",
                     {"type": "object", "properties": {
                         "limit": {"type": "integer"}, "layer": {"type": "string"},
                         "selected_only": {"type": "boolean"}}}),
    "run_command": (tool_run_command, "Run a Rhino command-line macro, e.g. '_Box 0,0,0 10,10,0 5'. Prefix commands with _ and use - for scriptable variants.",
                    {"type": "object", "properties": {"command": {"type": "string"}, "echo": {"type": "boolean"}},
                     "required": ["command"]}),
    "run_python": (tool_run_python, "Execute Python inside Rhino. Globals: Rhino, rs (rhinoscriptsyntax), sc, System, doc. print() is captured; set `result` to return a JSON value.",
                   {"type": "object", "properties": {"code": {"type": "string"}}, "required": ["code"]}),
    "delete_objects": (tool_delete_objects, "Delete objects by id.",
                       {"type": "object", "properties": {"ids": {"type": "array", "items": {"type": "string"}}},
                        "required": ["ids"]}),
    "capture_view": (tool_capture_view, "Save the active viewport to a PNG on the Rhino machine.",
                     {"type": "object", "properties": {"path": {"type": "string"}, "width": {"type": "integer"},
                                                       "height": {"type": "integer"}}}),
}


# --------------------------------------------------------------- JSON-RPC
def handle_rpc(msg):
    method = msg.get("method")
    mid = msg.get("id")
    if mid is None:  # notification (e.g. notifications/initialized)
        return None

    def ok(result):
        return {"jsonrpc": "2.0", "id": mid, "result": result}

    if method == "initialize":
        return ok({
            "protocolVersion": msg.get("params", {}).get("protocolVersion", PROTOCOL_VERSION),
            "capabilities": {"tools": {"listChanged": False}},
            "serverInfo": {"name": "rhino-mcp", "version": "0.1.0"},
        })
    if method == "ping":
        return ok({})
    if method == "tools/list":
        return ok({"tools": [{"name": n, "description": t[1], "inputSchema": t[2]} for n, t in TOOLS.items()]})
    if method == "tools/call":
        p = msg.get("params", {})
        name = p.get("name")
        if name not in TOOLS:
            return {"jsonrpc": "2.0", "id": mid, "error": {"code": -32602, "message": "Unknown tool " + str(name)}}
        try:
            value = on_ui(TOOLS[name][0](p.get("arguments") or {}))
            return ok({"content": [{"type": "text", "text": json.dumps(value, indent=1, default=str)}]})
        except Exception as e:
            return ok({"content": [{"type": "text", "text": str(e)}], "isError": True})
    return {"jsonrpc": "2.0", "id": mid, "error": {"code": -32601, "message": "Method not found: " + str(method)}}


UI_HTML = u"""<!doctype html><html><head><meta charset="utf-8"><title>Rhino Console</title>
<style>body{font:14px system-ui;margin:20px;max-width:900px}textarea{width:100%;height:180px;font:13px monospace}
pre{background:#f3f3f3;padding:10px;white-space:pre-wrap}button{padding:6px 14px;margin:6px 6px 6px 0}</style></head>
<body><h2>Rhino Console</h2><p>Connected to Rhino. Call <code>rhino(tool, args)</code> from JS, or use the form.</p>
<select id="tool"></select><br><textarea id="args">{}</textarea><br>
<button onclick="go()">Run</button><pre id="out"></pre>
<script>
const API = location.pathname.replace('/ui/', '/api/');
async function rhino(tool, args){
  const r = await fetch(API, {method:'POST', headers:{'Content-Type':'application/json'},
                              body: JSON.stringify({tool: tool, arguments: args || {}})});
  return r.json();
}
window.rhino = rhino;
async function go(){
  let a; try { a = JSON.parse(document.getElementById('args').value || '{}'); }
  catch(e){ document.getElementById('out').textContent = 'Bad JSON: ' + e; return; }
  document.getElementById('out').textContent = '...';
  const res = await rhino(document.getElementById('tool').value, a);
  document.getElementById('out').textContent = JSON.stringify(res, null, 1);
}
fetch(API).then(r => r.json()).then(ts => {
  const sel = document.getElementById('tool');
  ts.forEach(t => { const o = document.createElement('option'); o.value = o.textContent = t.name; o.title = t.description; sel.appendChild(o); });
});
</script></body></html>"""


def call_tool(name, args):
    if name not in TOOLS:
        return {"ok": False, "error": "Unknown tool " + str(name)}
    try:
        return {"ok": True, "result": on_ui(TOOLS[name][0](args or {}))}
    except Exception as e:
        return {"ok": False, "error": str(e)}


class Handler(BaseHTTPRequestHandler):
    protocol_version = "HTTP/1.1"

    def log_message(self, *a):
        pass

    def _path_ok(self):
        return self.path.split("?")[0].rstrip("/") == "/mcp/" + _token()

    def _route(self):
        return self.path.split("?")[0].rstrip("/")

    def _send(self, code, body=None, html=None):
        if html is not None:
            data = html.encode("utf-8")
        else:
            data = json.dumps(body, default=str).encode("utf-8") if body is not None else b""
        self.send_response(code)
        if html is not None:
            self.send_header("Content-Type", "text/html; charset=utf-8")
        elif body is not None:
            self.send_header("Content-Type", "application/json")
        self.send_header("Content-Length", str(len(data)))
        self.end_headers()
        self.wfile.write(data)

    def do_GET(self):
        r = self._route()
        if r == "/ui/" + _token():
            return self._send(200, html=UI_HTML)
        if r == "/api/" + _token():
            return self._send(200, [{"name": n, "description": t[1], "inputSchema": t[2]} for n, t in TOOLS.items()])
        if r == "" or r == "/":
            return self._send(200, html=u"<p>Rhino MCP server is running. Open /ui/&lt;token&gt; (printed in Rhino).</p>")
        # No server-initiated SSE stream on /mcp; spec allows 405 here.
        self._send(405 if self._path_ok() else 404)

    def do_DELETE(self):
        self._send(200 if self._path_ok() else 404)

    def do_POST(self):
        if self._route() == "/api/" + _token():
            try:
                req = json.loads(self.rfile.read(int(self.headers.get("Content-Length", 0))).decode("utf-8"))
            except Exception:
                return self._send(400, {"ok": False, "error": "Bad JSON"})
            return self._send(200, call_tool(req.get("tool"), req.get("arguments")))
        if not self._path_ok():
            return self._send(404)
        try:
            raw = self.rfile.read(int(self.headers.get("Content-Length", 0)))
            msg = json.loads(raw.decode("utf-8"))
        except Exception:
            return self._send(400, {"jsonrpc": "2.0", "id": None, "error": {"code": -32700, "message": "Parse error"}})
        if isinstance(msg, list):
            res = [r for r in (handle_rpc(m) for m in msg) if r is not None]
            return self._send(200, res) if res else self._send(202)
        res = handle_rpc(msg)
        return self._send(200, res) if res is not None else self._send(202)


class Server(ThreadingMixIn, HTTPServer):
    daemon_threads = True
    allow_reuse_address = True


def start():
    srv = Server((HOST, PORT), Handler)
    t = threading.Thread(target=srv.serve_forever)
    t.daemon = True
    t.start()
    sc.sticky[STICKY_KEY] = srv
    url = "http://%s:%d/mcp/%s" % (HOST, PORT, _token())
    print("Rhino MCP server running: " + url)
    print("Browser console:  http://%s:%d/ui/%s" % (HOST, PORT, _token()))
    print("Expose with:  cloudflared tunnel --url http://%s:%d" % (HOST, PORT))
    print("Connector URL: https://<tunnel-host>/mcp/" + _token())
    print("Run this script again to stop.")


def stop():
    srv = sc.sticky.pop(STICKY_KEY, None)
    if srv:
        threading.Thread(target=srv.shutdown).start()
        srv.server_close()
        print("Rhino MCP server stopped.")


if __name__ == "__main__":
    if sc.sticky.get(STICKY_KEY):
        stop()
    else:
        start()
