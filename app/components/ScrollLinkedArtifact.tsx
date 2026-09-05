'use client';

import { useEffect, useRef } from 'react';
import * as THREE from 'three';

const ACID = new THREE.Color('#b8ff61');
const MINT = new THREE.Color('#79d9a5');
const PAPER = new THREE.Color('#e8eee3');

function seededRandom(seed: number) {
  const value = Math.sin(seed * 9283.31) * 43758.5453;
  return value - Math.floor(value);
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
    const camera = new THREE.PerspectiveCamera(34, initialWidth / initialHeight, 0.1, 40);
    camera.position.set(0, 0, compact ? 9.3 : 7.8);

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance',
    });
    renderer.setClearAlpha(0);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, compact ? 1.1 : 1.45));
    renderer.setSize(initialWidth, initialHeight);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.18;
    container.appendChild(renderer.domElement);

    const resources: Array<THREE.BufferGeometry | THREE.Material> = [];
    const keep = <T extends THREE.BufferGeometry | THREE.Material>(resource: T) => {
      resources.push(resource);
      return resource;
    };

    // The sculpture travels through the page, while its tilted axis remains
    // fixed. Only the assembly inside that axis turns.
    const root = new THREE.Group();
    const axisFrame = new THREE.Group();
    axisFrame.rotation.set(0.34, 0.08, -0.54);
    const rotor = new THREE.Group();
    root.add(axisFrame);
    axisFrame.add(rotor);
    scene.add(root);

    const metalMaterial = keep(
      new THREE.MeshPhysicalMaterial({
        color: new THREE.Color('#111a13'),
        metalness: 0.86,
        roughness: 0.28,
        clearcoat: 0.62,
        clearcoatRoughness: 0.22,
        emissive: new THREE.Color('#162619'),
        emissiveIntensity: 0.28,
      })
    );
    const glassMaterial = keep(
      new THREE.MeshPhysicalMaterial({
        color: new THREE.Color('#55705a'),
        metalness: 0.12,
        roughness: 0.16,
        clearcoat: 1,
        transparent: true,
        opacity: 0.24,
        depthWrite: false,
        side: THREE.DoubleSide,
      })
    );
    const glowMaterial = keep(
      new THREE.MeshStandardMaterial({
        color: ACID,
        emissive: ACID,
        emissiveIntensity: 1.35,
        metalness: 0.3,
        roughness: 0.22,
      })
    );
    const edgeMaterial = keep(
      new THREE.LineBasicMaterial({
        color: MINT,
        transparent: true,
        opacity: 0.48,
      })
    );
    const paleMaterial = keep(
      new THREE.MeshStandardMaterial({
        color: PAPER,
        emissive: MINT,
        emissiveIntensity: 0.18,
        metalness: 0.78,
        roughness: 0.34,
      })
    );

    const outerGeometry = keep(new THREE.OctahedronGeometry(compact ? 0.86 : 1.02, 1));
    const outer = new THREE.Mesh(outerGeometry, glassMaterial);
    outer.scale.set(0.82, 1.15, 0.82);
    rotor.add(outer);

    const edgeGeometry = keep(new THREE.EdgesGeometry(outerGeometry, 12));
    const edges = new THREE.LineSegments(edgeGeometry, edgeMaterial);
    edges.scale.copy(outer.scale);
    rotor.add(edges);

    const coreGeometry = keep(new THREE.OctahedronGeometry(compact ? 0.43 : 0.52, 0));
    const core = new THREE.Mesh(coreGeometry, glowMaterial);
    core.scale.set(0.72, 1.28, 0.72);
    rotor.add(core);

    const collarGeometry = keep(
      new THREE.CylinderGeometry(compact ? 0.5 : 0.62, compact ? 0.5 : 0.62, 0.14, 6)
    );
    const topCollar = new THREE.Mesh(collarGeometry, metalMaterial);
    topCollar.position.y = compact ? 0.72 : 0.86;
    rotor.add(topCollar);
    const bottomCollar = topCollar.clone();
    bottomCollar.position.y *= -1;
    rotor.add(bottomCollar);

    const panelGeometry = keep(
      new THREE.BoxGeometry(compact ? 0.84 : 1.05, compact ? 0.35 : 0.42, 0.075)
    );
    const leftPanel = new THREE.Mesh(panelGeometry, metalMaterial);
    leftPanel.position.set(compact ? -0.95 : -1.16, 0.12, 0);
    leftPanel.rotation.z = 0.1;
    rotor.add(leftPanel);
    const rightPanel = leftPanel.clone();
    rightPanel.position.set(compact ? 0.95 : 1.16, -0.12, 0);
    rightPanel.rotation.z = -0.1;
    rotor.add(rightPanel);

    const panelEdgeGeometry = keep(new THREE.BoxGeometry(compact ? 0.72 : 0.9, 0.022, 0.088));
    const leftSignal = new THREE.Mesh(panelEdgeGeometry, glowMaterial);
    leftSignal.position.set(compact ? -0.95 : -1.16, 0.12, 0.06);
    leftSignal.rotation.z = 0.1;
    rotor.add(leftSignal);
    const rightSignal = leftSignal.clone();
    rightSignal.position.set(compact ? 0.95 : 1.16, -0.12, 0.06);
    rightSignal.rotation.z = -0.1;
    rotor.add(rightSignal);

    // This guide is deliberately outside the rotor so the visual axis does
    // not turn with the sculpture.
    const axisGeometry = keep(new THREE.CylinderGeometry(0.012, 0.012, compact ? 3.2 : 3.8, 8));
    const axisGuide = new THREE.Mesh(axisGeometry, paleMaterial);
    axisFrame.add(axisGuide);

    const capGeometry = keep(new THREE.SphereGeometry(0.055, 10, 10));
    const topCap = new THREE.Mesh(capGeometry, glowMaterial);
    topCap.position.y = compact ? 1.6 : 1.9;
    axisFrame.add(topCap);
    const bottomCap = topCap.clone();
    bottomCap.position.y *= -1;
    axisFrame.add(bottomCap);

    const moteGeometry = keep(new THREE.BoxGeometry(0.035, 0.12, 0.035));
    const moteCount = compact ? 12 : 20;
    const motes = new THREE.InstancedMesh(moteGeometry, paleMaterial, moteCount);
    const matrix = new THREE.Matrix4();
    const quaternion = new THREE.Quaternion();
    const scale = new THREE.Vector3();
    const position = new THREE.Vector3();

    for (let index = 0; index < moteCount; index += 1) {
      const turn = seededRandom(index + 1) * Math.PI * 2;
      const radius = 1.55 + seededRandom(index + 15) * 0.85;
      position.set(
        Math.cos(turn) * radius,
        (seededRandom(index + 31) - 0.5) * 2.2,
        Math.sin(turn) * radius * 0.56
      );
      quaternion.setFromEuler(
        new THREE.Euler(seededRandom(index + 42) * 0.7, turn, seededRandom(index + 63) * Math.PI)
      );
      scale.setScalar(0.65 + seededRandom(index + 78) * 1.25);
      matrix.compose(position, quaternion, scale);
      motes.setMatrixAt(index, matrix);
    }
    motes.instanceMatrix.needsUpdate = true;
    rotor.add(motes);

    scene.add(
      new THREE.HemisphereLight(new THREE.Color('#d8ffe1'), new THREE.Color('#020403'), 1.5)
    );
    const keyLight = new THREE.PointLight(ACID, 20, 12, 1.45);
    keyLight.position.set(2.6, 2.4, 3.6);
    scene.add(keyLight);
    const rimLight = new THREE.PointLight(MINT, 12, 11, 1.7);
    rimLight.position.set(-3.1, -1.8, 1.4);
    scene.add(rimLight);

    const desktopPath = new THREE.CatmullRomCurve3([
      new THREE.Vector3(3.0, -0.82, -1.7),
      new THREE.Vector3(2.35, 0.72, -1.1),
      new THREE.Vector3(-2.55, 0.28, -0.65),
      new THREE.Vector3(2.45, -0.18, -1.15),
      new THREE.Vector3(-0.7, -0.05, 0.05),
    ]);
    const mobilePath = new THREE.CatmullRomCurve3([
      new THREE.Vector3(1.45, -2.2, -2.7),
      new THREE.Vector3(1.15, 1.65, -2.4),
      new THREE.Vector3(-1.25, -1.4, -2.25),
      new THREE.Vector3(1.2, 1.15, -2.65),
      new THREE.Vector3(-0.3, -0.72, -2.2),
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
    let visible = !document.hidden;
    let framePending = false;

    function requestRender() {
      if (framePending || reducedMotion || !visible) return;
      framePending = true;
      animationFrame = requestAnimationFrame(render);
    }

    function updateScrollProgress() {
      const scrollable = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
      const nextScrollY = window.scrollY;
      targetProgress = THREE.MathUtils.clamp(nextScrollY / scrollable, 0, 1);
      scrollEnergy = Math.min(1, scrollEnergy + Math.abs(nextScrollY - previousScrollY) / 180);
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

    function handlePointerLeave() {
      pointerTarget.set(0, 0);
    }

    function handleResize() {
      const width = containerRef.current?.clientWidth || window.innerWidth;
      const height = containerRef.current?.clientHeight || window.innerHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, compact ? 1.1 : 1.45));
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
      scrollEnergy = THREE.MathUtils.lerp(scrollEnergy, 0, Math.min(1, delta * 2.8));
      path.getPointAt(currentProgress, pathPosition);

      root.position.copy(pathPosition);
      const baseScale = compact ? 0.7 : 0.8 + Math.sin(currentProgress * Math.PI) * 0.14;
      root.scale.setScalar(baseScale);

      // One calm rotation around one fixed, visible axis.
      rotor.rotation.y = 0.28 + currentProgress * Math.PI * 1.45 + clock.elapsedTime * 0.045;
      core.scale.y = 1.28 + (reducedMotion ? 0 : Math.sin(clock.elapsedTime * 0.72) * 0.045);
      glowMaterial.emissiveIntensity = 1.35 + scrollEnergy * 0.9;

      // The pointer changes the light, not the sculpture's position or axis.
      keyLight.position.x = 2.6 + pointerCurrent.x * 2.2;
      keyLight.position.y = 2.4 - pointerCurrent.y * 1.6;

      renderer.render(scene, camera);
      requestRender();
    }

    updateScrollProgress();
    window.addEventListener('scroll', updateScrollProgress, { passive: true });
    window.addEventListener('pointermove', handlePointerMove, { passive: true });
    document.documentElement.addEventListener('pointerleave', handlePointerLeave);
    window.addEventListener('resize', handleResize);
    document.addEventListener('visibilitychange', handleVisibility);
    render();

    return () => {
      cancelAnimationFrame(animationFrame);
      window.removeEventListener('scroll', updateScrollProgress);
      window.removeEventListener('pointermove', handlePointerMove);
      document.documentElement.removeEventListener('pointerleave', handlePointerLeave);
      window.removeEventListener('resize', handleResize);
      document.removeEventListener('visibilitychange', handleVisibility);
      resources.forEach(resource => resource.dispose());
      renderer.dispose();
      renderer.domElement.remove();
    };
  }, []);

  return <div ref={containerRef} className="scroll-artifact-canvas" />;
}
