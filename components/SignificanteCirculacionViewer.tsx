"use client";

import React, { useState, useMemo, useEffect, useRef } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { 
  HornTorusFamiliaModel, 
  COLOR_PALETTE, 
  SignificanteTracker 
} from "@/lib/hornTorusMath";
import { 
  Play, 
  Pause, 
  Sparkles, 
  RotateCcw, 
  Zap, 
  Flame, 
  Anchor, 
  Layers, 
  Compass, 
  Gauge,
  CheckCircle2,
  AlertTriangle
} from "lucide-react";

interface LacanPair {
  id: string;
  name: string;
  significante: string;
  significado: string;
  color: string;
  description: string;
}

interface SignificanteCirculacionViewerProps {
  model: HornTorusFamiliaModel;
  height?: number;
}

export const SignificanteCirculacionViewer: React.FC<SignificanteCirculacionViewerProps> = ({
  model,
  height = 480,
}) => {
  // Predefined canonical Lacanian pairs
  const lacanPairs: LacanPair[] = useMemo(() => [
    {
      id: "falo",
      name: "Φ (Falo) / Falta",
      significante: "Φ (Falo Simbólico)",
      significado: "Falta en ser / Castración",
      color: COLOR_PALETTE.S,
      description: "Significante del deseo que no tiene significado propio; significa la falta misma.",
    },
    {
      id: "nombre-padre",
      name: "Nombre-del-Padre / Ley",
      significante: "Nombre-del-Padre (S₁)",
      significado: "Ley Simbólica / Interdicción",
      color: "#6366f1",
      description: "Metáfora paterna que instaura la legalidad simbólica y anuda el nudo borromeo.",
    },
    {
      id: "deseo",
      name: "Deseo / Objeto a",
      significante: "Deseo del Sujeto ($)",
      significado: "Objeto a (Causa del deseo)",
      color: "#ec4899",
      description: "El deseo circula metonímicamente bordeando el vacío del objeto causa a.",
    },
    {
      id: "madre",
      name: "Madre / Amor",
      significante: "Madre (Demanda primordial)",
      significado: "Don de amor incondicional",
      color: "#a855f7",
      description: "La demanda de amor alienada en la omnipotencia materna primitiva.",
    },
    {
      id: "yo-otro",
      name: "Yo / Alteridad",
      significante: "Yo ideal [i(a)]",
      significado: "Gran Otro (A) / Alteridad",
      color: "#06b6d4",
      description: "Estructura especular del estadio del espejo entre el yo imaginario y el Otro.",
    },
    {
      id: "metonimia",
      name: "S₁ → S₂ (Cadena)",
      significante: "Significante Amo (S₁)",
      significado: "Saber inconsciente (S₂)",
      color: "#f59e0b",
      description: "Articulación significante en la que el sujeto se representa entre S₁ y S₂.",
    },
  ], []);

  const [activePair, setActivePair] = useState<LacanPair>(lacanPairs[0]);
  const [isAnimating, setIsAnimating] = useState<boolean>(true);
  const [speed, setSpeed] = useState<number>(1.0);
  const [showSignificado, setShowSignificado] = useState<boolean>(true);
  const [showPointDeCapiton, setShowPointDeCapiton] = useState<boolean>(true);
  const [showAngustiaZone, setShowAngustiaZone] = useState<boolean>(true);
  const [showVectors, setShowVectors] = useState<boolean>(true);

  // Live telemetry state
  const [telemetry, setTelemetry] = useState<{
    u: number;
    v: number;
    angustia: number;
    inAngustiaZone: boolean;
    atCapiton: boolean;
    phaseDeg: number;
  }>({
    u: 0,
    v: 0,
    angustia: 1.5,
    inAngustiaZone: false,
    atCapiton: false,
    phaseDeg: 0,
  });

  return (
    <div className="flex flex-col gap-5 bg-slate-900/90 rounded-xl border border-slate-800 p-5 shadow-xl text-slate-100">
      {/* Header & Theory Overview */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-indigo-400 animate-pulse" />
            <h3 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
              Circulación de Significante / Significado (S/s)
              <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-indigo-950 text-indigo-300 border border-indigo-700/60 font-medium">
                Deslizamiento Metonímico &amp; Point de Capiton
              </span>
            </h3>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Visualización topológica del algoritmo de Saussure modificado por Lacan: el significante se desliza 
            continuamente sobre el significado produciendo sentido por retroacción (*après-coup*).
          </p>
        </div>

        {/* Live Status Badge */}
        <div className="flex items-center gap-2 shrink-0">
          {telemetry.inAngustiaZone ? (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-rose-950/90 text-rose-300 border border-rose-600 animate-pulse shadow-sm shadow-rose-900/50">
              <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />
              ¡Zona de Angustia (A ≤ π/4)!
            </span>
          ) : telemetry.atCapiton ? (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-950/90 text-amber-300 border border-amber-500 animate-pulse shadow-sm shadow-amber-900/50">
              <Zap className="w-3.5 h-3.5 text-amber-400" />
              Point de Capiton Activo
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-indigo-950/70 text-indigo-300 border border-indigo-800/80">
              <CheckCircle2 className="w-3.5 h-3.5 text-indigo-400" />
              Deslizamiento Metonímico Libre
            </span>
          )}
        </div>
      </div>

      {/* Preset Pairs Selector */}
      <div className="flex flex-col gap-2.5">
        <span className="text-xs font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
          <Layers className="w-3.5 h-3.5 text-indigo-400" />
          Pares Significante / Significado Canónicos:
        </span>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
          {lacanPairs.map((pair) => {
            const isSelected = activePair.id === pair.id;
            return (
              <button
                key={pair.id}
                id={`btn-pair-${pair.id}`}
                onClick={() => setActivePair(pair)}
                className={`flex flex-col text-left p-2.5 rounded-lg border transition-all ${
                  isSelected
                    ? "bg-indigo-900/50 border-indigo-500 text-white shadow-md shadow-indigo-950/60 ring-1 ring-indigo-400/30"
                    : "bg-slate-950/60 border-slate-800 text-slate-300 hover:bg-slate-800/60 hover:border-slate-700"
                }`}
              >
                <span className="text-xs font-bold truncate" style={{ color: isSelected ? "#ffffff" : pair.color }}>
                  {pair.name}
                </span>
                <span className="text-[10px] text-slate-400 truncate mt-0.5">
                  {pair.significante}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Animation & Display Controls */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-3 bg-slate-950/70 rounded-lg border border-slate-800">
        <div className="flex flex-wrap items-center gap-3">
          <button
            id="btn-toggle-significante-anim"
            onClick={() => setIsAnimating(!isAnimating)}
            className={`inline-flex items-center gap-2 px-3.5 py-1.5 text-xs font-semibold rounded-lg shadow-sm transition-all ${
              isAnimating
                ? "bg-amber-600 hover:bg-amber-500 text-white"
                : "bg-emerald-600 hover:bg-emerald-500 text-white"
            }`}
          >
            {isAnimating ? (
              <>
                <Pause className="w-3.5 h-3.5" />
                <span>Pausar Deslizamiento</span>
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5" />
                <span>Reanudar Circulación</span>
              </>
            )}
          </button>

          {/* Speed slider */}
          <label className="flex items-center gap-2 text-xs text-slate-300 bg-slate-900 px-3 py-1.5 rounded-lg border border-slate-800">
            <Gauge className="w-3.5 h-3.5 text-indigo-400" />
            <span>Velocidad:</span>
            <input
              id="range-significante-speed"
              type="range"
              min="0.2"
              max="3.0"
              step="0.1"
              value={speed}
              onChange={(e) => setSpeed(parseFloat(e.target.value))}
              className="w-24 accent-indigo-500 cursor-pointer"
            />
            <span className="font-mono text-indigo-300 w-9 text-right font-medium">{speed.toFixed(1)}x</span>
          </label>
        </div>

        {/* Visibility Toggles */}
        <div className="flex flex-wrap items-center gap-3 text-xs text-slate-300">
          <label className="flex items-center gap-1.5 cursor-pointer hover:text-white">
            <input
              type="checkbox"
              checked={showSignificado}
              onChange={(e) => setShowSignificado(e.target.checked)}
              className="rounded accent-emerald-500 cursor-pointer"
            />
            <span>Flujo Significado (s)</span>
          </label>

          <label className="flex items-center gap-1.5 cursor-pointer hover:text-white">
            <input
              type="checkbox"
              checked={showPointDeCapiton}
              onChange={(e) => setShowPointDeCapiton(e.target.checked)}
              className="rounded accent-amber-500 cursor-pointer"
            />
            <span>Point de Capiton</span>
          </label>

          <label className="flex items-center gap-1.5 cursor-pointer hover:text-white">
            <input
              type="checkbox"
              checked={showAngustiaZone}
              onChange={(e) => setShowAngustiaZone(e.target.checked)}
              className="rounded accent-rose-500 cursor-pointer"
            />
            <span>Zona Angustia (A ≤ π/4)</span>
          </label>

          <label className="flex items-center gap-1.5 cursor-pointer hover:text-white">
            <input
              type="checkbox"
              checked={showVectors}
              onChange={(e) => setShowVectors(e.target.checked)}
              className="rounded accent-indigo-500 cursor-pointer"
            />
            <span>Vectores Tangentes</span>
          </label>
        </div>
      </div>

      {/* 3D Canvas Viewport */}
      <div 
        className="relative w-full rounded-xl overflow-hidden bg-slate-950 border border-slate-800 shadow-inner"
        style={{ height }}
        id="significante-3d-viewport"
      >
        <SignificanteCirculacionCanvas
          model={model}
          activePair={activePair}
          isAnimating={isAnimating}
          speed={speed}
          showSignificado={showSignificado}
          showPointDeCapiton={showPointDeCapiton}
          showAngustiaZone={showAngustiaZone}
          showVectors={showVectors}
          onTelemetry={setTelemetry}
        />

        {/* Real-Time Telemetry HUD Overlay */}
        <div className="absolute top-3 left-3 bg-slate-950/85 backdrop-blur-md p-3 rounded-lg border border-slate-800/80 text-[11px] font-mono text-slate-300 pointer-events-none shadow-lg max-w-xs">
          <div className="text-indigo-300 font-bold text-xs mb-1 border-b border-slate-800 pb-1 flex items-center justify-between">
            <span>TELEMETRÍA LACANIANA</span>
            <span className="text-[10px] text-slate-400 font-normal">{telemetry.phaseDeg}°</span>
          </div>
          <div className="grid grid-cols-2 gap-x-3 gap-y-1">
            <div>Significante S₁:</div>
            <div className="text-right text-indigo-200 font-semibold">{activePair.significante.split(" ")[0]}</div>
            <div>Posición (u, v):</div>
            <div className="text-right text-slate-200">
              ({telemetry.u.toFixed(2)}, {telemetry.v.toFixed(2)})
            </div>
            <div>Distancia al Fantasma:</div>
            <div className={`text-right font-semibold ${telemetry.inAngustiaZone ? "text-rose-400 font-bold animate-pulse" : "text-emerald-400"}`}>
              A = {telemetry.angustia.toFixed(3)} rad
            </div>
            <div>Umbral Crítico (A_cr):</div>
            <div className="text-right text-slate-400">π/4 ≈ 0.785</div>
          </div>
        </div>

        {/* Bottom Legend Overlay */}
        <div className="absolute bottom-3 right-3 bg-slate-950/85 backdrop-blur-md px-3 py-2 rounded-lg border border-slate-800/80 text-[10px] text-slate-300 flex items-center gap-3 pointer-events-none">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: activePair.color }} />
            <span>Cadena Significante (S)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
            <span>Significado (s)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
            <span>Point de Capiton</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-cyan-400" />
            <span>La Voz (0,0,0)</span>
          </div>
        </div>
      </div>

      {/* Conceptual Explanation Box */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
        <div className="p-3 bg-slate-950/60 rounded-lg border border-slate-800 flex flex-col gap-1">
          <div className="font-semibold text-indigo-300 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
            1. Deslizamiento Significante (S/s)
          </div>
          <p className="text-slate-400 text-[11px] leading-relaxed">
            El significante cabalga sobre el significado sin llegar jamás a coincidir plenamente. 
            La barra horizontal saussureana actúa como barrera resistente a la significación fija.
          </p>
        </div>

        <div className="p-3 bg-slate-950/60 rounded-lg border border-slate-800 flex flex-col gap-1">
          <div className="font-semibold text-amber-300 flex items-center gap-1.5">
            <Zap className="w-3.5 h-3.5 text-amber-400" />
            2. Point de Capiton (Almohadillado)
          </div>
          <p className="text-slate-400 text-[11px] leading-relaxed">
            Punto de cruce e interceptación en el Horn Torus donde el significante detiene momentáneamente 
            el flujo del significado, fijando un sentido retroactivo (*après-coup*).
          </p>
        </div>

        <div className="p-3 bg-slate-950/60 rounded-lg border border-slate-800 flex flex-col gap-1">
          <div className="font-semibold text-rose-300 flex items-center gap-1.5">
            <Flame className="w-3.5 h-3.5 text-rose-400" />
            3. Angustia ante el Fantasma (A ≤ π/4)
          </div>
          <p className="text-slate-400 text-[11px] leading-relaxed">
            Al aproximarse a la garganta del inconsciente en el punto de corte fantasmático ($ ◇ a), 
            la distancia angular cae bajo $\pi/4$, desencadenando la señal de angustia de castración.
          </p>
        </div>
      </div>
    </div>
  );
};

// =============================================================================
// THREE.JS CANVAS FOR SIGNIFICANTE / SIGNIFICADO REAL-TIME SIMULATION
// =============================================================================

interface SignificanteCirculacionCanvasProps {
  model: HornTorusFamiliaModel;
  activePair: LacanPair;
  isAnimating: boolean;
  speed: number;
  showSignificado: boolean;
  showPointDeCapiton: boolean;
  showAngustiaZone: boolean;
  showVectors: boolean;
  onTelemetry: (t: {
    u: number;
    v: number;
    angustia: number;
    inAngustiaZone: boolean;
    atCapiton: boolean;
    phaseDeg: number;
  }) => void;
}

const SignificanteCirculacionCanvas: React.FC<SignificanteCirculacionCanvasProps> = ({
  model,
  activePair,
  isAnimating,
  speed,
  showSignificado,
  showPointDeCapiton,
  showAngustiaZone,
  showVectors,
  onTelemetry,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const controlsRef = useRef<OrbitControls | null>(null);
  const animFrameRef = useRef<number | null>(null);
  const clockRef = useRef<THREE.Clock>(new THREE.Clock());

  // Dynamic references
  const dynamicGroupRef = useRef<THREE.Group | null>(null);
  const signifierOrbsRef = useRef<THREE.Mesh[]>([]);
  const signifierArrowsRef = useRef<THREE.ArrowHelper[]>([]);
  const signifiedOrbsRef = useRef<THREE.Mesh[]>([]);
  const capitonMeshRef = useRef<THREE.Mesh | null>(null);
  const capitonRippleRef = useRef<THREE.Mesh | null>(null);
  const angustiaZoneMeshRef = useRef<THREE.Mesh | null>(null);
  const fantasyMeshRef = useRef<THREE.Group | null>(null);

  // Sampled curve paths in 3D
  const curvesRef = useRef<{
    sPoints: THREE.Vector3[];
    iPoints: THREE.Vector3[];
    capitonPos: THREE.Vector3;
    fantasyPos: THREE.Vector3;
  }>({
    sPoints: [],
    iPoints: [],
    capitonPos: new THREE.Vector3(),
    fantasyPos: new THREE.Vector3(),
  });

  // Helper function to sample closed CatmullRom curve
  const sampleClosedPath = (pts: THREE.Vector3[], progress: number): THREE.Vector3 => {
    if (pts.length === 0) return new THREE.Vector3();
    const p = ((progress % 1) + 1) % 1;
    const idxExact = p * (pts.length - 1);
    const i0 = Math.floor(idxExact);
    const i1 = (i0 + 1) % pts.length;
    const f = idxExact - i0;
    return new THREE.Vector3().lerpVectors(pts[i0], pts[i1], f);
  };

  // 1. INITIALIZE THREE.JS SCENE ONCE
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color("#050811");
    sceneRef.current = scene;

    const width = container.clientWidth || 800;
    const height = container.clientHeight || 480;
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.set(38, 30, 42);
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.innerHTML = "";
    container.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.06;
    controls.maxDistance = 250;
    controls.minDistance = 6;
    controlsRef.current = controls;

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.1);
    scene.add(ambientLight);

    const dirLight1 = new THREE.DirectionalLight(0xffffff, 2.0);
    dirLight1.position.set(35, 50, 35);
    scene.add(dirLight1);

    const dirLight2 = new THREE.DirectionalLight(0x7090d0, 1.2);
    dirLight2.position.set(-35, -25, -25);
    scene.add(dirLight2);

    // Subtle grid
    const grid = new THREE.GridHelper(50, 24, 0x1e293b, 0x0f172a);
    grid.position.y = -model.r - 2;
    scene.add(grid);

    // Group for dynamic meshes that update in animation
    const dynamicGroup = new THREE.Group();
    scene.add(dynamicGroup);
    dynamicGroupRef.current = dynamicGroup;

    // Resize handler
    const handleResize = () => {
      if (!container || !renderer || !camera) return;
      const w = container.clientWidth || 800;
      const h = container.clientHeight || 480;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
      controls.dispose();
      renderer.dispose();
      while (container.firstChild) {
        container.removeChild(container.firstChild);
      }
    };
  }, []);

  // 2. REBUILD STATIC AND BASE OBJECTS WHEN MODEL OR PAIR CHANGES
  useEffect(() => {
    const scene = sceneRef.current;
    if (!scene) return;

    // Remove existing static items from scene (except lights, grid, and dynamic group)
    const objectsToRemove: THREE.Object3D[] = [];
    scene.children.forEach((child) => {
      if (
        child !== dynamicGroupRef.current &&
        !(child instanceof THREE.Light) &&
        !(child instanceof THREE.GridHelper)
      ) {
        objectsToRemove.push(child);
      }
    });
    objectsToRemove.forEach((obj) => scene.remove(obj));

    // Clear dynamic group
    if (dynamicGroupRef.current) {
      while (dynamicGroupRef.current.children.length > 0) {
        dynamicGroupRef.current.remove(dynamicGroupRef.current.children[0]);
      }
    }
    signifierOrbsRef.current = [];
    signifierArrowsRef.current = [];
    signifiedOrbsRef.current = [];

    // A) HORN TORUS SURFACE (Translucent with visible throat)
    const uSegments = 72;
    const vSegments = 36;
    const positions: number[] = [];
    const normals: number[] = [];
    const indices: number[] = [];

    for (let j = 0; j <= vSegments; j++) {
      const v = (j / vSegments) * 2 * Math.PI;
      for (let i = 0; i <= uSegments; i++) {
        const u = (i / uSegments) * 2 * Math.PI;
        const [x, y, z] = model.punto(u, v);
        positions.push(x, z, -y);

        const nx = Math.cos(v) * Math.cos(u);
        const ny = Math.cos(v) * Math.sin(u);
        const nz = Math.sin(v);
        normals.push(nx, nz, -ny);
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

    const torusGeo = new THREE.BufferGeometry();
    torusGeo.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
    torusGeo.setAttribute("normal", new THREE.Float32BufferAttribute(normals, 3));
    torusGeo.setIndex(indices);

    const torusMat = new THREE.MeshStandardMaterial({
      color: 0x1e293b,
      roughness: 0.35,
      metalness: 0.15,
      transparent: true,
      opacity: 0.38,
      side: THREE.DoubleSide,
      depthWrite: false,
    });
    const torusMesh = new THREE.Mesh(torusGeo, torusMat);
    scene.add(torusMesh);

    // Subtle equator wireframe ring
    const equatorGeo = new THREE.TorusGeometry(model.R + model.r, 0.05, 8, 80);
    const equatorMat = new THREE.MeshBasicMaterial({ color: 0x334155, wireframe: true });
    const equatorMesh = new THREE.Mesh(equatorGeo, equatorMat);
    equatorMesh.rotation.x = Math.PI / 2;
    scene.add(equatorMesh);

    // B) THE VOICE AT ORIGIN (0,0,0) - RADIANT CYAN
    const voiceGeo = new THREE.SphereGeometry(0.7, 24, 24);
    const voiceMat = new THREE.MeshStandardMaterial({
      color: 0x00e5ff,
      emissive: 0x00b4d8,
      emissiveIntensity: 1.4,
      roughness: 0.1,
      metalness: 0.2,
    });
    const voiceMesh = new THREE.Mesh(voiceGeo, voiceMat);
    voiceMesh.position.set(0, 0, 0);
    scene.add(voiceMesh);

    const voiceHaloGeo = new THREE.RingGeometry(0.75, 1.2, 32);
    const voiceHaloMat = new THREE.MeshBasicMaterial({
      color: 0x00e5ff,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.5,
    });
    const voiceHaloMesh = new THREE.Mesh(voiceHaloGeo, voiceHaloMat);
    voiceHaloMesh.rotation.x = Math.PI / 2;
    scene.add(voiceHaloMesh);

    // C) CURVES AND PATHS IN 3D
    const s4 = model.getSection4Curves(360);
    const sPoints = s4.S.map(([x, y, z]) => new THREE.Vector3(x, z, -y));
    const iPoints = s4.I.map(([x, y, z]) => new THREE.Vector3(x, z, -y));
    const fantasyPos = new THREE.Vector3(s4.fantasyPoint[0], s4.fantasyPoint[2], -s4.fantasyPoint[1]);

    // Approximate Capiton quilting point (where S and I get closest near equator/throat)
    const capitonPos = sampleClosedPath(sPoints, 0.42);

    curvesRef.current = {
      sPoints,
      iPoints,
      capitonPos,
      fantasyPos,
    };

    // D) WIDE 3D TUBULAR RIBBONS (S & I)
    const sCurveCatmull = new THREE.CatmullRomCurve3(sPoints, true);
    const sTubeGeo = new THREE.TubeGeometry(sCurveCatmull, 260, 0.32, 10, true);
    const sColorHex = new THREE.Color(activePair.color).getHex();
    const sTubeMat = new THREE.MeshStandardMaterial({
      color: sColorHex,
      emissive: sColorHex,
      emissiveIntensity: 0.35,
      roughness: 0.3,
      metalness: 0.2,
      transparent: true,
      opacity: 0.88,
    });
    const sTubeMesh = new THREE.Mesh(sTubeGeo, sTubeMat);
    scene.add(sTubeMesh);

    if (showSignificado) {
      const iCurveCatmull = new THREE.CatmullRomCurve3(iPoints, true);
      const iTubeGeo = new THREE.TubeGeometry(iCurveCatmull, 260, 0.24, 10, true);
      const iTubeMat = new THREE.MeshStandardMaterial({
        color: 0x2e8b57,
        emissive: 0x2e8b57,
        emissiveIntensity: 0.3,
        roughness: 0.3,
        metalness: 0.2,
        transparent: true,
        opacity: 0.8,
      });
      const iTubeMesh = new THREE.Mesh(iTubeGeo, iTubeMat);
      scene.add(iTubeMesh);
    }

    // E) FANTASY POINT NODE ($ ◇ a) - COMPACT ANCHOR
    const fantasyGroup = new THREE.Group();
    fantasyGroup.position.copy(fantasyPos);

    const anchorRingGeo = new THREE.TorusGeometry(0.32, 0.05, 16, 24);
    const anchorRingMat = new THREE.MeshStandardMaterial({
      color: 0xf59e0b,
      emissive: 0xd97706,
      emissiveIntensity: 0.8,
      metalness: 0.8,
      roughness: 0.2,
    });
    const anchorRingMesh = new THREE.Mesh(anchorRingGeo, anchorRingMat);
    anchorRingMesh.rotation.x = Math.PI / 2;
    fantasyGroup.add(anchorRingMesh);

    const jewelGeo = new THREE.OctahedronGeometry(0.30, 0);
    const jewelMat = new THREE.MeshStandardMaterial({
      color: COLOR_PALETTE.fant,
      emissive: COLOR_PALETTE.fant,
      emissiveIntensity: 1.2,
      roughness: 0.15,
      metalness: 0.3,
    });
    const jewelMesh = new THREE.Mesh(jewelGeo, jewelMat);
    fantasyGroup.add(jewelMesh);
    scene.add(fantasyGroup);
    fantasyMeshRef.current = fantasyGroup;

    // F) ZONA DE ANGUISTIA (A ≤ π/4) - SHELL & BEACON
    if (showAngustiaZone) {
      const angustiaGeo = new THREE.SphereGeometry(model.r * 0.785, 20, 20);
      const angustiaMat = new THREE.MeshBasicMaterial({
        color: 0xe11d48,
        transparent: true,
        opacity: 0.16,
        wireframe: true,
      });
      const angustiaMesh = new THREE.Mesh(angustiaGeo, angustiaMat);
      angustiaMesh.position.copy(fantasyPos);
      scene.add(angustiaMesh);
      angustiaZoneMeshRef.current = angustiaMesh;
    }

    // G) POINT DE CAPITON BEACON (GOLDEN RIPPLE)
    if (showPointDeCapiton) {
      const capitonGeo = new THREE.SphereGeometry(0.45, 16, 16);
      const capitonMat = new THREE.MeshStandardMaterial({
        color: 0xf59e0b,
        emissive: 0xd97706,
        emissiveIntensity: 1.2,
        roughness: 0.2,
        metalness: 0.5,
      });
      const capitonMesh = new THREE.Mesh(capitonGeo, capitonMat);
      capitonMesh.position.copy(capitonPos);
      scene.add(capitonMesh);
      capitonMeshRef.current = capitonMesh;

      const rippleGeo = new THREE.RingGeometry(0.5, 0.9, 24);
      const rippleMat = new THREE.MeshBasicMaterial({
        color: 0xfbbf24,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.6,
      });
      const rippleMesh = new THREE.Mesh(rippleGeo, rippleMat);
      rippleMesh.position.copy(capitonPos);
      rippleMesh.rotation.x = Math.PI / 2;
      scene.add(rippleMesh);
      capitonRippleRef.current = rippleMesh;
    }

    // H) DYNAMIC SIGNIFIER CHAIN ORBS (S₁, S₂, S₃, S₄)
    const numSignifiers = 4;
    const signifierOrbs: THREE.Mesh[] = [];
    const signifierArrows: THREE.ArrowHelper[] = [];

    for (let k = 0; k < numSignifiers; k++) {
      const isLeader = k === 0;
      const radius = isLeader ? 0.62 : 0.42;
      const orbGeo = new THREE.SphereGeometry(radius, 20, 20);
      const orbMat = new THREE.MeshStandardMaterial({
        color: isLeader ? sColorHex : 0xffffff,
        emissive: sColorHex,
        emissiveIntensity: isLeader ? 1.5 : 0.8,
        roughness: 0.15,
        metalness: 0.3,
      });
      const orb = new THREE.Mesh(orbGeo, orbMat);
      dynamicGroupRef.current?.add(orb);
      signifierOrbs.push(orb);

      // Tangential velocity arrow
      const arrow = new THREE.ArrowHelper(
        new THREE.Vector3(1, 0, 0),
        new THREE.Vector3(),
        1.2,
        new THREE.Color(activePair.color),
        0.32,
        0.16
      );
      arrow.visible = showVectors;
      dynamicGroupRef.current?.add(arrow);
      signifierArrows.push(arrow);
    }
    signifierOrbsRef.current = signifierOrbs;
    signifierArrowsRef.current = signifierArrows;

    // I) DYNAMIC SIGNIFIED STREAM ORBS (s)
    if (showSignificado) {
      const numSignified = 3;
      const signifiedOrbs: THREE.Mesh[] = [];
      for (let m = 0; m < numSignified; m++) {
        const orbGeo = new THREE.SphereGeometry(0.42, 16, 16);
        const orbMat = new THREE.MeshStandardMaterial({
          color: 0x10b981,
          emissive: 0x059669,
          emissiveIntensity: 1.1,
          roughness: 0.2,
          metalness: 0.2,
        });
        const orb = new THREE.Mesh(orbGeo, orbMat);
        dynamicGroupRef.current?.add(orb);
        signifiedOrbs.push(orb);
      }
      signifiedOrbsRef.current = signifiedOrbs;
    }

  }, [model, activePair, showSignificado, showPointDeCapiton, showAngustiaZone, showVectors]);

  // 3. CONTINUOUS REAL-TIME ANIMATION LOOP
  useEffect(() => {
    let animTime = 0;

    const animate = () => {
      animFrameRef.current = requestAnimationFrame(animate);

      const delta = clockRef.current.getDelta();
      if (isAnimating) {
        animTime += delta * speed;
      }

      controlsRef.current?.update();

      const { sPoints, iPoints, capitonPos, fantasyPos } = curvesRef.current;
      if (sPoints.length > 0) {
        const numSignifiers = signifierOrbsRef.current.length;
        
        // Base phase for S₁ leader (0 to 1 loop)
        const basePhase = (animTime * 0.08) % 1;
        const leaderPos = sampleClosedPath(sPoints, basePhase);
        const aheadPos = sampleClosedPath(sPoints, (basePhase + 0.005) % 1);
        const tangentDir = aheadPos.clone().sub(leaderPos).normalize();

        // Calculate approximate toroidal angles (u, v) for leader S₁
        const u = (basePhase * 2 * Math.PI) % (2 * Math.PI);
        const v = (u + model.v_S) % (2 * Math.PI);

        // Distance to fantasy ($ ◇ a)
        const angustia = model.distanciaAngular(u, v, model.u_F, model.v_F);
        const inAngustia = angustia <= model.A_cr;

        // Check if close to Capiton point
        const distToCapiton = leaderPos.distanceTo(capitonPos);
        const atCapiton = distToCapiton < 1.4;

        // Update each Signifier in the chain (S₁, S₂, S₃, S₄)
        signifierOrbsRef.current.forEach((orb, idx) => {
          const orbPhase = (basePhase - idx * 0.065 + 1) % 1;
          const pos = sampleClosedPath(sPoints, orbPhase);
          orb.position.copy(pos);

          // If leader S₁ enters anguish zone, shift color to high-energy flaming rose
          if (idx === 0) {
            const mat = orb.material as THREE.MeshStandardMaterial;
            if (inAngustia) {
              mat.color.setHex(0xff0055);
              mat.emissive.setHex(0xff0055);
              mat.emissiveIntensity = 2.4 + 0.6 * Math.sin(animTime * 12);
            } else if (atCapiton) {
              mat.color.setHex(0xfbbf24);
              mat.emissive.setHex(0xf59e0b);
              mat.emissiveIntensity = 2.0;
            } else {
              const baseColor = new THREE.Color(activePair.color);
              mat.color.copy(baseColor);
              mat.emissive.copy(baseColor);
              mat.emissiveIntensity = 1.4;
            }
          }

          // Update arrow helper
          if (idx < signifierArrowsRef.current.length) {
            const arrow = signifierArrowsRef.current[idx];
            arrow.visible = showVectors;
            if (showVectors) {
              const ahead = sampleClosedPath(sPoints, (orbPhase + 0.005) % 1);
              const dir = ahead.clone().sub(pos).normalize();
              arrow.position.copy(pos);
              arrow.setDirection(dir);
              arrow.setLength(1.15 * Math.min(speed, 1.5), 0.30, 0.15);
            }
          }
        });

        // Update Signified stream orbs (s) with phase lag (glissement du signifié)
        if (showSignificado && iPoints.length > 0) {
          signifiedOrbsRef.current.forEach((orb, m) => {
            // Reverse or lagging circulation
            const sPhase = (1 - (animTime * 0.065 + m * 0.15) % 1 + 1) % 1;
            const pos = sampleClosedPath(iPoints, sPhase);
            orb.position.copy(pos);
          });
        }

        // Capiton pulsing ripple
        if (capitonRippleRef.current) {
          const rippleScale = 1.0 + 0.35 * Math.sin(animTime * 4);
          capitonRippleRef.current.scale.set(rippleScale, rippleScale, rippleScale);
          (capitonRippleRef.current.material as THREE.MeshBasicMaterial).opacity = atCapiton ? 0.9 : 0.45;
        }

        // Anguish zone pulse
        if (angustiaZoneMeshRef.current) {
          const mat = angustiaZoneMeshRef.current.material as THREE.MeshBasicMaterial;
          mat.opacity = inAngustia ? 0.38 + 0.15 * Math.sin(animTime * 10) : 0.14;
        }

        // Telemetry update
        onTelemetry({
          u,
          v,
          angustia,
          inAngustiaZone: inAngustia,
          atCapiton,
          phaseDeg: Math.round(basePhase * 360),
        });
      }

      if (rendererRef.current && sceneRef.current && cameraRef.current) {
        rendererRef.current.render(sceneRef.current, cameraRef.current);
      }
    };

    animFrameRef.current = requestAnimationFrame(animate);

    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [isAnimating, speed, activePair, showSignificado, showVectors, onTelemetry]);

  return <div ref={containerRef} className="w-full h-full cursor-grab active:cursor-grabbing" />;
};
