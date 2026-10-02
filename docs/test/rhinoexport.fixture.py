# Run the real Rhino export script against a stubbed Rhino.
#
# scripts/rhino_export.py runs inside Rhino and nothing here has Rhino in it.
# What CAN be checked without it is the half that matters most at a boundary:
# that the file the script writes is a file the reader accepts, field for
# field. So Rhino's surface is stubbed to the few dozen members the script
# actually touches, the script's own export() is called - not a copy of it -
# and the bridge file it produces is written out for the JS suite to read.
#
# This catches the boundary bugs that are otherwise found by a person with a
# 2 GB model and an afternoon: a transform written transposed, a triangle
# written as a quad, a layer parent that is its own id, a colour at 0..1 where
# 0..255 was meant.

import json
import os
import sys
import types

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(os.path.dirname(HERE))
sys.path.insert(0, os.path.join(ROOT, "scripts"))


# ------------------------------------------------------- a Rhino, shaped like one

class Vertex(object):
    def __init__(self, x, y, z):
        self.X, self.Y, self.Z = x, y, z


class Face(object):
    def __init__(self, a, b, c, d):
        self.A, self.B, self.C, self.D = a, b, c, d


class Counted(list):
    @property
    def Count(self):
        return len(self)


class Mesh(object):
    def __init__(self, verts=None, faces=None):
        self.Vertices = Counted(verts or [])
        self.Faces = Counted(faces or [])

    def Append(self, other):
        base = len(self.Vertices)
        self.Vertices.extend(other.Vertices)
        for f in other.Faces:
            self.Faces.append(Face(f.A + base, f.B + base, f.C + base, f.D + base))


class Brep(object):
    def __init__(self, mesh):
        self._mesh = mesh


class Extrusion(object):
    def __init__(self, mesh):
        self._mesh = mesh

    def GetMesh(self, _type):
        return self._mesh


class SubD(object):
    pass


class Curve(object):
    pass


class PointCloud(object):
    pass


class TextEntity(object):
    pass


class Leader(object):
    pass


class Xform(object):
    def __init__(self, rows):
        names = ["M00", "M01", "M02", "M03", "M10", "M11", "M12", "M13",
                 "M20", "M21", "M22", "M23", "M30", "M31", "M32", "M33"]
        for name, value in zip(names, rows):
            setattr(self, name, value)


class InstanceReference(object):
    def __init__(self, idef_id, xform):
        self.ParentIdefId = idef_id
        self.Xform = xform


class MeshingParameters(object):
    FastRenderMesh = "fast"
    QualityRenderMesh = "quality"

    @staticmethod
    def FromDensity(d):
        return d


class MeshType(object):
    Render = 0


def CreateFromBrep(brep, _mp):
    return [brep._mesh] if brep._mesh else []


def CreateFromSurface(extrusion, _mp):
    return extrusion._mesh


Mesh.CreateFromBrep = staticmethod(CreateFromBrep)
Mesh.CreateFromSurface = staticmethod(CreateFromSurface)

rhino = types.ModuleType("Rhino")
rhino.Geometry = types.SimpleNamespace(
    Mesh=Mesh, Brep=Brep, Extrusion=Extrusion, SubD=SubD, Curve=Curve,
    PointCloud=PointCloud, TextEntity=TextEntity, Leader=Leader,
    InstanceReference=InstanceReference, MeshingParameters=MeshingParameters,
    MeshType=MeshType)
rhino.DocObjects = types.SimpleNamespace(
    ObjectColorSource=types.SimpleNamespace(ColorFromObject="object",
                                            ColorFromLayer="layer"))
rhino.RhinoApp = types.SimpleNamespace(ExeVersion=8)
sys.modules["Rhino"] = rhino

sc = types.ModuleType("scriptcontext")
sys.modules["scriptcontext"] = sc
rs = types.ModuleType("rhinoscriptsyntax")
rs.Command = lambda *a, **k: None
sys.modules["rhinoscriptsyntax"] = rs


# ------------------------------------------------------------ a document in it

class Colour(object):
    def __init__(self, r, g, b):
        self.R, self.G, self.B = r, g, b


class Layer(object):
    def __init__(self, id, name, parent, colour, visible=True, path=None):
        self.Id, self.Name = id, name
        self.ParentLayerId = parent
        self.Color = colour
        self.IsVisible = visible
        self.IsDeleted = False
        self.FullPath = path or name


