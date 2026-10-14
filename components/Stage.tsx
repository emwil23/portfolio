"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { RING, SPOKE, around, ringAt } from "@/components/Character";
import { boot } from "@/lib/boot";

// The fixed WebGL backdrop. The camera flies down -z as the page scrolls, with one stop per
// [data-chapter="<scene>"] element, in DOM order. Scenes and what stands at them:
//   hero                 studio floor and dust
//   fly                  flying in
//   green, key           one frame on its green wall; "key" removes the wall in the shader as you scroll
//   sprite, follow       the 55 frames deal out of a deck into the ring; the cursor picks a frame on it
//   work                 the same ring, without its centre (the character stands there, see Interlude.tsx)
//   out                  through the ring
//   wedding ... reply    two streams of colour on the floor that run side by side, then become one
//   proof ... end        a run of gates
//   scale                a skyline that rises as you arrive
//   player               drifting gems
//   shake ... close      open floor to the end of the page
// A set-piece is only shown on a page that has its scene.
const GREEN_Z = -16;
const RING_Z = -46;
const RADIUS = 3.6;
const CARDS = SPOKE + RING; // cells 0..54 of look-small.webp
const HEAD = 348 / 930; // the top square of each cell: his head and shoulders
const FOV = 45;
const TAN = Math.tan((FOV / 2) * (Math.PI / 180));

const clamp = (x: number) => Math.min(1, Math.max(0, x));
const smooth = (a: number, b: number, x: number) => {
  const t = clamp((x - a) / (b - a));
  return t * t * (3 - 2 * t);
};

const GREEN_FRAGMENT = /* glsl */ `
  uniform sampler2D uMap;
  uniform float uKey;
  uniform float uOpacity;
  uniform vec3 uLine;
  varying vec2 vUv;
  void main() {
    vec4 t = texture2D(uMap, vUv);
    float edge = uKey * 1.1 - 0.05;
    float keyed = 1.0 - smoothstep(edge - 0.004, edge + 0.004, vUv.x);
    // ffmpeg's colorkey=0x109757:0.12:0.06, then a despill, as in scripts/key-assets.sh
    float diff = length(t.rgb - vec3(0.063, 0.592, 0.341)) / 1.732;
    float alpha = clamp((diff - 0.12) / 0.06, 0.0, 1.0);
    vec3 rgb = t.rgb;
    rgb.g = mix(rgb.g, min(rgb.g, max(rgb.r, rgb.b)), keyed);
    float line = exp(-pow((vUv.x - edge) * 90.0, 2.0));
    gl_FragColor = vec4(mix(rgb, uLine, line), max(mix(1.0, alpha, keyed), line) * uOpacity);
  }
`;

const CARD_VERTEX = /* glsl */ `
  attribute float aCell;
  attribute float aGlow;
  varying vec2 vUv;
  varying vec2 vCard;
  varying float vGlow;
  void main() {
    vec2 cell = vec2(mod(aCell, 8.0), 6.0 - floor(aCell / 8.0));
    vUv = (cell + vec2(uv.x, 1.0 - (1.0 - uv.y) * ${HEAD.toFixed(4)})) / vec2(8.0, 7.0);
    vCard = uv;
    vGlow = aGlow;
    gl_Position = projectionMatrix * modelViewMatrix * instanceMatrix * vec4(position, 1.0);
  }
`;

const CARD_FRAGMENT = /* glsl */ `
  uniform sampler2D uMap;
  uniform float uOpacity;
  uniform vec3 uInk;
  uniform vec3 uLine;
  varying vec2 vUv;
  varying vec2 vCard;
  varying float vGlow;
  void main() {
    vec4 t = texture2D(uMap, vUv);
    float corner = length(max(abs(vCard - 0.5) - 0.42, 0.0)) - 0.08;
    float mask = 1.0 - smoothstep(-0.01, 0.01, corner);
    // The frame in play gets its green wall back
    vec3 back = mix(uInk, uLine, vGlow);
    gl_FragColor = vec4(mix(back, t.rgb, t.a), mix(mix(0.07, 0.92, vGlow), 1.0, t.a) * mask * uOpacity);
  }
`;

const PLAIN_VERTEX = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

