'use client';

import { useEffect, useRef } from 'react';
import * as THREE from 'three';

export default function LightningCloudsWebGL() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    let isCleanedUp = false; // Flag to prevent race conditions

    // Setup scene
    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
    const renderer = new THREE.WebGLRenderer({ 
      alpha: true, 
      antialias: false,
      powerPreference: 'high-performance'
    });
    
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2)); // Limit pixel ratio for performance
    
    const container = containerRef.current;
    container.appendChild(renderer.domElement);

    // Particle system - scale with screen width (increased)
    const getParticleCount = () => {
      const width = window.innerWidth;
      if (width < 640) return 80;   // Mobile: 80 particles (was 50)
      if (width < 1024) return 120; // Tablet: 120 particles (was 80)
      return 250;                   // Desktop: 250 particles (was 150)
    };
    
    const particleCount = getParticleCount();
    const geometry = new THREE.BufferGeometry();
    
    // Attributes
    const positions = new Float32Array(particleCount * 3);
    const velocities = new Float32Array(particleCount * 2);
    const brightness = new Float32Array(particleCount);
    const targetBrightness = new Float32Array(particleCount);
    const sizes = new Float32Array(particleCount);
    const colors = new Float32Array(particleCount * 3);
    const lifetimes = new Float32Array(particleCount); // Lifetime in seconds
    const maxLifetimes = new Float32Array(particleCount); // Max lifetime for each particle

    // Initialize particles
    for (let i = 0; i < particleCount; i++) {
      const i3 = i * 3;
      const i2 = i * 2;

      // Position (-1 to 1 normalized)
      positions[i3] = (Math.random() - 0.5) * 2;
      positions[i3 + 1] = (Math.random() - 0.5) * 2;
      positions[i3 + 2] = 0;

      // Velocity - faster base movement
      velocities[i2] = (Math.random() - 0.5) * 0.002;
      velocities[i2 + 1] = (Math.random() - 0.5) * 0.002;

      // Brightness - lower base
      brightness[i] = 0.15 + Math.random() * 0.15; // Start: 0.15-0.3
      targetBrightness[i] = 0.15 + Math.random() * 0.15;

      // Size - much larger
      sizes[i] = 100 + Math.random() * 120; // 100-220 pixels

      // Color (brighter green variations)
      colors[i3] = (80 + Math.random() * 40) / 255; // More red
      colors[i3 + 1] = (200 + Math.random() * 55) / 255; // Brighter green
      colors[i3 + 2] = (80 + Math.random() * 40) / 255; // More blue

      // Lifetime: 15-30 seconds (staggered initial lifetimes for smooth regeneration)
      maxLifetimes[i] = 15 + Math.random() * 15;
      lifetimes[i] = Math.random() * maxLifetimes[i]; // Start at random point in lifetime
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('aBrightness', new THREE.BufferAttribute(brightness, 1));
    geometry.setAttribute('aSize', new THREE.BufferAttribute(sizes, 1));
    geometry.setAttribute('aColor', new THREE.BufferAttribute(colors, 3));

    // Custom shader material
    const material = new THREE.ShaderMaterial({
      uniforms: {
        uResolution: { value: new THREE.Vector2(window.innerWidth, window.innerHeight) }
      },
      vertexShader: `
        attribute float aBrightness;
        attribute float aSize;
        attribute vec3 aColor;
        
        varying float vBrightness;
        varying vec3 vColor;
        
        uniform vec2 uResolution;
        
        void main() {
          vBrightness = aBrightness;
          vColor = aColor;
          
          vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
          gl_Position = projectionMatrix * mvPosition;
          
          // Size in pixels
          gl_PointSize = aSize * (uResolution.y / 1000.0);
        }
      `,
      fragmentShader: `
        varying float vBrightness;
        varying vec3 vColor;
        
        void main() {
          // Circular gradient
          vec2 center = gl_PointCoord - vec2(0.5);
          float dist = length(center);
          
          if (dist > 0.5) discard;
          
          // Softer gradient with more visible core
          float alpha = pow(1.0 - dist * 2.0, 1.5) * vBrightness * 1.5; // Brighter
          alpha = smoothstep(0.0, 1.0, alpha);
          
          gl_FragColor = vec4(vColor * 1.2, alpha); // Boost color brightness
        }
      `,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });

    const points = new THREE.Points(geometry, material);
    scene.add(points);

    // Animation state
    let lastInteraction = 0;
    const interactionThrottle = 100;
    const interactionPos = new THREE.Vector2(0, 0);
    
    // Detect touch device - check multiple conditions for reliability
    const isTouchDevice = (
      'ontouchstart' in window || 
      navigator.maxTouchPoints > 0 || 
      (navigator as any).msMaxTouchPoints > 0
    );

    // Mouse interaction (desktop only)
    const handleMouseMove = (e: MouseEvent) => {
      if (isTouchDevice) return; // Skip on touch devices
      
      const now = Date.now();
      if (now - lastInteraction < interactionThrottle) return;
      lastInteraction = now;

      // Convert to normalized coordinates (-1 to 1)
      interactionPos.x = (e.clientX / window.innerWidth) * 2 - 1;
      interactionPos.y = -(e.clientY / window.innerHeight) * 2 + 1;

      const radius = 0.15; // Interaction radius - reduced (was 0.25)
      
      for (let i = 0; i < particleCount; i++) {
        const i3 = i * 3;
        const i2 = i * 2;
        const px = positions[i3];
        const py = positions[i3 + 1];
        
        const dx = px - interactionPos.x;
        const dy = py - interactionPos.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < radius && distance > 0.001) {
          const intensity = 1 - (distance / radius);
          
          // Brighten particles
          targetBrightness[i] = Math.max(targetBrightness[i], intensity * 0.35);
          
          // Repulsion force - much weaker
          const repulsionStrength = 0.003 * intensity; // Reduced from 0.006 to 0.003
          const dirX = dx / distance; // Normalized direction
          const dirY = dy / distance;
          
          // Apply repulsion to velocity
          velocities[i2] += dirX * repulsionStrength;
          velocities[i2 + 1] += dirY * repulsionStrength;
          
          // Limit velocity with higher max speed
          const speed = Math.sqrt(velocities[i2] * velocities[i2] + velocities[i2 + 1] * velocities[i2 + 1]);
          const maxSpeed = 0.008;
          if (speed > maxSpeed) {
            velocities[i2] = (velocities[i2] / speed) * maxSpeed;
            velocities[i2 + 1] = (velocities[i2 + 1] / speed) * maxSpeed;
          }
        }
      }
    };

    // Scroll interaction (mobile/tablet only)
    const handleScroll = () => {
      if (!isTouchDevice) return; // Skip on desktop
      
      const now = Date.now();
      if (now - lastInteraction < interactionThrottle) return;
      lastInteraction = now;

      // Use scroll position (0 to 1, normalized by viewport height)
      const scrollY = window.scrollY;
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      const scrollProgress = Math.min(scrollY / Math.max(maxScroll, 1), 1);

      // Create a horizontal wave of repulsion based on scroll
      const waveY = scrollProgress * 2 - 1; // Convert to -1 to 1 range

      // Brighten and push particles based on scroll wave
      for (let i = 0; i < particleCount; i++) {
        const i3 = i * 3;
        const i2 = i * 2;
        const py = positions[i3 + 1]; // Y position (-1 to 1)
        
        // Distance from the scroll wave
        const distanceFromWave = Math.abs(py - waveY);
        
        if (distanceFromWave < 0.25) { // Reduced from 0.4 to 0.25 (smaller range)
          const intensity = 1 - (distanceFromWave / 0.25);
          
          // Brighten particles
          targetBrightness[i] = Math.max(targetBrightness[i], intensity * 0.35);
          
          // Horizontal repulsion force - much weaker
          const repulsionStrength = 0.002 * intensity; // Reduced from 0.004 to 0.002
          const direction = (positions[i3] > 0) ? 1 : -1; // Push away from center
          
          velocities[i2] += direction * repulsionStrength;
          
          // Limit velocity with higher max speed
          const speed = Math.sqrt(velocities[i2] * velocities[i2] + velocities[i2 + 1] * velocities[i2 + 1]);
          const maxSpeed = 0.008;
          if (speed > maxSpeed) {
            velocities[i2] = (velocities[i2] / speed) * maxSpeed;
            velocities[i2 + 1] = (velocities[i2 + 1] / speed) * maxSpeed;
          }
        }
      }
    };

    // Add event listeners based on device type
    if (!isTouchDevice) {
      window.addEventListener('mousemove', handleMouseMove);
      console.log('[LightningClouds] Mouse interaction enabled');
    } else {
      window.addEventListener('scroll', handleScroll, { passive: true });
      console.log('[LightningClouds] Scroll interaction enabled');
    }

    // Respawn particle at random position
    function respawnParticle(i: number) {
      const i3 = i * 3;
      const i2 = i * 2;

      // Random position
      positions[i3] = (Math.random() - 0.5) * 2;
      positions[i3 + 1] = (Math.random() - 0.5) * 2;

      // Reset velocity
      velocities[i2] = (Math.random() - 0.5) * 0.002;
      velocities[i2 + 1] = (Math.random() - 0.5) * 0.002;

      // Start dim
      brightness[i] = 0.05 + Math.random() * 0.05; // 0.05-0.1 (very dim)
      targetBrightness[i] = 0.05 + Math.random() * 0.05;

      // Reset lifetime
      maxLifetimes[i] = 15 + Math.random() * 15; // 15-30 seconds
      lifetimes[i] = maxLifetimes[i];
    }

    // Animation loop
    let lastFrameTime = Date.now();
    let animationFrameId: number;
    
    function animate() {
      if (isCleanedUp) return; // Stop animation if component is unmounted
      
      const now = Date.now();
      const deltaTime = (now - lastFrameTime) / 1000; // Convert to seconds
      lastFrameTime = now;

      // Continuous random sparkles - more particles can be bright at once
      // Each frame, randomly brighten 3-6 particles (increased from 1-3)
      const sparkleCount = Math.floor(Math.random() * 4) + 3; // 3-6 particles per frame
      for (let s = 0; s < sparkleCount; s++) {
        if (Math.random() < 0.02) { // 2% chance per sparkle slot (increased from 1.5%)
          const idx = Math.floor(Math.random() * particleCount);
          // Only brighten if currently dim (to avoid always hitting the same bright ones)
          if (targetBrightness[idx] < 0.25) {
            targetBrightness[idx] = 0.25 + Math.random() * 0.2; // 0.25-0.45
          }
        }
      }

      const posAttr = geometry.attributes.position as THREE.BufferAttribute;
      const brightAttr = geometry.attributes.aBrightness as THREE.BufferAttribute;

      // Update particles
      for (let i = 0; i < particleCount; i++) {
        const i3 = i * 3;
        const i2 = i * 2;

        // Update lifetime
        lifetimes[i] -= deltaTime;

        // Check if lifetime expired
        if (lifetimes[i] <= 0) {
          respawnParticle(i);
          continue; // Skip to next particle
        }

        // Apply velocity damping - less aggressive
        velocities[i2] *= 0.99;
        velocities[i2 + 1] *= 0.99;

        // Move
        positions[i3] += velocities[i2];
        positions[i3 + 1] += velocities[i2 + 1];

        // Also respawn if out of bounds (for particles pushed out by repulsion)
        if (positions[i3] < -1.2 || positions[i3] > 1.2 || 
            positions[i3 + 1] < -1.2 || positions[i3 + 1] > 1.2) {
          respawnParticle(i);
          continue; // Skip to next particle
        }

        // Brightness transition
        const diff = targetBrightness[i] - brightness[i];
        if (Math.abs(diff) > 0.001) {
          brightness[i] += diff * 0.15;
        }

        // Moderate decay
        targetBrightness[i] *= 0.995;
      }

      posAttr.needsUpdate = true;
      brightAttr.needsUpdate = true;

      renderer.render(scene, camera);
      animationFrameId = requestAnimationFrame(animate);
    }

    animate();
    console.log('[LightningClouds] Component mounted and animation started');

    // Resize handler
    const handleResize = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
      material.uniforms.uResolution.value.set(width, height);
    };

    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      console.log('[LightningClouds] Cleaning up component');
      isCleanedUp = true;
      
      // Cancel animation frame
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
      
      // Remove event listeners
      window.removeEventListener('resize', handleResize);
      if (!isTouchDevice) {
        window.removeEventListener('mousemove', handleMouseMove);
      } else {
        window.removeEventListener('scroll', handleScroll);
      }
      
      // Remove canvas element safely
      if (container && renderer.domElement.parentNode === container) {
        container.removeChild(renderer.domElement);
      }
      
      // Dispose Three.js resources
      geometry.dispose();
      material.dispose();
      renderer.dispose();
    };
  }, []);

  return (
    <div 
      ref={containerRef} 
      style={{ 
        position: 'absolute',
        top: 0, 
        left: 0, 
        width: '100%', 
        height: '100%',
        pointerEvents: 'auto'
      }} 
    />
  );
}
