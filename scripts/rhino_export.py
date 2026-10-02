# Export a Rhino document as a bridge file.
#
# Runs INSIDE Rhino - RunPythonScript in Rhino 7 (IronPython 2.7) or Rhino 8
# (CPython 3). It is written to the subset both speak: no f-strings, no type
# hints, nothing from a package that is not already in Rhino.
#
# WHY THIS EXISTS, rather than reading the .3dm in the browser.
#
# rhino3dm - Rhino's own library, and the only way to read a .3dm outside
# Rhino - carries the file format and none of the kernel. Enumerated against
# 8.35.0: there is no Mesh.CreateFromBrep, and BrepFace.GetMesh returns a mesh
# only when the FILE already holds one. So a browser reading a .3dm can draw
# exactly what Rhino happened to cache in it, and nothing else. Save Small
# strips those caches; so does anything that wrote the file with a script.
#
# In here the whole kernel is present. This script meshes at a tolerance
# somebody chose, keeps the layer tree, the blocks, the colours and the user
# strings, and writes one file the modeller reads in a single drop.
#
# WHAT IT DOES AND DOES NOT CARRY.
#
#   carried : layer tree and colours, block definitions and their placements,
#             object names, display colours, every user string, the document
#             unit system, meshes at the density you ask for
#   not     : NURBS surfaces. A mesh is a mesh. When you need surfaces you can
#             boolean and fillet, run this with STEP = True and it writes a
#             STEP beside the bridge file; open both and you have the structure
#             from one and the exact geometry from the other.
#
# Nothing here is lost silently: every object that produces no mesh is written
# into the file with the REASON, and the modeller prints the count on open.
#
#   usage: open in Rhino, set the options below, RunPythonScript.

import json
import os
import time

import Rhino
import scriptcontext as sc
import rhinoscriptsyntax as rs


# ----------------------------------------------------------------- options

# Where to write. Empty means "beside the .3dm, with the same name".
OUT = ""

# How finely to mesh. "fast" is Rhino's own fast render mesh and is what you
# want for context you are modelling against; "quality" is its quality render
# mesh; a NUMBER between 0 and 1 is Rhino's density setting, where 0.0 is
# coarse and 1.0 is fine - on a 90 m atrium 0.3 is about a 40 mm chord.
DENSITY = "fast"

# Write a STEP beside it, carrying the exact surfaces. Slow on a big model and
# worth it only when you mean to edit the geometry rather than look at it.
STEP = False

# Skip objects on layers that are turned off. A Rhino file's hidden layers are
# usually hidden on purpose, and on a large file they are most of it.
SKIP_HIDDEN = True

# Only these layers, by full name ("Steel::Primary"). Empty means all of them.
# This is the setting that makes a very large file possible: filter HERE, where
# the whole document is already in memory, rather than in a browser that has to
# load everything before it can drop anything.
ONLY_LAYERS = []

# Round coordinates to this many decimals, in the document's own units.
#
# Measured, because the obvious lever is the wrong one. On a 3,600-face shared
# corner grid, gzipped: 6 decimals costs 9.1 bytes a face, 3 decimals 8.7, and
# 1 decimal 8.4 - a 8% saving for throwing away a millimetre. What actually
# decides the size is whether CORNERS ARE SHARED: the same faces written as a
# triangle soup cost 63.8 bytes a face, seven times more. Rhino's meshes share
# their corners and compact() keeps them shared, which is where the win is.
# So this stays at a micron and nobody need tune it.
DECIMALS = 6


# ------------------------------------------------------------------ meshing

def meshing_parameters(doc):
    """What to mesh with, from DENSITY."""
    if DENSITY == "fast":
        return Rhino.Geometry.MeshingParameters.FastRenderMesh
    if DENSITY == "quality":
        return Rhino.Geometry.MeshingParameters.QualityRenderMesh
    try:
        density = float(DENSITY)
    except (TypeError, ValueError):
        return Rhino.Geometry.MeshingParameters.FastRenderMesh
    density = max(0.0, min(1.0, density))
    # Rhino's own density-driven parameters, the same ones the Mesh command's
    # slider sets. The static exists on Rhino 7 and 8; the constructor is the
    # older spelling, and one of the two is always there.
    try:
        return Rhino.Geometry.MeshingParameters.FromDensity(density)
    except (AttributeError, TypeError):
        return Rhino.Geometry.MeshingParameters(density)


