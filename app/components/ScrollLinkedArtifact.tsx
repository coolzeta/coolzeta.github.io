'use client';

import { useEffect, useRef } from 'react';
import * as THREE from 'three';

const ACID = new THREE.Color('#b8ff61');

function mobiusPoint(angle: number, across: number, radius: number) {
  const halfTwist = angle * 0.5;
  const reach = radius + across * Math.cos(halfTwist);
  return new THREE.Vector3(
    reach * Math.cos(angle),
    reach * Math.sin(angle),
    across * Math.sin(halfTwist)
  );
}

function createMobiusGeometry(segments: number, widthSegments: number) {
  const positions: number[] = [];
  const uvs: number[] = [];
  const indices: number[] = [];
  const radius = 1.12;
  const width = 0.72;

  for (let segment = 0; segment <= segments; segment += 1) {
    const u = segment / segments;
    const angle = u * Math.PI * 2;

    for (let strip = 0; strip <= widthSegments; strip += 1) {
      const v = strip / widthSegments;
      const point = mobiusPoint(angle, (v - 0.5) * width, radius);
      positions.push(point.x, point.y, point.z);
      uvs.push(u, v);
    }
  }

  const row = widthSegments + 1;
  for (let segment = 0; segment < segments; segment += 1) {
    for (let strip = 0; strip < widthSegments; strip += 1) {
      const a = segment * row + strip;
      const b = a + row;
      indices.push(a, b, a + 1, b, b + 1, a + 1);
    }
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
  geometry.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2));
  geometry.setIndex(indices);
  geometry.computeVertexNormals();
  geometry.center();
  return geometry;
}

function createEdgeGeometry(segments: number) {
  const points: THREE.Vector3[] = [];
  const radius = 1.12;
  const edge = 0.36;

  // A Möbius strip has one continuous edge, completed over two turns.
  for (let index = 0; index <= segments; index += 1) {
    const angle = (index / segments) * Math.PI * 4;
    points.push(mobiusPoint(angle, edge, radius));
  }

  return new THREE.BufferGeometry().setFromPoints(points);
}

