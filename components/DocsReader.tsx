"use client";

import React, { useState, useEffect } from "react";
import { Book, FileText, ChevronRight, Loader2 } from "lucide-react";

interface DocOption {
  id: string;
  title: string;
  description: string;
}

const DOCS_LIST: DocOption[] = [
  {
    id: "seccion16",
    title: "§16 — La Familia de Toros Límite r → R",
    description: "Reescritura rigurosa del paso al límite: qué teoremas valen en la familia y qué se rompe en el horn torus.",
  },
  {
    id: "trauma",
    title: "Formalización: Trauma y Fantasía",
    description: "Trauma como marca alcanzable (Emma), fantasía como agujero (Ein Kind...), y los dos mecanismos de la angustia.",
  },
  {
    id: "leyenda",
    title: "Leyenda y Estatuto de los Diagramas",
    description: "Declaración CITA / LECTURA / AXIOMA / HECHO MATEMÁTICO para cada elemento visual de las 8 figuras.",
  },
  {
    id: "capitulo",
    title: "Capítulo Completo: Horn Torus del Icc",
    description: "El texto completo del capítulo de la tesis de licenciatura (Carlos Vonsik, MN 85130).",
  },
];

export const DocsReader: React.FC = () => {
  const [selectedDocId, setSelectedDocId] = useState<string>("seccion16");
  const [content, setContent] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    setError(null);

    fetch(`/api/docs?doc=${selectedDocId}`)
      .then((res) => {
        if (!res.ok) throw new Error("Error al cargar el documento");
        return res.json();
      })
      .then((data) => {
        if (isMounted) {
          setContent(data.content || "");
          setLoading(false);
        }
      })
      .catch((err) => {
        if (isMounted) {
          setError(err.message || "Error al cargar documento");
          setLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [selectedDocId]);

  return (
    <div className="flex flex-col gap-4 bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
        <div>
          <h3 className="text-base font-semibold text-slate-900 flex items-center gap-2">
            <Book className="w-4 h-4 text-indigo-600" />
            Documentos y Fundamentación Teórica (Tesis RSI – Poincaré)
          </h3>
          <p className="text-xs text-slate-500">
            Textos de trabajo de Lic. Carlos Vonsik con el estatuto epistemológico de cada proposición
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Document list selector */}
        <div className="flex flex-col gap-1.5 md:col-span-1">
          {DOCS_LIST.map((doc) => {
            const isSelected = doc.id === selectedDocId;
            return (
              <button
                key={doc.id}
                onClick={() => setSelectedDocId(doc.id)}
                className={`text-left p-2.5 rounded-lg border transition-all text-xs flex flex-col gap-1 ${
                  isSelected
                    ? "bg-indigo-50 border-indigo-200 text-indigo-950 font-medium"
                    : "bg-slate-50 border-slate-200/70 text-slate-700 hover:bg-slate-100"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-semibold flex items-center gap-1.5 truncate">
                    <FileText className="w-3.5 h-3.5 shrink-0 text-slate-400" />
                    {doc.title}
                  </span>
                  <ChevronRight
                    className={`w-3.5 h-3.5 shrink-0 transition-transform ${
                      isSelected ? "text-indigo-600 rotate-90" : "text-slate-400"
                    }`}
                  />
                </div>
                <span className="text-[11px] text-slate-500 line-clamp-2">{doc.description}</span>
              </button>
            );
          })}
        </div>

        {/* Document content viewer */}
        <div className="md:col-span-3 bg-slate-50 rounded-xl border border-slate-200 p-5 min-h-[400px] max-h-[600px] overflow-y-auto">
          {loading ? (
            <div className="h-64 flex flex-col items-center justify-center text-slate-400 gap-2">
              <Loader2 className="w-6 h-6 animate-spin text-indigo-600" />
              <span className="text-xs">Cargando documento...</span>
            </div>
          ) : error ? (
            <div className="h-64 flex flex-col items-center justify-center text-rose-600 text-xs">
              <span>{error}</span>
            </div>
          ) : (
            <div className="prose prose-slate prose-sm max-w-none text-xs leading-relaxed font-sans whitespace-pre-wrap">
              {content}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
