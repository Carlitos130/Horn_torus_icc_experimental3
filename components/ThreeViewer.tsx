"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { HornTorusFamiliaModel, COLOR_PALETTE } from "@/lib/hornTorusMath";
import { Crosshair, Pin, PinOff, Info, Sparkles } from "lucide-react";

interface ThreeViewerProps {
  model: HornTorusFamiliaModel;
  viewMode: "half" | "full";
  colorMode: "neutral" | "angustia";
  curveStyle: "section4" | "motor" | "none";
  showDeformation: boolean;
  showMarkers: boolean;
  autoRotate?: boolean;
}

interface TooltipInfo {
  type: "surface" | "marker" | "curve";
  title: string;
  subtitle?: string;
  badge?: string;
  color?: string;
  coords: { x: number; y: number; z: number };
  parametric?: {
    uRad: number;
    uDeg: number;
    vRad: number;
    vDeg: number;
    rho: number;
    region: string;
    angustia?: number;
    isCritical?: boolean;
    sclFactor?: number;
  };
  details?: string;
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
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const controlsRef = useRef<OrbitControls | null>(null);
  const animFrameIdRef = useRef<number | null>(null);
  const meshGroupRef = useRef<THREE.Group | null>(null);
  const hoverReticleRef = useRef<THREE.Group | null>(null);

