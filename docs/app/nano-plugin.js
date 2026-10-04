// Nano Banana: the view out of the window, handed to an image model.
//
// WHAT THIS IS FOR. A path trace tells the truth about light and nothing about
// brick. It will not put people on the pavement, weather on the concrete or a
// street behind the building, and for the half-hour before a meeting those are
// exactly the things that are missing. So: take the picture that is on the
// screen - shaded, arctic, rendered or path-traced, whichever is up - send it
// to Google's image model with a sentence, and put what comes back over the
// top of it with a bar you can drag between the two.
//
// WHAT IT IS NOT. It is not a renderer and it does not know about the model.
// Everything it is given is a bitmap, so the geometry in the answer is the
// geometry in the picture only insofar as the model chose to keep it - which
// is why every suggested prompt here ends by saying so, and why the compare
// bar is not a nicety. Dragging it is how you find out what moved.
//
// THE KEY. It is held in a variable in this module and nowhere else: not in a
// cookie, not in localStorage or sessionStorage, not in the model file, not in
// a saved layout. Closing the tab loses it, which is the point - a key that
// survives a reload is a key that is written down somewhere. The gear says so
// on its face so that nobody has to read this comment to find out.
//
// WHAT HAS NOT BEEN TESTED, said plainly: no test in this repository has
// reached the Gemini API, because there is no key in the container the tests
// run in and asking for one would be asking for a credential. The request and
// the reply are built and read by nano.js, which IS tested, against Google's
// published shapes; everything from the fetch outwards has been driven only
// against a stub. The first real call is the user's.

import { offerPlugin } from "./plugin.js";
import {
  MAX_REFERENCES, NANO_DEFAULT_MODEL, NANO_MODELS, NANO_RATIOS, NANO_SIZES,
  PROMPT_IDEAS, REFERENCE_MAX_EDGE, REFERENCE_ROLES,
  base64Bytes, dataUrlParts, galleryName, imageFromReply, nanoRequest,
  ratioFor, roleInfoFor, storeZip, troubleFromReply,
} from "./nano.js";

const built = (tag, className, html) => {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (html !== undefined) node.innerHTML = html;
  return node;
};

const escaped = text => String(text).replace(/[&<>"']/g, ch =>
  ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[ch]));

const inBytes = bytes => bytes >= 1048576 ? (bytes / 1048576).toFixed(1) + " MB"
  : bytes >= 1024 ? Math.round(bytes / 1024) + " kB" : bytes + " B";

/* ------------------------------------------------------------------ the key

   One variable, module scope, never serialised. It is deliberately NOT on the
   live object the host keeps, because the host's live objects are the things
   that get logged, inspected and handed to the assistant.                   */

let apiKey = "";
let apiModel = NANO_DEFAULT_MODEL;

/* ------------------------------------------------------------------- the view */

class NanoView {
  constructor(kit) {
    this.kit = kit;
    //! EVERY PICTURE THIS SESSION HAS MADE, in memory. A render is a few
    //! hundred kilobytes and a session makes a dozen, so there is no reason to
    //! put them anywhere else - and nowhere else they could go that would not
    //! be writing somebody's work into their browser storage without asking.
    //! A reload loses them, which is why Save and the zip are on the shelf and
    //! not hidden behind a menu.
    this.gallery = [];
    //! THE MOOD BOARD. Pictures of what the view should be LIKE, sent with it
    //! in one call - a style, a material, a street, a light. Kept in memory
    //! beside the gallery and for the same reason: they are somebody's
    //! reference images, and writing them into browser storage uninvited
    //! would be deciding that for them.
    this.refs = [];
    this.at = -1;                       // which one is being shown, or -1
    this.split = 0;                     // where the compare bar is, 0..1
    this.busy = false;
    this.build();
  }

  /* ----------------------------------------------------------------- the DOM */

