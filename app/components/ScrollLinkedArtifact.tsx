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
    let inView = true;
    let previous = 0;
    let elapsed = 0;
    let progress = 0;
    let target = 0;

    function measure() {
      if (!container) return;
      const { width, height } = container.getBoundingClientRect();
      camera.aspect = width / Math.max(1, height);
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
      updateScroll();
      draw(0);
    }
    function updateScroll() {
      const rect = container!.getBoundingClientRect();
      target = THREE.MathUtils.clamp(-rect.top / window.innerHeight, 0, 1);
    }
    function draw(time: number) {
      cancelAnimationFrame(frame);
      const delta = previous && time ? Math.min((time - previous) / 1000, 0.05) : 0;
      previous = time;
      if (!reduced) elapsed += delta;
      progress += (target - progress) * (1 - Math.exp(-delta * 5));
      // Limited angular travel preserves the silhouette around one fixed axis.
      initial.rotation.y = reduced
        ? -0.4
        : -0.4 + Math.sin(elapsed * 0.16) * 0.12 + progress * 0.65;
      axis.position.y = reduced ? 0 : progress * 0.15;
      renderer.render(scene, camera);
      if (!reduced && inView && !document.hidden) frame = requestAnimationFrame(draw);
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
    const visibility = new IntersectionObserver(([entry]) => {
      inView = entry.isIntersecting;
      if (inView) resume();
      else cancelAnimationFrame(frame);
    });
    visibility.observe(container);
    window.addEventListener('scroll', updateScroll, { passive: true });
    document.addEventListener('visibilitychange', resume);
    motionPreference.addEventListener('change', onPreference);
    measure();
    container.dataset.ready = 'true';

    return () => {
      cancelAnimationFrame(frame);
      resize.disconnect();
      visibility.disconnect();
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

  return <div ref={containerRef} className="scroll-artifact-canvas" />;
}