  // Tooltip & Inspection state
  const [enableTooltips, setEnableTooltips] = useState(true);
  const [tooltipData, setTooltipData] = useState<TooltipInfo | null>(null);
  const [tooltipPos, setTooltipPos] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isPinned, setIsPinned] = useState(false);
  const isDraggingRef = useRef(false);
  const dragStartPosRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

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
    cameraRef.current = camera;

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

    // 6. 3D Hover Reticle
    const hoverGroup = new THREE.Group();
    hoverGroup.visible = false;

    // Inner glowing sphere
    const sphereGeo = new THREE.SphereGeometry(0.25, 16, 16);
    const sphereMat = new THREE.MeshBasicMaterial({ color: 0x38bdf8 });
    const innerSphere = new THREE.Mesh(sphereGeo, sphereMat);
    hoverGroup.add(innerSphere);

    // Outer ring
    const ringGeo = new THREE.RingGeometry(0.4, 0.55, 32);
    const ringMat = new THREE.MeshBasicMaterial({
      color: 0x38bdf8,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.85,
    });
    const outerRing = new THREE.Mesh(ringGeo, ringMat);
    hoverGroup.add(outerRing);

    scene.add(hoverGroup);
    hoverReticleRef.current = hoverGroup;

    // Render loop
    const animate = () => {
      animFrameIdRef.current = requestAnimationFrame(animate);
      controls.update();

      // Make outer ring look at camera
      if (hoverGroup.visible && camera) {
        outerRing.lookAt(camera.position);
      }

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
    torusMesh.userData = {
      type: "surface",
      title: model.es_limite ? "Superficie: Horn Torus (r = R)" : "Superficie: Toroide Liso (r < R)",
      badge: "Superficie Paramétrica",
      color: "#38bdf8",
    };
    meshGroup.add(torusMesh);

    // 2. Interior braided / motor curves
    if (curveStyle !== "none") {
      const addCurveLine = (
        pts: [number, number, number][],
        colorHex: string,
        name: string,
        badge: string,
        description: string,
        lineWidth: number = 3
      ) => {
        const linePoints = pts.map(([x, y, z]) => new THREE.Vector3(x, z, -y));
        const lineGeo = new THREE.BufferGeometry().setFromPoints(linePoints);
        const lineMat = new THREE.LineBasicMaterial({
          color: new THREE.Color(colorHex),
          linewidth: lineWidth,
          depthTest: true,
        });
        const line = new THREE.Line(lineGeo, lineMat);
        line.userData = {
          type: "curve",
          title: name,
          badge,
          color: colorHex,
          details: description,
        };
        meshGroup.add(line);
      };

      if (curveStyle === "section4") {
        const s4 = model.getSection4Curves(360);
        addCurveLine(s4.S, COLOR_PALETTE.S, "Curva S (Significante)", "Lazo Simbólico", "Cadena significante en el toroide", 4);
        addCurveLine(s4.I, COLOR_PALETTE.I, "Curva I (Imagen)", "Lazo Imaginario", "Bucle especular del registro imaginario", 4);
        addCurveLine(s4.Pulsion, COLOR_PALETTE.Pulsion, "Hilo Pulsional (Toroide Interior)", "Pulsión", "Trayectoria helicoidal pulsional circundante", 3);
        addCurveLine(s4.Sigma, COLOR_PALETTE.Sigma, "Curva Σ (Síntoma / Sinthome)", "Anudamiento", "Sinthome estabilizador de la estructura RSI", 4);
        addCurveLine(s4.lambdaInt, COLOR_PALETTE.voz, "Círculo Interior (Voz)", "Auto-tangencia", "Círculo central de contacto y auto-tangencia", 5);
      } else {
        const mc = model.getMotorCurves(360);
        addCurveLine(mc.S, COLOR_PALETTE.S, "Curva Motor S (Significante)", "Dinámica", "Flujo motor de la cadena significante", 4);
        addCurveLine(mc.I, COLOR_PALETTE.I, "Curva Motor I (Imagen)", "Dinámica", "Flujo motor del registro imaginario", 4);
        addCurveLine(mc.Pulsion, COLOR_PALETTE.Pulsion, "Hilo Pulsional Motor", "Dinámica", "Circulación pulsional dinámica", 3);
        addCurveLine(mc.Sigma, COLOR_PALETTE.Sigma, "Curva Motor Σ (Síntoma)", "Dinámica", "Dinámica sintomática de estabilización", 4);
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
      fantMesh.userData = {
        type: "marker",
        title: "Punto de Fantasía ($ ◊ a)",
        badge: "Punto Singular",
        color: COLOR_PALETTE.fant,
        coords: { x: s4.fantasyPoint[0], y: s4.fantasyPoint[1], z: s4.fantasyPoint[2] },
        details: "Corte interior de la estructura y fijación fantasmática del sujeto dividido ($) con el objeto a.",
      };
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
      traumaMesh.userData = {
        type: "marker",
        title: "Punto de Trauma",
        badge: "Punto Singular",
        color: COLOR_PALETTE.trauma,
        coords: { x: s4.traumaPoint[0], y: s4.traumaPoint[1], z: s4.traumaPoint[2] },
        details: "Nódulo de discontinuidad pulsional e impacto de lo Real sin mediación simbólica.",
      };
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
      voiceMesh.userData = {
        type: "marker",
        title: "La Voz (Auto-tangencia)",
        badge: "Singularidad Central",
        color: "#60a5fa",
        coords: { x: 0, y: 0, z: 0 },
        details: "Punto de auto-tangencia en el origen (0, 0, 0) donde se tocan los polos opuestos del horn torus.",
      };
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
        ringMesh.userData = {
          type: "marker",
          title: "Anillo Interior (λ_int)",
          badge: "Frontera Central",
          color: "#38bdf8",
          coords: { x: model.radio_agujero, y: 0, z: 0 },
          details: `Límite del agujero central. Radio actual: ${model.radio_agujero.toFixed(3)} (colapsa a 0 cuando r → R).`,
        };
        meshGroup.add(ringMesh);
      }
    }
  }, [model, viewMode, colorMode, curveStyle, showDeformation, showMarkers]);

  // Raycaster hover handler
  const handlePointerMove = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      if (!enableTooltips || isPinned) return;
      if (isDraggingRef.current) {
        // Hide tooltip while actively rotating / panning
        return;
      }

      const container = containerRef.current;
      const camera = cameraRef.current;
      const meshGroup = meshGroupRef.current;
      const hoverReticle = hoverReticleRef.current;
      if (!container || !camera || !meshGroup) return;

      const rect = container.getBoundingClientRect();
      const clientX = e.clientX;
      const clientY = e.clientY;
      const mouseX = ((clientX - rect.left) / rect.width) * 2 - 1;
      const mouseY = -((clientY - rect.top) / rect.height) * 2 + 1;

      const raycaster = new THREE.Raycaster();
      raycaster.params.Line = { threshold: 0.6 };
      raycaster.setFromCamera(new THREE.Vector2(mouseX, mouseY), camera);

      const intersects = raycaster.intersectObjects(meshGroup.children, true);

      if (intersects.length > 0) {
        // Prioritize markers over surface if multiple hits
        let hit = intersects[0];
        const markerHit = intersects.find((h) => h.object.userData?.type === "marker");
        if (markerHit) {
          hit = markerHit;
        }

        const obj = hit.object;
        const point = hit.point;

        // Mathematical coordinates: Three.js (x, z, -y) -> Math (x, y, z)
        const mathX = point.x;
        const mathY = -point.z;
        const mathZ = point.y;

        // Torus parametric coords:
        const r_xy = Math.sqrt(mathX * mathX + mathY * mathY);
        let uRad = Math.atan2(mathY, mathX);
        if (uRad < 0) uRad += 2 * Math.PI;
        const uDeg = (uRad * 180) / Math.PI;

        const vRad = Math.atan2(mathZ, r_xy - model.R);
        const vDeg = (vRad * 180) / Math.PI;

        const rho = Math.sqrt(mathX * mathX + mathY * mathY + mathZ * mathZ);
        const region = r_xy < model.R ? "Embudo Interior (Garganta)" : "Ecuador / Corona Exterior";

        const angustia = model.calculateAngustia(uRad, vRad);
        const isCritical = angustia <= model.A_cr;
        const sclFactor = showDeformation ? model.computeSclDeformation(uRad, vRad).factor : undefined;

        // Position 3D reticle
        if (hoverReticle) {
          hoverReticle.position.copy(point);
          hoverReticle.visible = true;
        }

        const userData = obj.userData || {};
        const info: TooltipInfo = {
          type: userData.type || "surface",
          title: userData.title || "Superficie Toroide",
          badge: userData.badge || (userData.type === "marker" ? "Marcador" : "Superficie 3D"),
          color: userData.color || "#38bdf8",
          coords: userData.coords || { x: mathX, y: mathY, z: mathZ },
          details: userData.details,
          parametric: {
            uRad,
            uDeg,
            vRad,
            vDeg,
            rho,
            region,
            angustia,
            isCritical,
            sclFactor,
          },
        };

        setTooltipData(info);
        setTooltipPos({
          x: clientX - rect.left,
          y: clientY - rect.top,
        });
      } else {
        if (!isPinned) {
          setTooltipData(null);
          if (hoverReticle) hoverReticle.visible = false;
        }
      }
    },
    [enableTooltips, isPinned, model, showDeformation]
  );

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    isDraggingRef.current = false;
    dragStartPosRef.current = { x: e.clientX, y: e.clientY };
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    const dx = Math.abs(e.clientX - dragStartPosRef.current.x);
    const dy = Math.abs(e.clientY - dragStartPosRef.current.y);
    if (dx > 4 || dy > 4) {
      isDraggingRef.current = true;
    } else {
      isDraggingRef.current = false;
      // Click without drag: toggle pin if we have tooltip data
      if (tooltipData && enableTooltips) {
        setIsPinned((prev) => !prev);
      }
    }
  };

  const handlePointerLeave = () => {
    if (!isPinned) {
      setTooltipData(null);
      if (hoverReticleRef.current) {
        hoverReticleRef.current.visible = false;
      }
    }
    isDraggingRef.current = false;
  };

  return (
    <div
      className="relative w-full h-full min-h-[460px] rounded-xl overflow-hidden bg-slate-950 border border-slate-800 select-none"
      onPointerMove={handlePointerMove}
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
      onPointerLeave={handlePointerLeave}
    >
      <div ref={containerRef} className="w-full h-full cursor-grab active:cursor-grabbing" />

      {/* Top Left: Model Diagnostic Header */}
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

      {/* Top Right: Controls & Auto-Rotate Indicator */}
      <div className="absolute top-3 right-3 flex items-center gap-2 z-20">
        <button
          id="tooltip-toggle-button"
          type="button"
          onClick={() => {
            const next = !enableTooltips;
            setEnableTooltips(next);
            if (!next) {
              setTooltipData(null);
              setIsPinned(false);
              if (hoverReticleRef.current) hoverReticleRef.current.visible = false;
            }
          }}
          className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-[11px] backdrop-blur-md transition-all ${
            enableTooltips
              ? "bg-sky-950/80 text-sky-200 border-sky-500/50 hover:bg-sky-900/80"
              : "bg-slate-900/70 text-slate-400 border-slate-700/60 hover:bg-slate-800/80"
          }`}
          title="Activar/desactivar tooltips y lectura de coordenadas al pasar el cursor"
        >
          <Crosshair className={`w-3.5 h-3.5 ${enableTooltips ? "text-sky-400" : "text-slate-400"}`} />
          <span>Coordenadas {enableTooltips ? "ON" : "OFF"}</span>
        </button>

        {autoRotate && (
          <div className="pointer-events-none flex items-center gap-1.5 bg-indigo-950/85 backdrop-blur-md px-2.5 py-1 rounded-lg border border-indigo-500/40 text-[11px] text-indigo-200">
            <span className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse" />
            <span>Auto-rotación</span>
          </div>
        )}
      </div>

      {/* Floating 3D Coordinate Tooltip Card */}
      {enableTooltips && tooltipData && (
        <div
          id="three-viewer-tooltip"
          className="absolute z-30 pointer-events-auto bg-slate-950/95 backdrop-blur-md border border-slate-700/80 shadow-2xl rounded-xl p-3 text-xs text-slate-200 w-72 max-w-[calc(100%-24px)] transition-transform duration-75"
          style={{
            left: Math.min(Math.max(tooltipPos.x + 14, 12), (containerRef.current?.clientWidth || 600) - 300),
            top: Math.min(Math.max(tooltipPos.y - 20, 12), (containerRef.current?.clientHeight || 450) - 220),
          }}
        >
          {/* Header */}
          <div className="flex items-start justify-between gap-2 border-b border-slate-800 pb-2 mb-2.5">
            <div className="flex items-center gap-2">
              <span
                className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                style={{ backgroundColor: tooltipData.color || "#38bdf8" }}
              />
              <div>
                <div className="font-semibold text-slate-100 text-xs leading-tight">
                  {tooltipData.title}
                </div>
                {tooltipData.badge && (
                  <span className="text-[10px] text-slate-400 font-mono">
                    {tooltipData.badge}
                  </span>
                )}
              </div>
            </div>

            <button
              type="button"
              onClick={() => setIsPinned((prev) => !prev)}
              className={`p-1 rounded transition-colors ${
                isPinned
                  ? "bg-amber-500/20 text-amber-300 border border-amber-500/40"
                  : "bg-slate-800 text-slate-400 hover:text-slate-200"
              }`}
              title={isPinned ? "Desanclar tooltip" : "Fijar tooltip"}
            >
              {isPinned ? <Pin className="w-3 h-3 text-amber-400" /> : <PinOff className="w-3 h-3" />}
            </button>
          </div>

          {/* Coordinates in Math Space (x, y, z) */}
          <div className="bg-slate-900/90 rounded-lg p-2 border border-slate-800 mb-2">
            <div className="text-[10px] uppercase tracking-wider text-slate-400 mb-1 font-semibold flex items-center justify-between">
              <span>Coordenadas Cartesianas ℝ³</span>
              <span className="text-[9px] text-slate-500">x, y, z</span>
            </div>
            <div className="grid grid-cols-3 gap-1.5 font-mono text-[11px]">
              <div className="bg-slate-950/80 px-1.5 py-0.5 rounded border border-slate-800/80 text-cyan-300 text-center">
                <span className="text-slate-500 text-[9px] block">X</span>
                {tooltipData.coords.x >= 0 ? "+" : ""}
                {tooltipData.coords.x.toFixed(3)}
              </div>
              <div className="bg-slate-950/80 px-1.5 py-0.5 rounded border border-slate-800/80 text-cyan-300 text-center">
                <span className="text-slate-500 text-[9px] block">Y</span>
                {tooltipData.coords.y >= 0 ? "+" : ""}
                {tooltipData.coords.y.toFixed(3)}
              </div>
              <div className="bg-slate-950/80 px-1.5 py-0.5 rounded border border-slate-800/80 text-cyan-300 text-center">
                <span className="text-slate-500 text-[9px] block">Z</span>
                {tooltipData.coords.z >= 0 ? "+" : ""}
                {tooltipData.coords.z.toFixed(3)}
              </div>
            </div>
          </div>

          {/* Parametric Toroidal Coordinates (u, v) */}
          {tooltipData.parametric && (
            <div className="space-y-1.5 text-[11px] mb-2">
              <div className="flex items-center justify-between py-0.5 border-b border-slate-800/60 text-slate-300">
                <span className="text-slate-400">u (meridiano):</span>
                <span className="font-mono text-indigo-300">
                  {tooltipData.parametric.uRad.toFixed(2)} rad ({tooltipData.parametric.uDeg.toFixed(1)}°)
                </span>
              </div>
              <div className="flex items-center justify-between py-0.5 border-b border-slate-800/60 text-slate-300">
                <span className="text-slate-400">v (paralelo):</span>
                <span className="font-mono text-indigo-300">
                  {tooltipData.parametric.vRad.toFixed(2)} rad ({tooltipData.parametric.vDeg.toFixed(1)}°)
                </span>
              </div>
              <div className="flex items-center justify-between py-0.5 border-b border-slate-800/60 text-slate-300">
                <span className="text-slate-400">Distancia origen (ρ):</span>
                <span className="font-mono text-emerald-300">
                  {tooltipData.parametric.rho.toFixed(3)}
                </span>
              </div>
              <div className="flex items-center justify-between py-0.5 text-slate-300">
                <span className="text-slate-400">Región:</span>
                <span className="text-[10px] text-slate-200 font-medium">
                  {tooltipData.parametric.region}
                </span>
              </div>
              {tooltipData.parametric.angustia !== undefined && (
                <div className="flex items-center justify-between py-0.5 text-slate-300">
                  <span className="text-slate-400">Nivel Angustia:</span>
                  <span
                    className={`font-mono text-[10px] px-1 rounded ${
                      tooltipData.parametric.isCritical
                        ? "bg-rose-500/20 text-rose-300 border border-rose-500/40"
                        : "text-slate-300"
                    }`}
                  >
                    {tooltipData.parametric.angustia.toFixed(3)}{" "}
                    {tooltipData.parametric.isCritical ? "(! Crítica)" : ""}
                  </span>
                </div>
              )}
              {tooltipData.parametric.sclFactor !== undefined && (
                <div className="flex items-center justify-between py-0.5 text-slate-300">
                  <span className="text-slate-400">Factor Scl:</span>
                  <span className="font-mono text-purple-300">
                    {tooltipData.parametric.sclFactor.toFixed(3)}x
                  </span>
                </div>
              )}
            </div>
          )}

          {/* Details / Semantic description if marker or curve */}
          {tooltipData.details && (
            <p className="text-[10px] text-slate-400 leading-relaxed border-t border-slate-800/80 pt-1.5 mt-1">
              {tooltipData.details}
            </p>
          )}

          {/* Footer Pin status */}
          <div className="mt-2 pt-1.5 border-t border-slate-800/60 flex items-center justify-between text-[10px] text-slate-500">
            <span>{isPinned ? "📌 Posición fijada" : "Haz clic para fijar"}</span>
            {isPinned && (
              <button
                type="button"
                onClick={() => setIsPinned(false)}
                className="text-amber-400 hover:underline"
              >
                Desanclar
              </button>
            )}
          </div>
        </div>
      )}

      {/* Bottom Left Legend */}
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
        Arrastrar: rotar · Scroll: zoom · Hover: coordenadas · Clic: fijar
      </div>
    </div>
  );
};

