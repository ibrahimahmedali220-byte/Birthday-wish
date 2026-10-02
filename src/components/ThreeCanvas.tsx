import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { PageStep } from '../types';

interface ThreeCanvasProps {
  currentStep: PageStep;
  glowBoost?: boolean;
}

export const ThreeCanvas: React.FC<ThreeCanvasProps> = ({ currentStep, glowBoost = false }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [webGLSupported, setWebGLSupported] = useState<boolean>(true);

  // References for animation loop
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const moonGroupRef = useRef<THREE.Group | null>(null);
  const lanternsRef = useRef<THREE.Group[]>([]);
  const particlesRef = useRef<THREE.Points | null>(null);
  const starsRef = useRef<THREE.Points | null>(null);
  const moonLightRef = useRef<THREE.PointLight | null>(null);
  const reqIdRef = useRef<number | null>(null);

  // Mouse & Parallax tracking
  const mousePos = useRef({ x: 0, y: 0, targetX: 0, targetY: 0 });

  useEffect(() => {
    // Check WebGL availability safely
    try {
      const testCanvas = document.createElement('canvas');
      const gl = testCanvas.getContext('webgl2') || testCanvas.getContext('webgl');
      if (!gl) {
        setWebGLSupported(false);
        return;
      }
    } catch {
      setWebGLSupported(false);
      return;
    }

    const container = containerRef.current;
    if (!container) return;

    const width = container.clientWidth || window.innerWidth;
    const height = container.clientHeight || window.innerHeight;

    // 1. Scene setup
    const scene = new THREE.Scene();
    sceneRef.current = scene;
    scene.fog = new THREE.FogExp2(0x030712, 0.022);

    // 2. Camera setup
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.set(0, 0, 15);
    cameraRef.current = camera;

    // 3. Renderer setup
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    container.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // 4. Ambient & Directional Lights
    const ambientLight = new THREE.AmbientLight(0x0f172a, 1.2);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xfef08a, 1.8);
    directionalLight.position.set(5, 8, 10);
    scene.add(directionalLight);

    const blueBackLight = new THREE.DirectionalLight(0x1e3a8a, 1.0);
    blueBackLight.position.set(-6, -4, -5);
    scene.add(blueBackLight);

    // 5. Procedural 3D Crescent Moon
    const moonGroup = new THREE.Group();
    moonGroupRef.current = moonGroup;

    // Construct smooth crescent geometry via 2D shape with curved inner cutout
    const moonShape = new THREE.Shape();
    const R_outer = 3.2;
    const R_inner = 2.85;
    const offsetInnerX = 1.15;
    const segments = 48;

    // Outer Arc
    moonShape.moveTo(0, -R_outer);
    for (let i = 0; i <= segments; i++) {
      const theta = -Math.PI / 2 + (Math.PI * i) / segments;
      const x = Math.cos(theta) * R_outer;
      const y = Math.sin(theta) * R_outer;
      moonShape.lineTo(x, y);
    }

    // Inner Cutout Arc curving back
    for (let i = segments; i >= 0; i--) {
      const theta = -Math.PI / 2 + (Math.PI * i) / segments;
      const x = offsetInnerX + Math.cos(theta) * R_inner;
      const y = Math.sin(theta) * R_inner;
      moonShape.lineTo(x, y);
    }
    moonShape.closePath();

    const extrudeSettings: THREE.ExtrudeGeometryOptions = {
      depth: 0.38,
      bevelEnabled: true,
      bevelSegments: 5,
      steps: 1,
      bevelSize: 0.12,
      bevelThickness: 0.14,
      curveSegments: 36,
    };

    const moonGeometry = new THREE.ExtrudeGeometry(moonShape, extrudeSettings);
    moonGeometry.center();

    const moonMaterial = new THREE.MeshPhysicalMaterial({
      color: 0xfef08a,
      emissive: 0xd97706,
      emissiveIntensity: 0.45,
      roughness: 0.28,
      metalness: 0.55,
      clearcoat: 0.35,
      clearcoatRoughness: 0.2,
    });

    const moonMesh = new THREE.Mesh(moonGeometry, moonMaterial);
    moonMesh.rotation.z = -0.38;
    moonMesh.rotation.y = 0.25;
    moonGroup.add(moonMesh);

    // Subtle golden moon halo sprite
    const canvasGlow = document.createElement('canvas');
    canvasGlow.width = 128;
    canvasGlow.height = 128;
    const ctxGlow = canvasGlow.getContext('2d');
    if (ctxGlow) {
      const gradient = ctxGlow.createRadialGradient(64, 64, 0, 64, 64, 64);
      gradient.addColorStop(0, 'rgba(254, 240, 138, 0.7)');
      gradient.addColorStop(0.3, 'rgba(234, 179, 8, 0.35)');
      gradient.addColorStop(0.7, 'rgba(202, 138, 4, 0.1)');
      gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctxGlow.fillStyle = gradient;
      ctxGlow.fillRect(0, 0, 128, 128);
    }

    const glowTexture = new THREE.CanvasTexture(canvasGlow);
    const glowMaterial = new THREE.SpriteMaterial({
      map: glowTexture,
      transparent: true,
      blending: THREE.AdditiveBlending,
      opacity: 0.75,
      depthWrite: false,
    });
    const glowSprite = new THREE.Sprite(glowMaterial);
    glowSprite.scale.set(11, 11, 1);
    glowSprite.position.set(0, 0, -0.2);
    moonGroup.add(glowSprite);

    // Warm Moon Point Light
    const moonPointLight = new THREE.PointLight(0xfef08a, 2.2, 25);
    moonPointLight.position.set(0, 0, 2);
    moonLightRef.current = moonPointLight;
    moonGroup.add(moonPointLight);

    // Position Moon in background
    moonGroup.position.set(2.8, 1.8, -2.5);
    scene.add(moonGroup);

    // 6. Helper: Procedural 3D Islamic Lantern (Fanous)
    const createLantern = (x: number, y: number, z: number, scale = 1, delay = 0) => {
      const lanternGroup = new THREE.Group();
      lanternGroup.position.set(x, y, z);
      lanternGroup.scale.set(scale, scale, scale);

      // Gold Metallic Material
      const goldMat = new THREE.MeshStandardMaterial({
        color: 0xeab308,
        metalness: 0.85,
        roughness: 0.3,
        emissive: 0x854d0e,
        emissiveIntensity: 0.2,
      });

      // Glass Material
      const glassMat = new THREE.MeshPhysicalMaterial({
        color: 0xffffff,
        transmission: 0.9,
        opacity: 1,
        transparent: true,
        roughness: 0.1,
        ior: 1.5,
      });

      // Top Hanging Ring
      const ringGeo = new THREE.TorusGeometry(0.2, 0.04, 8, 24);
      const ringMesh = new THREE.Mesh(ringGeo, goldMat);
      ringMesh.position.y = 1.7;
      lanternGroup.add(ringMesh);

      // Top Dome
      const domeGeo = new THREE.ConeGeometry(0.65, 0.7, 6);
      const domeMesh = new THREE.Mesh(domeGeo, goldMat);
      domeMesh.position.y = 1.25;
      lanternGroup.add(domeMesh);

      // Top Finial
      const finialGeo = new THREE.CylinderGeometry(0.12, 0.12, 0.25, 6);
      const finialMesh = new THREE.Mesh(finialGeo, goldMat);
      finialMesh.position.y = 1.6;
      lanternGroup.add(finialMesh);

      // Central Glass Body
      const bodyGeo = new THREE.CylinderGeometry(0.5, 0.42, 1.2, 6);
      const bodyMesh = new THREE.Mesh(bodyGeo, glassMat);
      bodyMesh.position.y = 0.45;
      lanternGroup.add(bodyMesh);

      // Cage struts (decorative frame)
      const cageWireframeGeo = new THREE.CylinderGeometry(0.52, 0.44, 1.22, 6, 1, true);
      const wireMat = new THREE.MeshStandardMaterial({
        color: 0xca8a04,
        metalness: 0.9,
        roughness: 0.25,
        wireframe: true,
      });
      const cageMesh = new THREE.Mesh(cageWireframeGeo, wireMat);
      cageMesh.position.y = 0.45;
      lanternGroup.add(cageMesh);

      // Internal Glowing Core (Flame)
      const flameGeo = new THREE.SphereGeometry(0.18, 16, 16);
      const flameMat = new THREE.MeshBasicMaterial({
        color: 0xfffbeb,
      });
      const flameMesh = new THREE.Mesh(flameGeo, flameMat);
      flameMesh.position.y = 0.45;
      lanternGroup.add(flameMesh);

      // Lantern Light
      const lanternLight = new THREE.PointLight(0xf59e0b, 1.6, 9);
      lanternLight.position.y = 0.45;
      lanternGroup.add(lanternLight);

      // Bottom Base
      const baseGeo = new THREE.CylinderGeometry(0.42, 0.55, 0.35, 6);
      const baseMesh = new THREE.Mesh(baseGeo, goldMat);
      baseMesh.position.y = -0.25;
      lanternGroup.add(baseMesh);

      // Bottom Drop Finial
      const dropGeo = new THREE.ConeGeometry(0.2, 0.35, 6);
      const dropMesh = new THREE.Mesh(dropGeo, goldMat);
      dropMesh.rotation.x = Math.PI;
      dropMesh.position.y = -0.55;
      lanternGroup.add(dropMesh);

      // Store animation metadata
      lanternGroup.userData = {
        baseX: x,
        baseY: y,
        baseZ: z,
        delay,
        floatSpeed: 0.9 + Math.random() * 0.4,
      };

      scene.add(lanternGroup);
      return lanternGroup;
    };

    // Instantiate two graceful lanterns framing the scene
    const lanternLeft = createLantern(-6.2, 2.5, 1.5, 0.75, 0);
    const lanternRight = createLantern(6.5, -0.8, 2.0, 0.85, 2.1);
    const lanternDistant = createLantern(-4.8, -3.2, -3.5, 0.55, 3.8);
    lanternsRef.current = [lanternLeft, lanternRight, lanternDistant];

    // 7. Depth-Based Starfield
    const starCount = 1400;
    const starPositions = new Float32Array(starCount * 3);
    const starColors = new Float32Array(starCount * 3);

    for (let i = 0; i < starCount; i++) {
      const idx = i * 3;
      starPositions[idx] = (Math.random() - 0.5) * 140;
      starPositions[idx + 1] = (Math.random() - 0.5) * 90;
      starPositions[idx + 2] = -25 + (Math.random() - 0.5) * 60;

      // Tint variation: cool white to warm gold
      const isGold = Math.random() > 0.65;
      if (isGold) {
        starColors[idx] = 1.0;
        starColors[idx + 1] = 0.92;
        starColors[idx + 2] = 0.65;
      } else {
        starColors[idx] = 0.92;
        starColors[idx + 1] = 0.96;
        starColors[idx + 2] = 1.0;
      }
    }

    const starGeometry = new THREE.BufferGeometry();
    starGeometry.setAttribute('position', new THREE.BufferAttribute(starPositions, 3));
    starGeometry.setAttribute('color', new THREE.BufferAttribute(starColors, 3));

    const starMaterial = new THREE.PointsMaterial({
      size: 0.22,
      vertexColors: true,
      transparent: true,
      opacity: 0.85,
      blending: THREE.AdditiveBlending,
    });

    const starPoints = new THREE.Points(starGeometry, starMaterial);
    scene.add(starPoints);
    starsRef.current = starPoints;

    // 8. Floating Golden Dust Particles
    const dustCount = 180;
    const dustPositions = new Float32Array(dustCount * 3);
    const dustVelocities: { x: number; y: number; z: number }[] = [];

    for (let i = 0; i < dustCount; i++) {
      const idx = i * 3;
      dustPositions[idx] = (Math.random() - 0.5) * 24;
      dustPositions[idx + 1] = (Math.random() - 0.5) * 18;
      dustPositions[idx + 2] = (Math.random() - 0.5) * 14;

      dustVelocities.push({
        x: (Math.random() - 0.5) * 0.005,
        y: 0.003 + Math.random() * 0.007,
        z: (Math.random() - 0.5) * 0.005,
      });
    }

    const dustGeometry = new THREE.BufferGeometry();
    dustGeometry.setAttribute('position', new THREE.BufferAttribute(dustPositions, 3));

    // Circle texture for soft round particles
    const canvasDot = document.createElement('canvas');
    canvasDot.width = 32;
    canvasDot.height = 32;
    const ctxDot = canvasDot.getContext('2d');
    if (ctxDot) {
      const grad = ctxDot.createRadialGradient(16, 16, 0, 16, 16, 16);
      grad.addColorStop(0, 'rgba(254, 240, 138, 1)');
      grad.addColorStop(0.5, 'rgba(234, 179, 8, 0.6)');
      grad.addColorStop(1, 'rgba(234, 179, 8, 0)');
      ctxDot.fillStyle = grad;
      ctxDot.fillRect(0, 0, 32, 32);
    }
    const dotTexture = new THREE.CanvasTexture(canvasDot);

    const dustMaterial = new THREE.PointsMaterial({
      size: 0.35,
      map: dotTexture,
      transparent: true,
      opacity: 0.7,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });

    const dustPoints = new THREE.Points(dustGeometry, dustMaterial);
    scene.add(dustPoints);
    particlesRef.current = dustPoints;

    // 8B. Soft Cinematic Bokeh Orbs (inspired by outdoor light bokeh)
    const bokehGroup = new THREE.Group();
    const bokehCanvas = document.createElement('canvas');
    bokehCanvas.width = 128;
    bokehCanvas.height = 128;
    const bCtx = bokehCanvas.getContext('2d');
    if (bCtx) {
      const bGrad = bCtx.createRadialGradient(64, 64, 0, 64, 64, 64);
      bGrad.addColorStop(0, 'rgba(254, 240, 138, 0.45)');
      bGrad.addColorStop(0.4, 'rgba(250, 204, 21, 0.2)');
      bGrad.addColorStop(0.75, 'rgba(202, 138, 4, 0.08)');
      bGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
      bCtx.fillStyle = bGrad;
      bCtx.fillRect(0, 0, 128, 128);
    }
    const bokehTex = new THREE.CanvasTexture(bokehCanvas);
    const bokehMat = new THREE.SpriteMaterial({
      map: bokehTex,
      transparent: true,
      blending: THREE.AdditiveBlending,
      opacity: 0.65,
      depthWrite: false,
    });

    const bokehSprites: { sprite: THREE.Sprite; baseX: number; baseY: number; speed: number; phase: number }[] = [];
    for (let b = 0; b < 14; b++) {
      const sprite = new THREE.Sprite(bokehMat);
      const bScale = 1.8 + Math.random() * 2.8;
      sprite.scale.set(bScale, bScale, 1);
      const bx = (Math.random() - 0.5) * 28;
      const by = (Math.random() - 0.5) * 18;
      const bz = -3 + Math.random() * 8;
      sprite.position.set(bx, by, bz);
      bokehGroup.add(sprite);
      bokehSprites.push({
        sprite,
        baseX: bx,
        baseY: by,
        speed: 0.25 + Math.random() * 0.35,
        phase: Math.random() * Math.PI * 2,
      });
    }
    scene.add(bokehGroup);

    // 9. Mouse movement handler
    const handleMouseMove = (e: MouseEvent) => {
      const normX = (e.clientX / window.innerWidth) * 2 - 1;
      const normY = -(e.clientY / window.innerHeight) * 2 + 1;
      mousePos.current.targetX = normX;
      mousePos.current.targetY = normY;
    };

    // Touch movement handler for subtle mobile parallax
    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        const touch = e.touches[0];
        const normX = (touch.clientX / window.innerWidth) * 2 - 1;
        const normY = -(touch.clientY / window.innerHeight) * 2 + 1;
        mousePos.current.targetX = normX * 0.5;
        mousePos.current.targetY = normY * 0.5;
      }
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('touchmove', handleTouchMove, { passive: true });

    // Handle Window Resize
    const handleResize = () => {
      if (!container || !renderer || !camera) return;
      const newWidth = container.clientWidth || window.innerWidth;
      const newHeight = container.clientHeight || window.innerHeight;
      camera.aspect = newWidth / newHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(newWidth, newHeight);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    };
    window.addEventListener('resize', handleResize);

    // 10. Animation Loop
    let clock = new THREE.Clock();

    const animate = () => {
      reqIdRef.current = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      // Smooth mouse lerp
      mousePos.current.x += (mousePos.current.targetX - mousePos.current.x) * 0.05;
      mousePos.current.y += (mousePos.current.targetY - mousePos.current.y) * 0.05;

      // Parallax camera adjustments
      if (cameraRef.current) {
        cameraRef.current.position.x = mousePos.current.x * 0.8;
        cameraRef.current.position.y = mousePos.current.y * 0.5;
        cameraRef.current.lookAt(0, 0, 0);
      }

      // Moon gentle rotation and floating
      if (moonGroupRef.current) {
        moonGroupRef.current.rotation.y = 0.25 + Math.sin(elapsedTime * 0.4) * 0.08;
        moonGroupRef.current.position.y = 1.8 + Math.sin(elapsedTime * 0.6) * 0.15;
      }

      // Lanterns bobbing and swaying
      lanternsRef.current.forEach((lantern) => {
        const u = lantern.userData;
        const t = elapsedTime * u.floatSpeed + u.delay;
        lantern.position.y = u.baseY + Math.sin(t) * 0.28;
        lantern.position.x = u.baseX + Math.cos(t * 0.7) * 0.1;
        lantern.rotation.z = Math.sin(t * 0.8) * 0.06;
        lantern.rotation.y = t * 0.15;
      });

      // Bokeh orbs soft floating and breathing
      bokehSprites.forEach((b) => {
        b.sprite.position.y = b.baseY + Math.sin(elapsedTime * b.speed + b.phase) * 0.45;
        b.sprite.position.x = b.baseX + Math.cos(elapsedTime * (b.speed * 0.7) + b.phase) * 0.25;
      });

      // Starfield slow cosmic drift
      if (starsRef.current) {
        starsRef.current.rotation.y = elapsedTime * 0.012;
      }

      // Floating dust particles upward flow
      if (particlesRef.current) {
        const posAttr = particlesRef.current.geometry.attributes.position as THREE.BufferAttribute;
        const positions = posAttr.array as Float32Array;

        for (let i = 0; i < dustCount; i++) {
          const idx = i * 3;
          positions[idx + 1] += dustVelocities[i].y;
          positions[idx] += dustVelocities[i].x;

          // Recycle particle when it goes too high
          if (positions[idx + 1] > 10) {
            positions[idx + 1] = -10;
            positions[idx] = (Math.random() - 0.5) * 24;
          }
        }
        posAttr.needsUpdate = true;
      }

      renderer.render(scene, camera);
    };

    animate();

    // Cleanup
    return () => {
      if (reqIdRef.current) cancelAnimationFrame(reqIdRef.current);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('resize', handleResize);

      if (renderer.domElement && container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
      scene.clear();
    };
  }, []);

  // Choreograph moon and camera positions based on current step
  useEffect(() => {
    if (!moonGroupRef.current || !cameraRef.current) return;

    const isMobile = window.innerWidth < 768;

    if (currentStep === 'welcome') {
      // Welcome Page: Moon prominent in upper right / center
      moonGroupRef.current.position.set(isMobile ? 0 : 3.4, isMobile ? 3.0 : 1.9, isMobile ? -3.5 : -2.5);
      moonGroupRef.current.scale.set(1, 1, 1);
      if (lanternsRef.current[0]) lanternsRef.current[0].position.set(isMobile ? -3.2 : -6.2, 2.5, 1.5);
      if (lanternsRef.current[1]) lanternsRef.current[1].position.set(isMobile ? 3.4 : 6.5, -0.8, 2.0);
    } else if (currentStep === 'dua') {
      // Dua Page: Moon slightly elevated and softer behind the center card
      moonGroupRef.current.position.set(isMobile ? 0 : 2.0, isMobile ? 3.6 : 3.2, -4.5);
      moonGroupRef.current.scale.set(0.92, 0.92, 0.92);
      // Lanterns frame wider
      if (lanternsRef.current[0]) lanternsRef.current[0].position.set(isMobile ? -3.8 : -7.5, 1.8, 0.5);
      if (lanternsRef.current[1]) lanternsRef.current[1].position.set(isMobile ? 3.8 : 7.6, -1.2, 0.5);
    } else if (currentStep === 'final') {
      // Final Page: Moon grander, centered higher
      moonGroupRef.current.position.set(0, isMobile ? 2.8 : 2.4, isMobile ? -2.2 : -1.8);
      moonGroupRef.current.scale.set(1.15, 1.15, 1.15);
      if (lanternsRef.current[0]) lanternsRef.current[0].position.set(isMobile ? -3.0 : -5.8, 1.5, 1.0);
      if (lanternsRef.current[1]) lanternsRef.current[1].position.set(isMobile ? 3.0 : 5.8, 1.2, 1.0);
    }
  }, [currentStep]);

  // Glow Boost effect (when user clicks "Read Again 🤲")
  useEffect(() => {
    if (!moonLightRef.current) return;
    if (glowBoost) {
      moonLightRef.current.intensity = 4.0;
      const timeout = setTimeout(() => {
        if (moonLightRef.current) {
          moonLightRef.current.intensity = 2.2;
        }
      }, 1600);
      return () => clearTimeout(timeout);
    }
  }, [glowBoost]);

  if (!webGLSupported) {
    return null; // Will trigger FallbackCanvas in parent
  }

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 pointer-events-none z-0 overflow-hidden"
      aria-hidden="true"
    />
  );
};
