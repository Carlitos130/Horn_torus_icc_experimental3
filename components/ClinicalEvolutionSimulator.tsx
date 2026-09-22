"use client";

import React, { useState, useEffect, useRef, useMemo, useCallback } from "react";
import {
  HornTorusFamiliaModel,
  SCL90RData,
  CASULLO_2008_MASCULINO_ADULTOS_T60,
  CLINICAL_CRISIS_SCENARIOS,
  ClinicalCrisisScenario,
  sampleScenarioAt,
} from "@/lib/hornTorusMath";
import { ThreeViewer } from "@/components/ThreeViewer";
import {
  Play,
  Pause,
  RotateCcw,
  FastForward,
  Flame,
  ShieldAlert,
  Activity,
  Sparkles,
  Info,
  Layers,
  ArrowRight,
  TrendingUp,
  Volume2,
  CheckCircle,
  HelpCircle,
  ExternalLink,
} from "lucide-react";

interface ClinicalEvolutionSimulatorProps {
  onApplyToGlobal?: (sclData: SCL90RData, rOverR: number, deformationFactor: number) => void;
}

export const ClinicalEvolutionSimulator: React.FC<ClinicalEvolutionSimulatorProps> = ({
  onApplyToGlobal,
}) => {
  // Scenario state
  const [selectedScenarioId, setSelectedScenarioId] = useState<string>(
    CLINICAL_CRISIS_SCENARIOS[0].id
  );

  // Playback state
  const [progress, setProgress] = useState<number>(0); // 0 to 100%
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [speedMultiplier, setSpeedMultiplier] = useState<number>(1.0);
  const [loop, setLoop] = useState<boolean>(true);

  // 3D Visualizer settings inside the simulator
  const [viewMode, setViewMode] = useState<"half" | "full">("half");
  const [colorModeOverride, setColorModeOverride] = useState<"auto" | "neutral" | "angustia" | "estres">("auto");
  const [curveStyle, setCurveStyle] = useState<"section4" | "motor" | "none">("section4");
  const [autoRotate, setAutoRotate] = useState<boolean>(false);

  const scenario = useMemo(() => {
    return (
      CLINICAL_CRISIS_SCENARIOS.find((s) => s.id === selectedScenarioId) ||
      CLINICAL_CRISIS_SCENARIOS[0]
    );
  }, [selectedScenarioId]);

  // Sample data at current progress
  const sampledState = useMemo(() => {
    return sampleScenarioAt(scenario, progress);
  }, [scenario, progress]);

  // Model instance
  const model = useMemo(() => {
    return new HornTorusFamiliaModel(
      sampledState.rOverR,
      sampledState.sclData,
      sampledState.deformationFactor
    );
  }, [sampledState.rOverR, sampledState.sclData, sampledState.deformationFactor]);

  // Effective color mode
  const effectiveColorMode = useMemo(() => {
    if (colorModeOverride !== "auto") return colorModeOverride;
    return sampledState.colorMode;
  }, [colorModeOverride, sampledState.colorMode]);

  // Animation frame loop
  const animRef = useRef<number | null>(null);
  const lastTimeRef = useRef<number | null>(null);

  useEffect(() => {
    if (!isPlaying) {
      if (animRef.current) cancelAnimationFrame(animRef.current);
      lastTimeRef.current = null;
      return;
    }

    const durationSeconds = 16.0 / speedMultiplier; // total timeline duration

    const step = (time: number) => {
      if (lastTimeRef.current === null) {
        lastTimeRef.current = time;
      }
      const deltaSeconds = (time - lastTimeRef.current) / 1000;
      lastTimeRef.current = time;

      setProgress((prev) => {
        const next = prev + (deltaSeconds / durationSeconds) * 100;
        if (next >= 100) {
          if (loop) {
            return 0;
          } else {
            setIsPlaying(false);
            return 100;
          }
        }
        return next;
      });

      animRef.current = requestAnimationFrame(step);
    };

    animRef.current = requestAnimationFrame(step);

    return () => {
      if (animRef.current) cancelAnimationFrame(animRef.current);
    };
  }, [isPlaying, speedMultiplier, loop]);

  const handleSelectScenario = (id: string) => {
    setSelectedScenarioId(id);
    setProgress(0);
    setIsPlaying(false);
  };

  const handleGoToPhase = (targetT: number) => {
    setProgress(targetT);
  };

  const handleApplyToMain = () => {
    if (onApplyToGlobal) {
      onApplyToGlobal(
        sampledState.sclData,
        sampledState.rOverR,
        sampledState.deformationFactor
      );
    }
  };

  // Symptoms tracking helper
  const scl = sampledState.sclData;
  const cutoffs = CASULLO_2008_MASCULINO_ADULTOS_T60;

  const scalesList: { key: keyof SCL90RData; label: string; cutoff: number; maxVal: number }[] = [
    { key: "Psicoticismo", label: "Psicoticismo (PSIC)", cutoff: cutoffs.Psicoticismo, maxVal: 4.0 },
    { key: "Ideacion Paranoide", label: "Ideación Paranoide (PAR)", cutoff: cutoffs["Ideacion Paranoide"], maxVal: 4.0 },
    { key: "Hostilidad", label: "Hostilidad (HOS)", cutoff: cutoffs.Hostilidad, maxVal: 4.0 },
    { key: "Ansiedad", label: "Ansiedad (ANS)", cutoff: cutoffs.Ansiedad, maxVal: 4.0 },
    { key: "Depresion", label: "Depresión (DEP)", cutoff: cutoffs.Depresion, maxVal: 4.0 },
    { key: "Somatizacion", label: "Somatización (SOM)", cutoff: cutoffs.Somatizacion, maxVal: 4.0 },
    { key: "GSI", label: "Índice Gravedad Global (IGS)", cutoff: cutoffs.GSI, maxVal: 3.5 },
  ];

  return (
    <div className="flex flex-col gap-6 w-full">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950/40 to-slate-900 border border-indigo-800/40 rounded-2xl p-5 shadow-lg flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
              <Activity className="w-5 h-5 animate-pulse" />
            </span>
            <h2 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
              Dinámica Temporal de Crisis &amp; Reconfiguración
              <span className="text-xs font-mono px-2 py-0.5 rounded-full bg-rose-950/70 border border-rose-500/50 text-rose-300">
                Efracción del Baremo
              </span>
            </h2>
          </div>
          <p className="text-xs text-slate-300 max-w-3xl leading-relaxed">
            Simulador evolutivo del Horn Torus ante descompensaciones clínicas. Permite observar cómo una{" "}
            <strong className="text-rose-300">explosión de psicoticismo fuera del baremo</strong> altera y deforma
            la geometría del toroide, y cómo la cinta del <strong>Sinthome (Σ)</strong> reconfigura la superficie
            en un nuevo equilibrio topológico compensado.
          </p>
        </div>

        {/* Theoretical thesis badge */}
        <div className="shrink-0 bg-slate-950/70 border border-indigo-700/40 rounded-xl p-3 text-xs max-w-sm">
          <div className="flex items-center gap-1.5 font-semibold text-indigo-300 mb-1">
            <ShieldAlert className="w-3.5 h-3.5 text-amber-400" />
            <span>Diferenciación con Lacan (Tesis Carlos Vonsik)</span>
          </div>
          <p className="text-[11px] text-slate-400 leading-snug">
            La angustia está métricamente ligada a la distancia $A(u,v) \le \pi/4$ al punto de anclaje de la
            fantasía ($\$\diamond a$) y al trauma, no al mero cruce de aros borromeos.
          </p>
        </div>
      </div>

      {/* Scenario Selector Tabs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {CLINICAL_CRISIS_SCENARIOS.map((sc) => {
          const isSelected = sc.id === selectedScenarioId;
          return (
            <button
              key={sc.id}
              onClick={() => handleSelectScenario(sc.id)}
              className={`flex flex-col gap-2 p-3.5 rounded-xl border text-left transition-all ${
                isSelected
                  ? "bg-indigo-950/60 border-indigo-500 text-white shadow-md ring-1 ring-indigo-500/50"
                  : "bg-slate-900/80 border-slate-800 hover:border-slate-700 text-slate-300 hover:bg-slate-800/50"
              }`}
            >
              <div className="flex items-center justify-between gap-2">
                <span
                  className={`text-[10px] font-mono px-2 py-0.5 rounded border uppercase tracking-wider font-semibold ${
                    isSelected
                      ? "bg-indigo-500/20 text-indigo-300 border-indigo-500/40"
                      : "bg-slate-800 text-slate-400 border-slate-700"
                  }`}
                >
                  {sc.badge}
                </span>
                {isSelected && <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />}
              </div>
              <h3 className="text-xs font-bold leading-snug">{sc.title}</h3>
              <p className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed">
                {sc.shortDesc}
              </p>
            </button>
          );
        })}
      </div>

      {/* Main Interactive Workstation: 3D Viewport + Timeline + Realtime Monitors */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: 3D Viewer with Embedded HUD (7 cols) */}
        <div className="lg:col-span-7 flex flex-col gap-4">
          <div className="h-[490px] w-full relative rounded-2xl overflow-hidden border border-slate-800 shadow-xl bg-slate-950">
            <ThreeViewer
              model={model}
              viewMode={viewMode}
              colorMode={effectiveColorMode}
              curveStyle={curveStyle}
              showDeformation={true}
              showMarkers={true}
              autoRotate={autoRotate}
            />

            {/* In-viewport Real-time HUD badges */}
            <div className="absolute top-3 left-3 flex flex-wrap items-center gap-2 pointer-events-none">
              <span className="px-2.5 py-1 rounded-md bg-slate-950/80 backdrop-blur-md border border-slate-700 text-[11px] font-mono text-slate-200 shadow">
                t = <strong className="text-indigo-400">{progress.toFixed(1)}%</strong>
              </span>

              <span
                className={`px-2.5 py-1 rounded-md backdrop-blur-md border text-[11px] font-mono font-bold shadow ${
                  sampledState.activePhase.isPeak
                    ? "bg-rose-950/90 border-rose-500 text-rose-300 animate-pulse"
                    : sampledState.activePhase.isReconfiguration
                    ? "bg-emerald-950/80 border-emerald-500 text-emerald-300"
                    : "bg-slate-950/80 border-slate-700 text-slate-300"
                }`}
              >
                {sampledState.activePhase.title}
              </span>
            </div>

            {/* Quick in-viewport Torus Metrics HUD */}
            <div className="absolute bottom-3 left-3 right-3 flex flex-wrap items-center justify-between gap-2 pointer-events-none bg-slate-950/85 backdrop-blur-md border border-slate-800 rounded-xl p-2.5 text-[11px] font-mono text-slate-300">
              <div className="flex items-center gap-4">
                <span>
                  r/R: <strong className="text-white">{sampledState.rOverR.toFixed(3)}</strong>
                </span>
                <span>
                  Deformación δ: <strong className="text-amber-400">{sampledState.deformationFactor.toFixed(2)}</strong>
                </span>
                <span>
                  Pulsión s: <strong className="text-emerald-400">{(model.pulsion_attachment_strength * 100).toFixed(0)}%</strong>
                </span>
              </div>
              <div className="flex items-center gap-2 text-[10px]">
                <span className="text-slate-400">Fase Sinthome Σ:</span>
                <span className="text-indigo-300 font-bold">
                  {((model.v_Sigma % (2 * Math.PI)) * (180 / Math.PI)).toFixed(1)}°
                </span>
              </div>
            </div>
          </div>

          {/* 3D Viewport Configuration Toolbar */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-3 flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2">
              <span className="text-slate-400 font-medium">Corte:</span>
              <button
                onClick={() => setViewMode(viewMode === "half" ? "full" : "half")}
                className={`px-2.5 py-1 rounded border transition-colors ${
                  viewMode === "half"
                    ? "bg-slate-800 border-indigo-500/60 text-indigo-300 font-medium"
                    : "bg-slate-800/40 border-slate-700 text-slate-300"
                }`}
              >
                {viewMode === "half" ? "Mitad abierta (cara interna)" : "Toro completo"}
              </button>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-slate-400 font-medium">Mapa de Color:</span>
              <select
                value={colorModeOverride}
                onChange={(e) => setColorModeOverride(e.target.value as any)}
                className="bg-slate-800 border border-slate-700 text-slate-200 rounded px-2 py-1 text-xs outline-none focus:border-indigo-500"
              >
                <option value="auto">Automático según fase ({sampledState.colorMode})</option>
                <option value="estres">Mapa de Estrés / Efracción</option>
                <option value="angustia">Métrica de Angustia (A ≤ π/4)</option>
                <option value="neutral">Tono Neutral</option>
              </select>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-slate-400 font-medium">Cintas:</span>
              <select
                value={curveStyle}
                onChange={(e) => setCurveStyle(e.target.value as any)}
                className="bg-slate-800 border border-slate-700 text-slate-200 rounded px-2 py-1 text-xs outline-none focus:border-indigo-500"
              >
                <option value="section4">Trenza §4 (S, I, Pulsión, Σ)</option>
                <option value="motor">Estilo Motor Dinámico</option>
                <option value="none">Ocultar cintas</option>
              </select>
            </div>
          </div>

          {/* Interactive Playback Control Panel */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-col gap-4">
            {/* Top row: Play, Pause, Scrubber */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className={`p-3 rounded-xl flex items-center justify-center transition-all shadow-md ${
                  isPlaying
                    ? "bg-amber-600 hover:bg-amber-500 text-white"
                    : "bg-indigo-600 hover:bg-indigo-500 text-white"
                }`}
                title={isPlaying ? "Pausar evolución" : "Reproducir evolución temporal"}
              >
                {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 ml-0.5" />}
              </button>

              <button
                onClick={() => setProgress(0)}
                className="p-2.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700"
                title="Rebobinar al estado inicial (0%)"
              >
                <RotateCcw className="w-4 h-4" />
              </button>

              {/* Progress Slider */}
              <div className="flex-1 flex flex-col gap-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-300">Evolución de la Crisis</span>
                  <span className="font-mono text-indigo-400 font-bold">{progress.toFixed(1)}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  step="0.5"
                  value={progress}
                  onChange={(e) => setProgress(parseFloat(e.target.value))}
                  className="w-full h-2 bg-slate-800 rounded-lg accent-indigo-500 cursor-pointer"
                />
              </div>

              {/* Speed toggle */}
              <div className="flex items-center gap-1 bg-slate-800/80 p-1 rounded-lg border border-slate-700 text-xs">
                {[0.5, 1.0, 1.5, 2.0].map((spd) => (
                  <button
                    key={spd}
                    onClick={() => setSpeedMultiplier(spd)}
                    className={`px-2 py-0.5 rounded font-mono text-[11px] ${
                      speedMultiplier === spd
                        ? "bg-indigo-600 text-white font-bold"
                        : "text-slate-400 hover:text-white"
                    }`}
                  >
                    {spd}x
                  </button>
                ))}
              </div>
            </div>

            {/* Phase Stepper Buttons */}
            <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-slate-800/80">
              <span className="text-xs text-slate-400 font-medium mr-1">Saltar a fase:</span>
              {scenario.phases.map((ph, idx) => {
                const isCurrent = Math.abs(progress - ph.t) < 8;
                return (
                  <button
                    key={ph.t}
                    onClick={() => handleGoToPhase(ph.t)}
                    className={`px-2.5 py-1 text-xs rounded-lg border transition-all flex items-center gap-1.5 ${
                      isCurrent
                        ? "bg-indigo-900/70 border-indigo-500 text-indigo-200 font-semibold shadow-sm"
                        : "bg-slate-800/50 border-slate-700 text-slate-300 hover:bg-slate-800"
                    }`}
                  >
                    {ph.isPeak && <Flame className="w-3 h-3 text-rose-400" />}
                    {ph.isReconfiguration && <Sparkles className="w-3 h-3 text-emerald-400" />}
                    <span>{ph.t}%: {ph.title.split("(")[0].trim()}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Column: Metapsychological Commentary + SCL-90-R Radar (5 cols) */}
        <div className="lg:col-span-5 flex flex-col gap-5">
          {/* Phase Narrative Card */}
          <div
            className={`border rounded-2xl p-5 shadow-lg flex flex-col gap-3 transition-colors ${
              sampledState.activePhase.isPeak
                ? "bg-rose-950/30 border-rose-600/60 ring-1 ring-rose-500/40"
                : sampledState.activePhase.isReconfiguration
                ? "bg-emerald-950/20 border-emerald-600/50 ring-1 ring-emerald-500/30"
                : "bg-slate-900 border-slate-800"
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {sampledState.activePhase.isPeak ? (
                  <span className="p-1 rounded bg-rose-500/20 text-rose-400 border border-rose-500/30">
                    <Flame className="w-4 h-4 animate-bounce" />
                  </span>
                ) : sampledState.activePhase.isReconfiguration ? (
                  <span className="p-1 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                    <Sparkles className="w-4 h-4" />
                  </span>
                ) : (
                  <span className="p-1 rounded bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
                    <Activity className="w-4 h-4" />
                  </span>
                )}
                <div>
                  <h4 className="text-sm font-bold text-white leading-tight">
                    {sampledState.activePhase.title}
                  </h4>
                  <p className="text-[11px] text-slate-400">{sampledState.activePhase.subtitle}</p>
                </div>
              </div>
              <span className="text-xs font-mono font-bold text-indigo-300 bg-slate-950 px-2 py-0.5 rounded border border-slate-800">
                Paso {sampledState.currentPhaseIndex + 1}/{scenario.phases.length}
              </span>
            </div>

            <p className="text-xs text-slate-200 leading-relaxed bg-slate-950/50 p-3 rounded-xl border border-slate-800/80">
              {sampledState.activePhase.description}
            </p>

            <div className="bg-indigo-950/30 border border-indigo-800/40 rounded-xl p-3 flex flex-col gap-1">
              <span className="text-[10px] uppercase font-bold text-indigo-300 tracking-wider flex items-center gap-1">
                <Info className="w-3 h-3 text-indigo-400" />
                Lectura Metapsicológica en el Manifold:
              </span>
              <p className="text-xs text-slate-300 leading-relaxed italic">
                "{sampledState.activePhase.metapsychologicalNote}"
              </p>
            </div>
          </div>

          {/* SCL-90-R Clinical Values vs. Casullo T=60 Cutoffs */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex flex-col gap-3 shadow-md">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <h4 className="text-xs font-bold text-slate-200 flex items-center gap-1.5 uppercase tracking-wider">
                <TrendingUp className="w-3.5 h-3.5 text-indigo-400" />
                Estado SCL-90-R en Tiempo Real vs. Corte T=60
              </h4>
              <span className="text-[11px] text-slate-400">Varones adultos (Casullo 2008)</span>
            </div>

            <div className="flex flex-col gap-2.5">
              {scalesList.map((scale) => {
                const currentVal = scl[scale.key] ?? 0;
                const isExceeded = currentVal > scale.cutoff;
                const isSevere = currentVal >= scale.cutoff * 1.5;
                const percent = Math.min(100, (currentVal / scale.maxVal) * 100);
                const cutoffPercent = Math.min(100, (scale.cutoff / scale.maxVal) * 100);

                return (
                  <div key={scale.key} className="flex flex-col gap-1 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-300 font-medium flex items-center gap-1.5">
                        {scale.label}
                        {isExceeded && (
                          <span
                            className={`text-[10px] px-1.5 py-0.2 rounded font-mono font-bold ${
                              isSevere
                                ? "bg-rose-950 text-rose-300 border border-rose-600/60 animate-pulse"
                                : "bg-amber-950 text-amber-300 border border-amber-600/60"
                            }`}
                          >
                            {isSevere ? "¡Efracción!" : "T > 60"}
                          </span>
                        )}
                      </span>
                      <div className="flex items-center gap-2 font-mono">
                        <span className="text-slate-500 text-[11px]">corte: {scale.cutoff.toFixed(2)}</span>
                        <strong
                          className={`text-sm ${
                            isSevere
                              ? "text-rose-400"
                              : isExceeded
                              ? "text-amber-400"
                              : "text-slate-200"
                          }`}
                        >
                          {currentVal.toFixed(2)}
                        </strong>
                      </div>
                    </div>

                    {/* Visual Bar with Cutoff Marker */}
                    <div className="w-full h-2 bg-slate-800 rounded-full relative overflow-hidden">
                      {/* Cutoff vertical line */}
                      <div
                        className="absolute top-0 bottom-0 w-0.5 bg-slate-400 z-10"
                        style={{ left: `${cutoffPercent}%` }}
                        title={`Corte T=60: ${scale.cutoff.toFixed(2)}`}
                      />
                      {/* Active value fill */}
                      <div
                        className={`h-full transition-all duration-150 ${
                          isSevere
                            ? "bg-rose-500"
                            : isExceeded
                            ? "bg-amber-500"
                            : "bg-indigo-500"
                        }`}
                        style={{ width: `${percent}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Differential Thesis Note & Export CTA */}
          <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-3.5 flex flex-col gap-2.5 text-xs">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-slate-300 flex items-center gap-1">
                <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
                Fundamento de la Tesis:
              </span>
              <button
                onClick={handleApplyToMain}
                className="px-2.5 py-1 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-medium flex items-center gap-1 transition-all shadow-sm"
              >
                <span>Aplicar este punto al Visor General</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              {scenario.theoreticalDifferential}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