def mesh_of(geometry, mp):
    """One mesh for a piece of geometry, or None with the reason why not.

    Returns (mesh, reason). Exactly one of them is set.
    """
    g = geometry
    kind = type(g).__name__

    if isinstance(g, Rhino.Geometry.Mesh):
        return g, None

    # An extrusion meshes directly and much faster than via its Brep.
    if isinstance(g, Rhino.Geometry.Extrusion):
        m = g.GetMesh(Rhino.Geometry.MeshType.Render)
        if m is None:
            m = Rhino.Geometry.Mesh.CreateFromSurface(g, mp)
        return (m, None) if m else (None, "an extrusion Rhino could not mesh")

    if isinstance(g, Rhino.Geometry.SubD):
        m = None
        try:
            m = Rhino.Geometry.Mesh.CreateFromSubD(g, 1)
        except (AttributeError, TypeError):
            try:
                m = Rhino.Geometry.Mesh.CreateFromSubDControlNet(g)
            except Exception:
                m = None
        return (m, None) if m else (None, "a SubD this Rhino could not mesh")

    if isinstance(g, Rhino.Geometry.Brep):
        pieces = Rhino.Geometry.Mesh.CreateFromBrep(g, mp)
        if not pieces:
            return None, "a surface Rhino could not mesh"
        # CreateFromBrep gives one mesh per FACE. Appended into one, the
        # corners of adjacent faces stay separate - which is correct: two
        # faces of a Brep meet along an edge they do not share vertices on,
        # and welding them here would smooth a corner that is not smooth.
        joined = Rhino.Geometry.Mesh()
        for piece in pieces:
            if piece:
                joined.Append(piece)
        return (joined, None) if joined.Faces.Count else (None, "a surface that meshed to nothing")

    if isinstance(g, Rhino.Geometry.Curve):
        return None, "a curve, which has no surface to mesh"
    if isinstance(g, Rhino.Geometry.PointCloud):
        return None, "a point cloud, which this bridge does not carry yet"
    if isinstance(g, Rhino.Geometry.TextEntity) or isinstance(g, Rhino.Geometry.Leader):
        return None, "annotation, which belongs on a drawing rather than in the model"

    return None, "a " + kind + ", which this script does not know how to mesh"


def compact(mesh, decimals):
    """A Rhino mesh as the bridge file's two flat arrays.

    Vertices flat in threes, faces flat in FOURS - Rhino's own convention,
    where a triangle is a quad whose last two corners are the same one. Kept
    that way because it is lossless for a Rhino mesh and a fixed stride parses
    and packs faster than a list of lists.
    """
    verts = []
    for i in range(mesh.Vertices.Count):
        v = mesh.Vertices[i]
        verts.append(round(float(v.X), decimals))
        verts.append(round(float(v.Y), decimals))
        verts.append(round(float(v.Z), decimals))
    faces = []
    for i in range(mesh.Faces.Count):
        f = mesh.Faces[i]
        faces.append(f.A)
        faces.append(f.B)
        faces.append(f.C)
        faces.append(f.D)
    return {"v": verts, "f": faces}


# ------------------------------------------------------------- the document

def unit_name(doc):
    """Rhino's unit system, as the name the reader looks up."""
    return str(doc.ModelUnitSystem).lower()