  build() {
    //! THE TAB, on the right edge, and it is NOT one of the things full screen
    //! takes away. Everything else on the page fades out with Tab because the
    //! model is the point; this stays because in full screen it is the only
    //! way in, which is the case the feature was asked for.
    this.tab = built("button", "nb-tab", "<span>Prompt</span>");
    this.tab.type = "button";
    this.tab.title = "Hand this view to an image model";
    this.tab.addEventListener("click", () => {
      //! IN FULL SCREEN, PRESSING IT MEANS "MAKE THIS USABLE".
      //!
      //! The bar is one of the panels Tab fades out, and a faded panel is
      //! still `hidden === false` - so toggling on that flag closed a bar
      //! nobody could see and read as the tab doing nothing. Measured: the
      //! press left bare true, the bar at opacity 0, and hidden flipped to
      //! true. There is only one thing pressing the tab can sensibly mean in
      //! there, and it is this.
      if (this.kit.isBare && this.kit.isBare()) {
        if (this.kit.bare) this.kit.bare(false);
        this.openBar(true);
        return;
      }
      this.openBar(this.bar.hidden);
    });
    document.body.appendChild(this.tab);

    this.bar = built("section", "float nb-bar");
    this.bar.hidden = true;
    this.bar.innerHTML = `
      <div class="nb-row nb-ask">
        <select class="nb-ideas" aria-label="Suggested prompts">
          <option value="">Suggestions…</option>
          ${PROMPT_IDEAS.map((idea, i) =>
            `<option value="${i}">${escaped(idea.label)}</option>`).join("")}
        </select>
        <textarea class="nb-prompt" rows="1" spellcheck="false"
          placeholder="what should this view become? — Enter to send, Shift+Enter for a new line"
          aria-label="Prompt"></textarea>
        <button class="btn primary nb-send" type="button">Send</button>
        <button class="icon-btn nb-gear" type="button" title="The API key and the model"
                aria-label="The API key and the model">⚙</button>
      </div>
      <div class="nb-row nb-state">
        <div class="nb-track" hidden><div class="nb-fill"></div></div>
        <span class="nb-note"></span>
        <span class="nb-grow"></span>
        <label class="nb-cmp" hidden>
          <span class="nb-tag">Compare</span>
          <input type="range" class="nb-split" min="0" max="1000" value="0"
                 aria-label="Drag between the render and the viewport">
          <span class="nb-read">render</span>
        </label>
        <button class="btn nb-refs-btn" type="button">References</button>
        <button class="btn nb-save" type="button" hidden>Save image</button>
        <button class="btn nb-shelf-btn" type="button">Gallery</button>
      </div>`;
    document.body.appendChild(this.bar);

    //! THE RESULT, OVER THE MODEL. Clipped from the left, so the bar at 0
    //! shows all of the render and at the far right shows all of the viewport
    //! - which is the way round somebody asked for and the opposite of the
    //! usual before/after slider, where the new thing is on the left.
    this.over = built("div", "nb-over");
    this.over.hidden = true;
    this.over.innerHTML = `<img class="nb-img" alt="the image model's answer">
      <div class="nb-edge"><span class="nb-grip"></span></div>`;
    document.body.appendChild(this.over);
    this.img = this.over.querySelector(".nb-img");
    this.edge = this.over.querySelector(".nb-edge");

    this.shelf = built("aside", "float nb-shelf");
    this.shelf.hidden = true;
    this.shelf.innerHTML = `
      <div class="panel-head"><h2>Images</h2></div>
      <div class="nb-shelf-body"></div>
      <div class="nb-shelf-foot">
        <button class="btn nb-zip" type="button">Download all as a zip</button>
        <span class="nb-shelf-note"></span>
      </div>`;
    document.body.appendChild(this.shelf);

    //! THREE WAYS IN, because a reference arrives three ways: it is already on
    //! the clipboard, it is a file on disk, or it is a picture on a web page.
    //! Paste, drop and open cover the first two; a URL covers the third and is
    //! the one that can fail for reasons that are nothing to do with this page
    //! - see addFromUrl.
    this.refsPanel = built("aside", "float nb-refs");
    this.refsPanel.hidden = true;
    this.refsPanel.innerHTML = `
      <div class="panel-head"><h2>References</h2></div>
      <div class="nb-refs-ways">
        <div class="nb-row">
          <input type="url" class="nb-url" spellcheck="false" autocomplete="off"
                 placeholder="paste an image URL" aria-label="Image URL">
          <button class="btn nb-url-add" type="button">Add</button>
        </div>
        <div class="nb-row">
          <button class="btn nb-open" type="button">Open a file…</button>
          <input type="file" class="nb-file" accept="image/*" multiple hidden>
          <span class="nb-fine">or drop images here, or paste one</span>
        </div>
      </div>
      <div class="nb-refs-body"></div>
      <div class="nb-refs-foot">
        <span class="nb-refs-note"></span>
        <span class="nb-grow"></span>
        <button class="btn nb-refs-clear" type="button">Clear all</button>
      </div>`;
    document.body.appendChild(this.refsPanel);

    this.keys = built("aside", "float nb-keys");
    this.keys.hidden = true;
    this.keys.innerHTML = `
      <div class="panel-head"><h2>Image model</h2></div>
      <label class="nb-field">
        <span>API key</span>
        <input type="password" class="nb-key" spellcheck="false" autocomplete="off"
               placeholder="paste a Google AI Studio key">
      </label>
      <p class="nb-fine">Held in memory for this tab only. It is not written to a
        cookie, to the browser's storage, or into the model file — so closing
        the tab loses it, and nothing on disk has ever seen it.</p>
      <label class="nb-field">
        <span>Model</span>
        <input type="text" class="nb-model" spellcheck="false" autocomplete="off"
               list="nb-model-list">
        <datalist id="nb-model-list">
          ${NANO_MODELS.map(name => `<option value="${escaped(name)}"></option>`).join("")}
        </datalist>
      </label>
      <div class="nb-field nb-two">
        <label><span>Shape</span>
          <select class="nb-ratio">
            ${NANO_RATIOS.map(name =>
              `<option value="${escaped(name)}">${escaped(name)}</option>`).join("")}
          </select></label>
        <label><span>Size</span>
          <select class="nb-size">
            ${NANO_SIZES.map(name =>
              `<option value="${escaped(name)}">${escaped(name)}</option>`).join("")}
          </select></label>
      </div>
      <p class="nb-fine">The model names are the ones Google published; a name
        typed here is sent as it stands, so a newer one can be used without
        waiting for this page to be rebuilt.</p>`;
    document.body.appendChild(this.keys);

    this.dress();
    this.wire();
  }

