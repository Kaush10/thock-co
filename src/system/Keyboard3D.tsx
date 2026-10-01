import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import { LAYOUT_65 } from './Keyboard';

// The home page's keyboard, rendered in three.js: a graphite case with
// Cherry-profile caps in the site's two-tone colourway, floating over the hole.
// Keys go down and glow pink as they're typed or tapped. One unit (u) is one
// key pitch; the board is 16u by 5u.

type Variant = 'light' | 'dark' | 'signal';

const CAP: Record<Variant, { face: string; ink: string }> = {
  light: { face: '#eeece6', ink: '#1c1c1c' },
  dark: { face: '#3a3a40', ink: '#e2e2e4' },
  signal: { face: '#ff1aa8', ink: '#3b0024' },
};
const SIGNAL = new THREE.Color('#ff00aa');

// Cherry profile: each row has its own height, and its top tilts toward you
// on the upper rows and away on the lower ones. `slope` is rise per unit
// toward the front.
const SCULPT = [
  { h: 0.47, slope: -0.17 },
  { h: 0.41, slope: -0.08 },
  { h: 0.385, slope: 0 },
  { h: 0.4, slope: 0.07 },
  { h: 0.4, slope: 0.07 },
];
const GAP = 0.055; // between neighbouring caps
const PLATE_Y = 0.4; // where the caps sit
const CASE_H = 0.52;
const CASE_MARGIN = 0.5; // case wall around the keys
const BOARD_W = 16;
const BOARD_D = 5;
const PRESS_DEPTH = 0.13;
const LEGEND_PX = 220; // texture pixels per unit

type Ring = [number, number, number][]; // x, y, z

function roundedRect(w: number, d: number, r: number, seg: number, cz = 0): [number, number][] {
  const hw = w / 2;
  const hd = d / 2;
  const corners: [number, number, number][] = [
    [hw - r, hd - r, 0],
    [-(hw - r), hd - r, Math.PI / 2],
    [-(hw - r), -(hd - r), Math.PI],
    [hw - r, -(hd - r), Math.PI * 1.5],
  ];
  const points: [number, number][] = [];
  for (const [x, z, a0] of corners) {
    for (let i = 0; i <= seg; i++) {
      const a = a0 + (i / seg) * (Math.PI / 2);
      points.push([x + Math.cos(a) * r, cz + z + Math.sin(a) * r]);
    }
  }
  return points;
}

/** A keycap `units` wide for `row`: lofted from its footprint up to a dished, tilted top. */
function capGeometry(units: number, row: number) {
  const { h, slope } = SCULPT[row];
  const bw = units - GAP;
  const bd = 1 - GAP;
  const tw = bw - 0.27;
  const td = bd - 0.31;
  const zTop = -0.035; // the top face sits a little toward the back
  // Cylindrical dish, shallower on long keys.
  const dish = 0.034 / Math.sqrt(units);
  const topY = (x: number, z: number) =>
    h + slope * (z - zTop) - dish * (1 - Math.min(1, (x / (tw / 2)) ** 2));

  const seg = 5;
  const rings: Ring[] = [];
  const ring = (w: number, d: number, r: number, cz: number, y: (x: number, z: number) => number) =>
    rings.push(roundedRect(w, d, r, seg, cz).map(([x, z]) => [x, y(x, z), z]));

  ring(bw, bd, 0.075, 0, () => 0);
  ring(tw + 0.07, td + 0.07, 0.13, zTop, (x, z) => topY(x, z) - 0.06);
  ring(tw, td, 0.11, zTop, topY);
  for (const s of [0.74, 0.46, 0.2]) ring(tw * s, td * s, 0.11 * s, zTop, topY);

  const positions: number[] = [];
  const uvs: number[] = [];
  const push = (x: number, y: number, z: number) => {
    positions.push(x, y, z);
    // The legend texture covers the top face; the walls take its blank edge.
    const u = THREE.MathUtils.clamp((x + tw / 2) / tw, 0, 1);
    const v = THREE.MathUtils.clamp(1 - (z - zTop + td / 2) / td, 0, 1);
    uvs.push(u, v);
  };
  rings.forEach((r) => r.forEach(([x, y, z]) => push(x, y, z)));
  push(0, topY(0, zTop), zTop);

  const n = rings[0].length;
  const index: number[] = [];
  for (let r = 0; r < rings.length - 1; r++) {
    for (let j = 0; j < n; j++) {
      const a = r * n + j;
      const a1 = r * n + ((j + 1) % n);
      const b = a + n;
      const b1 = a1 + n;
      index.push(a, b, a1, b, b1, a1);
    }
  }
  const last = (rings.length - 1) * n;
  const centre = rings.length * n;
  for (let j = 0; j < n; j++) index.push(last + j, centre, last + ((j + 1) % n));

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
  geometry.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2));
  geometry.setIndex(index);
  geometry.computeVertexNormals();
  return { geometry, tw, td };
}