export default function ScrollLinkedArtifact() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const compact = window.innerWidth < 720;
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const initialWidth = container.clientWidth || window.innerWidth;
    const initialHeight = container.clientHeight || window.innerHeight;
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(32, initialWidth / initialHeight, 0.1, 30);
    camera.position.set(0, 0, compact ? 8.4 : 6.8);

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance',
    });
    renderer.setClearAlpha(0);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, compact ? 1.1 : 1.5));
    renderer.setSize(initialWidth, initialHeight);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.12;
    container.appendChild(renderer.domElement);

    const root = new THREE.Group();
    const fixedAxis = new THREE.Group();
    const sculpture = new THREE.Group();
    fixedAxis.rotation.set(0.72, -0.18, -0.46);
    fixedAxis.add(sculpture);
    root.add(fixedAxis);
    scene.add(root);

    const ribbonGeometry = createMobiusGeometry(compact ? 120 : 190, compact ? 8 : 12);
    const ribbonMaterial = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color('#7d8d81'),
      emissive: new THREE.Color('#122119'),
      emissiveIntensity: 0.16,
      metalness: 0.92,
      roughness: 0.2,
      clearcoat: 1,
      clearcoatRoughness: 0.14,
      iridescence: 0.62,
      iridescenceIOR: 1.35,
      iridescenceThicknessRange: [120, 360],
      side: THREE.DoubleSide,
    });
    const ribbon = new THREE.Mesh(ribbonGeometry, ribbonMaterial);
    sculpture.add(ribbon);

    const edgeGeometry = createEdgeGeometry(compact ? 240 : 380);
    const edgeMaterial = new THREE.LineBasicMaterial({
      color: ACID,
      transparent: true,
      opacity: 0.62,
      blending: THREE.AdditiveBlending,
    });
    const edge = new THREE.Line(edgeGeometry, edgeMaterial);
    sculpture.add(edge);

    scene.add(
      new THREE.HemisphereLight(new THREE.Color('#f2f7ee'), new THREE.Color('#020403'), 1.65)
    );
    const keyLight = new THREE.PointLight(new THREE.Color('#efffe5'), 19, 11, 1.45);
    keyLight.position.set(2.8, 2.4, 3.5);
    scene.add(keyLight);
    const greenLight = new THREE.PointLight(ACID, 13, 9, 1.7);
    greenLight.position.set(-2.6, -1.6, 1.2);
    scene.add(greenLight);

    const desktopPath = new THREE.CatmullRomCurve3([
      new THREE.Vector3(3.0, -0.72, -1.25),
      new THREE.Vector3(2.25, 0.62, -0.8),
      new THREE.Vector3(-2.35, 0.15, -0.45),
      new THREE.Vector3(2.3, -0.12, -0.9),
      new THREE.Vector3(-0.55, -0.05, 0.08),
    ]);
    const mobilePath = new THREE.CatmullRomCurve3([
      new THREE.Vector3(1.45, -2.05, -2.5),
      new THREE.Vector3(1.1, 1.55, -2.25),
      new THREE.Vector3(-1.15, -1.25, -2.05),
      new THREE.Vector3(1.05, 1.05, -2.4),
      new THREE.Vector3(-0.25, -0.65, -2.05),
    ]);
    const path = compact ? mobilePath : desktopPath;
    const pathPosition = new THREE.Vector3();
    const pointerTarget = new THREE.Vector2();
    const pointerCurrent = new THREE.Vector2();
    const clock = new THREE.Clock();
    let targetProgress = 0;
    let currentProgress = 0;
    let scrollEnergy = 0;
    let previousScrollY = window.scrollY;
    let animationFrame = 0;
    let framePending = false;
    let visible = !document.hidden;

    function requestRender() {
      if (framePending || reducedMotion || !visible) return;
      framePending = true;
      animationFrame = requestAnimationFrame(render);
    }

    function updateScrollProgress() {
      const scrollable = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
      const nextScrollY = window.scrollY;
      targetProgress = THREE.MathUtils.clamp(nextScrollY / scrollable, 0, 1);
      scrollEnergy = Math.min(1, scrollEnergy + Math.abs(nextScrollY - previousScrollY) / 220);
      previousScrollY = nextScrollY;
      if (reducedMotion) render();
    }

    function handlePointerMove(event: PointerEvent) {
      if (event.pointerType === 'touch') return;
      pointerTarget.set(
        event.clientX / window.innerWidth - 0.5,
        event.clientY / window.innerHeight - 0.5
      );
    }

    function handleResize() {
      const width = containerRef.current?.clientWidth || window.innerWidth;
      const height = containerRef.current?.clientHeight || window.innerHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, compact ? 1.1 : 1.5));
      renderer.setSize(width, height);
      updateScrollProgress();
    }

    function handleVisibility() {
      visible = !document.hidden;
      if (visible) {
        clock.getDelta();
        requestRender();
      }
    }

    function render() {
      framePending = false;
      if (!visible) return;

      const delta = Math.min(clock.getDelta(), 0.05);
      const smoothing = reducedMotion ? 1 : 1 - Math.pow(0.0008, delta);
      currentProgress += (targetProgress - currentProgress) * smoothing;
      pointerCurrent.lerp(pointerTarget, reducedMotion ? 1 : 0.035);
      scrollEnergy = THREE.MathUtils.lerp(scrollEnergy, 0, Math.min(1, delta * 2.6));
      path.getPointAt(currentProgress, pathPosition);

      root.position.copy(pathPosition);
      root.scale.setScalar(compact ? 0.84 : 0.98 + Math.sin(currentProgress * Math.PI) * 0.12);

      // A single, unchanging diagonal axis keeps the motion calm.
      sculpture.rotation.y = 0.35 + currentProgress * Math.PI * 1.05 + clock.elapsedTime * 0.025;
      ribbonMaterial.emissiveIntensity = 0.16 + scrollEnergy * 0.3;
      edgeMaterial.opacity = 0.56 + scrollEnergy * 0.25;
      // Pointer movement only sweeps the highlight across the surface.
      keyLight.position.x = 2.8 + pointerCurrent.x * 2.4;
      keyLight.position.y = 2.4 - pointerCurrent.y * 1.8;

      renderer.render(scene, camera);
      requestRender();
    }

    updateScrollProgress();
    window.addEventListener('scroll', updateScrollProgress, { passive: true });
    window.addEventListener('pointermove', handlePointerMove, { passive: true });
    window.addEventListener('resize', handleResize);
    document.addEventListener('visibilitychange', handleVisibility);
    render();

    return () => {
      cancelAnimationFrame(animationFrame);
      window.removeEventListener('scroll', updateScrollProgress);
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('resize', handleResize);
      document.removeEventListener('visibilitychange', handleVisibility);
      ribbonGeometry.dispose();
      ribbonMaterial.dispose();
      edgeGeometry.dispose();
      edgeMaterial.dispose();
      renderer.dispose();
      renderer.domElement.remove();
    };
  }, []);

  return <div ref={containerRef} className="scroll-artifact-canvas" />;
}