def layer_rows(doc):
    rows = []
    for layer in doc.Layers:
        if layer.IsDeleted:
            continue
        # No System.Guid comparison: FindId answers "no such parent" with
        # None for a root layer's empty id, and `import System` is a .NET
        # detail that is not the same in Rhino 7 and Rhino 8.
        parent = None
        try:
            found = doc.Layers.FindId(layer.ParentLayerId)
            if found and found.Id != layer.Id:
                parent = str(found.Id)
        except Exception:
            parent = None
        colour = layer.Color
        rows.append({
            "id": str(layer.Id),
            "name": layer.Name,
            "parent": parent,
            "colour": [colour.R, colour.G, colour.B],
            "visible": bool(layer.IsVisible),
        })
    return rows


def full_layer_name(doc, index):
    layer = doc.Layers[index]
    return layer.FullPath if hasattr(layer, "FullPath") else layer.Name


def wanted(doc, rhino_object):
    """Whether this object is being exported, and why not when it is not."""
    index = rhino_object.Attributes.LayerIndex
    layer = doc.Layers[index]
    if SKIP_HIDDEN and not layer.IsVisible:
        return False
    if ONLY_LAYERS:
        name = full_layer_name(doc, index)
        if name not in ONLY_LAYERS:
            return False
    return True


def object_colour(doc, rhino_object):
    """The object's own display colour, or None when it takes the layer's.

    None is kept rather than resolved: "this object has no colour of its own"
    is a fact worth carrying, and resolving it here would freeze a layer colour
    the person may still change.
    """
    attributes = rhino_object.Attributes
    if attributes.ColorSource != Rhino.DocObjects.ObjectColorSource.ColorFromObject:
        return None
    c = attributes.ObjectColor
    return [c.R, c.G, c.B]


def user_strings(rhino_object):
    out = {}
    try:
        pairs = rhino_object.Attributes.GetUserStrings()
    except Exception:
        return None
    if not pairs:
        return None
    for key in pairs.AllKeys:
        out[str(key)] = str(pairs[key])
    return out or None


def xform_rows(xf):
    """A Rhino transform as sixteen numbers, row by row.

    Row major with the translation in the LAST COLUMN, which is how Rhino
    stores it - written any other way every rotation arrives transposed.
    """
    return [xf.M00, xf.M01, xf.M02, xf.M03,
            xf.M10, xf.M11, xf.M12, xf.M13,
            xf.M20, xf.M21, xf.M22, xf.M23,
            xf.M30, xf.M31, xf.M32, xf.M33]


# -------------------------------------------------------------------- write