/** The cap's top face as a texture: its colour, with the legend printed top-left. */
function legendTexture(
  key: { legend: string; shift?: string; align?: 'corner' | 'center' },
  variant: Variant,
  tw: number,
  td: number,
  anisotropy: number,
) {
  const canvas = document.createElement('canvas');
  canvas.width = Math.round(tw * LEGEND_PX);
  canvas.height = Math.round(td * LEGEND_PX);
  const ctx = canvas.getContext('2d')!;
  const { face, ink } = CAP[variant];
  ctx.fillStyle = face;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = ink;
  ctx.textBaseline = 'top';
  const pad = 0.075 * LEGEND_PX;
  const font = (weight: number, size: number) =>
    `${weight} ${Math.round(size * LEGEND_PX)}px Inter, "Helvetica Neue", Arial, sans-serif`;

  if (key.shift) {
    ctx.font = font(600, 0.17);
    ctx.fillText(key.shift, pad, pad);
    ctx.fillText(key.legend, pad, pad + 0.22 * LEGEND_PX);
  } else if (key.align === 'center') {
    ctx.font = font(600, 0.22);
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(key.legend, canvas.width / 2, canvas.height / 2);
  } else if (key.legend.length > 1) {
    ctx.font = font(600, 0.135);
    ctx.fillText(key.legend, pad, pad);
  } else if (key.legend) {
    ctx.font = font(600, 0.27);
    ctx.fillText(key.legend, pad, pad);
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = anisotropy;
  return texture;
}

function roundedShape(w: number, d: number, r: number, path: THREE.Path = new THREE.Shape()) {
  const x = -w / 2;
  const y = -d / 2;
  path.moveTo(x + r, y);
  path.lineTo(x + w - r, y);
  path.quadraticCurveTo(x + w, y, x + w, y + r);
  path.lineTo(x + w, y + d - r);
  path.quadraticCurveTo(x + w, y + d, x + w - r, y + d);
  path.lineTo(x + r, y + d);
  path.quadraticCurveTo(x, y + d, x, y + d - r);
  path.lineTo(x, y + r);
  path.quadraticCurveTo(x, y, x + r, y);
  return path;
}

/** Soft pink light spilling out from under the case. */
function glowTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = canvas.height = 256;
  const ctx = canvas.getContext('2d')!;
  const gradient = ctx.createRadialGradient(128, 128, 0, 128, 128, 128);
  gradient.addColorStop(0, 'rgba(255, 0, 170, 1)');
  gradient.addColorStop(0.45, 'rgba(255, 0, 170, 0.45)');
  gradient.addColorStop(1, 'rgba(255, 0, 170, 0)');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, 256, 256);
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

type KeyMesh = {
  id: string;
  mesh: THREE.Mesh<THREE.BufferGeometry, THREE.MeshStandardMaterial>;
  depth: number;
  glow: number;
};