  //! Every panel this package puts on the screen goes through the page's own
  //! close mechanism, which is what makes "bring the panels back" know their
  //! names. A hand-rolled cross is a panel the menu cannot find.
  dress() {
    const kit = this.kit;
    if (!kit.closesWith) return;
    kit.closesWith(this.bar, {
      title: "Put the prompt bar away", name: "the prompt bar",
      inline: false,
      close: () => this.openBar(false),
      open: () => this.openBar(true),
      isShut: () => this.bar.hidden,
    });
    kit.closesWith(this.shelf, {
      title: "Close the gallery", name: "the image gallery",
      into: ".panel-head",
      close: () => { this.shelf.hidden = true; },
      open: () => this.openShelf(true),
      isShut: () => this.shelf.hidden,
    });
    kit.closesWith(this.refsPanel, {
      title: "Close the references", name: "the reference images",
      into: ".panel-head",
      close: () => { this.refsPanel.hidden = true; },
      open: () => this.openRefs(true),
      isShut: () => this.refsPanel.hidden,
    });
    kit.closesWith(this.keys, {
      title: "Close", into: ".panel-head",
      close: () => { this.keys.hidden = true; },
    });
  }

  wire() {
    const q = sel => this.bar.querySelector(sel);
    this.ideas = q(".nb-ideas");
    this.prompt = q(".nb-prompt");
    this.send = q(".nb-send");
    this.track = q(".nb-track");
    this.fill = q(".nb-fill");
    this.note = q(".nb-note");
    this.cmp = q(".nb-cmp");
    this.range = q(".nb-split");
    this.read = q(".nb-read");
    this.saveBtn = q(".nb-save");

    this.ideas.addEventListener("change", () => {
      const idea = PROMPT_IDEAS[Number(this.ideas.value)];
      if (!idea) return;
      //! ADDED TO, not replaced over. Somebody who has typed half a sentence
      //! and then reaches for a suggestion meant both.
      const had = this.prompt.value.trim();
      this.prompt.value = had ? had + " " + idea.text : idea.text;
      this.ideas.value = "";
      this.grow();
      this.prompt.focus();
    });
    this.prompt.addEventListener("input", () => this.grow());
    this.prompt.addEventListener("keydown", event => {
      if (event.key === "Enter" && !event.shiftKey) {
        event.preventDefault();
        this.run();
      }
    });
    this.send.addEventListener("click", () => this.run());
    q(".nb-gear").addEventListener("click", () => this.openKeys(this.keys.hidden));
    q(".nb-shelf-btn").addEventListener("click", () => this.openShelf(this.shelf.hidden));
    this.refsBtn = q(".nb-refs-btn");
    this.refsBtn.addEventListener("click", () => this.openRefs(this.refsPanel.hidden));
    this.wireRefs();
    this.saveBtn.addEventListener("click", () => this.saveOne(this.at));

    this.range.addEventListener("input", () => this.setSplit(Number(this.range.value) / 1000));
    //! The grip drags too, because a slider in a bar at the bottom of the
    //! screen is a long way from the line it is moving.
    this.edge.addEventListener("pointerdown", event => {
      event.preventDefault();
      this.edge.setPointerCapture(event.pointerId);
      const move = e => this.setSplit(e.clientX / Math.max(1, window.innerWidth));
      const up = () => {
        this.edge.removeEventListener("pointermove", move);
        this.edge.removeEventListener("pointerup", up);
      };
      this.edge.addEventListener("pointermove", move);
      this.edge.addEventListener("pointerup", up);
      move(event);
    });

    const key = this.keys.querySelector(".nb-key");
    key.addEventListener("input", () => { apiKey = key.value.trim(); this.sayReady(); });
    const model = this.keys.querySelector(".nb-model");
    model.value = apiModel;
    model.addEventListener("input", () => { apiModel = model.value.trim() || NANO_DEFAULT_MODEL; });
    this.ratio = this.keys.querySelector(".nb-ratio");
    this.size = this.keys.querySelector(".nb-size");
    this.shelf.querySelector(".nb-zip").addEventListener("click", () => this.saveZip());
    this.sayReady();
  }

