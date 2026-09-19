"use client";

import React from "react";
import { HornTorusFamiliaModel } from "@/lib/hornTorusMath";
import { AlertTriangle, CheckCircle2, Info } from "lucide-react";

interface InvariantsPanelProps {
  model: HornTorusFamiliaModel;
}

export const InvariantsPanel: React.FC<InvariantsPanelProps> = ({ model }) => {
  const inv = model.invariantes();

  const formatNum = (val: number) => {
    if (!Number.isFinite(val)) return "∞ (diverge)";
    return val.toFixed(4);
  };

  return (
    <div className="flex flex-col gap-4 bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
        <div>
          <h3 className="text-base font-semibold text-slate-900">
            Invariantes Geométricos y Topológicos Exactos
          </h3>
          <p className="text-xs text-slate-500">
            Cálculo cerrado para el miembro actual de la familia de toros de revolución r → R
          </p>
        </div>
        <span
          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${
            inv.es_variedad
              ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
              : "bg-amber-50 text-amber-800 border border-amber-300"
          }`}
        >
          {inv.es_variedad ? (
            <>
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              Variedad lisa 2D (r &lt; R)
            </>
          ) : (
            <>
              <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
              Límite r = R: No es variedad
            </>
          )}
        </span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-slate-50 rounded-lg p-3 border border-slate-100">
          <div className="text-[11px] font-medium text-slate-500">Cociente r / R</div>
          <div className="text-lg font-mono font-bold text-slate-900 mt-0.5">
            {inv.r_over_R.toFixed(4)}
          </div>
          <div className="text-[10px] text-slate-500 mt-1">
            {inv.r_over_R === 1.0
              ? "Horn torus (límite)"
              : Math.abs(inv.r_over_R - 1 / Math.SQRT2) < 0.01
              ? "Toro de Clifford"
              : "Toro anular estándar"}
          </div>
        </div>

        <div className="bg-slate-50 rounded-lg p-3 border border-slate-100">
          <div className="text-[11px] font-medium text-slate-500">Radio Agujero R − r</div>
          <div className="text-lg font-mono font-bold text-slate-900 mt-0.5">
            {inv.radio_agujero.toFixed(4)}
          </div>
          <div className="text-[10px] text-slate-500 mt-1">
            {inv.radio_agujero <= 1e-4 ? "Agujero colapsado a un punto" : "Agujero central abierto"}
          </div>
        </div>

        <div className="bg-slate-50 rounded-lg p-3 border border-slate-100">
          <div className="text-[11px] font-medium text-slate-500">Característica de Euler χ</div>
          <div className="text-lg font-mono font-bold text-indigo-700 mt-0.5">
            χ = {inv.euler_characteristic}
          </div>
          <div className="text-[10px] text-slate-500 mt-1">
            {inv.euler_characteristic === 1
              ? "χ pasa de 0 a 1 en el límite"
              : "χ = 0 (toro topológico estándar)"}
          </div>
        </div>

        <div className="bg-slate-50 rounded-lg p-3 border border-slate-100">
          <div className="text-[11px] font-medium text-slate-500">Grupo Homología H₁</div>
          <div className="text-lg font-mono font-bold text-indigo-700 mt-0.5">
            {inv.H1}
          </div>
          <div className="text-[10px] text-slate-500 mt-1">
            Rango = {inv.rango_H1} (muere la longitud λ)
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-1">
        <div className="border border-slate-100 rounded-lg p-3.5 bg-slate-50/50">
          <h4 className="text-xs font-semibold text-slate-800 uppercase tracking-wider mb-2">
            Métricas de Curvatura y Energía
          </h4>
          <div className="flex flex-col gap-2 text-xs">
            <div className="flex justify-between items-center py-1 border-b border-slate-200/60">
              <span className="text-slate-600">Energía de Willmore W = ∫H² dA</span>
              <span className={`font-mono font-semibold ${!Number.isFinite(inv.willmore) ? "text-rose-600 font-bold" : "text-slate-900"}`}>
                {formatNum(inv.willmore)}
              </span>
            </div>
            <div className="flex justify-between items-center py-1 border-b border-slate-200/60">
              <span className="text-slate-600">Mínimo de W en la familia</span>
              <span className="font-mono text-slate-700">
                2π² ≈ {inv.willmore_minimo_familia.toFixed(4)} (en r/R = 1/√2)
              </span>
            </div>
            <div className="flex justify-between items-center py-1 border-b border-slate-200/60">
              <span className="text-slate-600">Curvatura de Gauss mínima K_min</span>
              <span className={`font-mono font-semibold ${!Number.isFinite(inv.curvatura_gauss_min) ? "text-rose-600" : "text-slate-900"}`}>
                {formatNum(inv.curvatura_gauss_min)}
              </span>
            </div>
            <div className="flex justify-between items-center py-1 border-b border-slate-200/60">
              <span className="text-slate-600">Curvatura de Gauss máxima K_max</span>
              <span className="font-mono text-slate-900">{formatNum(inv.curvatura_gauss_max)}</span>
            </div>
            <div className="flex justify-between items-center py-1">
              <span className="text-slate-600">Curvatura media promedio ⟨H⟩ = 1/(2r)</span>
              <span className="font-mono text-slate-900">{formatNum(inv.curvatura_media_promedio)}</span>
            </div>
          </div>
        </div>

        <div className="border border-slate-100 rounded-lg p-3.5 bg-slate-50/50">
          <h4 className="text-xs font-semibold text-slate-800 uppercase tracking-wider mb-2">
            Medidas Métricas Globales
          </h4>
          <div className="flex flex-col gap-2 text-xs">
            <div className="flex justify-between items-center py-1 border-b border-slate-200/60">
              <span className="text-slate-600">Área superficial A = 4π² R r</span>
              <span className="font-mono font-semibold text-slate-900">{inv.area.toFixed(3)}</span>
            </div>
            <div className="flex justify-between items-center py-1 border-b border-slate-200/60">
              <span className="text-slate-600">Volumen encerrado V = 2π² R r²</span>
              <span className="font-mono font-semibold text-slate-900">{inv.volumen.toFixed(3)}</span>
            </div>
            <div className="flex justify-between items-center py-1 border-b border-slate-200/60">
              <span className="text-slate-600">Radio de revolución R</span>
              <span className="font-mono text-slate-900">{inv.R.toFixed(3)}</span>
            </div>
            <div className="flex justify-between items-center py-1">
              <span className="text-slate-600">Radio del tubo r</span>
              <span className="font-mono text-slate-900">{inv.r.toFixed(3)}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-amber-50/70 border border-amber-200 rounded-lg p-3 text-xs text-amber-900 flex items-start gap-2.5">
        <Info className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <p className="font-semibold text-amber-950">
            Corrección epistemológica de la tesis (Lic. Carlos Vonsik):
          </p>
          <p className="text-amber-900/90 leading-relaxed">
            1. <strong>El horn torus (r = R) no es una variedad diferenciable:</strong> colapsa la
            longitud interior λ_int al origen. Los teoremas de Heegaard y Alexander valen para todo
            miembro r &lt; R de la familia suave, pero se quiebran en el límite singular donde surge
            la voz.
          </p>
          <p className="text-amber-900/90 leading-relaxed">
            2. <strong>W = 2π² no es el valor del horn torus</strong> sino el del toro de Clifford (r/R
            = 1/√2 ≈ 0.7071). Al acercarse al límite r → R, la energía de Willmore diverge a +∞ y
            K_min a −∞.
          </p>
        </div>
      </div>
    </div>
  );
};
