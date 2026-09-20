"use client";

import React, { useState } from "react";
import Image from "next/image";
import { ZoomIn, BookOpen, Layers } from "lucide-react";

interface FigureItem {
  id: string;
  title: string;
  src: string;
  section: string;
  summary: string;
  statutes: { element: string; statute: string; support: string }[];
}

const FIGURES_DATA: FigureItem[] = [
  {
    id: "fig1",
    title: "Fig. 1 — El Corte Axial",
    src: "/figures/fig1_corte_axial.png",
    section: "§4",
    summary:
      "Corte transversal al ángulo u. Dos circunferencias iguales tangentes en el origen (R = r = a). El punto de autotangencia es la voz / vía del superyó. Se muestran las 4 marcas de la cinta en la cara interna, el espesor Pcs que se anula en la autotangencia, y el núcleo del trauma y fantasma.",
    statutes: [
      {
        element: "Dos circunferencias iguales tangentes en un punto",
        statute: "HECHO MATEMÁTICO",
        support: "Consecuencia directa de R = r = a; no es licencia del dibujo.",
      },
      {
        element: "Punto de autotangencia = la voz (vía superyóica)",
        statute: "CITA + AXIOMA",
        support: "Lacan Sem. XI leç. 15 (orejas: orificio sin cierre); Freud GW XV conf. XXXI (Stimme des Gewissens).",
      },
      {
        element: "Cinta S-I-Σ pegada a cara interna",
        statute: "AXIOMA",
        support: "Definición del modelo en §4.",
      },
      {
        element: "Hilo pulsional pegado al borde de I",
        statute: "AXIOMA + CITA",
        support: "Lacan Sem. XI p. 106 (bord érogène funda trayecto circular).",
      },
      {
        element: "Pared con espesor Pcs que se anula en la autotangencia",
        statute: "AXIOMA + PENDIENTE",
        support: "§5 le da espesor; §16 aclara que el Pcs no ocupa región del volumen interior V.",
      },
    ],
  },
  {
    id: "fig2",
    title: "Fig. 2 — La Cinta sobre la Cara Interna y la Carta Desplegada",
    src: "/figures/fig2_cinta_cara_interna.png",
    section: "§4",
    summary:
      "(a) Cara interna vista desde abajo con la mitad inferior del tubo removida. (b) Carta desplegada (u, v) mostrando que la recta v = π colapsa a un solo punto (la voz) y la trenza conforme a §4 en la banda [0.45, 2.70].",
    statutes: [
      {
        element: "Recta v = π es un único punto en el horn torus",
        statute: "HECHO MATEMÁTICO",
        support: "En el horn torus límite la curva longitudinal interior colapsa al origen.",
      },
      {
        element: "Trenza conforme al §4",
        statute: "AXIOMA",
        support: "Conserva fases v_S, v_I, v_Σ mod 2π en banda [0.45, 2.70] sin cruzar la voz.",
      },
      {
        element: "Zona de ruptura A ≤ A_cr = π/4",
        statute: "AXIOMA",
        support: "Distancia angular envuelta sobre la carta del toro.",
      },
    ],
  },
  {
    id: "fig3",
    title: "Fig. 3 — Las Cuatro Vías de Salida y el Tiempo en el Cruce",
    src: "/figures/fig3_vias_de_salida.png",
    section: "§5 y §9",
    summary:
      "Las vías de salida: La voz (fija, espesor cero, siempre abierta), Palabra deformada (Entstellung, v = 0.95), Agieren (v = 2.05), y Sublimación. Cada cruce es un borde de época mínimo donde se produce la fecha.",
    statutes: [
      {
        element: "La voz — fija, espesor cero, siempre abierta",
        statute: "CITA + AXIOMA",
        support: "Lacan Sem. XI; Freud GW XV.",
      },
      {
        element: "Palabra deformada (Entstellung)",
        statute: "AXIOMA + CITA",
        support: "Exige marca ligada a Wortvorstellung: travesía Ub → Vb de la Carta 52.",
      },
      {
        element: "Agieren",
        statute: "CITA",
        support: "Freud GW X, «Erinnern, Wiederholen und Durcharbeiten», p. 131.",
      },
      {
        element: "Cada cruce es un borde de época donde se produce la fecha",
        statute: "AXIOMA (Carlos)",
        support: "Sobre CITA de Freud GW X, p. 286 y Carta 52.",
      },
    ],
  },
  {
    id: "fig4",
    title: "Fig. 4 — Heegaard, Toro Sólido y No-Anudamiento",
    src: "/figures/fig4_heegaard_no_anudamiento.png",
    section: "§4.7 y §16",
    summary:
      "V = toro sólido cerrado por Ding; descomposición de Heegaard de género 1 (m ↦ ℓ) produciendo S³. Ding separa S³ en dos componentes por dualidad de Alexander. Para que ambos lados sean toros sólidos, Ding no debe estar anudado.",
    statutes: [
      {
        element: "V = toro sólido cerrado por Ding",
        statute: "AXIOMA",
        support: "Formalización adoptada en §16.",
      },
      {
        element: "Pegado de Heegaard género 1 → S³",
        statute: "HECHO MATEMÁTICO",
        support: "Teorema de Heegaard 1898; Rolfsen; Hempel.",
      },
      {
        element: "Ding separa S³ en dos componentes",
        statute: "HECHO MATEMÁTICO",
        support: "Dualidad de Alexander (Trans. AMS 23, 1922).",
      },
      {
        element: "Ambos lados toros sólidos exige Ding no anudado",
        statute: "HECHO MATEMÁTICO + AXIOMA",
        support: "La implicación es teorema; la hipótesis de no anudamiento es axioma propio.",
      },
    ],
  },
  {
    id: "fig5",
    title: "Fig. 5 — El Horn Torus como Límite de la Familia r → R",
    src: "/figures/fig5_familia_limite.png",
    section: "§16",
    summary:
      "(a) La familia en corte axial para r/R = 0.45 ... 1.00. (b) La curva que muere es la longitud interior λ_int = {v = π}. (c) Los invariantes saltan únicamente en el límite: χ pasa de 0 a 1, y rango de H₁ pasa de 2 a 1.",
    statutes: [
      {
        element: "Familia de toros lisos encajados",
        statute: "HECHO MATEMÁTICO",
        support: "r < R es variedad lisa difeomorfa a S¹ × S¹.",
      },
      {
        element: "Salto en el límite r = R",
        statute: "HECHO MATEMÁTICO",
        support: "χ = 1, H₁ = Z⟨μ⟩. La variedad se degenera en un punto.",
      },
    ],
  },
  {
    id: "fig6",
    title: "Fig. 6 — Invariantes a lo Largo de la Familia",
    src: "/figures/fig6_invariantes_familia.png",
    section: "§16",
    summary:
      "La energía de Willmore W y las curvaturas sobre la familia. Mínimo de W = 2π² en r/R = 1/√2 (toro de Clifford). En r → R, W → ∞ y K_min → −∞, mientras K_max y ⟨H⟩ permanecen finitos.",
    statutes: [
      {
        element: "W_min = 2π² en r/R = 1/√2",
        statute: "HECHO MATEMÁTICO",
        support: "Conjetura de Willmore probada por Marques y Neves (2014).",
      },
      {
        element: "Divergencia de flexión en el límite",
        statute: "HECHO MATEMÁTICO",
        support: "W y K_min divergen cuando r → R.",
      },
    ],
  },
  {
    id: "fig7",
    title: "Fig. 7 — Trauma Alcanzable (Emma) y Fantasía como Agujero",
    src: "/figures/fig7_trauma_fantasma.png",
    section: "§17",
    summary:
      "(a) Trauma: marca en la superficie alcanzable por caminos en épocas posteriores (caso Emma, Kleider). (b) Fantasía: no es un punto sino un defecto/agujero en la superficie de inscripción («Ein Kind wird geschlagen», φ₂ rodeado pero nunca visitado).",
    statutes: [
      {
        element: "Trauma como marca alcanzable por Nachträglichkeit",
        statute: "CITA + AXIOMA",
        support: "Freud GW II/III, Entwurf, caso Emma.",
      },
      {
        element: "Fantasía como agujero / defecto topológico",
        statute: "CITA + AXIOMA",
        support: "Freud GW XII, «Ein Kind wird geschlagen» (fase inconsciente φ₂).",
      },
    ],
  },
  {
    id: "fig8",
    title: "Fig. 8 — Los Dos Mecanismos de la Angustia: Métrico y Topológico",
    src: "/figures/fig8_angustia_dos_mecanismos.png",
    section: "§17",
    summary:
      "(a) Cerca del trauma: mecanismo métrico y graduado (la angustia crece al acercarse; el umbral A_cr = π/4 opera aquí). (b) Cerca de la fantasía: mecanismo topológico no graduado (el agujero no se puede atravesar; rodearlo por izquierda o por derecha produce dos caminos no homotópicos).",
    statutes: [
      {
        element: "Angustia métrica graduada",
        statute: "AXIOMA",
        support: "Gradiente de proximidad en distancia envuelta.",
      },
      {
        element: "Angustia topológica / no homotopía",
        statute: "AXIOMA + HECHO MATEMÁTICO",
        support: "Grupo fundamental con perforación genera clases de homotopía distintas.",
      },
    ],
  },
];

