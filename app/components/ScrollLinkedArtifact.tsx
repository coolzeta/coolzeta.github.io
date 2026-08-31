'use client';

import { useEffect, useRef } from 'react';
import * as THREE from 'three';

const ACID = new THREE.Color('#b8ff61');
const MINT = new THREE.Color('#7fdc9a');
const PAPER = new THREE.Color('#eef4e8');

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
    const camera = new THREE.PerspectiveCamera(36, initialWidth / initialHeight, 0.1, 40);
    camera.position.set(0, 0, compact ? 8.6 : 7.2);

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance',
    });
    renderer.setClearAlpha(0);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, compact ? 1.15 : 1.5));
    renderer.setSize(initialWidth, initialHeight);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.08;
    container.appendChild(renderer.domElement);

    const artifact = new THREE.Group();
    artifact.rotation.set(-0.28, 0.45, -0.14);
    scene.add(artifact);

    const resources: Array<THREE.BufferGeometry | THREE.Material> = [];
    const keep = <T extends THREE.BufferGeometry | THREE.Material>(resource: T) => {
      resources.push(resource);
      return resource;
    };

    const shellMaterial = keep(
      new THREE.MeshPhysicalMaterial({
        color: new THREE.Color('#182317'),
        metalness: 0.72,
        roughness: 0.34,
        clearcoat: 0.55,
        clearcoatRoughness: 0.3,
        emissive: new THREE.Color('#203719'),
        emissiveIntensity: 0.32,
      })
    );
    const acidMaterial = keep(
      new THREE.MeshStandardMaterial({
        color: ACID,
        emissive: ACID,
        emissiveIntensity: 1.4,
        metalness: 0.38,
        roughness: 0.25,
      })
    );
    const lineMaterial = keep(
      new THREE.MeshBasicMaterial({
        color: MINT,
        transparent: true,
        opacity: 0.42,
        wireframe: true,
      })
    );

    const coreGeometry = keep(new THREE.IcosahedronGeometry(compact ? 0.72 : 0.9, 2));
    const core = new THREE.Mesh(coreGeometry, shellMaterial);
    artifact.add(core);

    const innerGeometry = keep(new THREE.IcosahedronGeometry(compact ? 0.45 : 0.57, 1));
    const inner = new THREE.Mesh(innerGeometry, acidMaterial);
    inner.scale.set(0.78, 1.08, 0.78);
    artifact.add(inner);

    const cageGeometry = keep(new THREE.IcosahedronGeometry(compact ? 0.9 : 1.14, 1));
    const cage = new THREE.Mesh(cageGeometry, lineMaterial);
    cage.rotation.set(0.3, 0.2, 0.1);
    artifact.add(cage);

    const ringMaterial = keep(
      new THREE.MeshStandardMaterial({
        color: PAPER,
        emissive: MINT,
        emissiveIntensity: 0.46,
        metalness: 0.76,
        roughness: 0.25,
        transparent: true,
        opacity: 0.66,
      })
    );
    const ringGeometry = keep(new THREE.TorusGeometry(compact ? 1.08 : 1.38, 0.018, 8, 112));
    const ringOne = new THREE.Mesh(ringGeometry, ringMaterial);
    ringOne.rotation.set(Math.PI * 0.5, 0.14, -0.34);
    artifact.add(ringOne);

    const ringTwo = new THREE.Mesh(ringGeometry, ringMaterial);
    ringTwo.scale.setScalar(0.78);
    ringTwo.rotation.set(1.08, -0.62, 0.52);
    artifact.add(ringTwo);

    const antennaMaterial = keep(
      new THREE.MeshStandardMaterial({
        color: new THREE.Color('#9fb69b'),
        metalness: 0.85,
        roughness: 0.28,
      })
    );
    const mastGeometry = keep(new THREE.CylinderGeometry(0.018, 0.026, 1.1, 8));
    const mast = new THREE.Mesh(mastGeometry, antennaMaterial);
    mast.position.set(0, compact ? 0.98 : 1.23, 0);
    artifact.add(mast);

    const beaconGeometry = keep(new THREE.SphereGeometry(0.09, 12, 12));
    const beacon = new THREE.Mesh(beaconGeometry, acidMaterial);
    beacon.position.set(0, compact ? 1.54 : 1.78, 0);
    artifact.add(beacon);

    const shardGeometry = keep(new THREE.TetrahedronGeometry(compact ? 0.055 : 0.07, 0));
    const shardMaterial = keep(
      new THREE.MeshStandardMaterial({
        color: new THREE.Color('#a7bba4'),
        emissive: MINT,
        emissiveIntensity: 0.16,
        metalness: 0.6,
        roughness: 0.42,
      })
    );
    const shardCount = compact ? 26 : 48;
    const shards = new THREE.InstancedMesh(shardGeometry, shardMaterial, shardCount);
    const matrix = new THREE.Matrix4();
    const quaternion = new THREE.Quaternion();
    const scale = new THREE.Vector3();
    const position = new THREE.Vector3();

    for (let index = 0; index < shardCount; index += 1) {
      const angle = seededRandom(index + 1) * Math.PI * 2;
      const radius = 1.65 + seededRandom(index + 12) * 1.45;
      position.set(
        Math.cos(angle) * radius,
        (seededRandom(index + 27) - 0.5) * 1.3,
        Math.sin(angle) * radius * 0.62
      );
      quaternion.setFromEuler(
        new THREE.Euler(
          seededRandom(index + 31) * Math.PI,
          seededRandom(index + 46) * Math.PI,
          seededRandom(index + 57) * Math.PI
        )
      );
      const shardScale = 0.55 + seededRandom(index + 72) * 1.55;
      scale.setScalar(shardScale);
      matrix.compose(position, quaternion, scale);
      shards.setMatrixAt(index, matrix);
    }
    shards.instanceMatrix.needsUpdate = true;
    artifact.add(shards);

    scene.add(
      new THREE.HemisphereLight(new THREE.Color('#c9ffd0'), new THREE.Color('#020503'), 1.7)
    );
    const keyLight = new THREE.PointLight(ACID, 18, 12, 1.4);
    keyLight.position.set(2.8, 2.2, 3.4);
    scene.add(keyLight);
    const rimLight = new THREE.PointLight(MINT, 9, 10, 1.8);
    rimLight.position.set(-3.4, -1.6, 1.2);
    scene.add(rimLight);

    const desktopPath = new THREE.CatmullRomCurve3([
      new THREE.Vector3(2.95, -1.15, -1.5),
      new THREE.Vector3(2.15, 0.65, -0.7),
      new THREE.Vector3(-2.35, -0.45, -0.2),
      new THREE.Vector3(2.15, 0.3, -1),
      new THREE.Vector3(-0.6, -0.15, 0.15),
    ]);
    const mobilePath = new THREE.CatmullRomCurve3([
      new THREE.Vector3(1.55, -2.15, -2.8),
      new THREE.Vector3(1.25, 1.55, -2.4),
      new THREE.Vector3(-1.3, -1.5, -2.2),
      new THREE.Vector3(1.35, 1.25, -2.7),
      new THREE.Vector3(-0.35, -0.9, -2.2),
    ]);
    const path = compact ? mobilePath : desktopPath;
    const pointerTarget = new THREE.Vector2();
    const pointerCurrent = new THREE.Vector2();
    const pathPosition = new THREE.Vector3();
    const clock = new THREE.Clock();
    let targetProgress = 0;
    let currentProgress = 0;
    let animationFrame = 0;
    let visible = !document.hidden;
    let framePending = false;

    const requestRender = () => {
      if (framePending || reducedMotion || !visible) return;
      framePending = true;
      animationFrame = requestAnimationFrame(render);
    };

    const updateScrollProgress = () => {
      const scrollable = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
      targetProgress = THREE.MathUtils.clamp(window.scrollY / scrollable, 0, 1);
    };

    const handlePointerMove = (event: PointerEvent) => {
      if (event.pointerType === 'touch') return;
      pointerTarget.set(
        event.clientX / window.innerWidth - 0.5,
        event.clientY / window.innerHeight - 0.5
      );
    };

    const handlePointerLeave = () => pointerTarget.set(0, 0);

    const handleResize = () => {
      const width = container.clientWidth || window.innerWidth;
      const height = container.clientHeight || window.innerHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, compact ? 1.15 : 1.5));
      renderer.setSize(width, height);
      updateScrollProgress();
    };

    const handleVisibility = () => {
      visible = !document.hidden;
      if (visible) {
        clock.getDelta();
        requestRender();
      }
    };

    function render() {
      framePending = false;
      if (!visible) return;
      const delta = Math.min(clock.getDelta(), 0.05);
      currentProgress += (targetProgress - currentProgress) * (reducedMotion ? 1 : 0.055);
      pointerCurrent.lerp(pointerTarget, reducedMotion ? 1 : 0.045);
      path.getPointAt(currentProgress, pathPosition);

      artifact.position.copy(pathPosition);
      artifact.position.x += pointerCurrent.x * (compact ? 0.18 : 0.42);
      artifact.position.y -= pointerCurrent.y * (compact ? 0.12 : 0.26);
      artifact.rotation.x = -0.28 + currentProgress * Math.PI * 1.65 - pointerCurrent.y * 0.16;
      artifact.rotation.y = 0.45 + currentProgress * Math.PI * 4.6 + pointerCurrent.x * 0.24;
      artifact.rotation.z = -0.14 + Math.sin(currentProgress * Math.PI * 3) * 0.42;

      const breathing = reducedMotion ? 1 : 1 + Math.sin(clock.elapsedTime * 0.7) * 0.018;
      const scrollScale = compact ? 0.72 : 0.82 + Math.sin(currentProgress * Math.PI) * 0.16;
      artifact.scale.setScalar(scrollScale * breathing);
      ringOne.rotation.z += delta * 0.12;
      ringTwo.rotation.z -= delta * 0.09;
      shards.rotation.y += delta * 0.045;
      beacon.scale.setScalar(1 + Math.max(0, Math.sin(clock.elapsedTime * 1.8)) * 0.35);

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
