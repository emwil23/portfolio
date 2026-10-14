#!/bin/bash
# Lighter copies of the character clips for phones and slow connections: 560px tall instead of 930,
# encoded harder. Derived from the full clips in public/assets/character/, so the green-screen sources
# are not needed. Chosen at runtime by lib/boot.ts. Needs ffmpeg with libvpx-vp9 and, for the HEVC
# copies Safari plays, macOS (hevc_videotoolbox).
set -euo pipefail
cd "$(dirname "$0")/.."
OUT=public/assets/character
# Keyed-out pixels painted black, as in key-assets.sh, so lossy alpha cannot show a coloured halo
CLEAR="format=gbrap,geq=r='r(X,Y)*gt(alpha(X,Y),0)':g='g(X,Y)*gt(alpha(X,Y),0)':b='b(X,Y)*gt(alpha(X,Y),0)':a='alpha(X,Y)'"
for name in idle arrive admire thumbsup type wave present handshake game; do
  ffmpeg -v error -y -c:v libvpx-vp9 -i "$OUT/$name.webm" -vf "scale=-2:560,$CLEAR,format=yuva420p" -an \
    -c:v libvpx-vp9 -b:v 0 -crf 42 -row-mt 1 "$OUT/$name-lite.webm"
  ffmpeg -v error -y -c:v libvpx-vp9 -i "$OUT/$name.webm" -vf "scale=-2:560,$CLEAR,format=bgra" -an \
    -c:v hevc_videotoolbox -alpha_quality 0.5 -b:v 250k -tag:v hvc1 "$OUT/$name-lite.mp4"
done
ls -lh "$OUT"/*-lite.*
