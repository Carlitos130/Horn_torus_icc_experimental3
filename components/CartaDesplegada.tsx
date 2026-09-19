"use client";

import React, { useRef, useEffect } from "react";
import { HornTorusFamiliaModel, COLOR_PALETTE } from "@/lib/hornTorusMath";

interface CartaDesplegadaProps {
  model: HornTorusFamiliaModel;
}

export const CartaDesplegada: React.FC<CartaDesplegadaProps> = ({ model }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    const padding = 38;

    const mapU = (u: number) => padding + (u / (2 * Math.PI)) * (width - 2 * padding);
    // v = 0 at top, v = 2pi at bottom, or inverted?
    // In math diagrams, v=0 at bottom, v=2pi at top
    const mapV = (v: number) => height - padding - (v / (2 * Math.PI)) * (height - 2 * padding);

    ctx.clearRect(0, 0, width, height);

    // Background square
    ctx.fillStyle = "#f8fafc";
    ctx.fillRect(padding, padding, width - 2 * padding, height - 2 * padding);

    // Internal face band: [0.45, 2.70]
    const yBandaTop = mapV(2.70);
    const yBandaBottom = mapV(0.45);
    ctx.fillStyle = "#e2e8f0";
    ctx.fillRect(padding, yBandaTop, width - 2 * padding, yBandaBottom - yBandaTop);

    // Grid lines for 0, pi, 2pi
    ctx.strokeStyle = "#cbd5e1";
    ctx.lineWidth = 1;
    ctx.setLineDash([4, 4]);

    // Vertical u = pi
    const xMid = mapU(Math.PI);
    ctx.beginPath();
    ctx.moveTo(xMid, padding);
    ctx.lineTo(xMid, height - padding);
    ctx.stroke();

    // Horizontal exit paths: palabra (0.95), agieren (2.05)
    ctx.setLineDash([3, 3]);
    ctx.strokeStyle = "#94a3b8";
    const yPalabra = mapV(0.95);
    ctx.beginPath();
    ctx.moveTo(padding, yPalabra);
    ctx.lineTo(width - padding, yPalabra);
    ctx.stroke();

    const yAgieren = mapV(2.05);
    ctx.beginPath();
    ctx.moveTo(padding, yAgieren);
    ctx.lineTo(width - padding, yAgieren);
    ctx.stroke();

    // Labels for exit paths
    ctx.setLineDash([]);
    ctx.font = "10px sans-serif";
    ctx.fillStyle = "#64748b";
    ctx.textAlign = "right";
    ctx.fillText("palabra (v = 0.95)", width - padding - 4, yPalabra - 4);
    ctx.fillText("agieren (v = 2.05)", width - padding - 4, yAgieren - 4);

    // Voice horizontal line: v = pi
    const yVoz = mapV(Math.PI);
    ctx.strokeStyle = COLOR_PALETTE.voz;
    ctx.lineWidth = 2.0;
    ctx.beginPath();
    ctx.moveTo(padding, yVoz);
    ctx.lineTo(width - padding, yVoz);
    ctx.stroke();

    ctx.fillStyle = COLOR_PALETTE.voz;
    ctx.font = "bold 10px sans-serif";
    ctx.textAlign = "left";
    ctx.fillText("λ_int  (v = π)  — en el límite colapsa al origen (la voz)", padding + 6, yVoz - 5);

    // Rupture zone contour: A(u, v) <= pi / 4
    ctx.fillStyle = "rgba(220, 38, 38, 0.15)";
    ctx.strokeStyle = "rgba(220, 38, 38, 0.7)";
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    const steps = 60;
    for (let i = 0; i <= steps; i++) {
      const angle = (i / steps) * 2 * Math.PI;
      const u = model.u_F + model.A_cr * Math.cos(angle);
      const v = model.v_F + model.A_cr * Math.sin(angle);
      const x = mapU(u);
      const y = mapV(v);
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = "#b91c1c";
    ctx.font = "9px sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("A ≤ π/4", mapU(model.u_F), mapV(model.v_F) + 20);

    // Draw Section 4 braided curves on the map
    const bandaMin = 0.45;
    const bandaMax = 2.70;
    const v0 = 0.5 * (bandaMin + bandaMax);
    const ampl = 0.5 * (bandaMax - bandaMin);

    const phi_S = model.v_S % (2 * Math.PI);
    const phi_I = model.v_I % (2 * Math.PI);
    const phi_Sigma = model.v_Sigma % (2 * Math.PI);

    const drawCurve = (phaseOffset: number, color: string, isPulsion: boolean = false) => {
      ctx.strokeStyle = color;
      ctx.lineWidth = isPulsion ? 1.5 : 2.2;
      ctx.setLineDash(isPulsion ? [4, 2] : []);
      ctx.beginPath();
      const numPts = 180;
      for (let i = 0; i <= numPts; i++) {
        const u = (i / numPts) * 2 * Math.PI;
        let v = v0 + ampl * Math.sin(3.0 * u + phaseOffset);
        if (isPulsion) {
          v += 0.075 + 0.055 * model.pulsion_attachment_strength;
        }
        const x = mapU(u);
        const y = mapV(v);
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();
    };

    drawCurve(phi_S, COLOR_PALETTE.S);
    drawCurve(phi_I + (2 * Math.PI) / 3, COLOR_PALETTE.I);
    drawCurve(phi_I + (2 * Math.PI) / 3, COLOR_PALETTE.Pulsion, true);
    drawCurve(phi_Sigma + (4 * Math.PI) / 3, COLOR_PALETTE.Sigma);

    // Draw Fantasy point (phi)
    const xF = mapU(model.u_F);
    const yF = mapV(model.v_F);
    ctx.fillStyle = COLOR_PALETTE.fant;
    ctx.fillRect(xF - 4, yF - 4, 8, 8);
    ctx.strokeStyle = "#ffffff";
    ctx.lineWidth = 1.2;
    ctx.strokeRect(xF - 4, yF - 4, 8, 8);

    // Draw Trauma point (T)
    const xT = mapU(model.u_T);
    const yT = mapV(model.v_T);
    ctx.fillStyle = COLOR_PALETTE.trauma;
    ctx.beginPath();
    ctx.moveTo(xT, yT - 6);
    ctx.lineTo(xT + 6, yT);
    ctx.lineTo(xT, yT + 6);
    ctx.lineTo(xT - 6, yT);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Chart Border & Axis Labels
    ctx.strokeStyle = "#475569";
    ctx.lineWidth = 1.5;
    ctx.setLineDash([]);
    ctx.strokeRect(padding, padding, width - 2 * padding, height - 2 * padding);

    ctx.fillStyle = "#334155";
    ctx.font = "11px sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("0", padding, height - padding + 15);
    ctx.fillText("π", mapU(Math.PI), height - padding + 15);
    ctx.fillText("2π", width - padding, height - padding + 15);
    ctx.fillText("Coordenada u (meridiano angular)", width / 2, height - 6);

    ctx.textAlign = "right";
    ctx.fillText("0", padding - 8, height - padding + 4);
    ctx.fillText("π", padding - 8, yVoz + 4);
    ctx.fillText("2π", padding - 8, padding + 4);

    ctx.save();
    ctx.translate(14, height / 2);
    ctx.rotate(-Math.PI / 2);
    ctx.textAlign = "center";
    ctx.fillText("Coordenada v (latitud del tubo)", 0, 0);
    ctx.restore();
  }, [model]);

  return (
    <div className="flex flex-col bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
      <div className="flex items-center justify-between mb-2">
        <h4 className="text-sm font-semibold text-slate-800">
          Carta Desplegada (u, v) de la Cara Interna (Fig. 2b)
        </h4>
        <span className="text-[11px] font-mono text-slate-500">
          Banda de inscripción [0.45, 2.70] rad
        </span>
      </div>
      <div className="relative w-full aspect-[4/3] max-h-[340px] flex items-center justify-center">
        <canvas
          ref={canvasRef}
          width={480}
          height={340}
          className="w-full h-full object-contain"
        />
      </div>
      <p className="mt-2 text-[11px] text-slate-600 leading-relaxed">
        <strong>Estatuto topológico:</strong> La línea horizontal plena{" "}
        <span className="font-mono text-slate-900 font-semibold">v = π</span> se
        dibuja extendida en la carta por desdoblamiento, pero en el horn torus límite{" "}
        (r = R) colapsa a un único punto geométrico en el origen:{" "}
        <em>la voz</em>. La trenza de tres hebras (§4) no toca este punto.
      </p>
    </div>
  );
};
