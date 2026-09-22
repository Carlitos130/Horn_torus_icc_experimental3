"use client";

import React, { useState, useMemo, useEffect, useRef } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { 
  HornTorusFamiliaModel, 
  COLOR_PALETTE, 
  VectorCirculacionGenerator, 
  VectorCirculacionTrayectoria,
  VectorCirculacion 
} from "@/lib/hornTorusMath";
import { 
  Play, 
  Pause, 
  Trash2, 
  Sparkles,
  Target,
  X,
  RotateCcw,
  Eye,
  Heart,
  Anchor,
  Gauge
} from "lucide-react";

interface VectorCirculacionViewerProps {
  model: HornTorusFamiliaModel;
  height?: number;
}

export const VectorCirculacionViewer: React.FC<VectorCirculacionViewerProps> = ({
  model,
  height = 500,
}) => {
  const [trayectorias, setTrayectorias] = useState<VectorCirculacionTrayectoria[]>([]);
  const [isAnimating, setIsAnimating] = useState<boolean>(true);
  const [animationSpeed, setAnimationSpeed] = useState<number>(1.0);
  const [arrowScale, setArrowScale] = useState<number>(0.65);
  const [showVozVectors, setShowVozVectors] = useState<boolean>(true);
  const [showTraumaVectors, setShowTraumaVectors] = useState<boolean>(false);
  const [showFantasiaAnchor, setShowFantasiaAnchor] = useState<boolean>(true);
  const [activePreset, setActivePreset] = useState<string>("completo");

  const generator = useMemo(() => new VectorCirculacionGenerator(model), [model]);

  // Cintas disponibles
  const cintas = ['S', 'I', 'Sigma', 'Pulsion'] as const;
  const cintaLabels: Record<string, string> = {
    S: 'Significante (S) [Horario]',
    I: 'Imagen (I) [Antihorario]',
    Sigma: 'Síntoma (Σ) [Horario]',
    Pulsion: 'Pulsión [Circulación continua]',
  };

  // 1. Generar TODO: Voz + Cintas + Trauma + Fantasía Anclada (SIN vectores)
  const handleGenerateCompleteSystem = () => {
    generator.clearTrayectorias();
    const nuevasTrayectorias: VectorCirculacionTrayectoria[] = [];
    
    // Vectores desde la voz
    const vectoresVoz = generator.generarVRDesdeVoz(8, 2);
    nuevasTrayectorias.push({
      nombre: 'VR-Voz',
      cinta: 'S',
      puntos: vectoresVoz,
      color: COLOR_PALETTE.voz,
      velocidad: 0.9,
    });
    
    // Vectores en todas las cintas
    cintas.forEach((cinta) => {
      const trayectoria = generator.generarTrayectoriaVR({
        cinta,
        numPuntos: 80,
        sentido: cinta === 'I' ? 'counterclockwise' : 'clockwise',
      });
      nuevasTrayectorias.push(trayectoria);
    });
    
    // Vectores en el trauma (oscilación congelada)
    const trayectoriaTrauma = generator.generarVRTrauma(24);
    nuevasTrayectorias.push(trayectoriaTrauma);
    
    // Fantasía: está anclada en el inconsciente, pero NO SALEN VECTORES
    const trayectoriaFantasia = generator.generarVRFantasia();
    nuevasTrayectorias.push(trayectoriaFantasia);
    
    setTrayectorias(nuevasTrayectorias);
    setIsAnimating(true);
    setShowVozVectors(true);
    setShowTraumaVectors(true);
    setShowFantasiaAnchor(true);
    setActivePreset("completo");
  };

  // 2. Generar solo las Cintas (movimiento continuo)
  const handleGenerateAllCintas = () => {
    generator.clearTrayectorias();
    const nuevasTrayectorias: VectorCirculacionTrayectoria[] = [];
    
    cintas.forEach((cinta) => {
      const trayectoria = generator.generarTrayectoriaVR({
        cinta,
        numPuntos: 80,
        sentido: cinta === 'I' ? 'counterclockwise' : 'clockwise',
      });
      nuevasTrayectorias.push(trayectoria);
    });
    
    setTrayectorias(nuevasTrayectorias);
    setIsAnimating(true);
    setShowVozVectors(false);
    setShowTraumaVectors(false);
    setShowFantasiaAnchor(true);
    setActivePreset("cintas");
  };

  // 3. Generar una cinta individual
  const handleGenerateCintaVectors = (cinta: 'S' | 'I' | 'Sigma' | 'Pulsion') => {
    generator.clearTrayectorias();
    const trayectoria = generator.generarTrayectoriaVR({
      cinta,
      numPuntos: 90,
      sentido: cinta === 'I' ? 'counterclockwise' : 'clockwise',
    });
    setTrayectorias([trayectoria]);
    setIsAnimating(true);
    setShowVozVectors(false);
    setShowTraumaVectors(false);
    setShowFantasiaAnchor(true);
    setActivePreset(`cinta-${cinta}`);
  };

  // 4. Generar vectores desde la voz
  const handleGenerateVozVectors = () => {
    generator.clearTrayectorias();
    const vectores = generator.generarVRDesdeVoz(12, 3);
    const trayectoriaVoz: VectorCirculacionTrayectoria = {
      nombre: 'VR-Voz',
      cinta: 'S',
      puntos: vectores,
      color: COLOR_PALETTE.voz,
      velocidad: 0.9,
    };
    
    setTrayectorias([trayectoriaVoz]);
    setIsAnimating(true);
    setShowVozVectors(true);
    setShowTraumaVectors(false);
    setShowFantasiaAnchor(true);
    setActivePreset("voz");
  };

  // 5. Generar trauma (congelado)
  const handleGenerateTraumaVectors = () => {
    generator.clearTrayectorias();
    const trayectoria = generator.generarVRTrauma(36);
    setTrayectorias([trayectoria]);
    setIsAnimating(true);
    setShowVozVectors(false);
    setShowTraumaVectors(true);
    setShowFantasiaAnchor(true);
    setActivePreset("trauma");
  };

  // 6. Fantasía: Anclada en el Inconsciente (NO SALEN VECTORES)
  const handleGenerateFantasiaVectors = () => {
    generator.clearTrayectorias();
    // La fantasía está anclada en el inconsciente, pero NO SALEN VECTORES
    const trayectoria = generator.generarVRFantasia();
    setTrayectorias([trayectoria]);
    setShowVozVectors(false);
    setShowTraumaVectors(false);
    setShowFantasiaAnchor(true);
    setActivePreset("fantasia");
  };

  // 7. Limpiar todo
  const handleClearAll = () => {
    generator.clearTrayectorias();
    setTrayectorias([]);
    setIsAnimating(false);
    setShowVozVectors(false);
    setShowTraumaVectors(false);
    setShowFantasiaAnchor(true);
    setActivePreset("limpio");
  };

  // Inicializar automáticamente con el sistema completo en movimiento
  useEffect(() => {
    handleGenerateCompleteSystem();
  }, [model]);

  return (
    <div className="flex flex-col gap-4 bg-slate-900 rounded-xl border border-slate-800 p-5 shadow-sm text-slate-100" id="vector-circulacion-panel">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
        <div>
          <h3 className="text-base font-semibold text-slate-100 flex items-center gap-2">
            <RotateCcw className="w-4 h-4 text-indigo-400" />
            Vectores de Circulación en Movimiento (VR en Cintas S, I, Σ)
          </h3>
          <p className="text-xs text-slate-400">
            Los vectores se desplazan dinámicamente por las cintas. La fantasía está anclada en el inconsciente (sin emisión de vectores).
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium border ${
            isAnimating 
              ? "bg-emerald-950/60 border-emerald-700/60 text-emerald-300"
              : "bg-amber-950/60 border-amber-700/60 text-amber-300"
          }`}>
            <span className={`w-2 h-2 rounded-full ${isAnimating ? "bg-emerald-400 animate-ping" : "bg-amber-400"}`} />
            {isAnimating ? "Circulación Activa (En Movimiento)" : "Movimiento en Pausa"}
          </span>
        </div>
      </div>

      {/* Control Panel */}
      <div className="bg-slate-950/70 rounded-lg p-4 border border-slate-800 flex flex-col gap-3">
        {/* Presets principales */}
        <div className="flex flex-wrap gap-2">
          <button
            id="btn-vr-complete-system"
            onClick={handleGenerateCompleteSystem}
            className={`inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white rounded-lg shadow-sm transition-all ${
              activePreset === "completo"
                ? "bg-gradient-to-r from-indigo-500 to-purple-600 ring-2 ring-indigo-400/50"
                : "bg-slate-800 hover:bg-slate-700 text-slate-200"
            }`}
          >
            <Sparkles className="w-4 h-4 text-amber-300" />
            <span>Sistema Completo (Cintas Móviles + Voz + Trauma + Fantasía Anclada)</span>
          </button>
          
          <button
            id="btn-vr-all-cintas"
            onClick={handleGenerateAllCintas}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border transition-colors ${
              activePreset === "cintas"
                ? "border-emerald-500 bg-emerald-950/80 text-emerald-200 ring-1 ring-emerald-400"
                : "border-emerald-800/80 bg-emerald-950/40 hover:bg-emerald-900/60 text-emerald-300"
            }`}
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Todas las Cintas (Flujo Dinámico)</span>
          </button>

          <button
            id="btn-vr-voz"
            onClick={handleGenerateVozVectors}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border transition-colors ${
              activePreset === "voz"
                ? "border-cyan-500 bg-cyan-950/80 text-cyan-200 ring-1 ring-cyan-400"
                : "border-cyan-800/80 bg-cyan-950/40 hover:bg-cyan-900/60 text-cyan-300"
            }`}
          >
            <Target className="w-3.5 h-3.5" />
            <span>Voz: Emisión desde el Origen (0,0,0)</span>
          </button>
        </div>

        {/* Botones individuales por cinta */}
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-800">
          <span className="text-[11px] text-slate-400 mr-1 font-medium">Cintas Individuales:</span>
          {cintas.map((cinta) => (
            <button
              key={cinta}
              id={`btn-vr-cinta-${cinta}`}
              onClick={() => handleGenerateCintaVectors(cinta)}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border transition-all ${
                activePreset === `cinta-${cinta}` ? "ring-2 ring-white/60 brightness-125" : "hover:brightness-110"
              }`}
              style={{
                borderColor: COLOR_PALETTE[cinta as keyof typeof COLOR_PALETTE],
                backgroundColor: `${COLOR_PALETTE[cinta as keyof typeof COLOR_PALETTE]}20`,
                color: COLOR_PALETTE[cinta as keyof typeof COLOR_PALETTE],
              }}
            >
              <span className="font-semibold">{cinta}</span>
              <span className="text-slate-300 text-[11px]">
                {cintaLabels[cinta].split(' ')[0]}
              </span>
            </button>
          ))}
        </div>

        {/* Trauma y Fantasía Anclada */}
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-800">
          <button
            id="btn-vr-trauma"
            onClick={handleGenerateTraumaVectors}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border transition-colors ${
              activePreset === "trauma"
                ? "border-rose-500 bg-rose-950/80 text-rose-200 ring-1 ring-rose-400"
                : "border-rose-800 bg-rose-950/50 hover:bg-rose-900/60 text-rose-300"
            }`}
          >
            <Heart className="w-3.5 h-3.5" />
            <span>Trauma (S-E-I Oscilación Congelada)</span>
          </button>
          
          <button
            id="btn-vr-fantasia"
            onClick={handleGenerateFantasiaVectors}
            className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold rounded-lg border transition-colors ${
              activePreset === "fantasia"
                ? "border-purple-400 bg-purple-950/90 text-purple-100 ring-2 ring-purple-400/60 shadow-sm"
                : "border-purple-700 bg-purple-950/60 hover:bg-purple-900/70 text-purple-200"
            }`}
          >
            <Anchor className="w-3.5 h-3.5 text-amber-300" />
            <span>Fantasía ($ ◇ a) — Anclada en el Inconsciente [Sin Vectores]</span>
          </button>
          
          <button
            id="btn-vr-clear"
            onClick={handleClearAll}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border border-slate-700 bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors ml-auto"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Limpiar Todo</span>
          </button>
        </div>

        {/* Controles de dinámica de animación */}
        <div className="flex flex-wrap items-center justify-between gap-4 pt-2.5 border-t border-slate-800">
          <div className="flex items-center gap-3">
            <button
              id="btn-vr-toggle-anim"
              onClick={() => setIsAnimating(!isAnimating)}
              className={`inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-lg shadow-sm transition-all ${
                isAnimating
                  ? "bg-amber-600 hover:bg-amber-500 text-white"
                  : "bg-emerald-600 hover:bg-emerald-500 text-white"
              }`}
            >
              {isAnimating ? (
                <>
                  <Pause className="w-3.5 h-3.5" />
                  <span>Pausar Movimiento</span>
                </>
              ) : (
                <>
                  <Play className="w-3.5 h-3.5" />
                  <span>Reanudar Circulación</span>
                </>
              )}
            </button>

            <label className="flex items-center gap-2 text-xs text-slate-300 bg-slate-900/80 px-3 py-1.5 rounded-lg border border-slate-800">
              <Gauge className="w-3.5 h-3.5 text-indigo-400" />
              <span>Velocidad de Circulación:</span>
              <input
                id="range-vr-speed"
                type="range"
                min="0.2"
                max="3.0"
                step="0.1"
                value={animationSpeed}
                onChange={(e) => setAnimationSpeed(parseFloat(e.target.value))}
                className="w-24 accent-indigo-500 cursor-pointer"
              />
              <span className="font-mono text-indigo-300 w-9 text-right font-medium">{animationSpeed.toFixed(1)}x</span>
            </label>
          </div>
          
          <div className="flex items-center gap-3">
            <label className="flex items-center gap-2 text-xs text-slate-300 bg-slate-900/80 px-3 py-1.5 rounded-lg border border-slate-800">
              <span>Tamaño de Vectores (Reducido):</span>
              <input
                id="range-vr-scale"
                type="range"
                min="0.25"
                max="1.4"
                step="0.05"
                value={arrowScale}
                onChange={(e) => setArrowScale(parseFloat(e.target.value))}
                className="w-24 accent-indigo-500 cursor-pointer"
              />
              <span className="font-mono text-slate-400 w-9 text-right">{arrowScale.toFixed(2)}x</span>
            </label>
          </div>
        </div>
      </div>

      {/* Explicación teórica de la dinámica */}
      <div className="bg-slate-950/70 border border-indigo-900/40 rounded-lg p-3.5 text-xs text-slate-300">
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0 mt-0.5">
            <Sparkles className="w-4 h-4 text-indigo-400" />
          </div>
          <div className="text-slate-300 leading-relaxed">
            <p className="font-semibold text-indigo-300 mb-1 tracking-wide">
              DINÁMICA DE LOS VECTORES DE CIRCULACIÓN (VR) & ANCLAJE DE LA FANTASÍA:
            </p>
            <ul className="list-disc list-inside space-y-1 ml-1 text-slate-300">
              <li>
                <strong className="text-slate-100">MOVIMIENTO EN LAS CINTAS (S, I, Σ, Pulsión):</strong> Los vectores se desplazan de manera continua en tiempo real a lo largo de cada cinta. S y Σ circulan en sentido horario, I en sentido antihorario, transportando energía pulsional.
              </li>
              <li>
                <strong className="text-slate-100">LA VOZ (0,0,0) COMO ORIGEN:</strong> Emite pulsos vectoriales continuos desde el orificio central hacia el interior del horn torus, nutriendo el circuito de las cintas.
              </li>
              <li>
                <strong className="text-amber-300">FANTASÍA FUNDAMENTAL ($ ◇ a) — ANCLADA EN EL INCONSCIENTE:</strong> La fantasía está firmemente <em>anclada en el inconsciente</em> (garganta del horn torus en el punto F). <strong>NO SALEN VECTORES</strong> de ella: es un punto fijo estructural sin emisión ni circulación propia. Sostiene el marco psíquico sin proyectar flujo vectorial.
              </li>
              <li>
                <strong className="text-rose-300">TRAUMA (S-E-I):</strong> Zona donde la circulación está congelada por la Nachträglichkeit. Los vectores oscilan con magnitud reducida (0.3) sin poder fluir libremente hasta que el trabajo analítico restituya la circulación significante.
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Visualización 3D */}
      <div 
        className="relative w-full h-[460px] rounded-xl overflow-hidden bg-slate-950 border border-slate-800 shadow-inner"
        id="vector-circulacion-canvas-container"
      >
        <VectorCirculacionCanvas
          model={model}
          trayectorias={trayectorias}
          isAnimating={isAnimating}
          animationSpeed={animationSpeed}
          arrowScale={arrowScale}
          showVozVectors={showVozVectors}
          showTraumaVectors={showTraumaVectors}
          showFantasiaAnchor={showFantasiaAnchor}
        />
      </div>

      {/* Leyenda y estado de trayectorias activas */}
      <div className="bg-slate-950/70 rounded-lg p-3.5 border border-slate-800 text-slate-200">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
            <RotateCcw className="w-3.5 h-3.5 text-indigo-400" />
            Flujos y Anclas Topológicas Activas
          </span>
        </div>
        
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5 text-xs">
          <div className="flex items-center gap-2 p-2 rounded-lg bg-slate-900 border border-slate-800">
            <span className="w-3 h-3 rounded-full" style={{ backgroundColor: COLOR_PALETTE.S }} />
            <div>
              <div className="font-semibold text-slate-100">Simbólico (S)</div>
              <div className="text-[10px] text-slate-400">Giro horario continuo</div>
            </div>
          </div>
          
          <div className="flex items-center gap-2 p-2 rounded-lg bg-slate-900 border border-slate-800">
            <span className="w-3 h-3 rounded-full" style={{ backgroundColor: COLOR_PALETTE.I }} />
            <div>
              <div className="font-semibold text-slate-100">Imaginario (I)</div>
              <div className="text-[10px] text-slate-400">Giro antihorario</div>
            </div>
          </div>

          <div className="flex items-center gap-2 p-2 rounded-lg bg-slate-900 border border-slate-800">
            <span className="w-3 h-3 rounded-full" style={{ backgroundColor: COLOR_PALETTE.Sigma }} />
            <div>
              <div className="font-semibold text-slate-100">Sinthome (Σ)</div>
              <div className="text-[10px] text-slate-400">Nudo de anudamiento</div>
            </div>
          </div>

          <div className="flex items-center gap-2 p-2 rounded-lg bg-slate-900 border border-slate-800">
            <span className="w-3 h-3 rounded-full" style={{ backgroundColor: COLOR_PALETTE.Pulsion }} />
            <div>
              <div className="font-semibold text-slate-100">Pulsión (Trieb)</div>
              <div className="text-[10px] text-slate-400">Flujo libidinal</div>
            </div>
          </div>

          <div className="flex items-center gap-2 p-2 rounded-lg bg-slate-900 border border-slate-800">
            <span className="w-3 h-3 rounded-full border border-cyan-300 bg-cyan-400 shadow-sm shadow-cyan-500/50" />
            <div>
              <div className="font-semibold text-cyan-200">Voz (0,0,0)</div>
              <div className="text-[10px] text-slate-400">Emisión cian luminoso</div>
            </div>
          </div>

          <div className="flex items-center gap-2 p-2 rounded-lg bg-purple-950/40 border border-purple-800/80">
            <Anchor className="w-3.5 h-3.5 text-amber-300" />
            <div>
              <div className="font-semibold text-purple-200">Fantasía ($ ◇ a)</div>
              <div className="text-[10px] text-amber-300 font-medium">Anclada (Sin vectores)</div>
            </div>
          </div>
        </div>

        {showTraumaVectors && (
          <div className="mt-3 pt-2.5 border-t border-rose-900/60 bg-rose-950/40 rounded p-2.5 text-[11px] text-rose-200">
            <Heart className="w-3.5 h-3.5 inline-block mr-1.5 text-rose-400" />
            <strong className="text-rose-300">TRAUMA (S-E-I Oscilación Congelada):</strong> Los vectores no pueden circular libremente; oscilan en un bucle local de baja amplitud alrededor del punto traumático. La resolución terapéutica restaura la circulación tangencial por las cintas.
          </div>
        )}

        <div className="mt-2.5 pt-2 border-t border-slate-800 text-[11px] text-purple-300 flex items-center gap-2">
          <Anchor className="w-3.5 h-3.5 text-amber-400 flex-shrink-0" />
          <span>
            <strong>Fijación Fantasmática:</strong> La fantasía está localizada en el inconsciente estructural $(u_F={model.u_F.toFixed(2)}, v_F={model.v_F.toFixed(2)})$. Al ser un anclaje ontológico, no produce radiación vectorial propia ($\nabla \cdot \vec{"{VR}"} = 0$).
          </span>
        </div>
      </div>
    </div>
  );
};