class Layers(list):
    def FindId(self, id):
        for layer in self:
            if layer.Id == id:
                return layer
        return None


class Attributes(object):
    def __init__(self, layer_index, name="", colour=None, user=None):
        self.LayerIndex = layer_index
        self.Name = name
        self.ColorSource = ("object" if colour else "layer")
        self.ObjectColor = colour
        self._user = user or {}

    def GetUserStrings(self):
        if not self._user:
            return None
        bag = types.SimpleNamespace(AllKeys=list(self._user.keys()))
        bag.__getitem__ = lambda k: self._user[k]
        return _Bag(self._user)


class _Bag(object):
    def __init__(self, d):
        self._d = d
        self.AllKeys = list(d.keys())

    def __getitem__(self, key):
        return self._d[key]

    def __len__(self):
        return len(self._d)


class Obj(object):
    def __init__(self, id, geometry, attributes):
        self.Id, self.Geometry, self.Attributes = id, geometry, attributes
        self.IsDeleted = False


class Definition(object):
    def __init__(self, index, id, name, objects):
        self.Index, self.Id, self.Name = index, id, name
        self._objects = objects
        self.IsDeleted = False

    def GetObjects(self):
        return self._objects


class Definitions(list):
    def FindId(self, id):
        for d in self:
            if d.Id == id:
                return d
        return None


def square(z=0.0):
    return Mesh([Vertex(0, 0, z), Vertex(1, 0, z), Vertex(1, 1, z), Vertex(0, 1, z)],
                [Face(0, 1, 2, 3)])


def triangle():
    return Mesh([Vertex(0, 0, 0), Vertex(1, 0, 0), Vertex(0, 1, 0)],
                [Face(0, 1, 2, 2)])


def build_doc():
    root = Layer("lay-steel", "Steel", "none", Colour(255, 128, 0), True, "Steel")
    child = Layer("lay-prim", "Primary", "lay-steel", Colour(10, 20, 30), True, "Steel::Primary")
    hidden = Layer("lay-hid", "Scratch", "none", Colour(0, 0, 0), False, "Scratch")
    layers = Layers([root, child, hidden])

    block_member = Obj("d1", Brep(triangle()), Attributes(1, "bracket"))
    definition = Definition(0, "def-bracket", "Bracket", [block_member])

    objects = [
        # a plain mesh on the root layer, with a user string and its own colour
        Obj("o1", square(), Attributes(0, "panel", Colour(1, 2, 3),
                                       {"Mark": "P-01", "Category": "Cladding"})),
        # a brep on the nested layer, meshed through CreateFromBrep
        Obj("o2", Brep(square(5.0)), Attributes(1, "slab")),
        # an extrusion, which takes the faster path
        Obj("o3", Extrusion(triangle()), Attributes(1, "mullion")),
        # a curve, which has no surface and must be REPORTED not dropped
        Obj("o4", Curve(), Attributes(1, "centreline")),
        # a brep that will not mesh
        Obj("o5", Brep(None), Attributes(1, "bad surface")),
        # something on a hidden layer, which SKIP_HIDDEN drops
        Obj("o6", square(), Attributes(2, "scratch")),
        # two placements of the one block, the second turned a quarter turn
        Obj("o7", InstanceReference("def-bracket",
                                    Xform([1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1])),
            Attributes(0, "bracket 1")),
        Obj("o8", InstanceReference("def-bracket",
                                    Xform([0, -1, 0, 10, 1, 0, 0, 20, 0, 0, 1, 30, 0, 0, 0, 1])),
            Attributes(0, "bracket 2")),
    ]

    doc = types.SimpleNamespace(
        Layers=layers, Objects=objects, InstanceDefinitions=Definitions([definition]),
        ModelUnitSystem="Meters", Path=os.path.join(HERE, "stub.3dm"))
    return doc


def main():
    import rhino_export
    rhino_export.SKIP_HIDDEN = True
    rhino_export.DENSITY = "fast"
    rhino_export.STEP = False

    out = sys.argv[1] if len(sys.argv) > 1 else os.path.join(HERE, "stub.rhj")
    report = rhino_export.export(build_doc(), out)
    print(json.dumps({"out": out, "report": {k: v for k, v in report.items()
                                             if k not in ("seconds",)}}, indent=1))


if __name__ == "__main__":
    main()
