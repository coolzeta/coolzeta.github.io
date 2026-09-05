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
    material.transparent = true;
    const initial = new THREE.Group();
    const solid = new THREE.Mesh(geometry, material);
    initial.add(solid);

    const contourGeometry = new THREE.BufferGeometry().setFromPoints(
      outline.getPoints(1).map(point => new THREE.Vector3(point.x, point.y, 0.37))
    );
    const contourMaterial = new THREE.LineBasicMaterial({
      color: '#c1dc91',
      transparent: true,
      opacity: 0.8,
    });
    const contour = new THREE.LineLoop(contourGeometry, contourMaterial);
    initial.add(contour);
    const leafMaterial = new THREE.LineBasicMaterial({
      color: '#c1dc91',
      transparent: true,
      opacity: 0,
    });
    const frontLeaf = new THREE.LineLoop(contourGeometry, leafMaterial);
    const backLeaf = new THREE.LineLoop(contourGeometry, leafMaterial);
    initial.add(frontLeaf, backLeaf);

    const axis = new THREE.Group();
    axis.rotation.set(0.15, 0, -0.19);
    axis.add(initial);
    scene.add(axis);
    const light = new THREE.DirectionalLight('#edffd1', 3);
    light.position.set(-3, 4, 5);
    scene.add(light);

    const home = container.closest<HTMLElement>('.personal-home');
    const motionPreference = window.matchMedia('(prefers-reduced-motion: reduce)');
    let reduced = motionPreference.matches;
    let frame = 0;
    let previous = 0;
    let elapsed = 0;
    let progress = window.scrollY;
    let target = progress;
    let disposed = false;
    let maxScroll = 0;
    let viewportWidth = 1;
    let viewportHeight = 1;
    type Pose = {
      scroll: number;
      x: number;
      y: number;
      size: number;
      angle: number;
      solid: number;
      spread: number;
      phase: string;
    };
    let stops: Pose[] = [];
    let heroHoldStart = 0;
    let heroHoldEnd = 0;

    function measure() {
      if (!container || disposed) return;
      const width = container.clientWidth;
      const height = container.clientHeight;
      if (!width || !height) return;
      viewportWidth = width;
      viewportHeight = height;
      camera.aspect = width / Math.max(1, height);
      camera.updateProjectionMatrix();
      // CSS owns the viewport-sized box. Resize only the drawing buffer so
      // canvas intrinsic dimensions cannot feed back into document overflow.
      renderer.setSize(width, height, false);
      const definitions = [
        { name: 'idea', angle: -0.4, solid: 0.8, spread: 0 },
        { name: 'make', angle: 0.55, solid: 1, spread: 0 },
        { name: 'notes', angle: -0.8, solid: 0.16, spread: 1 },
        { name: 'signature', angle: 0, solid: 1, spread: 0 },
      ];
      // Use the content's layout box, never scrollHeight (which includes
      // transformed visual overflow and can grow as an animation moves).
      maxScroll = Math.max(0, (home ? home.offsetTop + home.offsetHeight : height) - height);
      const anchors = definitions.flatMap((definition, index) => {
        const element = document.querySelector<HTMLElement>(
          '[data-story-anchor="' + definition.name + '"]'
        );
        if (!element) return [];
        const rect = element.getBoundingClientRect();
        const holdOffset =
          definition.name === 'idea' && width <= 600
            ? parseFloat(home?.style.getPropertyValue('--hero-hold-offset') || '0')
            : 0;
        const centerY = rect.top + window.scrollY + rect.height / 2 - holdOffset;
        return [
          {
            scroll: index === 0 ? 0 : Math.min(maxScroll, Math.max(0, centerY - height * 0.53)),
            x: rect.left + rect.width / 2,
            y: centerY,
            size:
              definition.name === 'signature'
                ? rect.height * 0.86
                : Math.min(rect.height * 0.74, rect.width * 0.85),
            angle: definition.angle,
            solid: definition.solid,
            spread: definition.spread,
            phase: definition.name,
          },
        ];
      });
      // On phones, first let the initial reach the middle of the screen, then
      // give it a short reading pause. No wheel/touch interception is needed.
      const mobile = width <= 600 && !reduced;
      heroHoldStart = mobile && anchors[0] ? Math.max(0, anchors[0].y - height * 0.5) : 0;
      heroHoldEnd = mobile ? heroHoldStart + 160 : 0;
      // Arrive before the section text enters the viewport, then stay attached while it is read.
      stops = anchors.flatMap((anchor, index) => {
        if (index === 0) {
          return mobile
            ? [anchor, { ...anchor, scroll: heroHoldEnd, y: anchor.y + 160 }]
            : [anchor];
        }
        if (index === anchors.length - 1) return [anchor];
        const arrival = Math.max(
          index === 1 ? heroHoldEnd + 1 : anchors[index - 1].scroll + height * 0.14 + 1,
          anchor.scroll - height * 0.65
        );
        return [
          { ...anchor, scroll: arrival },
          {
            ...anchor,
            scroll: Math.min(anchors[index + 1].scroll - 1, anchor.scroll + height * 0.14),
          },
        ];
      });
      updateScroll();
      draw(0);
    }
    function updateScroll() {
      target = THREE.MathUtils.clamp(window.scrollY, 0, maxScroll);
      if (reduced) draw(0);
    }
    function draw(time: number) {
      cancelAnimationFrame(frame);
      if (disposed || document.hidden || !stops.length) return;
      const delta = previous && time ? Math.min((time - previous) / 1000, 0.05) : 0;
      previous = time;
      if (!reduced) elapsed += delta;
      progress += (target - progress) * (reduced ? 1 : 1 - Math.exp(-delta * 10));
      const nextIndex = stops.findIndex(stop => stop.scroll > progress);
      const last = nextIndex === -1;
      const from = reduced ? stops[0] : stops[last ? stops.length - 1 : Math.max(0, nextIndex - 1)];
      const to = reduced || last ? from : stops[nextIndex];
      const fraction = THREE.MathUtils.clamp(
        (progress - from.scroll) / Math.max(1, to.scroll - from.scroll),
        0,
        1
      );
      const ease = fraction * fraction * (3 - 2 * fraction);
      const mix = (a: number, b: number) => THREE.MathUtils.lerp(a, b, ease);
      const worldHeight =
        2 * Math.tan(THREE.MathUtils.degToRad(camera.fov / 2)) * camera.position.z;
      const x = mix(from.x, to.x);
      // Document coordinates keep the object physically attached to the slots in the page.
      const holdingHero = heroHoldEnd > 0 && progress <= heroHoldEnd;
      const scroll = THREE.MathUtils.clamp(window.scrollY, 0, maxScroll);
      const y = holdingHero
        ? stops[0].y - Math.min(scroll, heroHoldStart)
        : mix(from.y, to.y) - scroll;
      const size = mix(from.size, to.size);
      axis.position.set(
        (x / viewportWidth - 0.5) * worldHeight * camera.aspect,
        (0.5 - y / viewportHeight) * worldHeight,
        0
      );
      axis.scale.setScalar(((size / viewportHeight) * worldHeight) / 2.8);
      const spread = mix(from.spread, to.spread);
      const introduction =
        reduced || progress > 100 ? 1 : THREE.MathUtils.smoothstep(elapsed, 0, 0.7);
      material.opacity = reduced ? 1 : mix(from.solid, to.solid) * introduction;
      material.depthWrite = material.opacity > 0.95;
      contourMaterial.opacity = reduced ? 0 : (1 - material.opacity) * 0.75 + spread * 0.1;
      leafMaterial.opacity = reduced ? 0 : spread * 0.5;
      frontLeaf.position.set(spread * 0.22, 0, spread * 0.7);
      backLeaf.position.set(-spread * 0.22, 0, -spread * 1);
      const closing = from.phase === 'signature' ? 1 : to.phase === 'signature' ? ease : 0;
      initial.rotation.y =
        mix(from.angle, to.angle) + (reduced ? 0 : Math.sin(elapsed * 0.24) * 0.12 * (1 - closing));
      const phase = ease < 0.5 ? from.phase : to.phase;
      if (home) {
        home.style.setProperty(
          '--hero-hold-offset',
          `${heroHoldEnd > 0 ? THREE.MathUtils.clamp(scroll - heroHoldStart, 0, 160) : 0}px`
        );
        home.dataset.storyPhase = reduced ? 'idea' : phase;
        home.style.setProperty(
          '--story-progress',
          String(
            reduced
              ? 0
              : THREE.MathUtils.clamp(progress / Math.max(1, stops[stops.length - 1].scroll), 0, 1)
          )
        );
      }
      renderer.render(scene, camera);
      if (!reduced) frame = requestAnimationFrame(draw);
    }
    function resume() {
      previous = 0;
      draw(0);
    }
    function onPreference() {
      reduced = motionPreference.matches;
      measure();
    }
    const resize = new ResizeObserver(measure);
    resize.observe(container);
    if (home) resize.observe(home);
    window.addEventListener('scroll', updateScroll, { passive: true });
    document.addEventListener('visibilitychange', resume);
    motionPreference.addEventListener('change', onPreference);
    document.fonts.ready.then(() => {
      if (!disposed) measure();
    });
    measure();
    container.dataset.ready = 'true';

    return () => {
      disposed = true;
      cancelAnimationFrame(frame);
      resize.disconnect();
      window.removeEventListener('scroll', updateScroll);
      document.removeEventListener('visibilitychange', resume);
      motionPreference.removeEventListener('change', onPreference);
      geometry.dispose();
      material.dispose();
      contourGeometry.dispose();
      contourMaterial.dispose();
      leafMaterial.dispose();
      environment.dispose();
      renderer.dispose();
      renderer.domElement.remove();
      delete container.dataset.ready;
      if (home) {
        delete home.dataset.storyPhase;
        home.style.removeProperty('--story-progress');
        home.style.removeProperty('--hero-hold-offset');
      }
    };
  }, []);

  return <div ref={containerRef} className="scroll-artifact-canvas" aria-hidden="true" />;
}
