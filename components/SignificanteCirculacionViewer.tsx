"use client";

import React, { useState, useMemo } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { HornTorusFamiliaModel, COLOR_PALETTE, SignificanteCirculacion, SignificanteTracker } from "@/lib/hornTorusMath";
import { Play, Pause, Trash2, Plus, Sparkles } from "lucide-react";

interface CirculacionPoint {
  position: [number, number, number];
  color: string;
  size: number;
  isSignificante: boolean;
}

interface CirculacionLine {
  points: [number, number, number][];
  color: string;
  linewidth: number;
  isActive: boolean;
}

interface SignificanteCirculacionViewerProps {
  model: HornTorusFamiliaModel;
  height?: number;
}

export const SignificanteCirculacionViewer: React.FC<SignificanteCirculacionViewerProps> = ({
  model,
  height = 500,
}) => {
  const [circulaciones, setCirculaciones] = useState<SignificanteCirculacion[]>([]);
  const [isAnimating, setIsAnimating] = useState<boolean>(false);
  const [animationProgress, setAnimationProgress] = useState<number>(0);
  const [showAngustia, setShowAngustia] = useState<boolean>(true);
  const [showRupturaZone, setShowRupturaZone] = useState<boolean>(true);
  
  const tracker = useMemo(() => new SignificanteTracker(model), [model]);

  // Predefined significante/significado pairs from Lacanian theory
  const predefinedPairs = [
    {
      name: "Falo / Falta",
      significante: "Φ (Falo)",
      significado: "falta / castración",
      color: COLOR_PALETTE.S,
    },
    {
      name: "Nombre-del-Padre / Ley",
      significante: "Nombre-del-Padre",
      significado: "Ley simbólica / Prohibición",
      color: "#1e40af",
    },
    {
      name: "Deseo / Objeto a",
      significante: "Deseo",
      significado: "objeto a (causa del deseo)",
      color: "#be123c",
    },
    {
      name: "Madre / Amor",
      significante: "madre",
      significado: "amor / demanda",
      color: "#8b5cf6",
    },
    {
      name: "Padre / Autoridad",
      significante: "padre",
      significado: "autoridad / interdicción",
      color: "#16a34a",
    },
    {
      name: "Yo / Otro",
      significante: "yo",
      significado: "Otro (alteridad)",
      color: "#ea580c",
    },
  ];

  const handleAddCirculacion = (pair: typeof predefinedPairs[0]) => {
    tracker.clearCirculaciones();
    
    const { significante, significado, color } = pair;
    const circ = tracker.generarCirculacionEnS(significante, significado, 200);
    
    // Override color
    circ.color = color;
    
    setCirculaciones([circ]);
    setAnimationProgress(0);
    setIsAnimating(true);
  };

  const handleAddSSPair = (pair: typeof predefinedPairs[0]) => {
    tracker.clearCirculaciones();
    
    const { significante, significado, color } = pair;
    const result = tracker.generarCirculacionSignificanteSignificado(
      significante,
      significado,
      200
    );
    
    result.significante.color = color;
    result.significado.color = COLOR_PALETTE.I;
    
    setCirculaciones([result.significante, result.significado]);
    setAnimationProgress(0);
    setIsAnimating(true);
  };

  const handleAddRupturaCirculacion = (pair: typeof predefinedPairs[0]) => {
    tracker.clearCirculaciones();
    
    const { significante, color } = pair;
    const circ = tracker.generarCirculacionConRuptura(significante, 200);
    circ.color = color;
    
    setCirculaciones([circ]);
    setAnimationProgress(0);
    setIsAnimating(true);
  };

  const handleClearAll = () => {
    tracker.clearCirculaciones();
    setCirculaciones([]);
    setIsAnimating(false);
    setAnimationProgress(0);
  };

  const toggleAnimation = () => {
    setIsAnimating(!isAnimating);
    if (!isAnimating) {
      setAnimationProgress(0);
    }
  };

  // Calculate 3D points for all circulaciones
  const circulacionLines: CirculacionLine[] = useMemo(() => {
    return circulaciones.map((circ) => {
      const points3D = tracker.getCirculacion3D(circ);
      return {
        points: points3D,
        color: circ.color,
        linewidth: circ.nombre.includes("significado") ? 3 : 4,
        isActive: true,
      };
    });
  }, [circulaciones, model]);

  // Calculate angustia values for color mapping
  const angustiaValues: number[][] = useMemo(() => {
    return circulaciones.map((circ) => {
      return tracker.calculateAngustiaEnTrayectoria(circ);
    });
  }, [circulaciones, model]);

  // Calculate rupture flags
  const rupturaFlags: boolean[][] = useMemo(() => {
    return circulaciones.map((circ) => {
      return tracker.checkRupturaEnTrayectoria(circ);
    });
  }, [circulaciones, model]);

  // Get animated points (only show up to current progress)
  const getAnimatedPoints = (): CirculacionPoint[] => {
    if (!isAnimating) {
      // Show all points when not animating
      return circulaciones.flatMap((circ, circIdx) => {
        const points3D = tracker.getCirculacion3D(circ);
        const angustia = angustiaValues[circIdx];
        const ruptura = rupturaFlags[circIdx];
        
        return points3D.map((point, idx) => ({
          position: point,
          color: circ.color,
          size: ruptura[idx] ? 0.4 : (angustia[idx] < model.A_cr ? 0.3 : 0.15),
          isSignificante: !circ.nombre.includes("significado"),
        }));
      });
    }
    
    // Show only points up to animation progress
    const progressIdx = Math.floor(animationProgress * (circulaciones[0]?.trayectoria.length || 100));
    
    return circulaciones.flatMap((circ, circIdx) => {
      const points3D = tracker.getCirculacion3D(circ);
      const angustia = angustiaValues[circIdx];
      const ruptura = rupturaFlags[circIdx];
      const maxPoints = Math.min(progressIdx, points3D.length);
      
      return points3D.slice(0, maxPoints).map((point, idx) => ({
        position: point,
        color: circ.color,
        size: ruptura[idx] ? 0.4 : (angustia[idx] < model.A_cr ? 0.3 : 0.15),
        isSignificante: !circ.nombre.includes("significado"),
      }));
    });
  };

  const animatedPoints = getAnimatedPoints();

  return (
    <div className="flex flex-col gap-4 bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
        <div>
          <h3 className="text-base font-semibold text-slate-900 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-indigo-600" />
            Circulación de Significante/Significado en el Horn Torus
          </h3>
          <p className="text-xs text-slate-500">
            Visualización lacaniana: "El significante representa al sujeto para otro significante"
          </p>
        </div>
      </div>

      {/* Control Panel */}
      <div className="bg-slate-50 rounded-lg p-4 border border-slate-200 flex flex-col gap-3">
        <div className="flex flex-wrap gap-2">
          {predefinedPairs.map((pair, idx) => (
            <button
              key={idx}
              onClick={() => handleAddCirculacion(pair)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border border-slate-300 bg-white hover:bg-slate-100 hover:border-slate-400 transition-colors shadow-sm"
              title={`Añadir circulación: ${pair.name}`}
            >
              <span className="font-semibold text-slate-800">{pair.significante}</span>
              <span className="text-slate-500">→</span>
              <span className="text-slate-600">{pair.significado}</span>
            </button>
          ))}
        </div>

        <div className="flex flex-wrap gap-2 pt-2 border-t border-slate-200">
          <button
            onClick={() => handleAddSSPair(predefinedPairs[0])}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border border-indigo-300 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 hover:text-indigo-900 transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>S + s (Significante + Significado)</span>
          </button>
          
          <button
            onClick={() => handleAddRupturaCirculacion(predefinedPairs[0])}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border border-rose-300 bg-rose-50 hover:bg-rose-100 text-rose-700 hover:text-rose-900 transition-colors"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Con Ruptura (Angustia)</span>
          </button>
          
          <button
            onClick={handleClearAll}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border border-slate-300 bg-white hover:bg-slate-100 text-slate-700 hover:text-slate-900 transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Limpiar Todo</span>
          </button>
        </div>

        <div className="flex items-center gap-4 pt-2 border-t border-slate-200">
          <button
            onClick={toggleAnimation}
            disabled={circulaciones.length === 0}
            className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg shadow-sm transition-all"
          >
            {isAnimating ? (
              <>
                <Pause className="w-3.5 h-3.5" />
                <span>Pausar</span>
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5" />
                <span>Animar Circulación</span>
              </>
            )}
          </button>
          
          <div className="flex items-center gap-2">
            <label className="flex items-center gap-1.5 cursor-pointer text-xs text-slate-600">
              <input
                type="checkbox"
                checked={showAngustia}
                onChange={(e) => setShowAngustia(e.target.checked)}
                className="rounded accent-indigo-600"
              />
              <span>Colorear por Angustia</span>
            </label>
            
            <label className="flex items-center gap-1.5 cursor-pointer text-xs text-slate-600">
              <input
                type="checkbox"
                checked={showRupturaZone}
                onChange={(e) => setShowRupturaZone(e.target.checked)}
                className="rounded accent-rose-600"
              />
              <span>Mostrar Zona de Ruptura</span>
            </label>
          </div>
        </div>
      </div>

      {/* Theory Explanation */}
      {circulaciones.length > 0 && (
        <div className="bg-indigo-50/70 border border-indigo-200 rounded-lg p-3 text-xs text-indigo-900">
          <p className="font-semibold text-indigo-950 mb-1">
            TEORÍA LACANIANA DE LA CIRCULACIÓN:
          </p>
          <p className="text-indigo-900/90 leading-relaxed">
            <strong>"El significante representa al sujeto para otro significante"</strong> (Lacan, Sem. XI).
            La circulación en el horn torus muestra cómo el significante (S) se desliza
            bajo la cadena, produciendo efectos de significado que nunca se fijan.
            Cuando la circulación pasa cerca del <em>fantasma</em> (u_F, v_F), entra en la
            <em>zona de ruptura</em> (A ≤ π/4) donde surge la angustia de castración.
          </p>
        </div>
      )}

      {/* 3D Visualization Canvas */}
      <div 
        className="relative w-full h-[400px] rounded-xl overflow-hidden bg-slate-950 border border-slate-800"
        id="significante-circulacion-canvas"
      >
        <SignificanteCirculacionCanvas
          model={model}
          circulacionLines={circulacionLines}
          animatedPoints={animatedPoints}
          isAnimating={isAnimating}
          setAnimationProgress={setAnimationProgress}
          showAngustia={showAngustia}
          showRupturaZone={showRupturaZone}
          angustiaValues={angustiaValues}
          rupturaFlags={rupturaFlags}
        />
      </div>

      {/* Circulation Info */}
      {circulaciones.length > 0 && (
        <div className="bg-slate-50 rounded-lg p-3 border border-slate-200">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-800 uppercase tracking-wider">
              Circulaciones Activas ({circulaciones.length})
            </span>
          </div>
          
          <div className="flex flex-wrap gap-2">
            {circulaciones.map((circ, idx) => (
              <div
                key={idx}
                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-medium"
                style={{ backgroundColor: `${circ.color}20`, color: circ.color, border: `1px solid ${circ.color}40` }}
              >
                <span className="font-semibold">{circ.nombre}</span>
                <span className="opacity-70">→ {circ.significado}</span>
                <span className="text-[10px] opacity-50">
                  ({circ.trayectoria.length} puntos, {circ.direccion})
                </span>
              </div>
            ))}
          </div>
          
          {circulaciones.length > 0 && (
            <div className="mt-3 pt-3 border-t border-slate-200 text-[11px] text-slate-600">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-indigo-500" />
                  <span>Significante (S)</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                  <span>Significado (s)</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
                  <span>Zona de Ruptura</span>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

// Separate component for Three.js canvas to avoid re-renders
interface SignificanteCirculacionCanvasProps {
  model: HornTorusFamiliaModel;
  circulacionLines: CirculacionLine[];
  animatedPoints: CirculacionPoint[];
  isAnimating: boolean;
  setAnimationProgress: (progress: number) => void;
  showAngustia: boolean;
  showRupturaZone: boolean;
  angustiaValues: number[][];
  rupturaFlags: boolean[][];
}

const SignificanteCirculacionCanvas: React.FC<SignificanteCirculacionCanvasProps> = ({
  model,
  circulacionLines,
  animatedPoints,
  isAnimating,
  setAnimationProgress,
  showAngustia,
  showRupturaZone,
  angustiaValues,
  rupturaFlags,
}) => {
  const canvasRef = React.useRef<HTMLCanvasElement>(null);
  const rendererRef = React.useRef<THREE.WebGLRenderer | null>(null);
  const sceneRef = React.useRef<THREE.Scene | null>(null);
  const cameraRef = React.useRef<THREE.PerspectiveCamera | null>(null);
  const controlsRef = React.useRef<OrbitControls | null>(null);
  const animationRef = React.useRef<number | null>(null);
  const meshesRef = React.useRef<THREE.Object3D[]>([]);

  // Initialize Three.js scene
  React.useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color("#090d16");
    sceneRef.current = scene;

    const width = canvas.clientWidth;
    const height = canvas.clientHeight;
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.set(40, 35, 45);
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    canvas.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.maxDistance = 250;
    controls.minDistance = 5;
    controlsRef.current = controls;

    // Lighting
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
      const width = canvas.clientWidth;
      const height = canvas.clientHeight;
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
      while (canvas.firstChild) {
        canvas.removeChild(canvas.firstChild);
      }
    };
  }, []);

  // Update scene when data changes
  React.useEffect(() => {
    const scene = sceneRef.current;
    const renderer = rendererRef.current;
    const camera = cameraRef.current;
    
    if (!scene || !renderer || !camera) return;

    // Clear previous meshes
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

    // 1. Draw the torus surface (transparent)
    const uSegments = 60;
    const vSegments = 30;
    const vMax = Math.PI; // Half torus to see inside

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

    // 2. Draw rupture zone (circle at v = π)
    if (showRupturaZone) {
      const ruptureRadius = model.R - model.r;
      const ruptureGeo = new THREE.RingGeometry(
        Math.max(0, ruptureRadius - 0.1),
        ruptureRadius + 0.1,
        64
      );
      const ruptureMat = new THREE.MeshBasicMaterial({
        color: 0xdc2626,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.3,
      });
      const ruptureMesh = new THREE.Mesh(ruptureGeo, ruptureMat);
      ruptureMesh.rotation.x = Math.PI / 2;
      ruptureMesh.position.y = 0;
      scene.add(ruptureMesh);
      meshesRef.current.push(ruptureMesh);
    }

    // 3. Draw voice point (origin)
    const voiceGeo = new THREE.SphereGeometry(0.5, 16, 16);
    const voiceMat = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      emissive: 0x60a5fa,
      emissiveIntensity: 0.8,
      roughness: 0.1,
    });
    const voiceMesh = new THREE.Mesh(voiceGeo, voiceMat);
    voiceMesh.position.set(0, 0, 0);
    scene.add(voiceMesh);
    meshesRef.current.push(voiceMesh);

    // 4. Draw fantasy point
    const fantasyGeo = new THREE.BoxGeometry(0.6, 0.6, 0.6);
    const fantasyMat = new THREE.MeshStandardMaterial({
      color: COLOR_PALETTE.fant,
      emissive: 0xd81b8c,
      emissiveIntensity: 0.6,
      roughness: 0.2,
    });
    const fantasyMesh = new THREE.Mesh(fantasyGeo, fantasyMat);
    const s4 = model.getSection4Curves(60);
    fantasyMesh.position.set(s4.fantasyPoint[0], s4.fantasyPoint[2], -s4.fantasyPoint[1]);
    scene.add(fantasyMesh);
    meshesRef.current.push(fantasyMesh);

    // 5. Draw circulation lines
    circulacionLines.forEach((line, lineIdx) => {
      const points = line.points.map(([x, y, z]) => new THREE.Vector3(x, z, -y));
      const lineGeo = new THREE.BufferGeometry().setFromPoints(points);
      const lineMat = new THREE.LineBasicMaterial({
        color: new THREE.Color(line.color),
        linewidth: line.linewidth,
        depthTest: true,
        transparent: true,
        opacity: 0.9,
      });
      const lineMesh = new THREE.Line(lineGeo, lineMat);
      scene.add(lineMesh);
      meshesRef.current.push(lineMesh);
    });

    // 6. Draw animated points
    if (animatedPoints.length > 0) {
      const pointsGeo = new THREE.BufferGeometry();
      const pointsPositions: number[] = [];
      const pointsColors: number[] = [];
      const pointsSizes: number[] = [];

      animatedPoints.forEach((point) => {
        pointsPositions.push(point.position[0], point.position[2], -point.position[1]);
        
        const color = new THREE.Color(point.color);
        pointsColors.push(color.r, color.g, color.b);
        pointsSizes.push(point.size);
      });

      pointsGeo.setAttribute('position', new THREE.Float32BufferAttribute(pointsPositions, 3));
      pointsGeo.setAttribute('color', new THREE.Float32BufferAttribute(pointsColors, 3));
      pointsGeo.setAttribute('size', new THREE.Float32BufferAttribute(pointsSizes, 1));

      const pointsMat = new THREE.PointsMaterial({
        size: 0.2,
        vertexColors: true,
        sizeAttenuation: false,
        transparent: true,
        opacity: 0.9,
        depthWrite: false,
      });

      const pointsMesh = new THREE.Points(pointsGeo, pointsMat);
      scene.add(pointsMesh);
      meshesRef.current.push(pointsMesh);
    }

    renderer.render(scene, camera);

  }, [model, circulacionLines, animatedPoints, showRupturaZone, showAngustia]);

  // Animation loop for point movement
  React.useEffect(() => {
    if (!isAnimating || circulaciones.length === 0) return;

    let startTime: number | null = null;
    const duration = 5000; // 5 seconds for full animation

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
  }, [isAnimating, circulaciones.length]);

  return <canvas ref={canvasRef} className="w-full h-full" />;
};