/** The edges of a set of boxes, each [width, height, depth, x, y, z], as one geometry. */
const boxLines = (boxes: number[][]) => {
  const points: number[] = [];
  for (const [w, h, d, x, y, z] of boxes) {
    const edges = new THREE.EdgesGeometry(new THREE.BoxGeometry(w, h, d));
    const at = edges.attributes.position;
    for (let i = 0; i < at.count; i++) points.push(at.getX(i) + x, at.getY(i) + y, at.getZ(i) + z);
  }
  return new THREE.BufferGeometry().setAttribute("position", new THREE.Float32BufferAttribute(points, 3));
};

/** Where each frame sits once dealt: cell 0 in the middle, the spoke out to the left, the ring around. */
const seat = (cell: number) => {
  if (cell === 0) return { x: 0, y: 0, size: 1.7 };
  if (cell < SPOKE) return { x: -1.05 - (cell - 1) * 0.19, y: 0, size: 0.17 };
  // The inverse of ringAt: ring position -> degrees clockwise from "left"
  const i = cell - SPOKE;
  const q = i < 10 ? 0 : i < 20 ? 1 : i < 31 ? 2 : 3;
  const a = ((q * 90 + ((i - [0, 10, 20, 31][q]) / [10, 10, 11, 11][q]) * 90) * Math.PI) / 180;
  return { x: -Math.cos(a) * RADIUS, y: Math.sin(a) * RADIUS, size: 0.5 };
};

