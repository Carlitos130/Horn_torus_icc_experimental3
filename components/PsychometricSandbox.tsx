"use client";

import React from "react";
import { SCL90RData, DEFAULT_SCL90R_DATA } from "@/lib/hornTorusMath";
import { AlertCircle, Sliders, RefreshCw } from "lucide-react";

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

  const handleReset = () => {
    onUpdateSclData({ ...DEFAULT_SCL90R_DATA });
    onUpdateDeformation(0.3);
  };

  const primaryScales: (keyof SCL90RData)[] = [
    "Somatizacion",
    "Obsesion-Compulsion",
    "Sensibilidad Interpersonal",
    "Depresion",
    "Ansiedad",
    "Hostilidad",
    "Ansiedad Fobica",
    "Ideacion Paranoide",
    "Psicoticismo",
  ];

  const globalIndices: (keyof SCL90RData)[] = ["GSI", "PST", "PSDI"];

  return (
    <div className="flex flex-col gap-4 bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
        <div>
          <h3 className="text-base font-semibold text-slate-900 flex items-center gap-2">
            <Sliders className="w-4 h-4 text-indigo-600" />
            Módulo Psicométrico SCL-90-R &amp; Parámetros Lacanianos
          </h3>
          <p className="text-xs text-slate-500">
            Ajuste de escalas para deformación del manifold y fijación de fases de las curvas
          </p>
        </div>
        <button
          onClick={handleReset}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
        >
          <RefreshCw className="w-3 h-3" />
          Restablecer valores originales
        </button>
      </div>

      {/* Explicit Clinical Warning (§14.5) */}
      <div className="bg-rose-50 border border-rose-200 rounded-lg p-3 text-xs text-rose-900 flex items-start gap-2.5">
        <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <p className="font-bold text-rose-950">
            ADVERTENCIA METODOLÓGICA (Capítulo 14.5 de la Tesis):
          </p>
          <p className="text-rose-900/90 leading-relaxed">
            El acoplamiento con el SCL-90-R tiene constantes libres y una asignación escala → coordenada
            que no se deriva analíticamente, con magnitudes topológicas reportadas a mano en el motor
            heredado. <strong>No tiene valor diagnóstico alguno y no debe utilizarse para ninguna
            decisión clínica</strong>; obra en este modelo únicamente como parametrización ilustrativa.
          </p>
        </div>
      </div>

      {/* Deformation slider */}
      <div className="bg-slate-50 rounded-lg p-3.5 border border-slate-100">
        <div className="flex justify-between items-center text-xs mb-1">
          <span className="font-semibold text-slate-800">
            Factor de Deformación del Manifold (δ)
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
          value={deformationFactor}
          onChange={(e) => onUpdateDeformation(parseFloat(e.target.value))}
          className="w-full accent-indigo-600 cursor-pointer"
        />
        <div className="flex justify-between text-[10px] text-slate-400 mt-1">
          <span>0.00 (Toro simétrico perfecto)</span>
          <span>0.30 (Predeterminado)</span>
          <span>0.80 (Máxima perturbación armónica)</span>
        </div>
      </div>

      {/* Primary scales grid */}
      <div className="space-y-2">
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">
          9 Escalas Primarias SCL-90-R
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {primaryScales.map((key) => (
            <div
              key={key}
              className="bg-slate-50/60 rounded-lg p-2.5 border border-slate-200/60 flex flex-col justify-between"
            >
              <div className="flex justify-between items-center text-xs mb-1">
                <span className="text-slate-700 font-medium truncate pr-2">{key}</span>
                <span className="font-mono text-xs font-semibold text-slate-900">
                  {(sclData[key] ?? 0).toFixed(2)}
                </span>
              </div>
              <input
                type="range"
                min="0.0"
                max="2.5"
                step="0.05"
                value={sclData[key] ?? 0}
                onChange={(e) => handleChange(key, parseFloat(e.target.value))}
                className="w-full accent-indigo-600 h-1.5 bg-slate-200 rounded-lg cursor-pointer"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Global indices */}
      <div className="space-y-2">
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">
          Índices Globales
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {globalIndices.map((key) => (
            <div
              key={key}
              className="bg-slate-50/60 rounded-lg p-2.5 border border-slate-200/60 flex flex-col justify-between"
            >
              <div className="flex justify-between items-center text-xs mb-1">
                <span className="text-slate-700 font-medium">{key}</span>
                <span className="font-mono text-xs font-semibold text-slate-900">
                  {(sclData[key] ?? 0).toFixed(2)}
                </span>
              </div>
              <input
                type="range"
                min="0.1"
                max="3.0"
                step="0.05"
                value={sclData[key] ?? 0}
                onChange={(e) => handleChange(key, parseFloat(e.target.value))}
                className="w-full accent-indigo-600 h-1.5 bg-slate-200 rounded-lg cursor-pointer"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
