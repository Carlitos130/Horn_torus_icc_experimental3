"use client";

import React, { useState, useMemo } from "react";
import {
  HornTorusFamiliaModel,
  SCL90RData,
  DEFAULT_SCL90R_DATA,
} from "@/lib/hornTorusMath";
import { ThreeViewer } from "@/components/ThreeViewer";
import { CartaDesplegada } from "@/components/CartaDesplegada";
import { InvariantsPanel } from "@/components/InvariantsPanel";
import { FiguresGallery } from "@/components/FiguresGallery";
import { PsychometricSandbox } from "@/components/PsychometricSandbox";
import { DocsReader } from "@/components/DocsReader";
import { RetrocompatibilityTest } from "@/components/RetrocompatibilityTest";
import { SignificanteCirculacionViewer } from "@/components/SignificanteCirculacionViewer";
import {
  Orbit,
  Layers,
  Sliders,
  BookOpen,
  Eye,
  Sparkles,
  Info,
  Maximize2,
  Minimize2,
  RotateCw,
  RotateCcw,
  ShieldCheck,
} from "lucide-react";

export default function HomePage() {
  const [activeTab, setActiveTab] = useState<"visor" | "figuras" | "scl" | "docs" | "test" | "circulacion">("visor");

  // Model parameters
  const [rOverR, setROverR] = useState<number>(1.0);
  const [sclData, setSclData] = useState<SCL90RData>({ ...DEFAULT_SCL90R_DATA });
  const [deformationFactor, setDeformationFactor] = useState<number>(0.3);

  // 3D Visualizer settings
  const [viewMode, setViewMode] = useState<"half" | "full">("half");
  const [colorMode, setColorMode] = useState<"neutral" | "angustia">("neutral");
  const [curveStyle, setCurveStyle] = useState<"section4" | "motor" | "none">("section4");
  const [showDeformation, setShowDeformation] = useState<boolean>(false);
  const [showMarkers, setShowMarkers] = useState<boolean>(true);
  const [autoRotate, setAutoRotate] = useState<boolean>(false);

  const handleResetDefaults = () => {
    setROverR(1.0);
    setSclData({ ...DEFAULT_SCL90R_DATA });
    setDeformationFactor(0.3);
    setViewMode("half");
    setColorMode("neutral");
    setCurveStyle("section4");
    setShowDeformation(false);
    setShowMarkers(true);
    setAutoRotate(false);
  };

  // Instantiate the model memoized
  const model = useMemo(() => {
    return new HornTorusFamiliaModel(rOverR, sclData, deformationFactor);
  }, [rOverR, sclData, deformationFactor]);

  const presets = [
    { label: "0.45", val: 0.45, desc: "Toro amplio" },
    { label: "1/√2 (0.707)", val: 1 / Math.SQRT2, desc: "Clifford (mín. Willmore)" },
    { label: "0.85", val: 0.85, desc: "Toro estrecho" },
    { label: "0.95", val: 0.95, desc: "Pre-límite" },
    { label: "1.00", val: 1.0, desc: "Horn Torus (límite)" },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-indigo-500 selection:text-white">
      {/* Top Header */}
      <header className="border-b border-slate-800 bg-slate-900/90 backdrop-blur-md sticky top-0 z-40 px-4 lg:px-8 py-3.5">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="flex flex-col">
            <div className="flex items-center gap-2.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
              <h1 className="text-lg font-bold tracking-tight text-white flex items-center gap-2">
                Horn Torus del Inconsciente (Icc)
                <span className="text-xs font-mono px-2 py-0.5 rounded bg-indigo-900/60 text-indigo-300 border border-indigo-700/50">
                  Familia r → R
                </span>
              </h1>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Modelo topológico del inconsciente freudiano · Tesis <em>RSI – Poincaré</em> · Lic. Carlos Vonsik (MN 85130)
            </p>
          </div>

          {/* Navigation tabs */}
          <nav className="flex items-center gap-1.5 bg-slate-950/70 p-1 rounded-xl border border-slate-800 self-start md:self-auto overflow-x-auto max-w-full">
            <button
              onClick={() => setActiveTab("visor")}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
                activeTab === "visor"
                  ? "bg-indigo-600 text-white shadow-sm font-semibold"
                  : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/60"
              }`}
            >
              <Orbit className="w-3.5 h-3.5" />
              <span>Visor 3D &amp; Invariantes</span>
            </button>
            <button
              onClick={() => setActiveTab("figuras")}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
                activeTab === "figuras"
                  ? "bg-indigo-600 text-white shadow-sm font-semibold"
                  : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/60"
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Atlas de Figuras (8)</span>
            </button>
            <button
              onClick={() => setActiveTab("scl")}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
                activeTab === "scl"
                  ? "bg-indigo-600 text-white shadow-sm font-semibold"
                  : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/60"
              }`}
            >
              <Sliders className="w-3.5 h-3.5" />
              <span>SCL-90-R &amp; Fases</span>
            </button>
            <button
              onClick={() => setActiveTab("docs")}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
                activeTab === "docs"
                  ? "bg-indigo-600 text-white shadow-sm font-semibold"
                  : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/60"
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>Documentos de la Tesis</span>
            </button>
            <button
              onClick={() => setActiveTab("test")}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
                activeTab === "test"
                  ? "bg-indigo-600 text-white shadow-sm font-semibold"
                  : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/60"
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Test Retrocompatibilidad</span>
            </button>
            <button
              onClick={() => setActiveTab("circulacion")}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
                activeTab === "circulacion"
                  ? "bg-indigo-600 text-white shadow-sm font-semibold"
                  : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/60"
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Circulaciu00f3n S/S</span>
            </button>
          </nav>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 lg:p-6 flex flex-col gap-6">
        {activeTab === "visor" && (
          <div className="flex flex-col gap-6">
            {/* Control Bar: Slider r/R and Presets */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
              <div className="flex-1 flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                    Parámetro Continuo de la Familia: Cociente de Radios (r / R)
                  </span>
                  <span className="text-sm font-mono font-bold text-indigo-300">
                    r/R = {rOverR.toFixed(4)}
                  </span>
                </div>
                <input
                  type="range"
                  min="0.30"
                  max="1.00"
                  step="0.005"
                  value={rOverR}
                  onChange={(e) => setROverR(parseFloat(e.target.value))}
                  className="w-full accent-indigo-500 h-2 bg-slate-800 rounded-lg cursor-pointer"
                />
                <div className="flex justify-between text-[11px] text-slate-500">
                  <span>r/R = 0.30 (Toro anular delgado)</span>
                  <span>r/R = 0.7071 (Toro de Clifford · W mín)</span>
                  <span>r/R = 1.00 (Horn Torus · Singularidad)</span>
                </div>
              </div>

              {/* Quick Presets */}
              <div className="flex flex-wrap items-center gap-1.5 shrink-0 pt-2 lg:pt-0 border-t lg:border-t-0 border-slate-800">
                <span className="text-xs text-slate-400 font-medium mr-1">Régimen:</span>
                {presets.map((p) => {
                  const isSelected = Math.abs(rOverR - p.val) < 0.008;
                  return (
                    <button
                      key={p.label}
                      onClick={() => setROverR(p.val)}
                      className={`px-2.5 py-1 text-xs rounded-lg transition-all border ${
                        isSelected
                          ? "bg-indigo-600 border-indigo-500 text-white font-semibold shadow-sm"
                          : "bg-slate-800/80 hover:bg-slate-700 border-slate-700/60 text-slate-300"
                      }`}
                    >
                      {p.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Main Interactive Grid: 3D Scene + Controls & Unfolded Map */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              {/* Left Column: 3D Visualizer & Display Controls */}
              <div className="lg:col-span-7 flex flex-col gap-4">
                {/* 3D Viewport */}
                <div className="h-[520px] w-full relative">
                  <ThreeViewer
                    model={model}
                    viewMode={viewMode}
                    colorMode={colorMode}
                    curveStyle={curveStyle}
                    showDeformation={showDeformation}
                    showMarkers={showMarkers}
                    autoRotate={autoRotate}
                  />
                </div>

                {/* 3D Viewport Controls */}
                <div className="bg-slate-900 border border-slate-800 rounded-xl p-3.5 flex flex-wrap items-center justify-between gap-3 text-xs">
                  {/* Auto-rotate toggle switch & Reset */}
                  <div className="flex items-center gap-2">
                    <button
                      id="auto-rotate-toggle"
                      type="button"
                      role="switch"
                      aria-checked={autoRotate}
                      onClick={() => setAutoRotate(!autoRotate)}
                      className={`inline-flex items-center gap-2 px-2.5 py-1 rounded-lg border transition-all ${
                        autoRotate
                          ? "bg-indigo-950/70 border-indigo-500/70 text-indigo-300 font-medium shadow-sm"
                          : "bg-slate-800/40 border-slate-700 text-slate-300 hover:bg-slate-800/80"
                      }`}
                      title="Activar/desactivar rotación continua automática 360°"
                    >
                      <RotateCw className={`w-3.5 h-3.5 ${autoRotate ? "animate-spin text-indigo-400" : "text-slate-400"}`} />
                      <span>Auto-rotación 360°</span>
                      <span
                        className={`w-7 h-3.5 flex items-center rounded-full p-0.5 transition-colors ${
                          autoRotate ? "bg-indigo-500 justify-end" : "bg-slate-700 justify-start"
                        }`}
                      >
                        <span className="w-2.5 h-2.5 rounded-full bg-white shadow-sm block" />
                      </span>
                    </button>

                    <button
                      id="reset-view-defaults-btn"
                      type="button"
                      onClick={handleResetDefaults}
                      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg border border-slate-700 bg-slate-800/50 hover:bg-slate-800 text-slate-300 hover:text-white transition-all text-xs font-medium"
                      title="Restablecer todos los parámetros y estados a sus valores predeterminados"
                    >
                      <RotateCcw className="w-3.5 h-3.5 text-slate-400" />
                      <span>Reset</span>
                    </button>
                  </div>

                  {/* Surface opening toggle */}
                  <div className="flex items-center gap-2">
                    <span className="text-slate-400 font-medium">Superficie:</span>
                    <button
                      onClick={() => setViewMode(viewMode === "half" ? "full" : "half")}
                      className={`px-2.5 py-1 rounded border transition-colors ${
                        viewMode === "half"
                          ? "bg-slate-800 border-indigo-500/50 text-indigo-300 font-medium"
                          : "bg-slate-800/40 border-slate-700 text-slate-300"
                      }`}
                    >
                      {viewMode === "half" ? "Mitad inferior abierta (cara interna)" : "Superficie completa"}
                    </button>
                  </div>

                  {/* Colormap toggle */}
                  <div className="flex items-center gap-2">
                    <span className="text-slate-400 font-medium">Coloreado:</span>
                    <button
                      onClick={() => setColorMode(colorMode === "neutral" ? "angustia" : "neutral")}
                      className={`px-2.5 py-1 rounded border transition-colors ${
                        colorMode === "angustia"
                          ? "bg-rose-950/60 border-rose-500/60 text-rose-300 font-medium"
                          : "bg-slate-800/40 border-slate-700 text-slate-300"
                      }`}
                    >
                      {colorMode === "angustia" ? "Por Angustia A ≤ π/4" : "Tono Neutral"}
                    </button>
                  </div>

                  {/* Curve mode */}
                  <div className="flex items-center gap-2">
                    <span className="text-slate-400 font-medium">Cintas:</span>
                    <select
                      value={curveStyle}
                      onChange={(e) => setCurveStyle(e.target.value as any)}
                      className="bg-slate-800 border border-slate-700 text-slate-200 rounded px-2 py-1 text-xs outline-none focus:border-indigo-500"
                    >
                      <option value="section4">Trenza §4 (Cara Interna)</option>
                      <option value="motor">Motor get_curves()</option>
                      <option value="none">Ocultar cintas</option>
                    </select>
                  </div>

                  {/* Markers & Deformation Toggles */}
                  <div className="flex items-center gap-2">
                    <label className="flex items-center gap-1.5 cursor-pointer text-slate-300">
                      <input
                        type="checkbox"
                        checked={showMarkers}
                        onChange={(e) => setShowMarkers(e.target.checked)}
                        className="rounded accent-indigo-600"
                      />
                      <span>Puntos (F, T, Voz)</span>
                    </label>
                    <label className="flex items-center gap-1.5 cursor-pointer text-slate-300 ml-2">
                      <input
                        type="checkbox"
                        checked={showDeformation}
                        onChange={(e) => setShowDeformation(e.target.checked)}
                        className="rounded accent-indigo-600"
                      />
                      <span>Deformación SCL</span>
                    </label>
                  </div>
                </div>
              </div>

              {/* Right Column: Exact Invariants & Unfolded Map */}
              <div className="lg:col-span-5 flex flex-col gap-6">
                <InvariantsPanel model={model} />
                <CartaDesplegada model={model} />
              </div>
            </div>
          </div>
        )}

        {activeTab === "figuras" && <FiguresGallery />}

        {activeTab === "scl" && (
          <PsychometricSandbox
            sclData={sclData}
            deformationFactor={deformationFactor}
            onUpdateSclData={setSclData}
            onUpdateDeformation={setDeformationFactor}
          />
        )}

        {activeTab === "docs" && <DocsReader />}

        {activeTab === "test" && <RetrocompatibilityTest />}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800 bg-slate-950 py-4 px-4 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>
            <em>Tesis RSI – Poincaré</em> · Lic. Carlos Vonsik (MN 85130)
          </span>
          <span className="font-mono text-[11px] text-slate-600">
            horn-torus-icc-experimental-2 · Modelo matemático verificado en forma cerrada
          </span>
        </div>
      </footer>
    </div>
  );
}