export function Stage() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    // Colours pass straight through: the textures and CSS colours are already sRGB
    THREE.ColorManagement.enabled = false;
    // Phones and slow connections (lib/boot.ts) get a lighter stage: no antialiasing, one pixel per CSS pixel, less dust
    const { lite } = boot.get();
    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: !lite });
    } catch {
      return; // no WebGL: the page reads fine without the backdrop
    }
    renderer.outputColorSpace = THREE.LinearSRGBColorSpace;
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, lite ? 1 : 2));

    const still = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const scene = new THREE.Scene();
    const fog = new THREE.Fog(0, 6, 46);
    scene.fog = fog;
    const camera = new THREE.PerspectiveCamera(FOV, 1, 0.1, 140);
    camera.position.set(0, 0, 8);
    const loader = new THREE.TextureLoader();

    // Dust and a studio floor, the whole length of the flight
    const specks = new Float32Array((lite ? 1200 : 2800) * 3);
    for (let i = 0; i < specks.length; i += 3) {
      specks[i] = (Math.random() - 0.5) * 30;
      specks[i + 1] = Math.random() * 10 - 3;
      specks[i + 2] = 10 - Math.random() * 250;
    }
    const dustGeometry = new THREE.BufferGeometry();
    dustGeometry.setAttribute("position", new THREE.BufferAttribute(specks, 3));
    const dustMaterial = new THREE.PointsMaterial({ size: 0.06, transparent: true, opacity: 0.5, depthWrite: false });
    const dust = new THREE.Points(dustGeometry, dustMaterial);
    const floor = new THREE.GridHelper(440, 220);
    floor.position.set(0, -3, -100);
    const floorMaterial = floor.material as THREE.LineBasicMaterial;
    floorMaterial.vertexColors = false;
    floorMaterial.transparent = true;
    floorMaterial.opacity = 0.22;
    scene.add(dust, floor);

    // Gates to fly through, a skyline standing on the floor either side of the flight path, and gems
    const lineMaterial = new THREE.LineBasicMaterial({ transparent: true, opacity: 0.3 });
    const gates = new THREE.LineSegments(
      boxLines(Array.from({ length: 11 }, (_, i) => [9, 6, 0.3, 0, 0, -160 - i * 6])),
      lineMaterial,
    );
    const skyline = new THREE.LineSegments(
      boxLines(
        Array.from({ length: 80 }, (_, i) => {
          const h = 1 + Math.random() * 6;
          const x = (3.5 + Math.random() * 13) * (i % 2 ? 1 : -1);
          return [0.8 + Math.random(), h, 0.8 + Math.random(), x, h / 2, -72 - Math.random() * 44];
        }),
      ),
      lineMaterial,
    );
    skyline.position.y = -3;
    const gemGeometry = new THREE.EdgesGeometry(new THREE.IcosahedronGeometry(1, 0));
    const gemMaterial = new THREE.LineBasicMaterial({ color: "#A855F7", transparent: true, opacity: 0.7 });
    const gems = new THREE.Group();
    for (let i = 0; i < 16; i++) {
      const gem = new THREE.LineSegments(gemGeometry, gemMaterial);
      gem.position.set((2.5 + Math.random() * 8) * (i % 2 ? 1 : -1), Math.random() * 6 - 2, -134 - Math.random() * 30);
      gem.scale.setScalar(0.3 + Math.random() * 0.9);
      gem.rotation.set(Math.random() * 3, Math.random() * 3, 0);
      gems.add(gem);
    }

    // Two rivers, rose and indigo, that meet at z = -100 and run on as one
    const drops = 2600;
    const riverAt = new Float32Array(drops * 3);
    const riverColor = new Float32Array(drops * 3);
    const tint = (hex: string) => new THREE.Color(hex).toArray();
    const [rose, indigo, blend] = [tint("#E0728F"), tint("#6C7BE0"), tint("#A877C4")];
    for (let i = 0; i < drops; i++) {
      const z = -62 - Math.random() * 78;
      const apart = smooth(-104, -92, z); // 1 while the streams run apart, 0 once they have met
      const side = i % 2 ? 1 : -1;
      riverAt.set([side * apart * (2.6 + Math.sin(z * 0.35 + side) * 0.5) + (Math.random() - 0.5) * 0.9, -2.9 + Math.random() * 0.25, z], i * 3);
      riverColor.set((side > 0 ? rose : indigo).map((v, k) => v + (blend[k] - v) * (1 - apart)), i * 3);
    }
    const riverGeometry = new THREE.BufferGeometry();
    riverGeometry.setAttribute("position", new THREE.BufferAttribute(riverAt, 3));
    riverGeometry.setAttribute("color", new THREE.BufferAttribute(riverColor, 3));
    const riverMaterial = new THREE.PointsMaterial({ size: 0.11, vertexColors: true, transparent: true, opacity: 0.9, depthWrite: false });
    const rivers = new THREE.Points(riverGeometry, riverMaterial);
    scene.add(gates, skyline, gems, rivers);

    // One frame of the source clip, on its green wall
    const greenMaterial = new THREE.ShaderMaterial({
      transparent: true,
      depthWrite: false,
      uniforms: {
        uMap: { value: loader.load("/assets/character/green.webp") },
        uKey: { value: 0 },
        uOpacity: { value: 0 },
        uLine: { value: new THREE.Color() },
      },
      vertexShader: PLAIN_VERTEX,
      fragmentShader: GREEN_FRAGMENT,
    });
    const green = new THREE.Mesh(new THREE.PlaneGeometry(2.8125, 5), greenMaterial);
    green.position.z = GREEN_Z;
    scene.add(green);

    // The 55 frames, one instanced card each
    const cells = new THREE.InstancedBufferAttribute(Float32Array.from({ length: CARDS }, (_, i) => i), 1);
    const glows = new THREE.InstancedBufferAttribute(new Float32Array(CARDS), 1);
    const cardGeometry = new THREE.PlaneGeometry(1, 1);
    cardGeometry.setAttribute("aCell", cells);
    cardGeometry.setAttribute("aGlow", glows);
    const cardMaterial = new THREE.ShaderMaterial({
      transparent: true,
      depthWrite: false,
      uniforms: {
        uMap: { value: loader.load("/assets/character/look-small.webp") },
        uOpacity: { value: 0 },
        uInk: { value: new THREE.Color() },
        uLine: { value: new THREE.Color() },
      },
      vertexShader: CARD_VERTEX,
      fragmentShader: CARD_FRAGMENT,
    });
    const cards = new THREE.InstancedMesh(cardGeometry, cardMaterial, CARDS);
    cards.position.z = RING_Z;
    cards.frustumCulled = false; // instances move, the mesh's own bounds don't
    scene.add(cards);
    const seats = Array.from({ length: CARDS }, (_, i) => seat(i));
    const card = new THREE.Object3D();

    // Colours come from the page's theme tokens
    const paint = () => {
      const css = getComputedStyle(document.documentElement);
      const ink = css.getPropertyValue("--foreground").trim();
      const key = css.getPropertyValue("--key").trim();
      dustMaterial.color.set(ink);
      floorMaterial.color.set(ink);
      lineMaterial.color.set(ink);
      fog.color.set(css.getPropertyValue("--background").trim());
      cardMaterial.uniforms.uInk.value.set(ink);
      cardMaterial.uniforms.uLine.value.set(key);
      greenMaterial.uniforms.uLine.value.set(key);
    };
    paint();
    const theme = new MutationObserver(paint);
    theme.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });

    // Camera stops, one per chapter. park() frames a w x h object in the part of the view the text leaves free.
    let chapters: HTMLElement[] = [];
    let names: string[] = [];
    let centres: number[] = [];
    let path: THREE.Vector3[] = [];
    const park = (w: number, h: number, z: number) => {
      const [fw, fh, nx, ny] = camera.aspect > 1 ? [0.5, 0.8, 0.45, 0] : [0.9, 0.42, 0, 0.45];
      const d = Math.max(h / (fh * 2 * TAN), w / (fw * 2 * TAN * camera.aspect));
      return new THREE.Vector3(-nx * d * TAN * camera.aspect, -ny * d * TAN, z + d);
    };
    const measure = () => {
      renderer.setSize(window.innerWidth, window.innerHeight, false);
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      chapters = Array.from(document.querySelectorAll<HTMLElement>("[data-chapter]"));
      names = chapters.map((el) => el.dataset.chapter ?? "");
      centres = chapters.map((el) => el.getBoundingClientRect().top + window.scrollY + el.offsetHeight / 2);
      const v = (x: number, y: number, z: number) => new THREE.Vector3(x, y, z);
      const greenStop = park(2.8125, 5, GREEN_Z);
      const ringStop = park(RADIUS * 2 + 1, RADIUS * 2 + 1, RING_Z);
      const stops: Record<string, THREE.Vector3> = {
        hero: v(0, 0, 8),
        fly: v(0, 0.4, 0),
        green: greenStop,
        key: greenStop,
        sprite: ringStop,
        follow: ringStop,
        work: ringStop,
        out: v(0, 0, RING_Z - 10),
        wedding: v(0, 0.6, -56),
        river: v(0, 0.8, -76),
        confluence: v(0, 0.2, -94),
        blend: v(0, 0.4, -112),
        reply: v(0, 0, -130),
        proof: v(0, 0, -150),
        end: v(0, 0, -228),
        scale: v(0, 0.5, -62),
        player: v(0, 0, -126),
        shake: v(0, 0, -168),
        close: v(0, 0, -190),
      };
      path = names.map((name) => stops[name] ?? stops.hero);
      green.visible = names.includes("green");
      gates.visible = names.includes("proof");
      skyline.visible = names.includes("scale");
      gems.visible = names.includes("player");
      rivers.visible = names.includes("wedding");
    };
    measure();
    const resize = new ResizeObserver(measure);
    resize.observe(document.body);

    const pointer = { x: 0, y: 0, moved: false };
    const onPointer = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      pointer.x = (e.clientX / window.innerWidth) * 2 - 1;
      pointer.y = 1 - (e.clientY / window.innerHeight) * 2;
      pointer.moved = true;
    };
    window.addEventListener("pointermove", onPointer);

    /** The chapter number of a scene on this page, for timing effects against the scroll. */
    const chapterOf = (...scenes: string[]) => {
      const i = names.findIndex((name) => scenes.includes(name));
      return i < 0 ? Infinity : i;
    };
    const at = new THREE.Vector3(0, 0, 8);
    let pos = 0; // the frame in play on the ring
    let ringShown = 1; // eases to 0 while a chapter is showing a picture where the ring is
    let raf = 0;
    const frame = (now: number) => {
      raf = requestAnimationFrame(frame);
      if (centres.length < 2) return;

      // c: which chapter is at the middle of the screen, as a fraction
      const y = window.scrollY + window.innerHeight / 2;
      let i = 0;
      while (i < centres.length - 2 && y > centres[i + 1]) i++;
      const c = i + clamp((y - centres[i]) / (centres[i + 1] - centres[i]));

      // The camera rests at each stop and travels in between
      const from = path[Math.min(i, path.length - 1)];
      const to = path[Math.min(i + 1, path.length - 1)];
      at.lerpVectors(from, to, smooth(0.2, 0.8, c - i));
      camera.position.lerp(at, still ? 1 : 0.08);
      if (!still) {
        camera.rotation.set(pointer.y * 0.02, -pointer.x * 0.03, 0);
        dust.position.y = Math.sin(now / 4000) * 0.15;
        for (const gem of gems.children) gem.rotation.y += 0.004;
      }
      skyline.scale.y = Math.max(0.001, smooth(-0.7, -0.1, c - chapterOf("scale")));

      const greenDistance = camera.position.z - GREEN_Z;
      greenMaterial.uniforms.uKey.value = smooth(-0.65, 0.3, c - chapterOf("key"));
      // On a tall screen the frame is parked dead ahead, behind whatever the chapter before shows, so it waits for its own chapter
      const greenDue = camera.aspect > 1 ? 1 : smooth(-0.7, -0.3, c - chapterOf("green"));
      greenMaterial.uniforms.uOpacity.value = smooth(1, 3, greenDistance) * (1 - smooth(14, 22, greenDistance)) * greenDue;

      const ringDistance = camera.position.z - RING_Z;
      const covered = chapters.some((el) => el.dataset.covered);
      ringShown += ((covered ? 0 : 1) - ringShown) * (still ? 1 : 0.14);
      const opacity = smooth(1, 4, ringDistance) * (1 - smooth(22, 30, ringDistance)) * (ringShown < 0.01 ? 0 : ringShown);
      cardMaterial.uniforms.uOpacity.value = opacity;
      if (opacity > 0) {
        const solo = !names.includes("sprite"); // the ring alone: the character stands in the middle
        const spread = smooth(-0.35, 0.4, c - Math.min(chapterOf("sprite"), chapterOf("work") - 0.5));
        const follow = c - chapterOf("follow", "work");
        const live = smooth(-0.6, -0.2, follow) * (1 - smooth(0.5, 0.9, follow));

        // The pointer, on the ring's plane. Same mapping as the hero: its angle picks the frame.
        const px = camera.position.x + pointer.x * ringDistance * TAN * camera.aspect;
        const py = camera.position.y + pointer.y * ringDistance * TAN;
        const onFace = pointer.moved && Math.hypot(px, py) < 0.9;
        if (pointer.moved) pos += around(pos, ringAt(px, -py)) * (still ? 1 : 0.15);
        else if (!still) pos += 0.08; // shortcut: no mouse (touch) just circles; make it follow touches if the demo needs to be driven there
        pos = (pos + RING) % RING;
        cells.setX(0, live > 0.5 && !onFace ? SPOKE + (Math.round(pos) % RING) : 0);
        cells.needsUpdate = true;

        for (let k = 0; k < CARDS; k++) {
          const dealt = smooth(0, 1, spread * 1.6 - (k / CARDS) * 0.6);
          const glow = k < SPOKE || onFace ? 0 : Math.exp(-(around(k - SPOKE, pos) ** 2) / 3) * live;
          const s = seats[k];
          const size = solo && k < SPOKE ? 0 : (1.7 + (s.size - 1.7) * dealt) * (1 + glow * 0.5);
          card.position.set(s.x * dealt, s.y * dealt, k === 0 ? 0.1 : (1 - dealt) * -k * 0.04 + glow * 0.5);
          card.scale.set(size, size, 1);
          card.updateMatrix();
          cards.setMatrixAt(k, card.matrix);
          glows.setX(k, glow);
        }
        cards.instanceMatrix.needsUpdate = true;
        glows.needsUpdate = true;
      }

      renderer.render(scene, camera);
    };
    raf = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onPointer);
      theme.disconnect();
      resize.disconnect();
      for (const material of [greenMaterial, cardMaterial]) material.uniforms.uMap.value.dispose();
      for (const item of [
        dustGeometry, dustMaterial, floor.geometry, floorMaterial, lineMaterial, gates.geometry, skyline.geometry,
        gemGeometry, gemMaterial, riverGeometry, riverMaterial, green.geometry, greenMaterial, cardGeometry, cardMaterial,
      ]) item.dispose();
      cards.dispose();
      renderer.dispose();
    };
  }, []);

  return <canvas ref={ref} aria-hidden="true" className="stage-in pointer-events-none fixed inset-0 z-0 h-full w-full" />;
}