  //! One line of textarea until there are two, which keeps the bar the height
  //! of a bar while a long prompt is being written.
  grow() {
    this.prompt.style.height = "auto";
    this.prompt.style.height = Math.min(96, this.prompt.scrollHeight) + "px";
  }

  openBar(on) {
    this.bar.hidden = !on;
    this.tab.classList.toggle("on", !!on);
    if (on) { this.grow(); this.prompt.focus(); }
  }

  openKeys(on) {
    this.keys.hidden = !on;
    if (on) this.keys.querySelector(".nb-key").focus();
  }

  openShelf(on) {
    this.shelf.hidden = !on;
    if (on) this.paintShelf();
  }

  sayReady() {
    if (this.busy) return;
    this.note.textContent = apiKey
      ? (this.gallery.length ? this.gallery.length
          + (this.gallery.length === 1 ? " image" : " images") + " this session" : "ready")
      : "the gear takes an API key";
  }

  /* ---------------------------------------------------------- the references */

  wireRefs() {
    const panel = this.refsPanel;
    const url = panel.querySelector(".nb-url");
    const file = panel.querySelector(".nb-file");
    panel.querySelector(".nb-open").addEventListener("click", () => file.click());
    file.addEventListener("change", () => {
      this.addFiles(file.files);
      file.value = "";
    });
    const fromUrl = () => {
      const said = url.value.trim();
      if (!said) return;
      url.value = "";
      this.addFromUrl(said);
    };
    panel.querySelector(".nb-url-add").addEventListener("click", fromUrl);
    url.addEventListener("keydown", event => {
      if (event.key === "Enter") { event.preventDefault(); fromUrl(); }
    });
    panel.querySelector(".nb-refs-clear").addEventListener("click", () => {
      this.refs = [];
      this.paintRefs();
    });

    //! DROPPED ON THE PANEL, AND STOPPED THERE.
    //!
    //! The page already listens for a drop on the window, and two or more
    //! images dropped together are read as a PBR material and installed as
    //! nodes in the document - which is the right answer for a window and
    //! exactly the wrong one for a mood board. The window's listener is on the
    //! bubble phase, so stopping propagation here is what keeps six
    //! photographs of concrete from becoming six Texture features.
    panel.addEventListener("dragover", event => {
      event.preventDefault();
      event.stopPropagation();
      panel.classList.add("taking");
    });
    panel.addEventListener("dragleave", () => panel.classList.remove("taking"));
    panel.addEventListener("drop", event => {
      event.preventDefault();
      event.stopPropagation();
      panel.classList.remove("taking");
      const dt = event.dataTransfer;
      if (dt && dt.files && dt.files.length) { this.addFiles(dt.files); return; }
      //! A DRAG FROM ANOTHER TAB is not a file - it is a URL, and sometimes
      //! an <img> whose src is the only thing that crossed.
      const said = dt && (dt.getData("text/uri-list") || dt.getData("text/plain"));
      if (said) this.addFromUrl(said.split(/\s+/)[0]);
    });

    //! PASTED, from anywhere, as long as the bar is up. A paste carrying text
    //! is left alone so that typing a prompt still works normally; one
    //! carrying an image becomes a reference wherever the caret happens to be,
    //! because that is what somebody means by pasting a screenshot.
    this.onPaste = event => {
      if (this.bar.hidden) return;
      const items = event.clipboardData && event.clipboardData.items;
      if (!items) return;
      const pictures = [...items].filter(one => one.type && one.type.startsWith("image/"));
      if (!pictures.length) return;
      event.preventDefault();
      this.addFiles(pictures.map(one => one.getAsFile()).filter(Boolean));
      this.openRefs(true);
    };
    window.addEventListener("paste", this.onPaste);
  }

  openRefs(on) {
    this.refsPanel.hidden = !on;
    if (on) this.paintRefs();
  }

