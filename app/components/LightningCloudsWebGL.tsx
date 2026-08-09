'use client';

import { useEffect, useRef } from 'react';
import * as THREE from 'three';

const vertexShader = /* glsl */ `
  uniform float uTime;
  uniform float uOrbitPhase;
  uniform vec2 uPointer;
  uniform float uPointerStrength;
  uniform float uAspect;
  uniform float uTanHalfFov;

  attribute float aSize;
  attribute float aSeed;
  attribute float aTone;

  varying float vAlpha;
  varying float vTone;
  varying float vSparkle;

  void main() {
    vec3 p = position;
    float t = uTime * (0.045 + aSeed * 0.018);

    // A restrained curl field: particles keep their structure while the
    // filaments appear to breathe and fold through one another.
    float curlX = sin(p.y * 0.72 + t * 1.7 + aSeed * 9.0);
    float curlY = cos(p.x * 0.58 - t * 1.25 + aSeed * 6.0);
    float curlZ = sin((p.x + p.y) * 0.38 + t + aSeed * 12.0);
    p += vec3(curlX, curlY, curlZ) * vec3(0.10, 0.07, 0.16);

    // A small global tilt keeps the field feeling spatial and calm.
    float yaw = uPointer.x * 0.15;
    float pitch = -uPointer.y * 0.09;
    mat2 rotateY = mat2(cos(yaw), -sin(yaw), sin(yaw), cos(yaw));
    mat2 rotateX = mat2(cos(pitch), -sin(pitch), sin(pitch), cos(pitch));
    p.xz = rotateY * p.xz;
    p.yz = rotateX * p.yz;
    p.xy += uPointer * (0.035 + aSeed * 0.035);

    vec4 mvPosition = modelViewMatrix * vec4(p, 1.0);

    // Calculate the gravity centre in view space so it lands exactly beneath
    // the cursor regardless of viewport ratio, camera depth or object tilt.
    float viewDepth = max(0.1, -mvPosition.z);
    vec2 gravityCenter = vec2(
      uPointer.x * viewDepth * uTanHalfFov * uAspect,
      uPointer.y * viewDepth * uTanHalfFov
    );
    vec2 gravityDelta = mvPosition.xy - gravityCenter;
    float gravityDistance = length(gravityDelta);
    float gravityFalloff = 1.0 - smoothstep(0.8, 5.4, gravityDistance);
    float orbitStrength = gravityFalloff * uPointerStrength;
    float orbitAngle = uOrbitPhase * orbitStrength;

    // Rotate around a tilted 3D axis rather than an axis perpendicular to the
    // screen. Its projected path is an ellipse, with part of the movement
    // travelling into depth instead of sweeping across the viewport.
    vec3 orbitAxis = normalize(vec3(0.68, 0.30, 0.67));
    vec3 orbitDelta = vec3(gravityDelta, 0.0);
    float orbitCos = cos(orbitAngle);
    float orbitSin = sin(orbitAngle);
    vec3 rotatedDelta = orbitDelta * orbitCos
      + cross(orbitAxis, orbitDelta) * orbitSin
      + orbitAxis * dot(orbitAxis, orbitDelta) * (1.0 - orbitCos);
    mvPosition.xy = gravityCenter + rotatedDelta.xy;
    mvPosition.z += rotatedDelta.z * 0.72;

    gl_Position = projectionMatrix * mvPosition;

    float depthFade = smoothstep(11.0, 3.2, -mvPosition.z);
    float edgeFade = 1.0 - smoothstep(3.0, 5.5, length(p.xy));
    float pulse = 0.76 + 0.24 * sin(uTime * 0.32 + aSeed * 26.0);
    float sparkleWave = sin(uTime * (0.38 + aSeed * 0.72) + aSeed * 113.0);
    vSparkle = pow(max(0.0, sparkleWave), 72.0) * step(0.97, aSeed);
    vAlpha = depthFade * edgeFade * pulse;
    vTone = aTone;
    gl_PointSize = aSize * (1.0 + vSparkle * 1.5) * (7.5 / max(2.0, -mvPosition.z));
  }
`;

const fragmentShader = /* glsl */ `
  varying float vAlpha;
  varying float vTone;
  varying float vSparkle;

  void main() {
    vec2 uv = gl_PointCoord - 0.5;
    float distanceToCenter = length(uv);
    if (distanceToCenter > 0.5) discard;

    float core = 1.0 - smoothstep(0.0, 0.16, distanceToCenter);
    float halo = 1.0 - smoothstep(0.08, 0.5, distanceToCenter);
    float alpha = (core * 0.9 + halo * (0.24 + vSparkle * 0.5)) * vAlpha;

    vec3 silver = vec3(0.80, 0.85, 0.80);
    vec3 mint = vec3(0.63, 0.92, 0.52);
    vec3 color = mix(silver, mint, vTone * 0.72);
    color += vec3(0.24, 0.31, 0.20) * vSparkle;
    gl_FragColor = vec4(color, alpha);
  }
`;

