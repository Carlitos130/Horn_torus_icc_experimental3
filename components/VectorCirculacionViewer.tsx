"use client";

import React, { useState, useMemo, useEffect } from "react";
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
  Plus, 
  Sparkles,
  Target,
  X,
  RotateCcw,
  RotateCw,
  Eye,
  Heart 
} from "lucide-react";

interface ArrowMesh {
  mesh: THREE.ArrowHelper;
  trayectoria: string;
  cinta: string;
}

interface VectorCirculacionViewerProps {
  model: HornTorusFamiliaModel;
  height?: number;
}

export const VectorCirculacionViewer: React.FC<VectorCirculacionViewerProps> = ({
  model,
  height = 500,
}) => {
  const [trayectorias, setTrayectorias] = useState<VectorCirculacionTrayectoria[]>([]);
  const [isAnimating, setIsAnimating] = useState<boolean>(false);
  const [animationProgress, setAnimationProgress] = useState<number>(0);
  const [showVozVectors, setShowVozVectors] = useState<boolean>(true);
  const [showTraumaVectors, setShowTraumaVectors] = useState<boolean>(false);
  const [showFantasiaVectors, setShowFantasiaVectors] = useState<boolean>(false);
  const [showAllCintas, setShowAllCintas] = useState<boolean>(false);
  const [showIndividualCinta, setShowIndividualCinta] = useState<'S' | 'I' | 'Sigma' | 'Pulsion' | null>(null);
  const [arrowScale, setArrowScale] = useState<number>(1.0);

  const generator = useMemo(() => new VectorCirculacionGenerator(model), [model]);

  // Opciones de cintas
  const cintas = ['S', 'I', 'Sigma', 'Pulsion'] as const;
  const cintaLabels: Record<string, string> = {
    S: 'Significante (S)',
    I: 'Imagen (I)',
    Sigma: 'Síntoma (Σ)',
    Pulsion: 'Pulsión',
  };

  // Generar vectores desde la voz
  const handleGenerateVozVectors = () => {
    generator.clearTrayectorias();
    const vectores = generator.generarVRDesdeVoz(12, 3);
    
    // Crear trayectoria artificial para la voz
    const trayectoriaVoz: VectorCirculacionTrayectoria = {
      nombre: 'VR-Voz',
      cinta: 'S',
      puntos: vectores,
      color: COLOR_PALETTE.voz,
      velocidad: 0.8,
    };
    
    setTrayectorias([trayectoriaVoz]);
    setAnimationProgress(0);
    setIsAnimating(true);
    setShowVozVectors(true);
    setShowTraumaVectors(false);
    setShowFantasiaVectors(false);
    setShowAllCintas(false);
    setShowIndividualCinta(null);
  };

  // Generar vectores para el trauma
  const handleGenerateTraumaVectors = () => {
    generator.clearTrayectorias();
    const trayectoria = generator.generarVRTrauma(50);
    setTrayectorias([trayectoria]);
    setAnimationProgress(0);
    setIsAnimating(true);
    setShowVozVectors(false);
    setShowTraumaVectors(true);
    setShowFantasiaVectors(false);
    setShowAllCintas(false);
    setShowIndividualCinta(null);
  };

  // Generar vectores para la fantasía
  const handleGenerateFantasiaVectors = () => {
    generator.clearTrayectorias();
    const trayectoria = generator.generarVRFantasia(30);
    setTrayectorias([trayectoria]);
    setAnimationProgress(0);
    setIsAnimating(false); // La fantasía NO tiene circulación
    setShowVozVectors(false);
    setShowTraumaVectors(false);
    setShowFantasiaVectors(true);
    setShowAllCintas(false);
    setShowIndividualCinta(null);
  };

  // Generar vectores para una cinta específica
  const handleGenerateCintaVectors = (cinta: 'S' | 'I' | 'Sigma' | 'Pulsion') => {
    generator.clearTrayectorias();
    const trayectoria = generator.generarTrayectoriaVR({
      cinta,
      numPuntos: 100,
      sentido: 'clockwise',
    });
    setTrayectorias([trayectoria]);
    setAnimationProgress(0);
    setIsAnimating(true);
    setShowVozVectors(false);
    setShowTraumaVectors(false);
    setShowFantasiaVectors(false);
    setShowAllCintas(false);
    setShowIndividualCinta(cinta);
  };

  // Generar vectores para TODAS las cintas
  const handleGenerateAllCintas = () => {
    generator.clearTrayectorias();
    const nuevasTrayectorias: VectorCirculacionTrayectoria[] = [];
    
    cintas.forEach((cinta) => {
      const trayectoria = generator.generarTrayectoriaVR({
        cinta,
        numPuntos: 80,
        sentido: cinta === 'S' || cinta === 'Sigma' ? 'clockwise' : 'counterclockwise',
      });
      nuevasTrayectorias.push(trayectoria);
    });
    
    setTrayectorias(nuevasTrayectorias);
    setAnimationProgress(0);
    setIsAnimating(true);
    setShowVozVectors(false);
    setShowTraumaVectors(false);
    setShowFantasiaVectors(false);
    setShowAllCintas(true);
    setShowIndividualCinta(null);
  };

  // Generar TODO: Voz + Cintas + Trauma + Fantasía
  const handleGenerateCompleteSystem = () => {
    generator.clearTrayectorias();
    const nuevasTrayectorias: VectorCirculacionTrayectoria[] = [];
    
    // 1. Vectores desde la voz
    const vectoresVoz = generator.generarVRDesdeVoz(8, 2);
    nuevasTrayectorias.push({
      nombre: 'VR-Voz',
      cinta: 'S',
      puntos: vectoresVoz,
      color: COLOR_PALETTE.voz,
      velocidad: 0.9,
    });
    
    // 2. Vectores en todas las cintas
    cintas.forEach((cinta) => {
      const trayectoria = generator.generarTrayectoriaVR({
        cinta,
        numPuntos: 60,
        sentido: cinta === 'S' || cinta === 'Sigma' ? 'clockwise' : 'counterclockwise',
      });
      nuevasTrayectorias.push(trayectoria);
    });
    
    // 3. Vectores en el trauma (congelados)
    const trayectoriaTrauma = generator.generarVRTrauma(30);
    nuevasTrayectorias.push(trayectoriaTrauma);
    
    // 4. Vectores en la fantasía (sin circulación)
    const trayectoriaFantasia = generator.generarVRFantasia(20);
    nuevasTrayectorias.push(trayectoriaFantasia);
    
    setTrayectorias(nuevasTrayectorias);
    setAnimationProgress(0);
    setIsAnimating(true);
    setShowVozVectors(true);
    setShowTraumaVectors(true);
    setShowFantasiaVectors(true);
    setShowAllCintas(true);
    setShowIndividualCinta(null);
  };

  const handleClearAll = () => {
    generator.clearTrayectorias();
    setTrayectorias([]);
    setIsAnimating(false);
    setAnimationProgress(0);
    setShowVozVectors(true);
    setShowTraumaVectors(false);
    setShowFantasiaVectors(false);
    setShowAllCintas(false);
    setShowIndividualCinta(null);
  };

  const toggleAnimation = () => {
    setIsAnimating(!isAnimating);
    if (!isAnimating) {
      setAnimationProgress(0);
    }
  };

  // Calcular datos 3D para todas las trayectorias
  const trayectorias3D = useMemo(() => {
    return trayectorias.map((trayectoria) => {
      return generator.getTrayectoria3D(trayectoria);
    });
  }, [trayectorias, model]);

  return (
    <div className="flex flex-col gap-4 bg-slate-900 rounded-xl border border-slate-800 p-5 shadow-sm text-slate-100">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
        <div>
          <h3 className="text-base font-semibold text-slate-100 flex items-center gap-2">
            <RotateCcw className="w-4 h-4 text-indigo-400" />
            Vectores de Circulación (VR) en las Cintas S, I, Σ
          </h3>
          <p className="text-xs text-slate-400">
            Circulación de vectores tangentes a las cintas desde el agujero de la voz
          </p>
        </div>
      </div>

      {/* Control Panel */}
      <div className="bg-slate-950/70 rounded-lg p-4 border border-slate-800 flex flex-col gap-3">
        
        {/* Botones principales */}
        <div className="flex flex-wrap gap-2">
          <button
            onClick={handleGenerateCompleteSystem}
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 rounded-lg shadow-sm transition-all"
          >
            <Sparkles className="w-4 h-4" />
            <span>Sistema Completo (Voz + Cintas + Trauma + Fantasía)</span>
          </button>
          
          <button
            onClick={handleGenerateVozVectors}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border border-indigo-700 bg-indigo-950/60 hover:bg-indigo-900/60 text-indigo-300 transition-colors"
          >
            <Target className="w-3.5 h-3.5" />
            <span>Vectores desde la Voz</span>
          </button>
          
          <button
            onClick={handleGenerateAllCintas}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border border-emerald-700 bg-emerald-950/60 hover:bg-emerald-900/60 text-emerald-300 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Todas las Cintas</span>
          </button>
        </div>

        {/* Botones individuales por cinta */}
        <div className="flex flex-wrap gap-2 pt-2 border-t border-slate-800">
          {cintas.map((cinta) => (
            <button
              key={cinta}
              onClick={() => handleGenerateCintaVectors(cinta)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border hover:brightness-125 transition-all"
              style={{
                borderColor: COLOR_PALETTE[cinta as keyof typeof COLOR_PALETTE],
                backgroundColor: `${COLOR_PALETTE[cinta as keyof typeof COLOR_PALETTE]}20`,
                color: COLOR_PALETTE[cinta as keyof typeof COLOR_PALETTE],
              }}
            >
              <span className="font-semibold">
                {cinta}
              </span>
              <span className="text-slate-300 text-[11px]">
                {cintaLabels[cinta]}
              </span>
            </button>
          ))}
        </div>

        {/* Botones para trauma y fantasía */}
        <div className="flex flex-wrap gap-2 pt-2 border-t border-slate-800">
          <button
            onClick={handleGenerateTraumaVectors}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border border-rose-800 bg-rose-950/60 hover:bg-rose-900/60 text-rose-300 transition-colors"
          >
            <X className="w-3.5 h-3.5" />
            <span>Trauma (S-E-I Congelado)</span>
          </button>
          
          <button
            onClick={handleGenerateFantasiaVectors}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border border-purple-800 bg-purple-950/60 hover:bg-purple-900/60 text-purple-300 transition-colors"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Fantasía (Sin Circulación)</span>
          </button>
          
          <button
            onClick={handleClearAll}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border border-slate-700 bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Limpiar Todo</span>
          </button>
        </div>

        {/* Controles de animación */}
        <div className="flex items-center gap-4 pt-2 border-t border-slate-800">
          <button
            onClick={toggleAnimation}
            disabled={trayectorias.length === 0}
            className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 disabled:cursor-not-allowed rounded-lg shadow-sm transition-all"
          >
            {isAnimating ? (
              <>
                <Pause className="w-3.5 h-3.5" />
                <span>Pausar</span>
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5" />
                <span>Animar Vectores</span>
              </>
            )}
          </button>
          
          <div className="flex items-center gap-4">
            <label className="flex items-center gap-2 text-xs text-slate-300">
              <span>Escala de Flechas:</span>
              <input
                type="range"
                min="0.1"
                max="2"
                step="0.1"
                value={arrowScale}
                onChange={(e) => setArrowScale(parseFloat(e.target.value))}
                className="w-24 accent-indigo-500 cursor-pointer"
              />
              <span className="font-mono text-slate-400">{arrowScale.toFixed(1)}x</span>
            </label>
          </div>
        </div>
      </div>

      {/* Explicación teórica */}
      {trayectorias.length > 0 && (
        <div className="bg-slate-950/70 border border-indigo-900/40 rounded-lg p-3.5 text-xs text-slate-300">
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0 mt-0.5">
              <Sparkles className="w-4 h-4 text-indigo-400" />
            </div>
            <div className="text-slate-300 leading-relaxed">
              <p className="font-semibold text-indigo-300 mb-1 tracking-wide">
                TEORÍA DE LOS VECTORES DE CIRCULACIÓN (VR):
              </p>
              <ul className="list-disc list-inside space-y-1 ml-1 text-slate-300">
                <li><strong className="text-slate-100">LA VOZ (0,0,0):</strong> Origen de los VR. Emite vectores que circulan por las cintas S, I, Σ a través de las pulsiones.</li>
                <li><strong className="text-slate-100">CINTAS S, I, Σ:</strong> Los VR son tangentes a cada cinta y transportan energía pulsional. Circulan en sentido horario o antihorario.</li>
                <li><strong className="text-slate-100">TRAUMA:</strong> Punto donde S-E-I está <em>congelado</em> por la Nachträglichkeit. Los VR tienen magnitud reducida (0.3). <em>El trauma SE PUEDE RESOLVER</em> al circular los VR.</li>
                <li><strong className="text-slate-100">FANTASÍA:</strong> Punto fijo donde <em>NO HAY CIRCULACIÓN</em>. Los VR apuntan hacia el punto fantasma con magnitud cero.</li>
                <li><strong className="text-slate-100">LO Icc:</strong> <em>NO todo lo Icc es reprimido</em>. Lo reprimido (ICC) puede volver a descifrarse. La fantasía tiene puntos no simbolizados que NO pueden volverse conscientes.</li>
                <li><strong className="text-slate-100">CONSTRUCCIÓN:</strong> &quot;Pegan a un niño&quot; - Lo Icc se construye a través de identificaciones primarias.</li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Visualización 3D */}
      <div 
        className="relative w-full h-[400px] rounded-xl overflow-hidden bg-slate-950 border border-slate-800 shadow-inner"
        id="vector-circulacion-canvas"
      >
        <VectorCirculacionCanvas
          model={model}
          trayectorias={trayectorias}
          trayectorias3D={trayectorias3D}
          isAnimating={isAnimating}
          setIsAnimating={setIsAnimating}
          animationProgress={animationProgress}
          setAnimationProgress={setAnimationProgress}
          showVozVectors={showVozVectors}
          showTraumaVectors={showTraumaVectors}
          showFantasiaVectors={showFantasiaVectors}
          arrowScale={arrowScale}
        />
      </div>

      {/* Información de trayectorias activas */}
      {trayectorias.length > 0 && (
        <div className="bg-slate-950/70 rounded-lg p-3.5 border border-slate-800 text-slate-200">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
              Trayectorias Activas ({trayectorias.length})
            </span>
          </div>
          
          <div className="flex flex-wrap gap-2">
            {trayectorias.map((trayectoria, idx) => (
              <div
                key={idx}
                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-medium"
                style={{
                  backgroundColor: `${trayectoria.color}25`,
                  color: trayectoria.color,
                  border: `1px solid ${trayectoria.color}60`
                }}
              >
                <span className="font-semibold">{trayectoria.nombre}</span>
                <span className="opacity-80">
                  (Cinta: {cintaLabels[trayectoria.cinta] || trayectoria.cinta})
                </span>
                <span className="text-[10px] opacity-60">
                  | V: {trayectoria.velocidad.toFixed(1)} | P: {trayectoria.puntos.length}
                </span>
              </div>
            ))}
          </div>
          
          <div className="mt-3 pt-3 border-t border-slate-800 text-[11px] text-slate-400">
            <div className="flex items-center flex-wrap gap-4">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: COLOR_PALETTE.S }} />
                <span>S: Significante</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: COLOR_PALETTE.I }} />
                <span>I: Imagen</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: COLOR_PALETTE.Sigma }} />
                <span>Σ: Síntoma</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: COLOR_PALETTE.Pulsion }} />
                <span>Pulsión</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full border border-white bg-black" />
                <span>Voz (Origen)</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: COLOR_PALETTE.trauma }} />
                <span>Trauma (Congelado)</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: COLOR_PALETTE.fant }} />
                <span>Fantasía (Sin Circulación)</span>
              </div>
            </div>
          </div>
          
          {showTraumaVectors && (
            <div className="mt-3 pt-2.5 border-t border-rose-900/60 bg-rose-950/40 rounded p-2.5 text-[11px] text-rose-200">
              <Heart className="w-3.5 h-3.5 inline-block mr-1.5 text-rose-400" />
              <strong className="text-rose-300">TRAUMA (S-E-I Congelado):</strong> Los vectores tienen magnitud reducida (0.3). 
              Representan el nudo S-E-I congelado por la Nachträglichkeit. 
              <em> El trauma SE PUEDE RESOLVER</em> al circular los VR por las cintas.
            </div>
          )}
          
          {showFantasiaVectors && (
            <div className="mt-3 pt-2.5 border-t border-purple-900/60 bg-purple-950/40 rounded p-2.5 text-[11px] text-purple-200">
              <Eye className="w-3.5 h-3.5 inline-block mr-1.5 text-purple-400" />
              <strong className="text-purple-300">FANTASÍA:</strong> Punto fijo donde <em>NO HAY CIRCULACIÓN</em>. 
              Los vectores apuntan hacia el punto fantasma con magnitud cero. 
              Puntos no simbolizados que NO pueden volverse conscientes.
            </div>
          )}
        </div>
      )}
    </div>
  );
};