  //! A REFERENCE, SHRUNK ON THE WAY IN.
  //!
  //! A photograph off a phone is four thousand pixels wide and three
  //! megabytes; six of those is eighteen megabytes of base64 in one POST, for
  //! a model that will look at them at a fraction of that. So each one is
  //! drawn down to REFERENCE_MAX_EDGE on its long side and re-encoded as JPEG,
  //! which is what a reference is - a picture to look at, not an asset.
  //!
  //! Returns null rather than throwing for anything the browser will not
  //! decode: the caller's answer to that is a sentence on screen naming the
  //! file, not a stack trace.
  async shrink(blob, name) {
    const url = URL.createObjectURL(blob);
    try {
      const image = await new Promise((done, fail) => {
        const img = new Image();
        img.onload = () => done(img);
        img.onerror = () => fail(new Error("the browser would not decode it"));
        img.src = url;
      });
      const wide = image.naturalWidth || image.width;
      const tall = image.naturalHeight || image.height;
      if (!wide || !tall) return null;
      const scale = Math.min(1, REFERENCE_MAX_EDGE / Math.max(wide, tall));
      const w = Math.max(1, Math.round(wide * scale));
      const h = Math.max(1, Math.round(tall * scale));
      const canvas = document.createElement("canvas");
      canvas.width = w;
      canvas.height = h;
      const pen = canvas.getContext("2d");
      //! A WHITE GROUND UNDER IT. A PNG with transparency re-encoded as JPEG
      //! gets black wherever it was clear, which turns a cut-out object
      //! reference into a silhouette on a black field.
      pen.fillStyle = "#ffffff";
      pen.fillRect(0, 0, w, h);
      pen.drawImage(image, 0, 0, w, h);
      const made = canvas.toDataURL("image/jpeg", 0.9);
      const parts = dataUrlParts(made);
      if (!parts) return null;
      return { name: name || "reference", role: REFERENCE_ROLES[0].key, note: "",
               on: true, data: parts.data, mime: parts.mime, w, h,
               was: [wide, tall] };
    } catch (err) {
      return null;
    } finally { URL.revokeObjectURL(url); }
  }

  async addFiles(list) {
    const files = [...(list || [])].filter(one => one);
    if (!files.length) return;
    this.openRefs(true);
    let refused = [];
    for (const one of files) {
      if (this.refs.length >= MAX_REFERENCES) {
        refused.push(one.name || "a file");
        continue;
      }
      const made = await this.shrink(one, one.name);
      if (made) this.refs.push(made);
      else refused.push(one.name || "a file");
    }
    this.paintRefs();
    if (refused.length)
      this.note.textContent = refused.length + " not added \u2014 "
        + (this.refs.length >= MAX_REFERENCES
            ? MAX_REFERENCES + " is the most the service takes"
            : "the browser would not read " + refused.slice(0, 2).join(", "));
  }

