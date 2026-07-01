import React, { useEffect, useRef } from 'react';
// Vertex shader from pen
const vertexShader = `
    uniform sampler2D u_map_tex;
    uniform float u_dot_size;
    uniform float u_time_since_click;
    uniform vec3 u_pointer;
    #define PI 3.14159265359
    varying float vOpacity;
    varying vec2 vUv;
    void main() {
        vUv = uv;
        float visibility = step(.2, texture2D(u_map_tex, uv).r);
        gl_PointSize = visibility * u_dot_size;
        vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
        vOpacity = (1. / length(mvPosition.xyz) - .7);
        vOpacity = clamp(vOpacity, .03, 1.);
        float t = u_time_since_click - .1;
        t = max(0., t);
        float max_amp = .15;
        float dist = 1. - .5 * length(position - u_pointer);
        float damping = 1. / (1. + 20. * t);
        float delta = max_amp * damping * sin(5. * t * (1. + 2. * dist) - PI);
        delta *= 1. - smoothstep(.8, 1., dist);
        vec3 pos = position;
        pos *= (1. + delta);
        gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.);
    }
`;

// Fragment shader from pen
const fragmentShader = `
    uniform sampler2D u_map_tex;
    varying float vOpacity;
    varying vec2 vUv;
    void main() {
        vec3 color = texture2D(u_map_tex, vUv).rgb;
        color -= .2 * length(gl_PointCoord.xy - vec2(.5));
        float dot = 1. - smoothstep(.38, .4, length(gl_PointCoord.xy - vec2(.5)));
        if (dot < 0.5) discard;
        gl_FragColor = vec4(color, dot * vOpacity);
    }
`;
// @ts-ignore
import gsap from 'gsap';
// @ts-ignore
import * as THREE from 'three';
// @ts-ignore
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

// Props: coordinates to show pointer (lat, lng)
export interface GlobeBannerProps {
  pointerCoords?: { lat: number; lng: number };
  containerHeight?: number; // height in px to use for desktop sizing
  containerWidth?: number; // width in px to use for desktop sizing
  /** Always-visible glowing marker at a fixed lat/lng, independent of the click-popup pointer */
  glowMarker?: { lat: number; lng: number; color?: string };
}

// Helper: convert lat/lng to cartesian coordinates on unit sphere
function latLngToCartesian(lat: number, lng: number) {
// Vertex shader from pen
const vertexShader = `
    uniform sampler2D u_map_tex;
    uniform float u_dot_size;
    uniform float u_time_since_click;
    uniform vec3 u_pointer;
    #define PI 3.14159265359
    varying float vOpacity;
    varying vec2 vUv;
    void main() {
        vUv = uv;
        float visibility = step(.2, texture2D(u_map_tex, uv).r);
        gl_PointSize = visibility * u_dot_size;
        vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
        vOpacity = (1. / length(mvPosition.xyz) - .7);
        vOpacity = clamp(vOpacity, .03, 1.);
        float t = u_time_since_click - .1;
        t = max(0., t);
        float max_amp = .15;
        float dist = 1. - .5 * length(position - u_pointer);
        float damping = 1. / (1. + 20. * t);
        float delta = max_amp * damping * sin(5. * t * (1. + 2. * dist) - PI);
        delta *= 1. - smoothstep(.8, 1., dist);
        vec3 pos = position;
        pos *= (1. + delta);
        gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.);
    }
`;

// Fragment shader from pen
const fragmentShader = `
    uniform sampler2D u_map_tex;
    varying float vOpacity;
    varying vec2 vUv;
    void main() {
        vec3 color = texture2D(u_map_tex, vUv).rgb;
        color -= .2 * length(gl_PointCoord.xy - vec2(.5));
        float dot = 1. - smoothstep(.38, .4, length(gl_PointCoord.xy - vec2(.5)));
        if (dot < 0.5) discard;
        gl_FragColor = vec4(color, dot * vOpacity);
    }
`;
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (180 - lng) * (Math.PI / 180);
  const x = Math.sin(phi) * Math.cos(theta);
  const y = Math.cos(phi);
  const z = Math.sin(phi) * Math.sin(theta);
  return { x, y, z };
}

