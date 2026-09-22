"use client";

import React, { useMemo } from "react";
import {
  SCL90RData,
  DEFAULT_SCL90R_DATA,
  CASULLO_2008_MASCULINO_ADULTOS_T60,
  SCL90_SCALES_CASULLO_2008,
  HornTorusFamiliaModel,
  COLOR_PALETTE,
} from "@/lib/hornTorusMath";
import {
  AlertCircle,
  Sliders,
  RefreshCw,
  AlertTriangle,
  CheckCircle2,
  BookmarkCheck,
  Compass,
  Activity,
  Info,
  Flame,
} from "lucide-react";

interface PsychometricSandboxProps {
  sclData: SCL90RData;
  deformationFactor: number;
  onUpdateSclData: (data: SCL90RData) => void;
  onUpdateDeformation: (factor: number) => void;
}

export const PsychometricSandbox: React.FC<PsychometricSandboxProps> = ({
  sclData,
  deformationFactor,
  onUpdateSclData,
  onUpdateDeformation,
}) => {
  const handleChange = (key: keyof SCL90RData, value: number) => {
    onUpdateSclData({
      ...sclData,
      [key]: value,
    });
  };

  const handleResetCutoffs = () => {
    onUpdateSclData({ ...CASULLO_2008_MASCULINO_ADULTOS_T60 });
    onUpdateDeformation(0.3);
  };

  const handleApplySubclinical = () => {
    // Estimación subclínica T = 50 (media poblacional aproximada ~65% del corte T=60)
    onUpdateSclData({
      Somatizacion: 0.65,
      "Obsesion-Compulsion": 1.05,
      "Sensibilidad Interpersonal": 0.80,
      Depresion: 0.85,
      Ansiedad: 0.75,
      Hostilidad: 0.80,
      "Ansiedad Fobica": 0.30,
      "Ideacion Paranoide": 0.90,
      Psicoticismo: 0.50,
      GSI: 0.70,
      PST: 32.0,
      PSDI: 1.65,
    });
    onUpdateDeformation(0.15);
  };

  const handleApplyAcute = () => {
    // Perfil con elevación clínica severa (T >= 70, ~1.3x - 1.5x del corte)
    onUpdateSclData({
      Somatizacion: 1.65,
      "Obsesion-Compulsion": 2.45,
      "Sensibilidad Interpersonal": 1.95,
      Depresion: 2.10,
      Ansiedad: 1.95,
      Hostilidad: 2.05,
      "Ansiedad Fobica": 1.15,
      "Ideacion Paranoide": 2.20,
      Psicoticismo: 1.45,
      GSI: 1.75,
      PST: 68.0,
      PSDI: 2.85,
    });
    onUpdateDeformation(0.5);
  };

  const handleApplyPsychoticExplosion = () => {
    // Explosión de Psicoticismo fuera de baremo (PSIC 3.85) y acoplados (PAR, HOS, ANS)
    onUpdateSclData({
      Somatizacion: 1.95,
      "Obsesion-Compulsion": 2.40,
      "Sensibilidad Interpersonal": 2.50,
      Depresion: 2.30,
      Ansiedad: 2.80,
      Hostilidad: 3.10,
      "Ansiedad Fobica": 1.60,
      "Ideacion Paranoide": 3.65,
      Psicoticismo: 3.85,
      GSI: 2.85,
      PST: 84.0,
      PSDI: 3.50,
    });
    onUpdateDeformation(0.78);
  };

  // Instancia del modelo para computar las fases en tiempo real
  const modelInstance = useMemo(() => {
    return new HornTorusFamiliaModel(1.0, sclData, deformationFactor);
  }, [sclData, deformationFactor]);

  const fases = useMemo(() => {
    return modelInstance.getFasesLacanianas();
  }, [modelInstance]);

  // Contar síntomas elevados por encima del corte (T > 60)
  const elevatedSymptoms = useMemo(() => {
    return SCL90_SCALES_CASULLO_2008.filter((meta) => {
      const val = sclData[meta.key] ?? 0;
      return val > meta.cutoffT60;
    });
  }, [sclData]);

  const primaryScales = SCL90_SCALES_CASULLO_2008.filter((m) => !m.isGlobalIndex);
  const globalIndices = SCL90_SCALES_CASULLO_2008.filter((m) => m.isGlobalIndex);

  return (
    <div className="flex flex-col gap-5 bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-slate-100 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-indigo-50 text-indigo-600">
              <Sliders className="w-4 h-4" />
            </span>
            <h3 className="text-base font-semibold text-slate-900">
              Módulo Psicométrico SCL-90-R &amp; Fases Lacanianas
            </h3>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Baremo <strong>Casullo – Pérez (2008)</strong> · Población general Buenos Aires · Adultos 25–60 años (Varones)
          </p>
        </div>

        {/* Action presets */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={handleResetCutoffs}
            id="btn-reset-cutoffs"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-indigo-700 hover:text-indigo-900 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 rounded-lg transition-colors"
            title="Aplica los valores exactos de corte T=60 de Casullo - Pérez (2008)"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Corte T=60 (Casullo-Pérez)
          </button>
          <button
            onClick={handleApplySubclinical}
            id="btn-apply-subclinical"
            className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
            title="Simula un perfil subclínico (T≈50, asintomático)"
          >
            Subclínico (T≈50)
          </button>
          <button
            onClick={handleApplyAcute}
            id="btn-apply-acute"
            className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium text-amber-700 hover:text-amber-900 bg-amber-50 hover:bg-amber-100 border border-amber-200 rounded-lg transition-colors"
            title="Simula elevación sintomática moderada (T≥70)"
          >
            Elevado (T≥70)
          </button>
          <button
            onClick={handleApplyPsychoticExplosion}
            id="btn-apply-psychotic-explosion"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-rose-800 hover:text-white bg-rose-100 hover:bg-rose-600 border border-rose-300 rounded-lg transition-colors shadow-xs"
            title="Simula una explosión aguda de psicoticismo (PSIC 3.85, fuera de baremo) y acoplados (PAR, HOS, ANS)"
          >
            <Flame className="w-3.5 h-3.5 text-rose-600 group-hover:text-white" />
            💥 Explosión Psicótica (Fuera de Baremo)
          </button>
        </div>
      </div>

      {/* Normative Reference & Cutoff Table */}
      <div className="bg-slate-50 rounded-xl p-4 border border-slate-200/80 space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <BookmarkCheck className="w-4 h-4 text-indigo-600" />
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800">
              Puntajes T Normalizados · Valores de Corte (T = 60)
            </h4>
          </div>
          <span className="text-[11px] font-medium text-slate-500">
            Regla clínica: <strong className="text-slate-700">T &gt; 60</strong> implica tomar nota de los síntomas
          </span>
        </div>

        {/* Interactive reference table */}
        <div className="overflow-x-auto">
          <table className="w-full text-center text-xs border border-slate-200 bg-white rounded-lg overflow-hidden shadow-xs">
            <thead className="bg-slate-100 text-slate-700 font-semibold text-[11px]">
              <tr>
                <th className="py-1.5 px-2 border-r border-slate-200 bg-indigo-100/70 text-indigo-900">T</th>
                <th className="py-1.5 px-2 border-r border-slate-200">SOM</th>
                <th className="py-1.5 px-2 border-r border-slate-200">OBS</th>
                <th className="py-1.5 px-2 border-r border-slate-200">SI</th>
                <th className="py-1.5 px-2 border-r border-slate-200">DEP</th>
                <th className="py-1.5 px-2 border-r border-slate-200">ANS</th>
                <th className="py-1.5 px-2 border-r border-slate-200">HOS</th>
                <th className="py-1.5 px-2 border-r border-slate-200">FOB</th>
                <th className="py-1.5 px-2 border-r border-slate-200">PAR</th>
                <th className="py-1.5 px-2 border-r border-slate-200">PSIC</th>
                <th className="py-1.5 px-2 border-r border-slate-200 bg-slate-200/60 font-bold">IGS</th>
                <th className="py-1.5 px-2 border-r border-slate-200 bg-slate-200/60 font-bold">TSP</th>
                <th className="py-1.5 px-2 border-r border-slate-200 bg-slate-200/60 font-bold">IMSP</th>
                <th className="py-1.5 px-2 bg-indigo-100/70 text-indigo-900">T</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-800 font-mono text-[11px]">
              <tr className="bg-slate-50/50">
                <td className="py-1.5 px-2 border-r border-slate-200 font-bold text-indigo-900 bg-indigo-50/50">60</td>
                <td className="py-1.5 px-2 border-r border-slate-200">1,08</td>
                <td className="py-1.5 px-2 border-r border-slate-200">1,70</td>
                <td className="py-1.5 px-2 border-r border-slate-200">1,33</td>
                <td className="py-1.5 px-2 border-r border-slate-200">1,38</td>
                <td className="py-1.5 px-2 border-r border-slate-200">1,30</td>
                <td className="py-1.5 px-2 border-r border-slate-200">1,33</td>
                <td className="py-1.5 px-2 border-r border-slate-200">0,57</td>
                <td className="py-1.5 px-2 border-r border-slate-200">1,50</td>
                <td className="py-1.5 px-2 border-r border-slate-200">0,90</td>
                <td className="py-1.5 px-2 border-r border-slate-200 font-bold text-slate-900 bg-slate-100/60">1,10</td>
                <td className="py-1.5 px-2 border-r border-slate-200 font-bold text-slate-900 bg-slate-100/60">52,00</td>
                <td className="py-1.5 px-2 border-r border-slate-200 font-bold text-slate-900 bg-slate-100/60">2,25</td>
                <td className="py-1.5 px-2 font-bold text-indigo-900 bg-indigo-50/50">60</td>
              </tr>
              <tr className="bg-white">
                <td className="py-1.5 px-2 border-r border-slate-200 font-bold text-slate-600 bg-slate-50">Actual</td>
                <td className={`py-1.5 px-2 border-r border-slate-200 ${(sclData.Somatizacion ?? 0) > 1.08 ? 'font-bold text-rose-600 bg-rose-50' : 'text-slate-800'}`}>
                  {(sclData.Somatizacion ?? 0).toFixed(2)}
                </td>
                <td className={`py-1.5 px-2 border-r border-slate-200 ${(sclData["Obsesion-Compulsion"] ?? 0) > 1.70 ? 'font-bold text-rose-600 bg-rose-50' : 'text-slate-800'}`}>
                  {(sclData["Obsesion-Compulsion"] ?? 0).toFixed(2)}
                </td>
                <td className={`py-1.5 px-2 border-r border-slate-200 ${(sclData["Sensibilidad Interpersonal"] ?? 0) > 1.33 ? 'font-bold text-rose-600 bg-rose-50' : 'text-slate-800'}`}>
                  {(sclData["Sensibilidad Interpersonal"] ?? 0).toFixed(2)}
                </td>
                <td className={`py-1.5 px-2 border-r border-slate-200 ${(sclData.Depresion ?? 0) > 1.38 ? 'font-bold text-rose-600 bg-rose-50' : 'text-slate-800'}`}>
                  {(sclData.Depresion ?? 0).toFixed(2)}
                </td>
                <td className={`py-1.5 px-2 border-r border-slate-200 ${(sclData.Ansiedad ?? 0) > 1.30 ? 'font-bold text-rose-600 bg-rose-50' : 'text-slate-800'}`}>
                  {(sclData.Ansiedad ?? 0).toFixed(2)}
                </td>
                <td className={`py-1.5 px-2 border-r border-slate-200 ${(sclData.Hostilidad ?? 0) > 1.33 ? 'font-bold text-rose-600 bg-rose-50' : 'text-slate-800'}`}>
                  {(sclData.Hostilidad ?? 0).toFixed(2)}
                </td>
                <td className={`py-1.5 px-2 border-r border-slate-200 ${(sclData["Ansiedad Fobica"] ?? 0) > 0.57 ? 'font-bold text-rose-600 bg-rose-50' : 'text-slate-800'}`}>
                  {(sclData["Ansiedad Fobica"] ?? 0).toFixed(2)}
                </td>
                <td className={`py-1.5 px-2 border-r border-slate-200 ${(sclData["Ideacion Paranoide"] ?? 0) > 1.50 ? 'font-bold text-rose-600 bg-rose-50' : 'text-slate-800'}`}>
                  {(sclData["Ideacion Paranoide"] ?? 0).toFixed(2)}
                </td>
                <td className={`py-1.5 px-2 border-r border-slate-200 ${(sclData.Psicoticismo ?? 0) > 0.90 ? 'font-bold text-rose-600 bg-rose-50' : 'text-slate-800'}`}>
                  {(sclData.Psicoticismo ?? 0).toFixed(2)}
                </td>
                <td className={`py-1.5 px-2 border-r border-slate-200 font-bold ${(sclData.GSI ?? 0) > 1.10 ? 'text-rose-600 bg-rose-50' : 'text-slate-900 bg-slate-50'}`}>
                  {(sclData.GSI ?? 0).toFixed(2)}
                </td>
                <td className={`py-1.5 px-2 border-r border-slate-200 font-bold ${(sclData.PST ?? 0) > 52.00 ? 'text-rose-600 bg-rose-50' : 'text-slate-900 bg-slate-50'}`}>
                  {(sclData.PST ?? 0).toFixed(0)}
                </td>
                <td className={`py-1.5 px-2 border-r border-slate-200 font-bold ${(sclData.PSDI ?? 0) > 2.25 ? 'text-rose-600 bg-rose-50' : 'text-slate-900 bg-slate-50'}`}>
                  {(sclData.PSDI ?? 0).toFixed(2)}
                </td>
                <td className="py-1.5 px-2 text-slate-500 font-sans text-[10px]">
                  {elevatedSymptoms.length > 0 ? `${elevatedSymptoms.length} > corte` : 'En norma'}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Clinical alert banner */}
        <div className="flex items-center justify-between text-xs px-1">
          <div className="flex items-center gap-2">
            {elevatedSymptoms.length > 0 ? (
              <>
                <AlertTriangle className="w-4 h-4 text-amber-600" />
                <span className="text-amber-800 font-medium">
                  Atención clínica: Hay <strong>{elevatedSymptoms.length}</strong> escalas que superan el punto de corte normalizado (T &gt; 60). Tomar nota para la interpretación de las fases.
                </span>
              </>
            ) : (
              <>
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span className="text-emerald-800 font-medium">
                  Todas las escalas se encuentran dentro o en el límite normativo poblacional (T ≤ 60).
                </span>
              </>
            )}
          </div>
        </div>
      </div>

      {/* LACANIAN PHASES MONITOR (Las Fases Corregidas) */}
      <div className="bg-slate-900 text-white rounded-xl p-4.5 border border-slate-800 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <Compass className="w-4 h-4 text-indigo-400" />
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200">
              Monitor de Fases Lacanianas &amp; Circulación en el Horn Torus
            </h4>
          </div>
          <span className="text-[11px] text-slate-400">
            Fases mod 2π en banda [0.45, 2.70] rad sin cruzar la voz
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
          {/* Fase S */}
          <div className="bg-slate-800/80 rounded-lg p-3 border border-slate-700/60 flex flex-col justify-between">
            <div className="flex items-center justify-between mb-1.5">
              <span className="font-bold flex items-center gap-1.5" style={{ color: COLOR_PALETTE.S }}>
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: COLOR_PALETTE.S }} />
                Cadena S (Significante)
              </span>
              <span className="font-mono text-[11px] text-slate-300">
                φ_S = {(fases.phi_S).toFixed(3)} rad
              </span>
            </div>
            <div className="space-y-1 text-[11px] text-slate-300">
              <div className="flex justify-between">
                <span className="text-slate-400">u_S (Simbólico):</span>
                <span className="font-mono font-medium">{fases.u_S.toFixed(3)} rad ({((fases.u_S * 180) / Math.PI).toFixed(1)}°)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">v_S (Imaginario):</span>
                <span className="font-mono font-medium">{fases.v_S.toFixed(3)} rad</span>
              </div>
              <div className="text-[10px] text-slate-400 mt-1 pt-1 border-t border-slate-700/50">
                Derivado de: <strong>ANS ({(sclData.Ansiedad ?? 0).toFixed(2)})</strong> + <strong>OBS ({(sclData["Obsesion-Compulsion"] ?? 0).toFixed(2)})</strong>
              </div>
            </div>
          </div>

          {/* Fase I */}
          <div className="bg-slate-800/80 rounded-lg p-3 border border-slate-700/60 flex flex-col justify-between">
            <div className="flex items-center justify-between mb-1.5">
              <span className="font-bold flex items-center gap-1.5" style={{ color: COLOR_PALETTE.I }}>
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: COLOR_PALETTE.I }} />
                Cinta I (Imago / Cuerpo)
              </span>
              <span className="font-mono text-[11px] text-slate-300">
                φ_I = {(fases.phi_I).toFixed(3)} rad
              </span>
            </div>
            <div className="space-y-1 text-[11px] text-slate-300">
              <div className="flex justify-between">
                <span className="text-slate-400">u_I (Simbólico):</span>
                <span className="font-mono font-medium">{fases.u_I.toFixed(3)} rad ({((fases.u_I * 180) / Math.PI).toFixed(1)}°)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">v_I (TSP normalizado):</span>
                <span className="font-mono font-medium">{fases.v_I.toFixed(3)} rad</span>
              </div>
              <div className="text-[10px] text-slate-400 mt-1 pt-1 border-t border-slate-700/50">
                Derivado de: <strong>SOM ({(sclData.Somatizacion ?? 0).toFixed(2)})</strong> + <strong>SI ({(sclData["Sensibilidad Interpersonal"] ?? 0).toFixed(2)})</strong>
              </div>
            </div>
          </div>

          {/* Fase Sigma */}
          <div className="bg-slate-800/80 rounded-lg p-3 border border-slate-700/60 flex flex-col justify-between">
            <div className="flex items-center justify-between mb-1.5">
              <span className="font-bold flex items-center gap-1.5" style={{ color: COLOR_PALETTE.Sigma }}>
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: COLOR_PALETTE.Sigma }} />
                Cinta Σ (Sinthome)
              </span>
              <span className="font-mono text-[11px] text-slate-300">
                φ_Σ = {(fases.phi_Sigma).toFixed(3)} rad
              </span>
            </div>
            <div className="space-y-1 text-[11px] text-slate-300">
              <div className="flex justify-between">
                <span className="text-slate-400">u_Σ (Simbólico):</span>
                <span className="font-mono font-medium">{fases.u_Sigma.toFixed(3)} rad ({((fases.u_Sigma * 180) / Math.PI).toFixed(1)}°)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">v_Σ (Latitud PSIC):</span>
                <span className="font-mono font-medium">{fases.v_Sigma.toFixed(3)} rad</span>
              </div>
              <div className="text-[10px] text-slate-400 mt-1 pt-1 border-t border-slate-700/50">
                Derivado de: <strong>PSIC ({(sclData.Psicoticismo ?? 0).toFixed(2)})</strong> + <strong>HOS ({(sclData.Hostilidad ?? 0).toFixed(2)})</strong>
              </div>
            </div>
          </div>

          {/* Pulsión & Escala */}
          <div className="bg-slate-800/80 rounded-lg p-3 border border-slate-700/60 flex flex-col justify-between">
            <div className="flex items-center justify-between mb-1.5">
              <span className="font-bold flex items-center gap-1.5" style={{ color: COLOR_PALETTE.Pulsion }}>
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: COLOR_PALETTE.Pulsion }} />
                Pulsión &amp; Escala Manifold
              </span>
              <span className="font-mono text-[11px] text-amber-300">
                s = {fases.pulsion_attachment_strength.toFixed(3)}
              </span>
            </div>
            <div className="space-y-1 text-[11px] text-slate-300">
              <div className="flex justify-between">
                <span className="text-slate-400">Apego al borde I:</span>
                <span className="font-mono font-medium">{(fases.pulsion_attachment_strength * 100).toFixed(1)}%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Radio mayor R:</span>
                <span className="font-mono font-medium">{fases.effective_a.toFixed(2)} u (a={fases.a.toFixed(3)})</span>
              </div>
              <div className="text-[10px] text-slate-400 mt-1 pt-1 border-t border-slate-700/50">
                Pulsión: <strong>SOM - DEP</strong> | Escala a: <strong>0.1 × IGS</strong>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Factor de Deformación Slider */}
      <div className="bg-slate-50 rounded-lg p-3.5 border border-slate-200">
        <div className="flex justify-between items-center text-xs mb-1">
          <span className="font-semibold text-slate-800 flex items-center gap-1.5">
            <Activity className="w-3.5 h-3.5 text-indigo-600" />
            Factor de Deformación Armónica del Manifold (δ)
          </span>
          <span className="font-mono font-bold text-indigo-700">
            {deformationFactor.toFixed(2)}
          </span>
        </div>
        <input
          type="range"
          min="0"
          max="0.8"
          step="0.02"
          id="slider-deformation"
          value={deformationFactor}
          onChange={(e) => onUpdateDeformation(parseFloat(e.target.value))}
          className="w-full accent-indigo-600 cursor-pointer"
        />
        <div className="flex justify-between text-[10px] text-slate-500 mt-1">
          <span>0.00 (Toro simétrico puro)</span>
          <span>0.30 (Predeterminado)</span>
          <span>0.80 (Máxima perturbación por IGS, TSP, IMSP)</span>
        </div>
      </div>

      {/* 9 Escalas Primarias SCL-90-R */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
            <span>9 Escalas Primarias SCL-90-R</span>
            <span className="text-[10px] font-normal text-slate-500 lowercase">(rango clínico 0.00 – 4.00)</span>
          </h4>
          <span className="text-[11px] text-slate-500">
            Marcador vertical indica corte <strong className="text-indigo-600 font-mono">T = 60</strong>
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {primaryScales.map((meta) => {
            const val = sclData[meta.key] ?? 0;
            const isElevated = val > meta.cutoffT60;
            const isAtCutoff = Math.abs(val - meta.cutoffT60) < 0.01;

            return (
              <div
                key={meta.key}
                id={`scale-card-${meta.abbreviation.toLowerCase()}`}
                className={`rounded-lg p-3 border flex flex-col justify-between transition-colors ${
                  isElevated
                    ? "bg-rose-50/50 border-rose-200"
                    : isAtCutoff
                    ? "bg-indigo-50/40 border-indigo-200"
                    : "bg-slate-50/60 border-slate-200"
                }`}
              >
                <div className="flex justify-between items-start text-xs mb-1.5">
                  <div className="min-w-0 pr-1">
                    <div className="flex items-center gap-1.5">
                      <span className="font-bold text-[11px] px-1.5 py-0.5 rounded bg-slate-200 text-slate-800">
                        {meta.abbreviation}
                      </span>
                      <span className="text-slate-800 font-semibold truncate text-[11px]">{meta.name}</span>
                    </div>
                    <p className="text-[10px] text-slate-500 mt-0.5 line-clamp-1" title={meta.description}>
                      {meta.description}
                    </p>
                  </div>
                  <div className="text-right shrink-0">
                    <span className={`font-mono text-xs font-bold ${isElevated ? 'text-rose-600' : 'text-slate-900'}`}>
                      {val.toFixed(2)}
                    </span>
                    <div className="text-[10px] text-slate-400">
                      corte: {meta.cutoffT60.toFixed(2)}
                    </div>
                  </div>
                </div>

                <div className="mt-2 space-y-1">
                  <input
                    type="range"
                    min={meta.min}
                    max={meta.max}
                    step={meta.step}
                    id={`slider-${meta.abbreviation.toLowerCase()}`}
                    value={val}
                    onChange={(e) => handleChange(meta.key, parseFloat(e.target.value))}
                    className={`w-full h-1.5 rounded-lg cursor-pointer ${
                      isElevated ? 'accent-rose-600' : 'accent-indigo-600'
                    }`}
                  />
                  <div className="flex justify-between items-center text-[10px]">
                    <span className="text-slate-400">0.00</span>
                    {isElevated ? (
                      <span className="font-semibold text-rose-600">
                        ⚠️ T &gt; 60 (Tomar nota)
                      </span>
                    ) : isAtCutoff ? (
                      <span className="font-medium text-indigo-600">
                        ⚖️ Corte T = 60
                      </span>
                    ) : (
                      <span className="text-emerald-700">
                        ✓ T ≤ 60 (Normal)
                      </span>
                    )}
                    <span className="text-slate-400">4.00</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 3 Índices Globales (IGS, TSP, IMSP) */}
      <div className="space-y-3">
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
          <span>3 Índices Globales de Distrés Psíquico</span>
          <span className="text-[10px] font-normal text-slate-500 lowercase">(IGS / TSP / IMSP)</span>
        </h4>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {globalIndices.map((meta) => {
            const val = sclData[meta.key] ?? 0;
            const isElevated = val > meta.cutoffT60;
            const isAtCutoff = Math.abs(val - meta.cutoffT60) < 0.05;

            return (
              <div
                key={meta.key}
                id={`index-card-${meta.abbreviation.toLowerCase()}`}
                className={`rounded-lg p-3.5 border flex flex-col justify-between transition-colors ${
                  isElevated
                    ? "bg-rose-50/50 border-rose-200"
                    : isAtCutoff
                    ? "bg-indigo-50/40 border-indigo-200"
                    : "bg-slate-50/60 border-slate-200"
                }`}
              >
                <div className="flex justify-between items-start text-xs mb-1.5">
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="font-bold text-[11px] px-1.5 py-0.5 rounded bg-indigo-100 text-indigo-800">
                        {meta.abbreviation}
                      </span>
                      <span className="text-slate-900 font-bold text-xs">{meta.name}</span>
                    </div>
                    <p className="text-[10px] text-slate-500 mt-1">
                      {meta.description}
                    </p>
                  </div>
                  <div className="text-right shrink-0 pl-2">
                    <span className={`font-mono text-sm font-bold ${isElevated ? 'text-rose-600' : 'text-slate-900'}`}>
                      {meta.key === "PST" ? val.toFixed(0) : val.toFixed(2)}
                    </span>
                    <div className="text-[10px] text-slate-400">
                      corte: {meta.key === "PST" ? meta.cutoffT60.toFixed(0) : meta.cutoffT60.toFixed(2)}
                    </div>
                  </div>
                </div>

                <div className="mt-2 space-y-1">
                  <input
                    type="range"
                    min={meta.min}
                    max={meta.max}
                    step={meta.step}
                    id={`slider-${meta.abbreviation.toLowerCase()}`}
                    value={val}
                    onChange={(e) => handleChange(meta.key, parseFloat(e.target.value))}
                    className={`w-full h-1.5 rounded-lg cursor-pointer ${
                      isElevated ? 'accent-rose-600' : 'accent-indigo-600'
                    }`}
                  />
                  <div className="flex justify-between items-center text-[10px]">
                    <span className="text-slate-400">{meta.min}</span>
                    {isElevated ? (
                      <span className="font-semibold text-rose-600">
                        ⚠️ T &gt; 60 (Elevado)
                      </span>
                    ) : isAtCutoff ? (
                      <span className="font-medium text-indigo-600">
                        ⚖️ Corte exacto
                      </span>
                    ) : (
                      <span className="text-emerald-700">
                        ✓ T ≤ 60 (Normal)
                      </span>
                    )}
                    <span className="text-slate-400">{meta.max}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Nota Metodológica de Tesis (§14.5) */}
      <div className="bg-amber-50/70 border border-amber-200/80 rounded-lg p-3 text-xs text-amber-950 flex items-start gap-2.5">
        <Info className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <p className="font-semibold text-amber-950">
            Anotación Clínica &amp; Epistemológica (Capítulo 14.5 de la Tesis):
          </p>
          <p className="text-amber-900/90 leading-relaxed text-[11px]">
            Conforme a las normas de Casullo &amp; Pérez (2008) para población de Buenos Aires, los valores de corte fijados en <strong>T = 60</strong> delimitan la sintomatología clínicamente significativa. En el modelo geométrico del Horn Torus, las coordenadas modulan las fases de oscilación de las formaciones del inconsciente (cintas $S$, $I$, $\Sigma$ y Trieb) en la superficie sin invadir la singularidad central de la voz ($v = \pi$).
          </p>
        </div>
      </div>
    </div>
  );
};