// Componente del canvas para Three.js
interface VectorCirculacionCanvasProps {
  model: HornTorusFamiliaModel;
  trayectorias: VectorCirculacionTrayectoria[];
  trayectorias3D: {
    puntos: [number, number, number][];
    vectores: [number, number, number][];
  }[];
  isAnimating: boolean;
  setIsAnimating: (animating: boolean) => void;
  animationProgress: number;
  setAnimationProgress: (progress: number) => void;
  showVozVectors: boolean;
  showTraumaVectors: boolean;
  showFantasiaVectors: boolean;
  arrowScale: number;
}

const VectorCirculacionCanvas: React.FC<VectorCirculacionCanvasProps> = ({
  model,
  trayectorias,
  trayectorias3D,
  isAnimating,
  setIsAnimating,
  animationProgress,
  setAnimationProgress,
  showVozVectors,
  showTraumaVectors,
  showFantasiaVectors,
  arrowScale,
}) => {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const rendererRef = React.useRef<THREE.WebGLRenderer | null>(null);
  const sceneRef = React.useRef<THREE.Scene | null>(null);
  const cameraRef = React.useRef<THREE.PerspectiveCamera | null>(null);
  const controlsRef = React.useRef<OrbitControls | null>(null);
  const animationRef = React.useRef<number | null>(null);
  const meshesRef = React.useRef<THREE.Object3D[]>([]);
  const arrowsRef = React.useRef<THREE.ArrowHelper[]>([]);

  // Inicializar escena Three.js
  React.useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color("#090d16");
    sceneRef.current = scene;

    const width = container.clientWidth || 800;
    const height = container.clientHeight || 400;
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.set(40, 35, 45);
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
    controls.minDistance = 5;
    controlsRef.current = controls;

    // Iluminación
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.2);
    scene.add(ambientLight);

    const dirLight1 = new THREE.DirectionalLight(0xffffff, 2.0);
    dirLight1.position.set(30, 45, 30);
    scene.add(dirLight1);

    const dirLight2 = new THREE.DirectionalLight(0x90b0e0, 1.2);
    dirLight2.position.set(-30, -25, -20);
    scene.add(dirLight2);

    // Grid
    const grid = new THREE.GridHelper(60, 30, 0x1e293b, 0x0f172a);
    grid.position.y = -model.r - 2;
    scene.add(grid);

    // Animation loop
    const animate = () => {
      animationRef.current = requestAnimationFrame(animate);
      controls.update();
      renderer.render(scene, camera);
    };
    animate();

    // Resize handler
    const handleResize = () => {
      if (!container) return;
      const width = container.clientWidth || 800;
      const height = container.clientHeight || 400;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
      controls.dispose();
      renderer.dispose();
      while (container.firstChild) {
        container.removeChild(container.firstChild);
      }
    };
  }, []);

  // Actualizar escena cuando cambian los datos
  React.useEffect(() => {
    const scene = sceneRef.current;
    const renderer = rendererRef.current;
    const camera = cameraRef.current;
    
    if (!scene || !renderer || !camera) return;

    // Limpiar meshes anteriores
    meshesRef.current.forEach((mesh) => {
      scene.remove(mesh);
      if (mesh instanceof THREE.Mesh) {
        mesh.geometry.dispose();
        if (Array.isArray(mesh.material)) {
          mesh.material.forEach(m => m.dispose());
        } else {
          mesh.material.dispose();
        }
      } else if (mesh instanceof THREE.Line) {
        mesh.geometry.dispose();
        mesh.material.dispose();
      }
    });
    meshesRef.current = [];

    // Limpiar flechas anteriores
    arrowsRef.current.forEach((arrow) => {
      scene.remove(arrow);
      arrow.dispose();
    });
    arrowsRef.current = [];

    // 1. Dibujar la superficie del toro (transparente)
    const uSegments = 60;
    const vSegments = 30;
    const vMax = Math.PI;

    const positions: number[] = [];
    const normals: number[] = [];

    for (let j = 0; j <= vSegments; j++) {
      const v = (j / vSegments) * vMax;
      for (let i = 0; i <= uSegments; i++) {
        const u = (i / uSegments) * 2 * Math.PI;
        const [x, y, z] = model.punto(u, v);
        positions.push(x, z, -y);

        const rad = model.R + model.r * Math.cos(v);
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

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
    geometry.setAttribute('normal', new THREE.Float32BufferAttribute(normals, 3));
    geometry.setIndex(indices);

    const surfaceMaterial = new THREE.MeshStandardMaterial({
      color: 0x94a3b8,
      side: THREE.DoubleSide,
      roughness: 0.4,
      metalness: 0.1,
      transparent: true,
      opacity: 0.25,
      depthWrite: true,
    });

    const torusMesh = new THREE.Mesh(geometry, surfaceMaterial);
    scene.add(torusMesh);
    meshesRef.current.push(torusMesh);

    // 2. Dibujar el punto de la voz (origen)
    const voiceGeo = new THREE.SphereGeometry(0.8, 16, 16);
    const voiceMat = new THREE.MeshStandardMaterial({
      color: 0x000000,
      emissive: 0x60a5fa,
      emissiveIntensity: 1.0,
      roughness: 0.1,
    });
    const voiceMesh = new THREE.Mesh(voiceGeo, voiceMat);
    voiceMesh.position.set(0, 0, 0);
    scene.add(voiceMesh);
    meshesRef.current.push(voiceMesh);

    // 3. Dibujar el punto del fantasma
    const s4 = model.getSection4Curves(60);
    const fantasyGeo = new THREE.BoxGeometry(0.8, 0.8, 0.8);
    const fantasyMat = new THREE.MeshStandardMaterial({
      color: COLOR_PALETTE.fant,
      emissive: COLOR_PALETTE.fant,
      emissiveIntensity: 0.8,
      roughness: 0.2,
    });
    const fantasyMesh = new THREE.Mesh(fantasyGeo, fantasyMat);
    fantasyMesh.position.set(s4.fantasyPoint[0], s4.fantasyPoint[2], -s4.fantasyPoint[1]);
    scene.add(fantasyMesh);
    meshesRef.current.push(fantasyMesh);

    // 4. Dibujar el punto del trauma
    const traumaGeo = new THREE.IcosahedronGeometry(0.6, 0);
    const traumaMat = new THREE.MeshStandardMaterial({
      color: COLOR_PALETTE.trauma,
      emissive: COLOR_PALETTE.trauma,
      emissiveIntensity: 0.6,
      roughness: 0.2,
    });
    const traumaMesh = new THREE.Mesh(traumaGeo, traumaMat);
    traumaMesh.position.set(s4.traumaPoint[0], s4.traumaPoint[2], -s4.traumaPoint[1]);
    scene.add(traumaMesh);
    meshesRef.current.push(traumaMesh);

    // 5. Dibujar las curvas S, I, Σ, Pulsión
    const curves = model.getSection4Curves(200);
    const curveList: { name: string; points: [number, number, number][]; color: string }[] = [
      { name: "S", points: curves.S, color: COLOR_PALETTE.S },
      { name: "I", points: curves.I, color: COLOR_PALETTE.I },
      { name: "Pulsion", points: curves.Pulsion, color: COLOR_PALETTE.Pulsion },
      { name: "Sigma", points: curves.Sigma, color: COLOR_PALETTE.Sigma },
    ];

    curveList.forEach(({ points, color }) => {
      const curvePoints = points.map(([x, y, z]) => new THREE.Vector3(x, z, -y));
      const curveGeo = new THREE.BufferGeometry().setFromPoints(curvePoints);
      const curveMat = new THREE.LineBasicMaterial({
        color: new THREE.Color(color).getHex(),
        linewidth: 3,
        transparent: true,
        opacity: 0.8,
      });
      const curveLine = new THREE.Line(curveGeo, curveMat);
      scene.add(curveLine);
      meshesRef.current.push(curveLine);
    });

    // 6. Dibujar los vectores de circulación (flechas)
    trayectorias3D.forEach((trayectoria3D, idx) => {
      const trayectoria = trayectorias[idx];
      const { puntos, vectores } = trayectoria3D;
      
      const numToShow = isAnimating 
        ? Math.floor(animationProgress * puntos.length)
        : puntos.length;
      
      const pointsToShow = puntos.slice(0, Math.min(numToShow, puntos.length));
      const vectorsToShow = vectores.slice(0, Math.min(numToShow, vectores.length));

      vectorsToShow.forEach((vectorDir, vecIdx) => {
        const point = pointsToShow[vecIdx];
        if (!point) return;
        
        const origin = new THREE.Vector3(point[0], point[2], -point[1]);
        
        // Escalar el vector según la magnitud y arrowScale
        const vector = new THREE.Vector3(
          vectorDir[0] * arrowScale * 2,
          vectorDir[2] * arrowScale * 2,
          -vectorDir[1] * arrowScale * 2
        );
        
        // Color según la trayectoria
        const arrowColor = new THREE.Color(trayectoria.color);
        
        // Crear flecha
        const arrow = new THREE.ArrowHelper(
          vector.clone().normalize(),
          origin,
          vector.length(),
          arrowColor,
          0.3 * arrowScale,
          0.15 * arrowScale
        );
        
        scene.add(arrow);
        arrowsRef.current.push(arrow);
        meshesRef.current.push(arrow);
      });
    });

    renderer.render(scene, camera);

  }, [model, trayectorias, trayectorias3D, isAnimating, animationProgress, arrowScale]);

  // Animación de progreso
  React.useEffect(() => {
    if (!isAnimating || trayectorias.length === 0) return;

    let startTime: number | null = null;
    const duration = 8000; // 8 segundos para la animación completa

    const animateProgress = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const elapsed = timestamp - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      setAnimationProgress(progress);
      
      if (progress < 1) {
        animationRef.current = requestAnimationFrame(animateProgress);
      } else {
        setAnimationProgress(1);
        setIsAnimating(false);
      }
    };

    animationRef.current = requestAnimationFrame(animateProgress);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isAnimating, trayectorias.length]);

  return <div ref={containerRef} className="w-full h-full" />;
};

export default VectorCirculacionViewer;
