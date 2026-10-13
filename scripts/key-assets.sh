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
# The presenting gesture was shot 16:9 so his whole arm fits. Its wall is a slightly different green and its
# watermark sits elsewhere, so it masks and keys for itself; the crop keeps him the same size as the others and
# the extra width is undone in components/Character.tsx (CLIP_BOX), so he still lines up with them.
FRAME_WIDE="drawbox=x=1080:y=540:w=200:h=180:color=0x229B52:t=fill,crop=470:720:299:0,colorkey=0x229B52:0.12:0.06"
SIZE_WIDE="scale=608:930"

# 1. Head circle -> an 8x7 sprite of every 2nd source frame from 0 to 108, so cell k is frame 2k.
# Cell 0 looks at the camera, cells 1-12 turn from the camera to screen-left, and cells 13-54 are
# one full circle of his gaze (left, up, right, down). components/Character.tsx walks these cells.
ffmpeg -v error -y -i "$IN/04-look-circle.mp4" \
  -vf "select='between(n,0,109)*not(mod(n,2))',$FRAME,$KEY,$SIZE,format=rgba,tile=8x7" \
  -frames:v 1 "$TMP/look.png"
cwebp -quiet -q 80 -alpha_q 90 "$TMP/look.png" -o "$OUT/look.webp"
# For the WebGL stage (components/Stage.tsx): the sprite at half size, so it fits a 4096px phone
# texture limit, and one frame still on its green wall, which the stage keys live in a shader.
cwebp -quiet -q 80 -alpha_q 90 -resize 1392 3255 "$TMP/look.png" -o "$OUT/look-small.webp"
ffmpeg -v error -y -i "$IN/04-look-circle.mp4" -vf "$MASK,scale=432:768" -frames:v 1 "$TMP/green.png"
cwebp -quiet -q 90 "$TMP/green.png" -o "$OUT/green.webp"

# One full turn on the spot -> an 8x6 sprite of every 3rd frame, scrubbed by the scroll in components/Turnaround.tsx.
ffmpeg -v error -y -i "$IN/10-turnaround.mp4" \
  -vf "select='not(mod(n,3))',$MASK,crop=464:1240:128:20,$KEY,scale=261:698,format=rgba,tile=8x6" \
  -frames:v 1 "$TMP/turn.png"
cwebp -quiet -q 80 -alpha_q 90 "$TMP/turn.png" -o "$OUT/turn.webp"

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
encode 11-present-wide present "$FRAME_WIDE" "$SIZE_WIDE"
encode 08-thumbsup thumbsup "$FRAME_B"
# Later clips each have their own wall green and framing, so they mask, frame and key for themselves
# (measured from the bounding box of frame 0, as above). Wider than the shared frame where he leans out of it.
encode 12-gaming game "drawbox=x=0:y=1080:w=175:h=200:color=0x1F9B54:t=fill,drawbox=x=545:y=1080:w=175:h=200:color=0x1F9B54:t=fill,pad=720:1304:0:2:color=0x1F9B54,crop=528:1304:86:0,colorkey=0x1F9B54:0.12:0.06" "scale=376:930"
encode 13-lookup admire "drawbox=x=0:y=1080:w=175:h=200:color=0x1B9A54:t=fill,drawbox=x=545:y=1080:w=175:h=200:color=0x1B9A54:t=fill,pad=720:1288:0:0:color=0x1B9A54,crop=480:1284:113:3,colorkey=0x1B9A54:0.12:0.06"
encode 14-typing type "drawbox=x=0:y=1080:w=175:h=200:color=0x229B54:t=fill,drawbox=x=545:y=1080:w=175:h=200:color=0x229B54:t=fill,pad=720:1326:0:15:color=0x229B54,crop=496:1325:100:0,colorkey=0x229B54:0.12:0.06"

# The preloader's entrance keeps the whole 9:16 frame (he walks in from its right edge) and drops the
# first two frames, which are a still of the reference pose.
ARRIVE="trim=start_frame=2,setpts=PTS-STARTPTS,drawbox=x=0:y=1080:w=175:h=200:color=0x16A555:t=fill,drawbox=x=545:y=1080:w=175:h=200:color=0x16A555:t=fill,colorkey=0x16A555:0.12:0.06"
encode 15-arrive arrive "$ARRIVE" "scale=522:928"
encode 09-handshake handshake "$FRAME_A"

# The Player 1 poses are Nano Banana stills (768x1376) on a wall of their own green, keyed whole.
mkdir -p public/assets/player
for pose in 19-night 23-creed 21-site; do
  ffmpeg -v error -y -i "$IN/$pose.jpg" \
    -vf "drawbox=x=630:y=1240:w=138:h=136:color=0x0FA24B:t=fill,colorkey=0x0FA24B:0.12:0.06,despill=type=green,format=rgba" \
    -frames:v 1 -c:v libwebp -quality 82 "public/assets/player/${pose#*-}.webp"
done
# Each world's backdrop is an 8s Veo clip cut to a 7s loop: its last second dissolves into its first.
for world in 24-world-night 25-world-creed 26-world-site; do
  ffmpeg -v error -y -i "$IN/$world.mp4" -an -filter_complex \
    "[0:v]scale=854:480,split[a][b];[a]trim=1:8,setpts=PTS-STARTPTS[main];[b]trim=0:1,setpts=PTS-STARTPTS[head];[main][head]xfade=transition=fade:duration=1:offset=6,format=yuv420p" \
    -c:v libx264 -preset slow -crf 34 -movflags +faststart "public/assets/player/${world#*-world-}.mp4"
done

# The contact section's desk clip. Its wall is unevenly lit, so it is keyed on how green each pixel is
# (g - max(r, b)) rather than on distance from one colour, then cut to a 5.5s loop that dissolves into itself.
# No HEVC encode yet: Apple browsers show desk.webp, its first frame (see components/ContactHandshake.tsx).
# Keyed-out pixels are also painted black, so the codec's alpha noise cannot show as a pale haze.
GN="(g(X,Y)-max(r(X,Y),b(X,Y)))"
DESK="drawbox=x=1090:y=530:w=190:h=190:color=0x55A066:t=fill,format=gbrap,geq=r='r(X,Y)*lt($GN,30)':g='min(g(X,Y),max(r(X,Y),b(X,Y)))*lt($GN,30)':b='b(X,Y)*lt($GN,30)':a='255*clip((30-$GN)/18,0,1)',crop=800:630:120:90"
ffmpeg -v error -y -i "$IN/27-desk.mp4" -an -filter_complex \
  "[0:v]$DESK,split[a][b];[a]trim=0.5:6,setpts=PTS-STARTPTS[main];[b]trim=0:0.5,setpts=PTS-STARTPTS[head];[main][head]xfade=transition=fade:duration=0.5:offset=5,format=yuva420p" \
  -c:v libvpx-vp9 -b:v 0 -crf 32 -row-mt 1 "$OUT/desk.webm"
ffmpeg -v error -y -i "$IN/27-desk.mp4" -vf "$DESK" -frames:v 1 -c:v libwebp -quality 82 "$OUT/desk.webp"

ls -lh "$OUT"
