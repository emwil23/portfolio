#!/bin/bash
# Keys the green-screen sources in raw-assets/ into transparent files in public/assets/character/.
# Usage: scripts/key-assets.sh   (needs ffmpeg with libvpx-vp9 + hevc_videotoolbox, and cwebp)
set -euo pipefail
cd "$(dirname "$0")/.."
IN=raw-assets
OUT=public/assets/character
TMP=$(mktemp -d)
trap 'rm -rf "$TMP"' EXIT
mkdir -p "$OUT"

# Every output shares one frame: a 464x1240 window on the 720x1280 source, scaled to 348x930, with him
# centred (the hero mirrors some frames, and an off-centre figure would jump sideways).
# MASK paints over the Gemini/Veo sparkle watermarks, which drift around the bottom corners.
MASK="drawbox=x=0:y=1080:w=175:h=200:color=0x109757:t=fill,drawbox=x=545:y=1080:w=175:h=200:color=0x109757:t=fill"
FRAME="$MASK,crop=464:1240:118:30"
# colorkey (RGB distance), not chromakey: chromakey ignores brightness and eats into the black clothes.
# Keep similarity + blend under ~0.2: above that the beard and sweater knit go semi-transparent.
KEY="colorkey=0x109757:0.12:0.06,despill=type=green"
SIZE="scale=348:930"

# Flow doesn't frame every clip alike. These map the two other framings it has produced onto the head
# circle's (measured from his bounding box in frame 0), so swapping clips doesn't make him jump or resize.
# A new clip that matches neither needs measuring the same way.
FRAME_A="$MASK,pad=720:1334:0:24:color=0x109757,crop=499:1333:110:0,scale=464:1240" # 7% larger, 10px right
FRAME_B="$MASK,pad=720:1320:0:16:color=0x109757,crop=493:1318:103:1,scale=464:1240" # 6% larger
# FRAME_A, widened left to the edge of the source for the presenting gesture, whose arm reaches out of the shared frame.
# The extra width is undone in components/Character.tsx (CLIP_BOX), so he still lines up with the others.
FRAME_A_WIDE="$MASK,pad=720:1334:0:24:color=0x109757,crop=609:1333:0:0,scale=566:1240"
SIZE_WIDE="scale=424:930"

# 1. Head circle -> an 8x7 sprite of every 2nd source frame from 0 to 108, so cell k is frame 2k.
# Cell 0 looks at the camera, cells 1-12 turn from the camera to screen-left, and cells 13-54 are
# one full circle of his gaze (left, up, right, down). components/Character.tsx walks these cells.
ffmpeg -v error -y -i "$IN/04-look-circle.mp4" \
  -vf "select='between(n,0,109)*not(mod(n,2))',$FRAME,$KEY,$SIZE,format=rgba,tile=8x7" \
  -frames:v 1 "$TMP/look.png"
cwebp -quiet -q 80 -alpha_q 90 "$TMP/look.png" -o "$OUT/look.webp"

# 2. Clips -> VP9 with alpha (Chromium, Firefox) and HEVC with alpha (Safari).
encode() {
  local src=$1 name=$2 frame=$3 size=${4:-$SIZE}
  ffmpeg -v error -y -i "$IN/$src.mp4" -vf "$frame,$KEY,$size,format=yuva420p" -an \
    -c:v libvpx-vp9 -b:v 0 -crf 34 -row-mt 1 "$OUT/$name.webm"
  ffmpeg -v error -y -i "$IN/$src.mp4" -vf "$frame,$KEY,$size,format=bgra" -an \
    -c:v hevc_videotoolbox -alpha_quality 0.75 -q:v 55 -tag:v hvc1 "$OUT/$name.mp4"
}
encode 05-idle-nocup idle "$FRAME_A"
encode 06-wave wave "$FRAME_B"
encode 07-present present "$FRAME_A_WIDE" "$SIZE_WIDE"
encode 08-thumbsup thumbsup "$FRAME_B"
encode 09-handshake handshake "$FRAME_A"

ls -lh "$OUT"