function buildScene(renderer: THREE.WebGLRenderer) {
  const scene = new THREE.Scene();
  const pmrem = new THREE.PMREMGenerator(renderer);
  const room = new RoomEnvironment();
  const envMap = pmrem.fromScene(room, 0.04).texture;
  room.dispose();
  scene.environment = envMap;
  scene.environmentIntensity = 0.42;

  const disposables: { dispose: () => void }[] = [envMap, pmrem];
  const own = <T extends { dispose: () => void }>(thing: T) => (disposables.push(thing), thing);

  const board = new THREE.Group();
  scene.add(board);

  // Case: a bevelled graphite frame around the plate.
  const outerW = BOARD_W + CASE_MARGIN * 2;
  const outerD = BOARD_D + CASE_MARGIN * 2;
  const frame = roundedShape(outerW, outerD, 0.42) as THREE.Shape;
  frame.holes.push(roundedShape(BOARD_W + 0.2, BOARD_D + 0.2, 0.1, new THREE.Path()));
  const caseGeometry = own(
    new THREE.ExtrudeGeometry(frame, { depth: CASE_H, bevelEnabled: true, bevelThickness: 0.07, bevelSize: 0.07, bevelSegments: 5, curveSegments: 12 }),
  );
  caseGeometry.rotateX(-Math.PI / 2);
  const caseMaterial = own(
    new THREE.MeshPhysicalMaterial({ color: '#232327', metalness: 0.72, roughness: 0.34, clearcoat: 0.35, clearcoatRoughness: 0.35 }),
  );
  const caseMesh = new THREE.Mesh(caseGeometry, caseMaterial);
  caseMesh.castShadow = true;
  caseMesh.receiveShadow = true;
  board.add(caseMesh);

  const plate = new THREE.Mesh(
    own(new THREE.BoxGeometry(BOARD_W + 0.3, PLATE_Y, BOARD_D + 0.3)),
    own(new THREE.MeshStandardMaterial({ color: '#0d0d10', metalness: 0.4, roughness: 0.7 })),
  );
  plate.position.y = PLATE_Y / 2;
  plate.receiveShadow = true;
  board.add(plate);

  // A status LED on the top-right of the case, lit while someone types.
  const ledMaterial = own(new THREE.MeshStandardMaterial({ color: '#1a1a1d', emissive: SIGNAL, emissiveIntensity: 0, roughness: 0.3 }));
  const led = new THREE.Mesh(own(new THREE.SphereGeometry(0.065, 16, 12)), ledMaterial);
  led.position.set(outerW / 2 - 0.42, CASE_H + 0.05, -outerD / 2 + 0.25);
  board.add(led);

  // Underglow.
  const glowMaterial = own(
    new THREE.MeshBasicMaterial({ map: own(glowTexture()), transparent: true, opacity: 0.5, blending: THREE.AdditiveBlending, depthWrite: false, toneMapped: false }),
  );
  const glow = new THREE.Mesh(own(new THREE.PlaneGeometry(outerW * 1.5, outerD * 2.6)), glowMaterial);
  glow.rotation.x = -Math.PI / 2;
  glow.position.y = -0.3;
  board.add(glow);

  // Caps.
  const anisotropy = renderer.capabilities.getMaxAnisotropy();
  const geometries = new Map<string, ReturnType<typeof capGeometry>>();
  const keys: KeyMesh[] = [];
  LAYOUT_65.forEach((row, r) => {
    let x = -BOARD_W / 2;
    row.forEach((spec) => {
      const units = spec.units ?? 1;
      const cacheKey = `${units}|${r}`;
      if (!geometries.has(cacheKey)) {
        const built = capGeometry(units, r);
        own(built.geometry);
        geometries.set(cacheKey, built);
      }
      const { geometry, tw, td } = geometries.get(cacheKey)!;
      const variant: Variant = spec.variant ?? 'light';
      const material = own(
        new THREE.MeshStandardMaterial({
          map: own(legendTexture(spec, variant, tw, td, anisotropy)),
          roughness: variant === 'signal' ? 0.48 : 0.58,
          metalness: 0,
          emissive: SIGNAL,
          emissiveIntensity: 0,
        }),
      );
      const mesh = new THREE.Mesh(geometry, material);
      mesh.position.set(x + units / 2, PLATE_Y, r - (BOARD_D - 1) / 2);
      mesh.castShadow = true;
      mesh.receiveShadow = true;
      board.add(mesh);
      keys.push({ id: spec.id, mesh, depth: 0, glow: 0 });
      x += units;
    });
  });

  // Light: a soft key light from the upper left, a cool fill, and pink from the hole below.
  const key = new THREE.DirectionalLight('#ffffff', 2.1);
  key.position.set(-6, 13, 7);
  key.castShadow = true;
  key.shadow.mapSize.set(2048, 2048);
  key.shadow.camera.left = -11;
  key.shadow.camera.right = 11;
  key.shadow.camera.top = 7;
  key.shadow.camera.bottom = -7;
  key.shadow.bias = -0.0004;
  key.shadow.normalBias = 0.02;
  key.shadow.radius = 4;
  scene.add(key);
  const fill = new THREE.DirectionalLight('#c9d4ff', 0.35);
  fill.position.set(8, 5, 6);
  scene.add(fill);
  const under = new THREE.PointLight(SIGNAL, 40, 22, 1.6);
  under.position.set(0, -2.2, 4.2);
  scene.add(under);

  return {
    scene,
    board,
    keys,
    glowMaterial,
    ledMaterial,
    under,
    dispose: () => disposables.forEach((thing) => thing.dispose()),
  };
}

