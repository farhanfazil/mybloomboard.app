"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

export default function RubiksCube({ className }: { className?: string }) {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = mountRef.current;
    if (!el) return;

    /* ── Renderer ── */
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(el.clientWidth, el.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.1;
    el.appendChild(renderer.domElement);

    /* ── Scene & camera ── */
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(38, el.clientWidth / el.clientHeight, 0.1, 100);
    camera.position.set(5.5, 4.0, 7.5);
    camera.lookAt(0, 0, 0);

    /* ── Environment: give metallic surface something to reflect ── */
    const pmrem = new THREE.PMREMGenerator(renderer);
    pmrem.compileEquirectangularShader();

    // Build a tiny env scene with bright patches so the metal reflects them
    const envScene = new THREE.Scene();
    // Dark background sphere
    envScene.add(new THREE.Mesh(
      new THREE.SphereGeometry(10, 16, 16),
      new THREE.MeshBasicMaterial({ color: 0x080808, side: THREE.BackSide }),
    ));
    // Bright top-right patch (key highlight)
    const addPatch = (color: number, x: number, y: number, z: number, r = 0.9) => {
      const m = new THREE.Mesh(
        new THREE.SphereGeometry(r, 12, 12),
        new THREE.MeshBasicMaterial({ color }),
      );
      m.position.set(x, y, z);
      envScene.add(m);
    };
    addPatch(0xffffff, 5,  9,  4, 1.4);   // main key — white
    addPatch(0x7799ff, -7, 1,  4, 1.0);   // blue fill
    addPatch(0x442200,  2, -6, -4, 0.7);  // warm rim
    const envTex = pmrem.fromScene(envScene).texture;
    scene.environment = envTex;
    pmrem.dispose();

    /* ── Lights ── */
    scene.add(new THREE.AmbientLight(0xffffff, 0.25));

    // Key spot — sharp highlight from top-right
    const key = new THREE.SpotLight(0xffffff, 120, 60, Math.PI / 6, 0.35, 1.0);
    key.position.set(9, 14, 10);
    key.castShadow = true;
    key.shadow.mapSize.set(2048, 2048);
    key.shadow.bias = -0.001;
    scene.add(key);
    scene.add(key.target);

    // Blue fill
    const fill = new THREE.PointLight(0x5577cc, 30, 35);
    fill.position.set(-9, 3, 6);
    scene.add(fill);

    // Rim
    const rim = new THREE.PointLight(0xffffff, 20, 25);
    rim.position.set(3, -6, -5);
    scene.add(rim);

    // Front bounce — makes sure cube reads on dark bg
    const bounce = new THREE.PointLight(0xffffff, 15, 22);
    bounce.position.set(0, 2, 12);
    scene.add(bounce);

    /* ── Shadow ground ── */
    const ground = new THREE.Mesh(
      new THREE.PlaneGeometry(30, 30),
      new THREE.ShadowMaterial({ opacity: 0.5 }),
    );
    ground.rotation.x = -Math.PI / 2;
    ground.position.y  = -4.2;
    ground.receiveShadow = true;
    scene.add(ground);

    /* ── Cubie factory ── */
    const GAP  = 0.10;
    const STEP = 1 + GAP;

    const makeMat = () =>
      new THREE.MeshPhysicalMaterial({
        color:              0x1e1e1e,   // dark charcoal — visible but moody
        roughness:          0.18,
        metalness:          0.90,
        clearcoat:          1.0,
        clearcoatRoughness: 0.08,
        envMapIntensity:    1.8,
      });

    const group = new THREE.Group();
    scene.add(group);

    for (let xi = -1; xi <= 1; xi++) {
      for (let yi = -1; yi <= 1; yi++) {
        for (let zi = -1; zi <= 1; zi++) {
          // Slightly rounded box via segments — gives chamfered-edge look
          const geo = new THREE.BoxGeometry(0.92, 0.92, 0.92);
          const mats = Array.from({ length: 6 }, () => makeMat());
          const mesh = new THREE.Mesh(geo, mats);
          mesh.position.set(xi * STEP, yi * STEP, zi * STEP);
          mesh.castShadow    = true;
          mesh.receiveShadow = true;
          group.add(mesh);
        }
      }
    }

    /* ── Mouse parallax ── */
    const mouse = { x: 0, y: 0 };
    const target = { x: 0, y: 0 };
    const onMouseMove = (e: MouseEvent) => {
      mouse.x = (e.clientX / window.innerWidth  - 0.5) * 2;
      mouse.y = (e.clientY / window.innerHeight - 0.5) * 2;
    };
    window.addEventListener("mousemove", onMouseMove);

    /* ── Resize ── */
    const onResize = () => {
      if (!el) return;
      camera.aspect = el.clientWidth / el.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(el.clientWidth, el.clientHeight);
    };
    window.addEventListener("resize", onResize);

    /* ── Animate ── */
    const clock = new THREE.Clock();
    let animId: number;

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const t = clock.getElapsedTime();

      // Smooth mouse lerp
      target.x += (mouse.x - target.x) * 0.04;
      target.y += (mouse.y - target.y) * 0.04;

      // Base auto-rotation
      group.rotation.y += 0.003;
      group.rotation.x += 0.001;

      // Mouse influence
      group.rotation.y += target.x * 0.006;
      group.rotation.x += target.y * 0.006;

      // Floating bob
      group.position.y = Math.sin(t * 0.7) * 0.22;

      renderer.render(scene, camera);
    };

    animate();

    /* ── Cleanup ── */
    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("resize", onResize);
      envTex.dispose();
      renderer.dispose();
      if (el.contains(renderer.domElement)) el.removeChild(renderer.domElement);
    };
  }, []);

  return <div ref={mountRef} className={className} style={{ width: "100%", height: "100%" }} />;
}
