"use client";

import React, { useEffect, useRef } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { HornTorusFamiliaModel, COLOR_PALETTE } from "@/lib/hornTorusMath";

interface ThreeViewerProps {
  model: HornTorusFamiliaModel;
  viewMode: "half" | "full";
  colorMode: "neutral" | "angustia";
  curveStyle: "section4" | "motor" | "none";
  showDeformation: boolean;
  showMarkers: boolean;
  autoRotate?: boolean;
}

export const ThreeViewer: React.FC<ThreeViewerProps> = ({
  model,
  viewMode,
  colorMode,
  curveStyle,
  showDeformation,
  showMarkers,
  autoRotate = false,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const controlsRef = useRef<OrbitControls | null>(null);
  const animFrameIdRef = useRef<number | null>(null);
  const meshGroupRef = useRef<THREE.Group | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // 1. Scene setup
    const scene = new THREE.Scene();
    scene.background = new THREE.Color("#090d16");
    sceneRef.current = scene;

    // 2. Camera setup
    const width = container.clientWidth || 800;
    const height = container.clientHeight || 600;
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.set(40, 35, 45);

    // 3. Renderer setup
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: "high-performance" });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    container.innerHTML = "";
    container.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // 4. OrbitControls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.maxDistance = 250;
    controls.minDistance = 5;
    controls.autoRotate = autoRotate;
    controls.autoRotateSpeed = 1.0;
    controlsRef.current = controls;

    // 5. Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.2);
    scene.add(ambientLight);

    const dirLight1 = new THREE.DirectionalLight(0xffffff, 2.0);
    dirLight1.position.set(30, 45, 30);
    scene.add(dirLight1);

    const dirLight2 = new THREE.DirectionalLight(0x90b0e0, 1.2);
    dirLight2.position.set(-30, -25, -20);
    scene.add(dirLight2);

    const dirLight3 = new THREE.DirectionalLight(0xffffff, 0.8);
    dirLight3.position.set(0, 30, -30);
    scene.add(dirLight3);

    // Grid helper subtle
    const grid = new THREE.GridHelper(60, 30, 0x1e293b, 0x0f172a);
    grid.position.y = -model.r - 2;
    scene.add(grid);

    // Mesh group
    const meshGroup = new THREE.Group();
    scene.add(meshGroup);
    meshGroupRef.current = meshGroup;

    // Render loop
    const animate = () => {
      animFrameIdRef.current = requestAnimationFrame(animate);
      controls.update();
      renderer.render(scene, camera);
    };
    animate();

    // Resize observer
    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width: w, height: h } = entry.contentRect;
        if (w === 0 || h === 0) continue;
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
        renderer.setSize(w, h);
      }
    });
    resizeObserver.observe(container);

    return () => {
      resizeObserver.disconnect();
      if (animFrameIdRef.current) cancelAnimationFrame(animFrameIdRef.current);
      controls.dispose();
      renderer.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  // Dynamically update autoRotate on orbit controls
  useEffect(() => {
    if (controlsRef.current) {
      controlsRef.current.autoRotate = autoRotate;
      controlsRef.current.autoRotateSpeed = 1.0;
    }
  }, [autoRotate]);

  // Re-build geometry when model or view settings change
  useEffect(() => {
    const meshGroup = meshGroupRef.current;
    if (!meshGroup) return;

    // Clear previous children
    while (meshGroup.children.length > 0) {
      const child = meshGroup.children[0];
      meshGroup.remove(child);
      if (child instanceof THREE.Mesh) {
        child.geometry.dispose();
        if (Array.isArray(child.material)) {
          child.material.forEach((m) => m.dispose());
        } else {
          child.material.dispose();
        }
      } else if (child instanceof THREE.Line) {
        child.geometry.dispose();
        child.material.dispose();
      }
    }

    // 1. Torus Parametric Surface
    const uSegments = 100;
    const vSegments = 50;
    const vMax = viewMode === "half" ? Math.PI : 2 * Math.PI;

    const positions: number[] = [];
    const normals: number[] = [];
    const colors: number[] = [];
    const indices: number[] = [];

    const tempColors: THREE.Color[] = [];
    const colorNormal = new THREE.Color("#94a3b8");
    const colorRupture = new THREE.Color("#dc2626");
    const colorModerate = new THREE.Color("#f59e0b");

    for (let j = 0; j <= vSegments; j++) {
      const v = (j / vSegments) * vMax;
      for (let i = 0; i <= uSegments; i++) {
        const u = (i / uSegments) * 2 * Math.PI;

        let [x, y, z] = model.punto(u, v);
        if (showDeformation) {
          const { factor } = model.computeSclDeformation(u, v);
          x *= factor;
          y *= factor;
          z *= 1.0 + (factor - 1.0) * 0.85;
        }

        positions.push(x, z, -y); // Three.js Y is up, standard math Z is up

        // Normal computation
        const rad = model.R + model.r * Math.cos(v);
        const nx = Math.cos(v) * Math.cos(u);
        const ny = Math.cos(v) * Math.sin(u);
        const nz = Math.sin(v);
        normals.push(nx, nz, -ny);

        // Vertex color
        if (colorMode === "angustia") {
          const angustia = model.calculateAngustia(u, v);
          if (angustia <= model.A_cr) {
            // High anxiety / rupture zone
            const t = Math.max(0, Math.min(1, angustia / model.A_cr));
            const c = colorRupture.clone().lerp(colorModerate, t);
            colors.push(c.r, c.g, c.b);
          } else {
            const t = Math.min(1, (angustia - model.A_cr) / 2.0);
            const c = colorModerate.clone().lerp(colorNormal, t);
            colors.push(c.r, c.g, c.b);
          }
        } else {
          // Subtle neutral tone
          const depthShade = 0.65 + 0.35 * Math.sin(v);
          colors.push(
            colorNormal.r * depthShade,
            colorNormal.g * depthShade,
            colorNormal.b * depthShade
          );
        }
      }
    }

    for (let j = 0; j < vSegments; j++) {
      for (let i = 0; i < uSegments; i++) {
        const a = j * (uSegments + 1) + i;
        const b = (j + 1) * (uSegments + 1) + i;
        const c = (j + 1) * (uSegments + 1) + (i + 1);
        const d = j * (uSegments + 1) + (i + 1);

        indices.push(a, b, d);
        indices.push(b, c, d);
      }
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
    geometry.setAttribute("normal", new THREE.Float32BufferAttribute(normals, 3));
    geometry.setAttribute("color", new THREE.Float32BufferAttribute(colors, 3));
    geometry.setIndex(indices);
    geometry.computeVertexNormals();

    const surfaceMaterial = new THREE.MeshStandardMaterial({
      vertexColors: true,
      side: THREE.DoubleSide,
      roughness: 0.35,
      metalness: 0.15,
      transparent: true,
      opacity: viewMode === "half" ? 0.75 : 0.60,
      depthWrite: true,
    });

    const torusMesh = new THREE.Mesh(geometry, surfaceMaterial);
    meshGroup.add(torusMesh);

    // 2. Interior braided / motor curves
    if (curveStyle !== "none") {
      const curves =
        curveStyle === "section4"
          ? model.getSection4Curves(360)
          : model.getMotorCurves(360);

      const addCurveLine = (pts: [number, number, number][], colorHex: string, lineWidth: number = 3) => {
        const linePoints = pts.map(([x, y, z]) => new THREE.Vector3(x, z, -y));
        const lineGeo = new THREE.BufferGeometry().setFromPoints(linePoints);
        const lineMat = new THREE.LineBasicMaterial({
          color: new THREE.Color(colorHex),
          linewidth: lineWidth,
          depthTest: true,
        });
        const line = new THREE.Line(lineGeo, lineMat);
        meshGroup.add(line);
      };

      if (curveStyle === "section4") {
        const s4 = model.getSection4Curves(360);
        addCurveLine(s4.S, COLOR_PALETTE.S, 4);
        addCurveLine(s4.I, COLOR_PALETTE.I, 4);
        addCurveLine(s4.Pulsion, COLOR_PALETTE.Pulsion, 3);
        addCurveLine(s4.Sigma, COLOR_PALETTE.Sigma, 4);
        addCurveLine(s4.lambdaInt, COLOR_PALETTE.voz, 5);
      } else {
        const mc = model.getMotorCurves(360);
        addCurveLine(mc.S, COLOR_PALETTE.S, 4);
        addCurveLine(mc.I, COLOR_PALETTE.I, 4);
        addCurveLine(mc.Pulsion, COLOR_PALETTE.Pulsion, 3);
        addCurveLine(mc.Sigma, COLOR_PALETTE.Sigma, 4);
      }
    }

    // 3. Markers: Fantasy, Trauma, The Voice
    if (showMarkers) {
      const s4 = model.getSection4Curves(60);

      // Fantasy Point (Cube / square)
      const fantGeo = new THREE.BoxGeometry(0.8, 0.8, 0.8);
      const fantMat = new THREE.MeshStandardMaterial({
        color: COLOR_PALETTE.fant,
        emissive: 0xd81b8c,
        emissiveIntensity: 0.6,
        roughness: 0.2,
      });
      const fantMesh = new THREE.Mesh(fantGeo, fantMat);
      fantMesh.position.set(s4.fantasyPoint[0], s4.fantasyPoint[2], -s4.fantasyPoint[1]);
      meshGroup.add(fantMesh);

      // Trauma Point (Octahedron / diamond)
      const traumaGeo = new THREE.OctahedronGeometry(0.7);
      const traumaMat = new THREE.MeshStandardMaterial({
        color: COLOR_PALETTE.trauma,
        emissive: 0xef6c00,
        emissiveIntensity: 0.6,
        roughness: 0.2,
      });
      const traumaMesh = new THREE.Mesh(traumaGeo, traumaMat);
      traumaMesh.position.set(s4.traumaPoint[0], s4.traumaPoint[2], -s4.traumaPoint[1]);
      meshGroup.add(traumaMesh);

      // The Voice / Self-tangency point at origin
      const voiceGeo = new THREE.SphereGeometry(model.es_limite ? 0.65 : 0.45, 24, 24);
      const voiceMat = new THREE.MeshStandardMaterial({
        color: 0xffffff,
        emissive: 0x60a5fa,
        emissiveIntensity: 0.8,
        roughness: 0.1,
      });
      const voiceMesh = new THREE.Mesh(voiceGeo, voiceMat);
      voiceMesh.position.set(0, 0, 0);
      meshGroup.add(voiceMesh);

      // Inner boundary circle (λ_int) indicator when r < R
      if (!model.es_limite) {
        const ringGeo = new THREE.RingGeometry(model.radio_agujero - 0.05, model.radio_agujero + 0.05, 64);
        const ringMat = new THREE.MeshBasicMaterial({
          color: 0x38bdf8,
          side: THREE.DoubleSide,
          transparent: true,
          opacity: 0.45,
        });
        const ringMesh = new THREE.Mesh(ringGeo, ringMat);
        ringMesh.rotation.x = Math.PI / 2;
        meshGroup.add(ringMesh);
      }
    }
  }, [model, viewMode, colorMode, curveStyle, showDeformation, showMarkers]);

  return (
    <div className="relative w-full h-full min-h-[460px] rounded-xl overflow-hidden bg-slate-950 border border-slate-800">
      <div ref={containerRef} className="w-full h-full cursor-grab active:cursor-grabbing" />
      <div className="absolute top-3 left-3 pointer-events-none flex flex-col gap-1 bg-slate-900/80 backdrop-blur-md px-3 py-2 rounded-lg border border-slate-800 text-xs">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-slate-200">r/R = {model.r_over_R.toFixed(3)}</span>
          <span
            className={`px-1.5 py-0.5 rounded text-[10px] font-medium ${
              model.es_limite
                ? "bg-amber-500/20 text-amber-300 border border-amber-500/40"
                : "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40"
            }`}
          >
            {model.es_limite ? "Límite: Horn Torus" : "Toro Liso"}
          </span>
        </div>
        <div className="text-[11px] text-slate-400">
          Radio agujero R − r: <span className="font-mono text-slate-200">{model.radio_agujero.toFixed(3)}</span>
        </div>
      </div>

      {autoRotate && (
        <div className="absolute top-3 right-3 pointer-events-none flex items-center gap-1.5 bg-indigo-950/85 backdrop-blur-md px-2.5 py-1 rounded-lg border border-indigo-500/40 text-[11px] text-indigo-200">
          <span className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse" />
          <span>Auto-rotación activa</span>
        </div>
      )}

      <div className="absolute bottom-3 left-3 pointer-events-none bg-slate-900/85 backdrop-blur-md px-3 py-2 rounded-lg border border-slate-800 text-[11px] text-slate-300 flex flex-wrap gap-x-3 gap-y-1">
        <span className="flex items-center gap-1">
          <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: COLOR_PALETTE.S }} />
          <span>S (Significante)</span>
        </span>
        <span className="flex items-center gap-1">
          <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: COLOR_PALETTE.I }} />
          <span>I (Imagen)</span>
        </span>
        <span className="flex items-center gap-1">
          <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: COLOR_PALETTE.Pulsion }} />
          <span>Hilo Pulsional</span>
        </span>
        <span className="flex items-center gap-1">
          <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: COLOR_PALETTE.Sigma }} />
          <span>Σ (Síntoma)</span>
        </span>
        <span className="flex items-center gap-1">
          <span className="w-2 h-2 rounded-none" style={{ backgroundColor: COLOR_PALETTE.fant }} />
          <span>Fantasía</span>
        </span>
        <span className="flex items-center gap-1">
          <span className="w-2 h-2 rotate-45" style={{ backgroundColor: COLOR_PALETTE.trauma }} />
          <span>Trauma</span>
        </span>
        <span className="flex items-center gap-1">
          <span className="w-2 h-2 rounded-full border border-white bg-black" />
          <span>La Voz (0,0,0)</span>
        </span>
      </div>

      <div className="absolute bottom-3 right-3 pointer-events-none text-[10px] text-slate-500 bg-slate-900/60 px-2 py-1 rounded">
        Arrastrar: rotar · Scroll: zoom · Shift+Arrastrar: desplazar
      </div>
    </div>
  );
};