const FOV = 26;
const ELEVATION = THREE.MathUtils.degToRad(35);
const BASE_YAW = THREE.MathUtils.degToRad(-3.5);

/**
 * Renders the board into a canvas sized by its container. Keys whose ids are
 * in `lit` go down and glow; `live` brings up the underglow. If WebGL isn't
 * available it calls `onUnavailable` so the caller can show the CSS board.
 */
export default function Keyboard3D({
  lit,
  live,
  onKey,
  onUnavailable,
  className = '',
}: {
  lit: Set<string>;
  live: boolean;
  onKey?: (id: string) => void;
  onUnavailable?: () => void;
  className?: string;
}) {
  const hostRef = useRef<HTMLDivElement>(null);
  const state = useRef({ lit, live, onKey, onUnavailable });
  state.current = { lit, live, onKey, onUnavailable };

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;
    let cancelled = false;
    let cleanup = () => {};

    const start = async () => {
      // Legends are drawn into textures, so the font has to be ready first.
      await Promise.all([document.fonts.load('600 40px Inter'), document.fonts.load('500 40px Inter')]).catch(() => {});
      if (cancelled) return;

      let renderer: THREE.WebGLRenderer;
      try {
        renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
      } catch {
        state.current.onUnavailable?.();
        return;
      }
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.outputColorSpace = THREE.SRGBColorSpace;
      renderer.toneMapping = THREE.NeutralToneMapping;
      renderer.toneMappingExposure = 0.95;
      renderer.shadowMap.enabled = true;
      renderer.shadowMap.type = THREE.PCFSoftShadowMap;
      const canvas = renderer.domElement;
      canvas.style.display = 'block';
      canvas.style.width = '100%';
      canvas.style.height = '100%';
      canvas.setAttribute('aria-hidden', 'true');
      host.appendChild(canvas);

      const { scene, board, keys, glowMaterial, ledMaterial, under, dispose } = buildScene(renderer);
      const camera = new THREE.PerspectiveCamera(FOV, 1, 0.1, 200);
      const target = new THREE.Vector3(0, 0.3, 0.35);

      const fit = () => {
        const width = host.clientWidth;
        const height = host.clientHeight;
        if (!width || !height) return;
        renderer.setSize(width, height, false);
        const aspect = width / height;
        camera.aspect = aspect;
        const tan = Math.tan(THREE.MathUtils.degToRad(FOV / 2));
        // Far enough back that the case fits the width with a margin, and its depth the height.
        const byWidth = ((BOARD_W + CASE_MARGIN * 2) * 0.56) / (tan * aspect);
        const byHeight = 3.1 / tan;
        const distance = Math.max(byWidth, byHeight);
        camera.position.set(0, Math.sin(ELEVATION) * distance, Math.cos(ELEVATION) * distance).add(target);
        camera.lookAt(target);
        camera.updateProjectionMatrix();
      };
      fit();
      const resize = new ResizeObserver(fit);
      resize.observe(host);

      const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      const finePointer = window.matchMedia('(pointer: fine)').matches;

      // Pointer: the board leans toward it, the key under it is highlighted, and a click types it.
      const raycaster = new THREE.Raycaster();
      const pointer = new THREE.Vector2(2, 2);
      const lean = { x: 0, y: 0, tx: 0, ty: 0 };
      let hovered: KeyMesh | null = null;
      const meshes = keys.map((k) => k.mesh);
      const pick = (event: PointerEvent) => {
        const rect = canvas.getBoundingClientRect();
        pointer.set(((event.clientX - rect.left) / rect.width) * 2 - 1, -((event.clientY - rect.top) / rect.height) * 2 + 1);
        raycaster.setFromCamera(pointer, camera);
        const hit = raycaster.intersectObjects(meshes, false)[0];
        return hit ? keys.find((k) => k.mesh === hit.object) ?? null : null;
      };
      const onMove = (event: PointerEvent) => {
        hovered = state.current.onKey ? pick(event) : null;
        canvas.style.cursor = hovered ? 'pointer' : '';
      };
      const onLeave = () => {
        hovered = null;
        canvas.style.cursor = '';
      };
      const onDown = (event: PointerEvent) => {
        const hit = pick(event);
        if (hit && state.current.onKey) {
          event.preventDefault();
          state.current.onKey(hit.id);
        }
      };
      const onWindowMove = (event: PointerEvent) => {
        lean.tx = (event.clientX / window.innerWidth - 0.5) * 2;
        lean.ty = (event.clientY / window.innerHeight - 0.5) * 2;
      };
      canvas.addEventListener('pointermove', onMove);
      canvas.addEventListener('pointerleave', onLeave);
      canvas.addEventListener('pointerdown', onDown);
      if (finePointer && !reduceMotion) window.addEventListener('pointermove', onWindowMove);

      // Only draw while the board is on screen.
      let raf = 0;
      let last = performance.now();
      const tick = (now: number) => {
        raf = requestAnimationFrame(tick);
        const dt = Math.min(0.05, (now - last) / 1000);
        last = now;
        const ease = (rate: number) => 1 - Math.exp(-dt * rate);
        const { lit: litKeys, live: isLive } = state.current;

        lean.x += (lean.tx - lean.x) * ease(3);
        lean.y += (lean.ty - lean.y) * ease(3);
        board.rotation.y = BASE_YAW + lean.x * 0.07;
        board.rotation.x = lean.y * 0.035;
        board.position.y = reduceMotion ? 0 : Math.sin((now / 1000) * ((Math.PI * 2) / 6)) * 0.14;

        for (const k of keys) {
          const down = litKeys.has(k.id);
          k.depth += ((down ? 1 : 0) - k.depth) * ease(down ? 45 : 18);
          k.glow += ((down ? 1 : k === hovered ? 0.18 : 0) - k.glow) * ease(down ? 40 : 8);
          k.mesh.position.y = PLATE_Y - k.depth * PRESS_DEPTH;
          k.mesh.material.emissiveIntensity = k.glow * 0.85;
        }

        const liveness = isLive ? 1 : 0;
        glowMaterial.opacity += (0.42 + liveness * 0.5 - glowMaterial.opacity) * ease(4);
        under.intensity += (30 + liveness * 25 - under.intensity) * ease(4);
        ledMaterial.emissiveIntensity += (liveness * 2.5 - ledMaterial.emissiveIntensity) * ease(10);

        renderer.render(scene, camera);
      };
      const run = () => {
        if (raf) return;
        last = performance.now();
        raf = requestAnimationFrame(tick);
      };
      const stop = () => {
        cancelAnimationFrame(raf);
        raf = 0;
      };
      const visibility = new IntersectionObserver(([entry]) => (entry.isIntersecting ? run() : stop()));
      visibility.observe(host);
      renderer.render(scene, camera);

      cleanup = () => {
        stop();
        visibility.disconnect();
        resize.disconnect();
        canvas.removeEventListener('pointermove', onMove);
        canvas.removeEventListener('pointerleave', onLeave);
        canvas.removeEventListener('pointerdown', onDown);
        window.removeEventListener('pointermove', onWindowMove);
        dispose();
        renderer.dispose();
        canvas.remove();
      };
    };

    start();
    return () => {
      cancelled = true;
      cleanup();
    };
  }, []);

  return <div ref={hostRef} className={className} />;
}