export const FiguresGallery: React.FC = () => {
  const [selectedFigId, setSelectedFigId] = useState<string>("fig1");
  const selectedFig = FIGURES_DATA.find((f) => f.id === selectedFigId) || FIGURES_DATA[0];

  return (
    <div className="flex flex-col gap-5 bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
        <div>
          <h3 className="text-base font-semibold text-slate-900 flex items-center gap-2">
            <Layers className="w-4 h-4 text-indigo-600" />
            Atlas de Figuras de la Tesis (RSI – Poincaré)
          </h3>
          <p className="text-xs text-slate-500">
            Las 8 figuras del Capítulo 4/5 con la disciplina de estatutos metodológicos
          </p>
        </div>
      </div>

      {/* Tabs list */}
      <div className="flex flex-wrap gap-1.5 p-1 bg-slate-100 rounded-lg border border-slate-200/60">
        {FIGURES_DATA.map((fig) => {
          const isActive = fig.id === selectedFigId;
          return (
            <button
              key={fig.id}
              onClick={() => setSelectedFigId(fig.id)}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                isActive
                  ? "bg-white text-indigo-700 shadow-sm font-semibold"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-200/60"
              }`}
            >
              {fig.id.toUpperCase()} · {fig.section}
            </button>
          );
        })}
      </div>

      {/* Main figure display */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        <div className="lg:col-span-7 flex flex-col bg-slate-950 rounded-xl overflow-hidden border border-slate-800 p-2">
          <div className="relative w-full aspect-[16/10] bg-slate-900 rounded-lg overflow-hidden flex items-center justify-center">
            <Image
              src={selectedFig.src}
              alt={selectedFig.title}
              fill
              sizes="(max-width: 1024px) 100vw, 58vw"
              className="object-contain"
              priority
              referrerPolicy="no-referrer"
            />
          </div>
          <div className="p-3 text-slate-400 text-xs flex justify-between items-center">
            <span className="font-mono text-slate-300">{selectedFig.title}</span>
            <a
              href={selectedFig.src}
              target="_blank"
              rel="noopener noreferrer"
              className="text-indigo-400 hover:text-indigo-300 inline-flex items-center gap-1 text-[11px]"
            >
              <ZoomIn className="w-3.5 h-3.5" />
              Abrir alta resolución
            </a>
          </div>
        </div>

        {/* Detailed legend & epistemological statutes */}
        <div className="lg:col-span-5 flex flex-col gap-4">
          <div>
            <span className="inline-block px-2 py-0.5 rounded text-[10px] font-bold tracking-wide uppercase bg-indigo-50 text-indigo-700 border border-indigo-200 mb-1">
              Capítulo {selectedFig.section}
            </span>
            <h4 className="text-base font-bold text-slate-900">{selectedFig.title}</h4>
            <p className="text-xs text-slate-600 mt-1 leading-relaxed">{selectedFig.summary}</p>
          </div>

          <div className="flex flex-col gap-2">
            <h5 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
              <BookOpen className="w-3.5 h-3.5 text-slate-500" />
              Estatuto Epistemológico de Cada Elemento
            </h5>
            <div className="flex flex-col gap-2 max-h-[380px] overflow-y-auto pr-1">
              {selectedFig.statutes.map((s, idx) => (
                <div
                  key={idx}
                  className="bg-slate-50 rounded-lg p-2.5 border border-slate-200/80 text-xs"
                >
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <span className="font-semibold text-slate-900">{s.element}</span>
                    <span
                      className={`px-1.5 py-0.5 rounded text-[10px] font-bold shrink-0 ${
                        s.statute.includes("HECHO")
                          ? "bg-blue-100 text-blue-800"
                          : s.statute.includes("CITA")
                          ? "bg-emerald-100 text-emerald-800"
                          : s.statute.includes("AXIOMA")
                          ? "bg-purple-100 text-purple-800"
                          : "bg-amber-100 text-amber-800"
                      }`}
                    >
                      {s.statute}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-600 leading-snug">{s.support}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
