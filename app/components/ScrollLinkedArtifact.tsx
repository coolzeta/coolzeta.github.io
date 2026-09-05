'use client';

import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';

/** A bevelled initial, lit as a physical object in a photographic studio. */
export default function ScrollLinkedArtifact() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({
        alpha: true,
        antialias: true,
        powerPreference: 'low-power',
      });
    } catch {
      return; // The typographic initial remains visible when WebGL is unavailable.
    }

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(32, 1, 0.1, 30);
    camera.position.set(0, 0, 7.8);
    renderer.setClearAlpha(0);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.75));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.25;
    container.appendChild(renderer.domElement);

    const room = new RoomEnvironment();
    const pmrem = new THREE.PMREMGenerator(renderer);
    const environment = pmrem.fromScene(room, 0.025);
    scene.environment = environment.texture;
    room.dispose();
    pmrem.dispose();

    const outline = new THREE.Shape();
    outline.moveTo(-1.05, 1.28);
    outline.lineTo(1.05, 1.28);
    outline.lineTo(1.05, 0.87);
    outline.lineTo(-0.37, -0.8);
    outline.lineTo(1.05, -0.8);
    outline.lineTo(1.05, -1.28);
    outline.lineTo(-1.05, -1.28);
    outline.lineTo(-1.05, -0.87);
    outline.lineTo(0.37, 0.8);
    outline.lineTo(-1.05, 0.8);
    outline.closePath();
    const geometry = new THREE.ExtrudeGeometry(outline, {
      depth: 0.52,
      bevelEnabled: true,
      bevelSegments: 8,
      steps: 1,
      bevelSize: 0.09,
      bevelThickness: 0.09,
      curveSegments: 16,
    });
    geometry.center();
    const material = new THREE.MeshPhysicalMaterial({
      color: '#c7c9c2',
      metalness: 1,
      roughness: 0.23,
      clearcoat: 0.7,
      clearcoatRoughness: 0.18,
      envMapIntensity: 1.35,
    });
    const initial = new THREE.Mesh(geometry, material);
    const axis = new THREE.Group();
    axis.rotation.set(0.15, 0, -0.19);
    axis.add(initial);
    scene.add(axis);
    const light = new THREE.DirectionalLight('#edffd1', 3);
    light.position.set(-3, 4, 5);
    scene.add(light);

    const motionPreference = window.matchMedia('(prefers-reduced-motion: reduce)');
    let reduced = motionPreference.matches;
    let frame = 0;
    let previous = 0;
    let elapsed = 0;
    let progress = 0;
    let target = 0;
    let stops: { scroll: number; x: number; y: number; size: number; opacity: number }[] = [];

    function measure() {
      if (!container) return;
      const width = window.innerWidth;
      const height = window.innerHeight;
      camera.aspect = width / Math.max(1, height);
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
      const stage = document.querySelector('.artifact-stage')?.getBoundingClientRect();
      const now = document.querySelector('.now-section')?.getBoundingClientRect();
      const notes = document.querySelector('.notes-section')?.getBoundingClientRect();
      const footer = document.querySelector('.personal-footer')?.getBoundingClientRect();
      const mobile = width < 600;
      const firstSize = (stage?.height || 470) * 0.74;
      stops = [
        {
          scroll: 0,
          x: stage ? stage.left + stage.width / 2 : width * 0.75,
          y: stage ? stage.top + window.scrollY + stage.height / 2 : height * 0.5,
          size: firstSize,
          opacity: 1,
        },
        {
          scroll: Math.max(1, (now?.top || height) + window.scrollY - 120),
          x: width * (mobile ? 0.88 : 0.22),
          y: height * 0.68,
          size: mobile ? 150 : 240,
          opacity: mobile ? 0.18 : 0.65,
        },
        {
          scroll: (notes?.top || height * 2) + window.scrollY - height * 0.25,
          x: width * 0.94,
          y: height * 0.55,
          size: mobile ? 130 : 210,
          opacity: 0.16,
        },
        {
          scroll: (footer?.top || height * 3) + window.scrollY - height * 0.3,
          x: width * 0.8,
          y: height * 0.67,
          size: mobile ? 150 : 260,
          opacity: 0.25,
        },
      ];
      updateScroll();
      draw(0);
    }
    function updateScroll() {
      target = window.scrollY;
      if (reduced) draw(0);
    }
    function draw(time: number) {
      cancelAnimationFrame(frame);
      const delta = previous && time ? Math.min((time - previous) / 1000, 0.05) : 0;
      previous = time;
      if (!reduced) elapsed += delta;
      progress += (target - progress) * (reduced ? 1 : 1 - Math.exp(-delta * 8));
      if (!stops.length) return;
      const index = Math.max(
        0,
        stops.findIndex((stop, i) => i < stops.length - 1 && progress < stops[i + 1].scroll)
      );
      const last = progress >= stops[stops.length - 1].scroll;
      const from = last ? stops[stops.length - 1] : stops[index];
      const to = last ? from : stops[index + 1];
      const fraction = THREE.MathUtils.clamp(
        (progress - from.scroll) / Math.max(1, to.scroll - from.scroll),
        0,
        1
      );
      const ease = fraction * fraction * (3 - 2 * fraction);
      const mix = (a: number, b: number) => THREE.MathUtils.lerp(a, b, ease);
      const worldHeight =
        2 * Math.tan(THREE.MathUtils.degToRad(camera.fov / 2)) * camera.position.z;
      const x = reduced ? stops[0].x : mix(from.x, to.x);
      const y = reduced ? stops[0].y - progress : mix(from.y, to.y);
      const size = reduced ? stops[0].size : mix(from.size, to.size);
      axis.position.set(
        (x / window.innerWidth - 0.5) * worldHeight * camera.aspect,
        (0.5 - y / window.innerHeight) * worldHeight,
        0
      );
      axis.scale.setScalar(((size / window.innerHeight) * worldHeight) / 2.8);
      container!.style.opacity = String(reduced ? 1 : mix(from.opacity, to.opacity));
      // A fixed tilted axis, with readable continuous rotation and scroll-driven travel.
      initial.rotation.y = reduced
        ? -0.4
        : -0.4 + elapsed * 0.12 + (progress / window.innerHeight) * 1.7;
      renderer.render(scene, camera);
      if (!reduced && !document.hidden) frame = requestAnimationFrame(draw);
    }
    function resume() {
      previous = 0;
      draw(0);
    }
    function onPreference() {
      reduced = motionPreference.matches;
      resume();
    }
    const resize = new ResizeObserver(measure);
    resize.observe(container);
    window.addEventListener('scroll', updateScroll, { passive: true });
    document.addEventListener('visibilitychange', resume);
    motionPreference.addEventListener('change', onPreference);
    measure();
    container.dataset.ready = 'true';

    return () => {
      cancelAnimationFrame(frame);
      resize.disconnect();
      window.removeEventListener('scroll', updateScroll);
      document.removeEventListener('visibilitychange', resume);
      motionPreference.removeEventListener('change', onPreference);
      geometry.dispose();
      material.dispose();
      environment.dispose();
      renderer.dispose();
      renderer.domElement.remove();
      delete container.dataset.ready;
    };
  }, []);

  return <div ref={containerRef} className="scroll-artifact-canvas" aria-hidden="true" />;
}