def export(doc, path):
    started = time.time()
    mp = meshing_parameters(doc)
    decimals = int(DECIMALS)

    report = {"meshed": 0, "skipped": 0, "instances": 0, "blocks": 0,
              "faces": 0, "why": {}}

    def note(reason):
        report["skipped"] += 1
        report["why"][reason] = report["why"].get(reason, 0) + 1

    # A BLOCK'S CONTENTS, meshed once. The definitions are walked first so an
    # instance can be a reference rather than a copy - on a file with four
    # hundred placements of one bracket that is the difference between a
    # model that opens and one that does not.
    block_rows = []
    block_members = []
    definition_of = {}
    for definition in doc.InstanceDefinitions:
        if definition.IsDeleted:
            continue
        members = []
        for member in definition.GetObjects():
            mesh, reason = mesh_of(member.Geometry, mp)
            member_id = "D" + str(definition.Index) + "_" + str(len(members))
            row = {
                "id": member_id,
                "kind": type(member.Geometry).__name__.lower(),
                "name": member.Attributes.Name or "",
                "colour": object_colour(doc, member),
            }
            if mesh:
                row["mesh"] = compact(mesh, decimals)
                report["meshed"] += 1
                report["faces"] += mesh.Faces.Count
            else:
                row["missing"] = reason
                note(reason)
            block_members.append(row)
            members.append(member_id)
        if members:
            definition_of[definition.Index] = str(definition.Id)
            block_rows.append({
                "id": str(definition.Id),
                "name": definition.Name,
                "objects": members,
            })
    report["blocks"] = len(block_rows)

    # STREAMED, not built. A large document's meshes do not all want to be in
    # memory as Python lists at the same time as they are in memory as Rhino
    # meshes, so the objects go out one at a time and the file is the only
    # complete copy.
    handle = open(path, "w")
    try:
        head = {
            "format": "rhino-bridge",
            "version": 1,
            "name": os.path.basename(doc.Path or "untitled.3dm"),
            "units": unit_name(doc),
            "source": {
                "application": "Rhino " + str(Rhino.RhinoApp.ExeVersion),
                "written": time.strftime("%Y-%m-%dT%H:%M:%S"),
                "density": str(DENSITY),
            },
            "layers": layer_rows(doc),
            "blocks": block_rows,
        }
        if STEP:
            head["exact"] = {"step": os.path.basename(step_path(path))}
        text = json.dumps(head)
        handle.write(text[:-1])          # everything but the closing brace
        handle.write(',"objects":[')

        first = [True]

        def emit(row):
            if not first[0]:
                handle.write(",")
            first[0] = False
            handle.write(json.dumps(row))

        for row in block_members:
            emit(row)

        for rhino_object in doc.Objects:
            if rhino_object.IsDeleted:
                continue
            if not wanted(doc, rhino_object):
                continue
            geometry = rhino_object.Geometry
            layer_id = str(doc.Layers[rhino_object.Attributes.LayerIndex].Id)
            row = {
                "id": str(rhino_object.Id),
                "layer": layer_id,
                "name": rhino_object.Attributes.Name or "",
                "kind": type(geometry).__name__.lower(),
                "colour": object_colour(doc, rhino_object),
            }
            strings = user_strings(rhino_object)
            if strings:
                row["user"] = strings

            if isinstance(geometry, Rhino.Geometry.InstanceReference):
                found = doc.InstanceDefinitions.FindId(geometry.ParentIdefId)
                block = definition_of.get(found.Index) if found else None
                if block:
                    row["block"] = block
                    row["xform"] = xform_rows(geometry.Xform)
                    report["instances"] += 1
                    emit(row)
                    continue
                row["missing"] = "a block whose definition is empty"
                note(row["missing"])
                emit(row)
                continue

            mesh, reason = mesh_of(geometry, mp)
            if mesh:
                row["mesh"] = compact(mesh, decimals)
                report["meshed"] += 1
                report["faces"] += mesh.Faces.Count
            else:
                row["missing"] = reason
                note(reason)
            emit(row)

        handle.write("]}")
    finally:
        handle.close()

    report["seconds"] = time.time() - started
    report["bytes"] = os.path.getsize(path)
    return report


def step_path(path):
    base = path[:-4] if path.lower().endswith(".rhj") else path
    return base + ".stp"


def write_step(path):
    """The exact surfaces, through Rhino's own exporter.

    Done with a command rather than by hand because Rhino's STEP writer is
    better than anything reachable from a script, and because what is wanted
    here is the file Rhino would have written anyway.
    """
    target = step_path(path)
    rs.Command('_-Export "' + target + '" _Enter', False)
    return target if os.path.exists(target) else None


def main():
    doc = sc.doc
    path = OUT
    if not path:
        source = doc.Path
        if not source:
            print("Save the Rhino file first, or set OUT to a path.")
            return
        path = source[:-4] + ".rhj" if source.lower().endswith(".3dm") else source + ".rhj"

    report = export(doc, path)

    print("wrote " + path)
    print("  " + str(report["meshed"]) + " meshes, "
          + str(report["faces"]) + " faces, "
          + str(report["blocks"]) + " blocks, "
          + str(report["instances"]) + " placements")
    print("  " + "{0:.1f}".format(report["bytes"] / 1048576.0) + " MB in "
          + "{0:.1f}".format(report["seconds"]) + " s")
    if report["skipped"]:
        print("  " + str(report["skipped"]) + " objects carry no mesh:")
        for reason, count in sorted(report["why"].items(), key=lambda kv: -kv[1]):
            print("    " + str(count) + "  " + reason)

    if STEP:
        written = write_step(path)
        print("  exact surfaces: " + (written or "STEP export was cancelled"))


if __name__ == "__main__":
    main()