export const GlobeBanner: React.FC<GlobeBannerProps> = ({ pointerCoords, containerHeight, containerWidth, glowMarker }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvas3DRef = useRef<HTMLCanvasElement>(null);
  const canvas2DRef = useRef<HTMLCanvasElement>(null);
  const popupRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let renderer: any, scene: any, camera: any, rayCaster: any, controls: any;
    let overlayCtx: any;
    let pointer: any, globe: any, globeMesh: any, mapMaterial: any;
    let glowDot: any, glowHalo: any, glowTweens: any[] = [];
    let earthTexture: any;
    let clock: any;
    let popupVisible = false;
    let pointerPos: any;
    let dragged = false;
    let popupOpenTl: any, popupCloseTl: any;
    let mouse: any = new THREE.Vector2(-1, -1);
    let coordinates2D = [0, 0];

    const containerEl = containerRef.current!;
    const canvas3D = canvas3DRef.current!;
    const canvas2D = canvas2DRef.current!;
    const popupEl = popupRef.current!;
    overlayCtx = canvas2D.getContext('2d');

    function initScene() {
      renderer = new THREE.WebGLRenderer({ canvas: canvas3D, alpha: true });
      renderer.setPixelRatio(2);
      scene = new THREE.Scene();
      camera = new THREE.OrthographicCamera(-1.1, 1.1, 1.1, -1.1, 0, 3);
      // Default camera position (azimuth 0) faces ~90°E (India). Rotate the
      // starting position to ~10°W (West Africa) so auto-rotation reaches
      // North America sooner.
      const startAzimuth = -100 * (Math.PI / 180);
      camera.position.set(Math.sin(startAzimuth) * 1.1, 0, Math.cos(startAzimuth) * 1.1);
      rayCaster = new THREE.Raycaster();
      rayCaster.far = 1.15;
      clock = new THREE.Clock();
      createOrbitControls();
      popupVisible = false;
      new THREE.TextureLoader().load(
        'https://ksenia-k.com/img/earth-map-colored.png',
        (mapTex: any) => {
          earthTexture = mapTex;
          earthTexture.repeat.set(1, 1);
          createGlobe();
          createPointer();
          createGlowMarker();
          createPopupTimelines();
          addCanvasEvents();
          updateSize();
          render();
        }
      );
    }

    function createOrbitControls() {
      controls = new OrbitControls(camera, canvas3D);
      controls.enablePan = false;
      controls.enableZoom = false;
      controls.enableDamping = true;
      controls.minPolarAngle = 0.4 * Math.PI;
      controls.maxPolarAngle = 0.4 * Math.PI;
      controls.autoRotate = true;
      controls.autoRotateSpeed = 0.6; // default is 2.0 — slowed down considerably
      let timestamp: number;
      controls.addEventListener('start', () => {
        timestamp = Date.now();
      });
      controls.addEventListener('end', () => {
        dragged = Date.now() - timestamp > 600;
      });
    }

    function createGlobe() {
      const globeGeometry = new THREE.IcosahedronGeometry(1, 22);
      mapMaterial = new THREE.ShaderMaterial({
        vertexShader,
        fragmentShader,
        uniforms: {
          u_map_tex: { type: 't', value: earthTexture },
          u_dot_size: { type: 'f', value: 0 },
          u_pointer: { type: 'v3', value: new THREE.Vector3(0, 0, 1) },
          u_time_since_click: { value: 0 },
        },
        alphaTest: false,
        transparent: true,
      });
      globe = new THREE.Points(globeGeometry, mapMaterial);
      scene.add(globe);
      globeMesh = new THREE.Mesh(globeGeometry, new THREE.MeshBasicMaterial({
        color: 0x222222,
        transparent: true,
        opacity: 0.05,
      }));
      scene.add(globeMesh);
    }

    function createPointer() {
      const geometry = new THREE.SphereGeometry(0.04, 16, 16);
      const material = new THREE.MeshBasicMaterial({
        color: 0x000000,
        transparent: true,
        opacity: 0,
      });
      pointer = new THREE.Mesh(geometry, material);
      scene.add(pointer);
      // Set pointer position from props
      if (pointerCoords) {
        const { x, y, z } = latLngToCartesian(pointerCoords.lat, pointerCoords.lng);
        pointer.position.set(x, y, z);
        mapMaterial.uniforms.u_pointer.value = new THREE.Vector3(x, y, z);
      }
    }

    // A separate, always-on glowing marker — independent of the click-popup
    // pointer above so it isn't affected by popupOpenTl/popupCloseTl tweens.
    function createGlowMarker() {
      if (!glowMarker) return;
      const { x, y, z } = latLngToCartesian(glowMarker.lat, glowMarker.lng);
      const color = glowMarker.color ?? '#ff00aa';

      const dotGeometry = new THREE.SphereGeometry(0.022, 16, 16);
      const dotMaterial = new THREE.MeshBasicMaterial({ color });
      glowDot = new THREE.Mesh(dotGeometry, dotMaterial);
      glowDot.position.set(x, y, z);
      scene.add(glowDot);

      const haloGeometry = new THREE.SphereGeometry(0.05, 16, 16);
      const haloMaterial = new THREE.MeshBasicMaterial({
        color,
        transparent: true,
        opacity: 0.45,
      });
      glowHalo = new THREE.Mesh(haloGeometry, haloMaterial);
      glowHalo.position.set(x, y, z);
      scene.add(glowHalo);

      glowTweens.push(
        gsap.to(glowHalo.scale, {
          x: 1.6,
          y: 1.6,
          z: 1.6,
          duration: 1.1,
          yoyo: true,
          repeat: -1,
          ease: 'sine.inOut',
        })
      );
    }

    function createPopupTimelines() {
      popupOpenTl = gsap.timeline({ paused: true })
        .to(pointer.material, { duration: 0.2, opacity: 1 }, 0)
        .fromTo(canvas2D, { opacity: 0 }, { duration: 0.3, opacity: 1 }, 0.15)
        .fromTo(popupEl, { opacity: 0, scale: 0.9, transformOrigin: 'center bottom' }, { duration: 0.1, opacity: 1, scale: 1 }, 0.25);
      popupCloseTl = gsap.timeline({ paused: true })
        .to(pointer.material, { duration: 0.3, opacity: 0.2 }, 0)
        .to(canvas2D, { duration: 0.3, opacity: 0 }, 0)
        .to(popupEl, { duration: 0.3, opacity: 0, scale: 0.9, transformOrigin: 'center bottom' }, 0);
    }

    function addCanvasEvents() {
      containerEl.addEventListener('mousemove', (e) => {
        updateMousePosition(e.clientX, e.clientY);
      });
      containerEl.addEventListener('click', (e) => {
        if (!dragged) {
          updateMousePosition(e.clientX, e.clientY);
          const res = checkIntersects();
          if (res.length) {
            // pointerPos = res[0].face.normal.clone();
            // pointer.position.set(res[0].face.normal.x, res[0].face.normal.y, res[0].face.normal.z);
            // mapMaterial.uniforms.u_pointer.value = res[0].face.normal;
            popupEl.innerHTML = cartesianToLatLong();
            showPopupAnimation(true);
            clock.start();
          }
        }
      });
      function updateMousePosition(eX: number, eY: number) {
        mouse.x = (eX - containerEl.offsetLeft) / containerEl.offsetWidth * 2 - 1;
        mouse.y = -((eY - containerEl.offsetTop) / containerEl.offsetHeight) * 2 + 1;
      }
    }

    function checkIntersects() {
      rayCaster.setFromCamera(mouse, camera);
      const intersects = rayCaster.intersectObject(globeMesh);
      if (intersects.length) {
        document.body.style.cursor = 'pointer';
      } else {
        document.body.style.cursor = 'auto';
      }
      return intersects;
    }

    function render() {
      mapMaterial.uniforms.u_time_since_click.value = clock.getElapsedTime();
      checkIntersects();
      if (pointer) {
        updateOverlayGraphic();
      }
      controls.update();
      renderer.render(scene, camera);
      requestAnimationFrame(render);
    }

    function updateOverlayGraphic() {
      let activePointPosition = pointer.position.clone();
      activePointPosition.applyMatrix4(globe.matrixWorld);
      const activePointPositionProjected = activePointPosition.clone();
      activePointPositionProjected.project(camera);
      coordinates2D[0] = (activePointPositionProjected.x + 1) * containerEl.offsetWidth * 0.5;
      coordinates2D[1] = (1 - activePointPositionProjected.y) * containerEl.offsetHeight * 0.5;
      const matrixWorldInverse = controls.object.matrixWorldInverse;
      activePointPosition.applyMatrix4(matrixWorldInverse);
      if (activePointPosition.z > -1) {
        if (popupVisible === false) {
          popupVisible = true;
          showPopupAnimation(false);
        }
        let popupX = coordinates2D[0];
        popupX -= activePointPositionProjected.x * containerEl.offsetWidth * 0.3;
        let popupY = coordinates2D[1];
        const upDown = activePointPositionProjected.y > 0.6;
        popupY += upDown ? 20 : -20;
        gsap.set(popupEl, {
          x: popupX,
          y: popupY,
          xPercent: -35,
          yPercent: upDown ? 0 : -100,
        });
        popupY += upDown ? -5 : 5;
        const curveMidX = popupX + activePointPositionProjected.x * 100;
        const curveMidY = popupY + (upDown ? -0.5 : 0.1) * coordinates2D[1];
        drawPopupConnector(coordinates2D[0], coordinates2D[1], curveMidX, curveMidY, popupX, popupY);
      } else {
        if (popupVisible) {
          popupOpenTl.pause(0);
          popupCloseTl.play(0);
        }
        popupVisible = false;
      }
    }

    function showPopupAnimation(lifted: boolean) {
      if (lifted) {
        let positionLifted = pointer.position.clone();
        positionLifted.multiplyScalar(1.3);
        gsap.from(pointer.position, {
          duration: 0.25,
          x: positionLifted.x,
          y: positionLifted.y,
          z: positionLifted.z,
          ease: 'power3.out',
        });
      }
      popupCloseTl.pause(0);
      popupOpenTl.play(0);
    }

    function drawPopupConnector(startX: number, startY: number, midX: number, midY: number, endX: number, endY: number) {
      overlayCtx.strokeStyle = '#000000';
      overlayCtx.lineWidth = 3;
      overlayCtx.lineCap = 'round';
      overlayCtx.clearRect(0, 0, containerEl.offsetWidth, containerEl.offsetHeight);
      overlayCtx.beginPath();
      overlayCtx.moveTo(startX, startY);
      overlayCtx.quadraticCurveTo(midX, midY, endX, endY);
      overlayCtx.stroke();
    }

    function cartesianToLatLong() {
      const pos = pointer.position;
      const lat = 90 - Math.acos(pos.y) * 180 / Math.PI;
      const lng = (270 + Math.atan2(pos.x, pos.z) * 180 / Math.PI) % 360 - 180;
      return formatCoordinate(lat, 'N', 'S') + ',&nbsp;' + formatCoordinate(lng, 'E', 'W');
    }
    function formatCoordinate(coordinate: number, positiveDirection: string, negativeDirection: string) {
      const direction = coordinate >= 0 ? positiveDirection : negativeDirection;
      return `${Math.abs(coordinate).toFixed(4)}°&nbsp${direction}`;
    }

    function updateSize() {
      // Responsive: on screens larger than md, use containerHeight/containerWidth if provided
      const isDesktop = window.matchMedia('(min-width: 768px)').matches;
      let size: number;
      if (isDesktop && containerHeight && containerWidth) {
        size = Math.min(containerHeight, containerWidth);
      } else if (isDesktop && containerHeight) {
        size = containerHeight;
      } else {
        size = 0.65 * Math.min(window.innerWidth, window.innerHeight);
      }
      containerEl.style.width = size + 'px';
      containerEl.style.height = size + 'px';
      renderer.setSize(size, size);
      canvas2D.width = canvas2D.height = size;
      mapMaterial.uniforms.u_dot_size.value = 0.04 * size;
    }

    initScene();
    window.addEventListener('resize', updateSize);
    return () => {
      window.removeEventListener('resize', updateSize);
      glowTweens.forEach((tween) => tween.kill());
    };
  }, [pointerCoords]);

  return (
    <div
      className="globe-wrapper"
      ref={containerRef}
      style={{
        position: 'relative',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minWidth: '300px',
        minHeight: '300px',
      }}
    >
      <canvas id="globe-3d" ref={canvas3DRef} style={{ display: 'block', position: 'absolute', top: 0, left: 0 }} />
      {/* 2D overlay canvas (connector line to popup) — disabled alongside the popup */}
      <canvas id="globe-2d-overlay" ref={canvas2DRef} style={{ display: 'none', position: 'absolute', top: 0, left: 0, pointerEvents: 'none' }} />
      {/* Coordinate popup disabled — appears off-screen at certain aspect ratios */}
      <div id="globe-popup-overlay" style={{ display: 'none', position: 'absolute', top: 0, left: 0, pointerEvents: 'none' }}>
        <div className="globe-popup" ref={popupRef} style={{
          top: 0,
          left: 0,
          backgroundColor: 'white',
          opacity: 0,
          color: '#111',
          fontFamily: 'sans-serif',
          padding: '5px 10px',
          fontSize: '15px',
          borderRadius: '3px',
          filter: 'drop-shadow(0px 0px 3px #555555)',
          position: 'absolute',
        }} />
      </div>
    </div>
  );
};