// Canvas Three.js con animación continua de vectores en movimiento
interface VectorCirculacionCanvasProps {
  model: HornTorusFamiliaModel;
  trayectorias: VectorCirculacionTrayectoria[];
  isAnimating: boolean;
  animationSpeed: number;
  arrowScale: number;
  showVozVectors: boolean;
  showTraumaVectors: boolean;
  showFantasiaAnchor: boolean;
}

const VectorCirculacionCanvas: React.FC<VectorCirculacionCanvasProps> = ({
  model,
  trayectorias,
  isAnimating,
  animationSpeed,
  arrowScale,
  showVozVectors,
  showTraumaVectors,
  showFantasiaAnchor,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const controlsRef = useRef<OrbitControls | null>(null);
  const animationFrameRef = useRef<number | null>(null);

  // Referencias para objetos que se mueven en cada frame
  const animatedArrowsGroupRef = useRef<THREE.Group | null>(null);
  const fantasyGroupRef = useRef<THREE.Group | null>(null);
  const accumulatedTimeRef = useRef<number>(0);
  const lastTimeRef = useRef<number>(performance.now());
  const isAnimatingRef = useRef<boolean>(isAnimating);
  const animationSpeedRef = useRef<number>(animationSpeed);
  const arrowScaleRef = useRef<number>(arrowScale);

  useEffect(() => {
    isAnimatingRef.current = isAnimating;
  }, [isAnimating]);

  useEffect(() => {
    animationSpeedRef.current = animationSpeed;
  }, [animationSpeed]);

  useEffect(() => {
    arrowScaleRef.current = arrowScale;
  }, [arrowScale]);

  // Inicializar Three.js
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color("#070b14");
    sceneRef.current = scene;

    const width = container.clientWidth || 800;
    const height = container.clientHeight || 460;
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
    controls.dampingFactor = 0.05;
    controls.maxDistance = 250;
    controls.minDistance = 6;
    controlsRef.current = controls;

    // Luces
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.4);
    scene.add(ambientLight);

    const dirLight1 = new THREE.DirectionalLight(0xffffff, 1.8);
    dirLight1.position.set(30, 40, 30);
    scene.add(dirLight1);

    const dirLight2 = new THREE.DirectionalLight(0x818cf8, 1.2);
    dirLight2.position.set(-30, -20, -25);
    scene.add(dirLight2);

    // Grid de referencia tenue en la base
    const grid = new THREE.GridHelper(60, 30, 0x1e293b, 0x0f172a);
    grid.position.y = -model.r - 2;
    scene.add(grid);

    // Grupo de flechas en movimiento
    const animatedArrowsGroup = new THREE.Group();
    scene.add(animatedArrowsGroup);
    animatedArrowsGroupRef.current = animatedArrowsGroup;

    // Grupo de fantasía
    const fantasyGroup = new THREE.Group();
    scene.add(fantasyGroup);
    fantasyGroupRef.current = fantasyGroup;

    // Loop de render y movimiento continuo de vectores
    const animate = (currentTime: number) => {
      animationFrameRef.current = requestAnimationFrame(animate);

      const dt = (currentTime - lastTimeRef.current) * 0.001;
      lastTimeRef.current = currentTime;

      // Actualizar tiempo acumulado si está animando
      if (isAnimatingRef.current && dt < 0.2) {
        accumulatedTimeRef.current += dt * animationSpeedRef.current;
      }

      controls.update();

      // Pulsación del anclaje de la fantasía en el inconsciente
      if (fantasyGroupRef.current) {
        const pulse = 1.0 + 0.06 * Math.sin(accumulatedTimeRef.current * 2.2);
        fantasyGroupRef.current.scale.set(pulse, pulse, pulse);
      }

      // Actualizar la posición y orientación de los vectores móviles
      if (animatedArrowsGroupRef.current) {
        animatedArrowsGroupRef.current.children.forEach((child) => {
          const updateFn = (child as any).__updateVector;
          if (typeof updateFn === 'function') {
            updateFn(accumulatedTimeRef.current, arrowScaleRef.current);
          }
        });
      }

      renderer.render(scene, camera);
    };

    lastTimeRef.current = performance.now();
    animationFrameRef.current = requestAnimationFrame(animate);

    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth || 800;
      const h = container.clientHeight || 460;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
      controls.dispose();
      renderer.dispose();
      while (container.firstChild) {
        container.removeChild(container.firstChild);
      }
    };
  }, []);

  // Vector unitario hacia arriba para alineación de cuaterniones
  const UP = useMemo(() => new THREE.Vector3(0, 1, 0), []);

  // Construcción de micro-vectores volumétricos aerodinámicos de tamaño reducido
  const createMicroVector = (colorHex: string | number) => {
    const group = new THREE.Group();
    const color = new THREE.Color(colorHex);

    const mat = new THREE.MeshStandardMaterial({
      color: color,
      emissive: color,
      emissiveIntensity: 1.45,
      roughness: 0.22,
      metalness: 0.35,
    });

    // Cono de punta aerodinámica (reducido y nítido)
    const coneGeo = new THREE.ConeGeometry(0.10, 0.22, 12);
    const coneMesh = new THREE.Mesh(coneGeo, mat);
    coneMesh.position.y = 0.11;
    group.add(coneMesh);

    // Vástago cilíndrico delgado
    const cylGeo = new THREE.CylinderGeometry(0.035, 0.035, 0.16, 8);
    const cylMesh = new THREE.Mesh(cylGeo, mat);
    cylMesh.position.y = -0.06;
    group.add(cylMesh);

    // Perla luminosa de cola
    const sphereGeo = new THREE.SphereGeometry(0.045, 8, 8);
    const sphereMesh = new THREE.Mesh(sphereGeo, mat);
    sphereMesh.position.y = -0.15;
    group.add(sphereMesh);

    (group as any).dispose = () => {
      coneGeo.dispose();
      cylGeo.dispose();
      sphereGeo.dispose();
      mat.dispose();
    };

    return group;
  };

  // Cálculo analítico continuo de posición y vector tangente sobre las cintas del Horn Torus
  const getRibbonPointAndTangent = (
    cinta: 'S' | 'I' | 'Sigma' | 'Pulsion',
    u: number,
    modelObj: HornTorusFamiliaModel,
    tubeRad: number = 0.22,
    elevation: number = 0.06
  ) => {
    const phi_S = modelObj.v_S % (2 * Math.PI);
    const phi_I = modelObj.v_I % (2 * Math.PI);
    const phi_Sigma = modelObj.v_Sigma % (2 * Math.PI);
    const s = modelObj.pulsion_attachment_strength;

    const computeV = (angU: number): number => {
      switch (cinta) {
        case 'S':
          return angU + phi_S;
        case 'I':
          return -angU + phi_I;
        case 'Sigma':
          return 2.0 * angU + phi_Sigma;
        case 'Pulsion':
          return angU + phi_I + 0.35 + 0.15 * Math.sin(3.0 * angU) * s;
        default:
          return angU;
      }
    };

    const rho = 1.015 * modelObj.r + tubeRad + elevation;
    const v0 = computeV(u);
    const [x0, y0, z0] = modelObj.punto(u, v0, rho);

    // Pequeño paso du para vector tangente exacto sin saltos numéricos
    const du = 0.003;
    const u1 = u + du;
    const v1 = computeV(u1);
    const [x1, y1, z1] = modelObj.punto(u1, v1, rho);

    const pos = new THREE.Vector3(x0, z0, -y0);
    const ahead = new THREE.Vector3(x1, z1, -y1);
    const tangent = ahead.sub(pos).normalize();

    return { position: pos, tangent };
  };

  // Reconstruir la geometría estática del toro, cintas, ancla de fantasía y registrar vectores dinámicos
  useEffect(() => {
    const scene = sceneRef.current;
    const animatedGroup = animatedArrowsGroupRef.current;
    const fantasyGroup = fantasyGroupRef.current;
    if (!scene || !animatedGroup || !fantasyGroup) return;

    // 1. Limpiar objetos antiguos excepto las luces fijas y grupos
    const toRemove: THREE.Object3D[] = [];
    scene.children.forEach((child) => {
      if (
        child !== animatedGroup &&
        child !== fantasyGroup &&
        !(child instanceof THREE.Light) &&
        !(child instanceof THREE.GridHelper)
      ) {
        toRemove.push(child);
      }
    });

    toRemove.forEach((obj) => {
      scene.remove(obj);
      if (obj instanceof THREE.Mesh) {
        obj.geometry.dispose();
        if (Array.isArray(obj.material)) obj.material.forEach((m) => m.dispose());
        else obj.material.dispose();
      } else if (obj instanceof THREE.Line) {
        obj.geometry.dispose();
        obj.material.dispose();
      }
    });

    // Limpiar grupo de flechas dinámicas
    while (animatedGroup.children.length > 0) {
      const child = animatedGroup.children[0];
      animatedGroup.remove(child);
      if ((child as any).dispose) (child as any).dispose();
    }

    // Limpiar grupo de fantasía
    while (fantasyGroup.children.length > 0) {
      const child = fantasyGroup.children[0];
      fantasyGroup.remove(child);
      if (child instanceof THREE.Mesh) {
        child.geometry.dispose();
        if (Array.isArray(child.material)) child.material.forEach((m) => m.dispose());
        else child.material.dispose();
      }
    }

    // 2. Toro transparente (superficie del horn torus)
    const uSegments = 70;
    const vSegments = 40;
    const vMax = 2 * Math.PI;
    const positions: number[] = [];
    const normals: number[] = [];

    for (let j = 0; j <= vSegments; j++) {
      const v = (j / vSegments) * vMax;
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

    const indices: number[] = [];
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
    torusGeo.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
    torusGeo.setAttribute('normal', new THREE.Float32BufferAttribute(normals, 3));
    torusGeo.setIndex(indices);

    const torusMat = new THREE.MeshStandardMaterial({
      color: 0x1e293b,
      side: THREE.DoubleSide,
      roughness: 0.38,
      metalness: 0.12,
      transparent: true,
      opacity: 0.18,
      depthWrite: false,
    });
    const torusMesh = new THREE.Mesh(torusGeo, torusMat);
    scene.add(torusMesh);

    // 3. Origen de la Voz (0,0,0) - Garganta central en cian brillante luminoso (alto contraste)
    const voiceGeo = new THREE.SphereGeometry(0.7, 24, 24);
    const voiceMat = new THREE.MeshStandardMaterial({
      color: 0x00e5ff,
      emissive: 0x00b4d8,
      emissiveIntensity: 1.5,
      roughness: 0.1,
      metalness: 0.2,
    });
    const voiceMesh = new THREE.Mesh(voiceGeo, voiceMat);
    voiceMesh.position.set(0, 0, 0);
    scene.add(voiceMesh);

    // Halo concéntrico de la voz
    const voiceHaloGeo = new THREE.RingGeometry(0.75, 1.15, 32);
    const voiceHaloMat = new THREE.MeshBasicMaterial({
      color: 0x00e5ff,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.55,
    });
    const voiceHaloMesh = new THREE.Mesh(voiceHaloGeo, voiceHaloMat);
    voiceHaloMesh.rotation.x = Math.PI / 2;
    scene.add(voiceHaloMesh);

    // 4. Generar curvas de cintas desde el modelo y representarlas con TubeGeometry (cintas anchas 3D)
    const section4 = model.getSection4Curves(360);
    const ribbonCurves: Record<string, THREE.Vector3[]> = {
      S: section4.S.map(([x, y, z]) => new THREE.Vector3(x, z, -y)),
      I: section4.I.map(([x, y, z]) => new THREE.Vector3(x, z, -y)),
      Sigma: section4.Sigma.map(([x, y, z]) => new THREE.Vector3(x, z, -y)),
      Pulsion: section4.Pulsion.map(([x, y, z]) => new THREE.Vector3(x, z, -y)),
    };

    // Radio de la cinta tubular
    const ribbonTubeRadius = 0.22;

    // Dibujar las cintas con TubeGeometry volumétrico recorriendo toda la superficie
    Object.entries(ribbonCurves).forEach(([cintaKey, pts]) => {
      const curve = new THREE.CatmullRomCurve3(pts, true);
      const tubeGeo = new THREE.TubeGeometry(curve, 320, ribbonTubeRadius, 12, true);
      const colorHex = new THREE.Color(COLOR_PALETTE[cintaKey as keyof typeof COLOR_PALETTE] || "#ffffff").getHex();
      const tubeMat = new THREE.MeshStandardMaterial({
        color: colorHex,
        emissive: colorHex,
        emissiveIntensity: 0.42,
        roughness: 0.28,
        metalness: 0.22,
        transparent: true,
        opacity: 0.92,
      });
      const tubeMesh = new THREE.Mesh(tubeGeo, tubeMat);
      scene.add(tubeMesh);
    });

    // 5. Trauma (nodo fijo en el nudo de corte)
    const traumaPos = new THREE.Vector3(section4.traumaPoint[0], section4.traumaPoint[2], -section4.traumaPoint[1]);
    const traumaGeo = new THREE.IcosahedronGeometry(0.5, 0);
    const traumaMat = new THREE.MeshStandardMaterial({
      color: COLOR_PALETTE.trauma,
      emissive: COLOR_PALETTE.trauma,
      emissiveIntensity: 0.9,
      roughness: 0.2,
    });
    const traumaMesh = new THREE.Mesh(traumaGeo, traumaMat);
    traumaMesh.position.copy(traumaPos);
    scene.add(traumaMesh);

    // 6. FANTASÍA: ANCLADA EN EL INCONSCIENTE (MÁS CHICA EN EL ESPACIO, NO SALEN VECTORES)
    // Coordenadas en la cara interna del horn torus
    const fantasyPos = new THREE.Vector3(section4.fantasyPoint[0], section4.fantasyPoint[2], -section4.fantasyPoint[1]);
    fantasyGroup.position.copy(fantasyPos);

    // A) Base del Ancla: Anillo de fijación en el inconsciente (tamaño compacto)
    const anchorRingGeo = new THREE.TorusGeometry(0.32, 0.05, 16, 24);
    const anchorRingMat = new THREE.MeshStandardMaterial({
      color: 0xf59e0b, // Dorado
      emissive: 0xd97706,
      emissiveIntensity: 0.8,
      metalness: 0.8,
      roughness: 0.2,
    });
    const anchorRingMesh = new THREE.Mesh(anchorRingGeo, anchorRingMat);
    anchorRingMesh.rotation.x = Math.PI / 2;
    fantasyGroup.add(anchorRingMesh);

    // B) Diamante/Cristal Central ($ ◇ a) (más chico)
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

    // C) Barra transversal del ancla estructural (más chica)
    const crossBarGeo = new THREE.CylinderGeometry(0.03, 0.03, 0.55, 10);
    const crossBarMat = new THREE.MeshStandardMaterial({
      color: 0xfbbf24,
      emissive: 0xb45309,
      emissiveIntensity: 0.6,
      metalness: 0.7,
      roughness: 0.3,
    });
    const crossBarMesh = new THREE.Mesh(crossBarGeo, crossBarMat);
    crossBarMesh.rotation.z = Math.PI / 2;
    fantasyGroup.add(crossBarMesh);

    // D) Halo aura del inconsciente (pulsación sin emitir vectores, más chico)
    const fantasyAuraGeo = new THREE.SphereGeometry(0.48, 16, 16);
    const fantasyAuraMat = new THREE.MeshBasicMaterial({
      color: 0xa855f7,
      transparent: true,
      opacity: 0.25,
      wireframe: true,
    });
    const fantasyAuraMesh = new THREE.Mesh(fantasyAuraGeo, fantasyAuraMat);
    fantasyGroup.add(fantasyAuraMesh);

    // 7. CREAR MICRO-VECTORES EN MOVIMIENTO FLUIDO PARA CADA TRAYECTORIA ACTIVA
    // Nota: La fantasía NO emite vectores ("no salen vectores esta anclado en el inconsciente")
    trayectorias.forEach((trayectoria) => {
      // Si es la fantasía, NO generar flechas (es un punto fijo anclado)
      if (trayectoria.nombre.includes("Fantasia") || trayectoria.puntos.length === 0) {
        return;
      }

      // CASO A: Vectores desde la Voz (emisión continua centrífuga desde (0,0,0))
      if (trayectoria.nombre === "VR-Voz" && showVozVectors) {
        const numRays = 8;
        const arrowsPerRay = 3;
        const color = COLOR_PALETTE.voz;

        for (let r = 0; r < numRays; r++) {
          const angle = (r / numRays) * Math.PI * 2;
          const dirX = Math.cos(angle);
          const dirZ = Math.sin(angle);
          const maxDistance = model.r * 1.4;

          for (let a = 0; a < arrowsPerRay; a++) {
            const microVector = createMicroVector(color);
            const baseOffset = a / arrowsPerRay;

            (microVector as any).__updateVector = (time: number, scale: number) => {
              // Movimiento continuo desde el centro hacia afuera
              const progress = ((baseOffset + time * 0.22) % 1);
              const dist = progress * maxDistance;
              const yDisp = 0.7 * Math.sin(progress * Math.PI);

              microVector.position.set(dirX * dist, yDisp, dirZ * dist);
              const dir = new THREE.Vector3(dirX, 0.25 * Math.cos(progress * Math.PI), dirZ).normalize();
              microVector.quaternion.setFromUnitVectors(UP, dir);
              microVector.scale.set(scale * 0.85, scale * 0.85, scale * 0.85);
            };

            animatedGroup.add(microVector);
          }
        }
        return;
      }

      // CASO B: Vectores del Trauma (oscilación congelada sin circulación libre)
      if (trayectoria.nombre === "VR-Trauma" && showTraumaVectors) {
        const numTraumaArrows = 8;
        const color = COLOR_PALETTE.trauma;

        for (let i = 0; i < numTraumaArrows; i++) {
          const angle = (i / numTraumaArrows) * Math.PI * 2;
          const microVector = createMicroVector(color);

          (microVector as any).__updateVector = (time: number, scale: number) => {
            // Oscilación bloqueada/congelada en el trauma (S-E-I)
            const wiggle = 0.18 * Math.sin(time * 2.8 + i);
            const radius = 0.72 + wiggle;
            const curAngle = angle + 0.14 * Math.sin(time * 1.5 + i);

            microVector.position.set(
              traumaPos.x + radius * Math.cos(curAngle),
              traumaPos.y + 0.16 * Math.cos(time * 3 + i),
              traumaPos.z + radius * Math.sin(curAngle)
            );

            // Vector apuntando hacia el nudo o tangencialmente bloqueado
            const dir = new THREE.Vector3(
              -Math.sin(curAngle) * 0.65 - Math.cos(curAngle) * 0.35,
              0.22 * Math.sin(time * 2),
              Math.cos(curAngle) * 0.65 - Math.sin(curAngle) * 0.35
            ).normalize();

            microVector.quaternion.setFromUnitVectors(UP, dir);
            microVector.scale.set(scale * 0.75, scale * 0.75, scale * 0.75);
          };

          animatedGroup.add(microVector);
        }
        return;
      }

      // CASO C: Micro-Vectores tangentes desplazándose fluidamente por las Cintas (S, I, Sigma, Pulsion)
      const cintaKey = trayectoria.cinta as 'S' | 'I' | 'Sigma' | 'Pulsion';
      if (!cintaKey) return;

      const numArrows = 14; // Micro-vectores uniformemente espaciados por la cinta
      const colorHex = trayectoria.color || COLOR_PALETTE[cintaKey];
      const isClockwise = cintaKey === 'S' || cintaKey === 'Sigma' || cintaKey === 'Pulsion';
      const dirMultiplier = cintaKey === 'I' ? -1 : 1;
      const speedFactor = trayectoria.velocidad || 0.65;

      for (let k = 0; k < numArrows; k++) {
        const basePhase = k / numArrows;
        const microVector = createMicroVector(colorHex);

        (microVector as any).__updateVector = (time: number, scale: number) => {
          // Desplazamiento continuo en la dirección de la cinta
          const currentPhase = ((basePhase + dirMultiplier * time * 0.08 * speedFactor) % 1 + 1) % 1;
          const u = currentPhase * 2 * Math.PI;

          // Cálculo analítico directo de la posición y la tangente sobre la superficie
          const { position, tangent } = getRibbonPointAndTangent(
            cintaKey,
            u,
            model,
            ribbonTubeRadius,
            0.06
          );

          if (dirMultiplier < 0) {
            tangent.multiplyScalar(-1);
          }

          microVector.position.copy(position);
          microVector.quaternion.setFromUnitVectors(UP, tangent);
          microVector.scale.set(scale, scale, scale);
        };

        animatedGroup.add(microVector);
      }
    });

  }, [model, trayectorias, showVozVectors, showTraumaVectors, showFantasiaAnchor, UP]);

  return <div ref={containerRef} className="w-full h-full cursor-grab active:cursor-grabbing" />;
};

export default VectorCirculacionViewer;