function createParticleGeometry(count: number) {
  const geometry = new THREE.BufferGeometry();
  const positions = new Float32Array(count * 3);
  const sizes = new Float32Array(count);
  const seeds = new Float32Array(count);
  const tones = new Float32Array(count);

  for (let i = 0; i < count; i += 1) {
    const i3 = i * 3;
    const seed = Math.random();
    const angle = Math.random() * Math.PI * 2;
    const radius = Math.pow(Math.random(), 0.64) * 4.8;
    const arm = i % 3;

    // Three overlapping filaments create a cloud with a dense centre and
    // sparse, almost smoke-like edges.
    const twist = angle + radius * (0.47 + arm * 0.065);
    const thickness = (Math.random() - 0.5) * (0.16 + radius * 0.075);
    const armOffset = (arm - 1) * 0.31;

    positions[i3] = Math.cos(twist) * radius * 1.18 + thickness;
    positions[i3 + 1] =
      Math.sin(twist) * radius * 0.52 + Math.sin(radius * 1.45 + arm) * 0.24 + armOffset;
    positions[i3 + 2] =
      (Math.random() - 0.5) * (0.48 + radius * 0.34) + Math.cos(twist * 1.4) * 0.26;

    seeds[i] = seed;
    const sizeClass = Math.random();
    sizes[i] =
      sizeClass < 0.72
        ? 2.2 + Math.random() * 2.2
        : sizeClass < 0.96
          ? 4.8 + Math.random() * 4.2
          : 10 + Math.random() * 7;
    tones[i] = Math.pow(Math.random(), 2.7);
  }

  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute('aSize', new THREE.BufferAttribute(sizes, 1));
  geometry.setAttribute('aSeed', new THREE.BufferAttribute(seeds, 1));
  geometry.setAttribute('aTone', new THREE.BufferAttribute(tones, 1));
  geometry.computeBoundingSphere();
  return geometry;
}

export default function LightningCloudsWebGL() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const isCompact = window.innerWidth < 768;
    const particleCount = isCompact ? 1500 : window.innerWidth < 1200 ? 2900 : 4700;
    const initialWidth = container.clientWidth || window.innerWidth;
    const initialHeight = container.clientHeight || window.innerHeight;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(42, initialWidth / initialHeight, 0.1, 30);
    camera.position.set(0, 0.05, isCompact ? 8.1 : 7.2);

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: false,
      powerPreference: 'high-performance',
    });
    renderer.setClearAlpha(0);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.65));
    renderer.setSize(initialWidth, initialHeight);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    container.appendChild(renderer.domElement);

    const geometry = createParticleGeometry(particleCount);
    const material = new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0 },
        uOrbitPhase: { value: 0 },
        uPointer: { value: new THREE.Vector2() },
        uPointerStrength: { value: 0 },
        uAspect: { value: initialWidth / initialHeight },
        uTanHalfFov: { value: Math.tan(THREE.MathUtils.degToRad(camera.fov / 2)) },
      },
      vertexShader,
      fragmentShader,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      depthTest: true,
    });

    const particles = new THREE.Points(geometry, material);
    particles.rotation.set(-0.12, 0.08, isCompact ? -0.16 : -0.1);
    particles.scale.setScalar(isCompact ? 0.88 : 1);
    scene.add(particles);

    const targetPointer = new THREE.Vector2();
    const currentPointer = new THREE.Vector2();
    const clock = new THREE.Clock();
    let animationFrame = 0;
    let orbitPhase = 0;
    let targetPointerStrength = 1;
    let currentPointerStrength = 1;

    const handlePointerMove = (event: PointerEvent) => {
      if (event.pointerType === 'touch') return;
      const bounds = container.getBoundingClientRect();
      targetPointer.set(
        ((event.clientX - bounds.left) / bounds.width) * 2 - 1,
        -((event.clientY - bounds.top) / bounds.height) * 2 + 1
      );
      targetPointerStrength = 1;
    };

    const handlePointerLeave = () => {
      targetPointer.set(0, 0);
      targetPointerStrength = 1;
    };

    const handleWindowBlur = () => {
      targetPointer.set(0, 0);
      targetPointerStrength = 1;
    };

    const handleVisibilityChange = () => {
      if (document.hidden) handleWindowBlur();
    };

    const handleResize = () => {
      const width = container.clientWidth || window.innerWidth;
      const height = container.clientHeight || window.innerHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      material.uniforms.uAspect.value = camera.aspect;
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.65));
      renderer.setSize(width, height);
    };

    const render = () => {
      const delta = Math.min(clock.getDelta(), 0.05);
      currentPointer.lerp(targetPointer, 0.085);
      currentPointerStrength += (targetPointerStrength - currentPointerStrength) * 0.09;
      orbitPhase += delta * 0.46 * currentPointerStrength;
      material.uniforms.uPointer.value.copy(currentPointer);
      material.uniforms.uPointerStrength.value = currentPointerStrength;
      material.uniforms.uOrbitPhase.value = orbitPhase;
      material.uniforms.uTime.value = clock.elapsedTime;

      if (!reducedMotion) {
        particles.rotation.y = 0.08 + Math.sin(clock.elapsedTime * 0.055) * 0.035;
      }

      renderer.render(scene, camera);
      if (!reducedMotion) animationFrame = requestAnimationFrame(render);
    };

    window.addEventListener('pointermove', handlePointerMove, { passive: true });
    document.documentElement.addEventListener('pointerleave', handlePointerLeave);
    window.addEventListener('blur', handleWindowBlur);
    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('resize', handleResize);
    render();

    return () => {
      cancelAnimationFrame(animationFrame);
      window.removeEventListener('pointermove', handlePointerMove);
      document.documentElement.removeEventListener('pointerleave', handlePointerLeave);
      window.removeEventListener('blur', handleWindowBlur);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('resize', handleResize);
      geometry.dispose();
      material.dispose();
      renderer.dispose();
      renderer.domElement.remove();
    };
  }, []);

  return <div ref={containerRef} className="particle-field" />;
}