  //! A REFERENCE FROM A URL, which is the one way in that can fail for
  //! reasons that have nothing to do with this page. A picture on somebody
  //! else's site is only readable from script if that site allows it; without
  //! the right header the fetch is refused by the browser before it starts,
  //! and no amount of code here changes that. So the failure says what to do
  //! instead rather than reading as a bug.
  async addFromUrl(said) {
    const link = String(said || "").trim();
    if (!/^https?:\/\//i.test(link)) {
      this.note.textContent = "that is not an http address";
      return;
    }
    if (this.refs.length >= MAX_REFERENCES) {
      this.note.textContent = MAX_REFERENCES + " references is the most the service takes";
      return;
    }
    this.note.textContent = "fetching that picture\u2026";
    try {
      const answer = await fetch(link, { mode: "cors" });
      if (!answer.ok) throw new Error("the site answered " + answer.status);
      const blob = await answer.blob();
      if (!/^image\//.test(blob.type || ""))
        throw new Error("that address is not a picture");
      const made = await this.shrink(blob, link.split("/").pop().split("?")[0]);
      if (!made) throw new Error("the browser would not decode it");
      this.refs.push(made);
      this.paintRefs();
      this.sayReady();
    } catch (err) {
      this.note.textContent = "could not fetch that picture \u2014 " + err.message
        + ". Save it and drop it in instead.";
    }
  }

  paintRefs() {
    const body = this.refsPanel.querySelector(".nb-refs-body");
    body.textContent = "";
    if (!this.refs.length) {
      body.appendChild(built("p", "nb-fine",
        "Nothing yet. Add pictures of what this view should be LIKE — a style, "
        + "a material, a street, a light — and they are sent with it in one "
        + "call, each one named in the prompt by what it is for."));
    }
    this.refs.forEach((one, at) => {
      const row = built("div", "nb-ref" + (one.on ? "" : " off"));
      const thumb = built("img", "nb-thumb");
      thumb.src = "data:" + one.mime + ";base64," + one.data;
      thumb.alt = "";
      thumb.title = one.name;

      const words = built("div", "nb-words");
      const roles = built("select", "nb-role");
      for (const role of REFERENCE_ROLES) {
        const option = document.createElement("option");
        option.value = role.key;
        option.textContent = role.label;
        roles.appendChild(option);
      }
      roles.value = one.role;
      roles.addEventListener("change", () => {
        one.role = roles.value;
        this.paintRefs();
      });
      const note = built("input", "nb-ref-note");
      note.type = "text";
      note.placeholder = "anything to add about it (optional)";
      note.value = one.note || "";
      note.addEventListener("input", () => { one.note = note.value; });
      words.append(roles, note);
      words.appendChild(built("p", "nb-fine",
        escaped(one.name) + " \u00b7 " + one.w + "\u00d7" + one.h
        + (one.was && one.was[0] > one.w ? " (from " + one.was[0] + "\u00d7"
            + one.was[1] + ")" : "")
        + " \u00b7 " + inBytes(Math.round(one.data.length * 0.75))));

      const use = built("button", "icon-btn nb-ref-use", one.on ? "\u25cf" : "\u25cb");
      use.type = "button";
      use.title = one.on ? "Sent with the next render" : "Kept, but not sent";
      use.addEventListener("click", () => { one.on = !one.on; this.paintRefs(); });
      const drop = built("button", "icon-btn nb-ref-drop", "\u00d7");
      drop.type = "button";
      drop.title = "Remove this reference";
      drop.addEventListener("click", () => {
        this.refs.splice(at, 1);
        this.paintRefs();
      });
      row.append(thumb, words, use, drop);
      body.appendChild(row);
    });
    const live = this.refs.filter(one => one.on);
    const bytes = live.reduce((n, one) => n + Math.round(one.data.length * 0.75), 0);
    this.refsPanel.querySelector(".nb-refs-note").textContent = live.length
      ? live.length + " of " + this.refs.length + " sent \u00b7 " + inBytes(bytes)
      : this.refs.length ? "none of " + this.refs.length + " will be sent" : "";
    //! The count on the button, so the bar says there are references without
    //! the panel having to be open.
    this.refsBtn.textContent = live.length ? "References " + live.length : "References";
    this.refsBtn.classList.toggle("on", live.length > 0);
    this.sayReady();
  }

  /* ---------------------------------------------------------------- the call */

  async run() {
    if (this.busy) return;
    const said = this.prompt.value.trim();
    if (!said) { this.note.textContent = "type what it should become first"; return; }
    if (!apiKey) {
      this.note.textContent = "no API key yet — the gear takes one";
      this.openKeys(true);
      return;
    }

    //! THE PICTURE AS IT IS, taken before anything of this package's own is
    //! over it: a second send would otherwise send the first answer back.
    const wasOver = !this.over.hidden;
    this.over.hidden = true;
    let shot = null;
    try { shot = this.kit.snapshot("image/png"); }
    catch (err) { shot = null; }
    this.over.hidden = !wasOver;
    const parts = shot && dataUrlParts(shot);
    if (!parts) {
      this.note.textContent = "the viewport would not give up a picture";
      return;
    }

    const shape = this.ratio.value === NANO_RATIOS[0]
      ? ratioFor(window.innerWidth, window.innerHeight) : this.ratio.value;
    let request;
    try {
      request = nanoRequest({ prompt: said, image: parts.data, mime: parts.mime,
                              key: apiKey, model: apiModel, ratio: shape,
                              size: this.size.value,
                              references: this.refs.filter(one => one.on) });
    } catch (err) { this.note.textContent = err.message; return; }

    this.working(true, said);
    try {
      const answer = await fetch(request.url, {
        method: "POST", headers: request.headers,
        body: JSON.stringify(request.body),
      });
      //! READ AS TEXT FIRST. A failure from this service is sometimes JSON and
      //! sometimes an HTML error page from whatever is in front of it, and
      //! calling .json() on the second one throws a parse error that tells the
      //! person nothing about what went wrong.
      const text = await answer.text();
      let reply = null;
      try { reply = JSON.parse(text); } catch (e) { reply = null; }
      if (!reply) {
        this.working(false);
        this.note.textContent = "the service answered " + answer.status
          + " with something that is not JSON";
        this.kit.showError("the image model answered " + answer.status + ": "
          + text.slice(0, 200));
        return;
      }
      const made = imageFromReply(reply);
      if (!made) {
        this.working(false);
        const why = troubleFromReply(reply, answer.status);
        this.note.textContent = why;
        this.kit.showError("no image came back — " + why);
        return;
      }
      this.working(false);
      //! WHAT IT WAS MADE FROM, kept with it. A render that came out well and
      //! cannot be repeated because nobody wrote down which four references
      //! were switched on is a render to be made again by guesswork.
      this.keep({ data: made.data, mime: made.mime, prompt: said,
                  when: Date.now(), model: apiModel,
                  refs: this.refs.filter(one => one.on)
                    .map(one => roleInfoFor(one.role).label + ": " + one.name) });
    } catch (err) {
      this.working(false);
      this.note.textContent = "the request did not get there — " + err.message;
    }
  }

  //! WHILE IT IS AWAY. There is no progress to report: it is one request and
  //! the service sends nothing until it is finished, so a bar filling up to
  //! ninety per cent would be a bar making it up. This one sweeps, and the
  //! number beside it is the only honest figure there is - how long it has
  //! been.
  working(on, said) {
    this.busy = !!on;
    this.send.disabled = !!on;
    this.track.hidden = !on;
    this.fill.classList.toggle("sweeping", !!on);
    if (!on) {
      clearInterval(this.ticking);
      this.sayReady();
      return;
    }
    const began = Date.now();
    const tick = () => {
      const seconds = Math.round((Date.now() - began) / 1000);
      const refs = this.refs.filter(one => one.on).length;
      this.note.textContent = "asking " + apiModel
        + (refs ? " with " + refs + (refs === 1 ? " reference" : " references") : "")
        + " — " + seconds + "s"
        + (seconds > 45 ? " (a 2K or 4K image takes a while)" : "");
    };
    tick();
    clearInterval(this.ticking);
    this.ticking = setInterval(tick, 1000);
  }

  /* -------------------------------------------------------------- the result */

  keep(entry) {
    this.gallery.push(entry);
    this.show(this.gallery.length - 1);
    if (!this.shelf.hidden) this.paintShelf();
    this.kit.say("the image model answered · "
      + inBytes(Math.round(entry.data.length * 0.75))
      + " · drag Compare to see it against the viewport");
  }

  show(index) {
    const entry = this.gallery[index];
    if (!entry) return;
    this.at = index;
    this.img.src = "data:" + (entry.mime || "image/png") + ";base64," + entry.data;
    this.over.hidden = false;
    this.cmp.hidden = false;
    this.saveBtn.hidden = false;
    //! ALL THE WAY TO THE RENDER to begin with, because the thing somebody
    //! wants first is to see what came back - and then to drag it away.
    this.setSplit(0);
    this.sayReady();
  }

  setSplit(fraction) {
    const at = Math.max(0, Math.min(1, Number(fraction) || 0));
    this.split = at;
    this.range.value = String(Math.round(at * 1000));
    //! The image is CLIPPED from the left: inset(0 0 0 X%) keeps the part from
    //! X across to the right edge, so X = 0 is all render and X = 100% is all
    //! viewport.
    this.img.style.clipPath = "inset(0 0 0 " + (at * 100) + "%)";
    this.edge.style.left = (at * 100) + "%";
    //! The edge is pointless at either end - there is nothing on one side of
    //! it - and a grip sitting on the frame of the window looks like a bug.
    this.edge.style.opacity = at <= 0.002 || at >= 0.998 ? "0" : "1";
    this.read.textContent = at <= 0.002 ? "render" : at >= 0.998 ? "viewport"
      : Math.round(at * 100) + "% viewport";
  }

  /* -------------------------------------------------------------- the shelf */

  paintShelf() {
    const body = this.shelf.querySelector(".nb-shelf-body");
    body.textContent = "";
    if (!this.gallery.length) {
      body.appendChild(built("p", "nb-fine",
        "Nothing yet. Every image this session makes is kept here until the tab "
        + "is closed — nothing is written to disk on its own, so download "
        + "what you want to keep."));
      this.shelf.querySelector(".nb-zip").disabled = true;
      this.shelf.querySelector(".nb-shelf-note").textContent = "";
      return;
    }
    this.shelf.querySelector(".nb-zip").disabled = false;
    //! NEWEST FIRST. The one somebody wants is almost always the last one.
    this.gallery.slice().reverse().forEach((entry, back) => {
      const index = this.gallery.length - 1 - back;
      const row = built("div", "nb-item" + (index === this.at ? " on" : ""));
      const thumb = built("img", "nb-thumb");
      thumb.src = "data:" + (entry.mime || "image/png") + ";base64," + entry.data;
      thumb.alt = "";
      thumb.addEventListener("click", () => { this.show(index); this.paintShelf(); });
      const words = built("div", "nb-words");
      words.appendChild(built("p", "nb-said", escaped(entry.prompt)));
      words.appendChild(built("p", "nb-fine",
        new Date(entry.when).toLocaleTimeString() + " · "
        + escaped(entry.model || "") + " · "
        + inBytes(Math.round(entry.data.length * 0.75))
        + ((entry.refs || []).length
            ? " · " + entry.refs.length
              + (entry.refs.length === 1 ? " reference" : " references") : "")));
      const get = built("button", "btn nb-get", "Save");
      get.type = "button";
      get.addEventListener("click", () => this.saveOne(index));
      row.append(thumb, words, get);
      body.appendChild(row);
    });
    const bytes = this.gallery.reduce((n, one) => n + Math.round(one.data.length * 0.75), 0);
    this.shelf.querySelector(".nb-shelf-note").textContent =
      this.gallery.length + (this.gallery.length === 1 ? " image" : " images")
      + " · " + inBytes(bytes);
  }

  /* ------------------------------------------------------------- saving out */

  //! One download, from bytes already in hand. An object URL rather than a
  //! data: href, because a data URL of a 4K PNG is several megabytes of
  //! attribute and some browsers refuse to navigate to one that size.
  offer(name, bytes, mime) {
    const blob = new Blob([bytes], { type: mime });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = name;
    document.body.appendChild(link);
    link.click();
    link.remove();
    setTimeout(() => URL.revokeObjectURL(url), 4000);
  }

  saveOne(index) {
    const entry = this.gallery[index];
    if (!entry) return;
    this.offer(galleryName(entry, index), base64Bytes(entry.data),
               entry.mime || "image/png");
  }

  saveZip() {
    if (!this.gallery.length) return;
    const files = this.gallery.map((entry, index) => ({
      name: galleryName(entry, index), bytes: base64Bytes(entry.data) }));
    //! AND WHAT WAS ASKED FOR, beside the pictures. A folder of renders with
    //! no prompts in it is a folder nobody can use a week later.
    const said = this.gallery.map((entry, index) =>
      galleryName(entry, index) + "\n  " + new Date(entry.when).toISOString()
      + "\n  " + (entry.model || "") + "\n  " + entry.prompt + "\n"
      + ((entry.refs || []).length
          ? "  references: " + entry.refs.join("; ") + "\n" : "")).join("\n");
    files.push({ name: "prompts.txt",
                 bytes: new TextEncoder().encode(
                   "What was asked for, in the order the images were made.\n\n" + said) });
    this.offer("nano-banana-" + new Date().toISOString().slice(0, 10) + ".zip",
               storeZip(files), "application/zip");
  }

  /* ------------------------------------------------------------------ host */

  //! A REBUILD IS NOT A REASON TO THROW THE PICTURE AWAY. The answer is about
  //! the view it was taken from, and editing the model does not make it
  //! untrue - it makes it OLD, which is a different thing and one the person
  //! can see for themselves by dragging the bar. So the overlay stays and the
  //! note says what happened.
  invalidate() {
    if (this.over.hidden || this.at < 0) return;
    this.note.textContent = "the model has changed since this image — "
      + "drag Compare to see how far";
  }

  dispose() {
    clearInterval(this.ticking);
    //! The paste listener is on the WINDOW, so it outlives the panel it feeds
    //! unless it is taken off by name. A package put away has to leave the
    //! page as it found it.
    if (this.onPaste) window.removeEventListener("paste", this.onPaste);
    for (const node of [this.tab, this.bar, this.over, this.shelf, this.keys,
                        this.refsPanel])
      if (node && node.parentNode) node.remove();
  }
}

/* ------------------------------------------------------------- the package */

export const NANO = offerPlugin({
  id: "nano",
  name: "Nano Banana",
  version: 1,
  summary: "Hands the view that is on the screen to Google's image model with a "
         + "sentence, and puts the answer over the viewport with a bar to drag "
         + "between the two. Needs an API key, which is kept in memory only.",
  needs: [],

  //! NO NODES. This package adds nothing to the catalogue and nothing to the
  //! document: what it makes is a picture, which is not a feature, and a model
  //! saved while it is loaded is the same file as one saved without it. That
  //! is also why it is safe to have on by default - it cannot make a model
  //! that will not open somewhere else.
  nodes: [],

  api: {
    name: "NanoBanana",
    summary: "The viewport as an image model sees it.",
    operations: [
      { name: "prompt", summary: "What this view should become. The suggestions "
             + "all end by saying the geometry must not change, which is the "
             + "difference between a render and a different building." },
    ],
  },

  async start(kit) {
    const view = kit.THREE && typeof document !== "undefined" ? new NanoView(kit) : null;
    return {
      view,
      //! Deliberately NOT handing the key out on the live object: the live
      //! objects are what get inspected and described, and a key in one is a
      //! key one `JSON.stringify` away from a log.
      hasKey: () => !!apiKey,
      dispose: () => { if (view) view.dispose(); },
    };
  },
});
