#!/bin/sh
# What the tests and the browser drives need, and where they need it.
#
# WHY THIS EXISTS. None of it is in the repository - a 22 MB WebAssembly
# kernel, a three.js build, Playwright and a 3.5 MB texture fixture do not
# belong in git - so it all lives outside and a fresh container has none of
# it. The symptom is not a clear one: `node --test docs/test/*.test.mjs` fails
# on a suite that is fine, and a browser drive dies with MODULE_NOT_FOUND on
# Playwright. Both read as broken code.
#
# Run it from the repository root. Everything it does is idempotent.
set -e
cd "$(dirname "$0")/.."
ROOT=$(pwd)
SCRATCH=${SCRATCH:-/tmp/claude-0}
mkdir -p "$SCRATCH"

# THE KERNEL. build.py already fetches and caches it under docs/.kernel, so
# there is nothing to download - the tests just have to be told where it is.
# They read OCJS_DIR and fall back to a path that only existed on one machine.
KERNEL="$ROOT/docs/.kernel/package/dist"
if [ ! -f "$KERNEL/replicad_single.wasm" ]; then
  echo "fetching the kernel through the build (it caches under docs/.kernel)"
  python3 docs/build.py --only site >/dev/null
fi
echo "kernel:     $KERNEL"
echo "            export OCJS_DIR=$KERNEL"

# THREE.JS, for the browser drives. They route the page's own request for
# three.min.js to this file rather than letting the page fetch it, so a drive
# never depends on a CDN being up.
if [ ! -f "$SCRATCH/three/package/build/three.min.js" ]; then
  echo "fetching three.js"
  mkdir -p "$SCRATCH/three"
  ( cd "$SCRATCH/three" && npm pack three@0.128.0 >/dev/null \
    && tar xzf three-0.128.0.tgz )
fi
echo "three:      $SCRATCH/three/package/build/three.min.js"

# PLAYWRIGHT, for the drives. The browser itself is already in the image at
# /opt/pw-browsers/chromium - do NOT run `playwright install`, which would
# download a second copy.
if [ ! -d "$SCRATCH/node_modules/playwright" ]; then
  echo "installing playwright (the browser is already in the image)"
  ( cd "$SCRATCH" && npm install playwright --no-audit --no-fund >/dev/null )
fi
echo "playwright: $SCRATCH/node_modules/playwright"

# THE TEXTURE FIXTURE. texture.test.mjs reads a real PBR zip, because the one
# thing a hand-made zip cannot check is that the reader copes with what
# ambientCG actually ships. The test FAILS rather than skips without it, which
# is right - it is a check that could not be made - but it means a fresh
# container shows a red suite for a reason that is not the code.
if [ ! -f "$SCRATCH/c34.zip" ]; then
  echo "fetching the Concrete034 fixture (ambientCG, CC0)"
  curl -sSL -o "$SCRATCH/c34.zip" \
    "https://ambientcg.com/get?file=Concrete034_1K-JPG.zip"
fi
echo "fixture:    $SCRATCH/c34.zip"

echo
echo "now:  OCJS_DIR=$KERNEL node --test docs/test/*.test.mjs"
