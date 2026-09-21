"use client";

import React, { useState, useEffect } from "react";
import {
  Book,
  FileText,
  ChevronRight,
  Loader2,
  Search,
  X,
  Sun,
  Moon,
  Bookmark,
  ShieldCheck,
  Award,
  Quote,
  AlertCircle,
  Type,
} from "lucide-react";
import {
  MarkdownDocumentViewer,
  ReaderTheme,
  TextSize,
} from "./MarkdownDocumentViewer";

interface DocOption {
  id: string;
  title: string;
  badge: string;
  description: string;
}

const DOCS_LIST: DocOption[] = [
  {
    id: "seccion16",
    title: "§16 — La Familia de Toros Límite r → R",
    badge: "Topología Formal",
    description: "Reescritura rigurosa del paso al límite: qué teoremas valen en la familia y qué se rompe en el horn torus.",
  },
  {
    id: "trauma",
    title: "Formalización: Trauma y Fantasía",
    badge: "Clínica & Axiomas",
    description: "Trauma como marca alcanzable (Emma), fantasía como agujero (Ein Kind...), y los dos mecanismos de la angustia.",
  },
  {
    id: "leyenda",
    title: "Leyenda y Estatuto de los Diagramas",
    badge: "Atlas Epistemológico",
    description: "Declaración CITA / LECTURA / AXIOMA / HECHO MATEMÁTICO para cada elemento visual de las 8 figuras.",
  },
  {
    id: "capitulo",
    title: "Capítulo Completo: Horn Torus del Icc",
    badge: "Tesis Licenciatura",
    description: "El texto completo del capítulo de la tesis de licenciatura (Lic. Carlos Vonsik, MN 85130).",
  },
];

export const DocsReader: React.FC = () => {
  const [selectedDocId, setSelectedDocId] = useState<string>("seccion16");
  const [content, setContent] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Reader settings
  const [readerTheme, setReaderTheme] = useState<ReaderTheme>("dark");
  const [textSize, setTextSize] = useState<TextSize>("base");
  const [searchQuery, setSearchQuery] = useState<string>("");

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

  const activeDoc = DOCS_LIST.find((d) => d.id === selectedDocId) || DOCS_LIST[0];

  return (
    <div className="flex flex-col gap-5 bg-slate-900 rounded-xl border border-slate-800 p-5 shadow-xl text-slate-100">
      {/* Header with Title and Epistemological Discipline Legend */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-indigo-950/80 border border-indigo-700/50 text-indigo-400">
              <Book className="w-5 h-5" />
            </span>
            <div>
              <h3 className="text-base md:text-lg font-bold text-slate-100 flex items-center gap-2">
                Documentos y Fundamentación Teórica (Tesis RSI – Poincaré)
              </h3>
              <p className="text-xs text-slate-400">
                Textos de trabajo de Lic. Carlos Vonsik con el estatuto epistemológico de cada proposición
              </p>
            </div>
          </div>
        </div>

        {/* Epistemological Statutes Badges Banner */}
        <div className="flex flex-wrap items-center gap-1.5 text-[11px] font-mono">
          <span className="text-slate-400 text-xs font-sans mr-1">Estatutos:</span>
          <span className="px-2 py-0.5 rounded bg-blue-950/60 border border-blue-500/40 text-blue-300 font-semibold flex items-center gap-1">
            <ShieldCheck className="w-3 h-3 text-blue-400" />
            HECHO MATEMÁTICO
          </span>
          <span className="px-2 py-0.5 rounded bg-purple-950/60 border border-purple-500/40 text-purple-300 font-semibold flex items-center gap-1">
            <Award className="w-3 h-3 text-purple-400" />
            AXIOMA
          </span>
          <span className="px-2 py-0.5 rounded bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 font-semibold flex items-center gap-1">
            <Quote className="w-3 h-3 text-emerald-400" />
            CITA
          </span>
          <span className="px-2 py-0.5 rounded bg-amber-950/60 border border-amber-500/40 text-amber-300 font-semibold flex items-center gap-1">
            <Book className="w-3 h-3 text-amber-400" />
            LECTURA
          </span>
          <span className="px-2 py-0.5 rounded bg-rose-950/60 border border-rose-500/40 text-rose-300 font-semibold flex items-center gap-1">
            <AlertCircle className="w-3 h-3 text-rose-400" />
            PENDIENTE
          </span>
        </div>
      </div>

      {/* Reader Workspace: Left Sidebar (Document selector) + Right Content Viewer */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        {/* Document List Selector */}
        <div className="lg:col-span-4 flex flex-col gap-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 px-1 flex items-center gap-1.5">
            <Bookmark className="w-3.5 h-3.5 text-indigo-400" />
            Textos de la Investigación
          </span>

          <div className="flex flex-col gap-2">
            {DOCS_LIST.map((doc) => {
              const isSelected = doc.id === selectedDocId;
              return (
                <button
                  key={doc.id}
                  onClick={() => setSelectedDocId(doc.id)}
                  className={`text-left p-3 rounded-xl border transition-all text-xs flex flex-col gap-1.5 ${
                    isSelected
                      ? "bg-indigo-950/90 border-indigo-500 text-white font-medium shadow-md shadow-indigo-950/50"
                      : "bg-slate-950/60 border-slate-800 text-slate-300 hover:bg-slate-800/80 hover:text-white hover:border-slate-700"
                  }`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-bold flex items-center gap-1.5 truncate text-slate-100">
                      <FileText className={`w-3.5 h-3.5 shrink-0 ${isSelected ? "text-indigo-400" : "text-slate-400"}`} />
                      {doc.title}
                    </span>
                    <ChevronRight
                      className={`w-4 h-4 shrink-0 transition-transform ${
                        isSelected ? "text-indigo-400 rotate-90" : "text-slate-500"
                      }`}
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="px-1.5 py-0.5 rounded text-[10px] font-mono font-semibold bg-slate-800/80 text-indigo-300 border border-slate-700/60">
                      {doc.badge}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 leading-snug line-clamp-2">
                    {doc.description}
                  </p>
                </button>
              );
            })}
          </div>
        </div>

        {/* Document Content Viewer and Reader Controls */}
        <div className="lg:col-span-8 flex flex-col gap-3">
          {/* Reader Top Controls: Search, Theme Mode, Font Size */}
          <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs">
            {/* Search in document */}
            <div className="relative flex-1 min-w-[200px]">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Buscar término o proposición..."
                className="w-full pl-8 pr-7 py-1.5 bg-slate-900 border border-slate-800 rounded-lg text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Reading Theme Selector */}
            <div className="flex items-center gap-1 bg-slate-900 border border-slate-800 rounded-lg p-1">
              <span className="text-[10px] text-slate-400 uppercase tracking-wider px-1 font-mono font-semibold">
                Fondo:
              </span>
              <button
                onClick={() => setReaderTheme("dark")}
                className={`px-2 py-1 rounded text-[11px] font-medium transition-colors flex items-center gap-1 ${
                  readerTheme === "dark"
                    ? "bg-indigo-600 text-white font-semibold"
                    : "text-slate-400 hover:text-slate-200"
                }`}
                title="Modo Pizarra Oscura (Alto contraste para monitores)"
              >
                <Moon className="w-3 h-3" />
                Oscuro
              </button>
              <button
                onClick={() => setReaderTheme("sepia")}
                className={`px-2 py-1 rounded text-[11px] font-medium transition-colors flex items-center gap-1 ${
                  readerTheme === "sepia"
                    ? "bg-[#6b3a1a] text-[#fbf7ee] font-semibold"
                    : "text-slate-400 hover:text-slate-200"
                }`}
                title="Modo Papel Sepia (Lectura editorial descansada)"
              >
                <Book className="w-3 h-3" />
                Sepia
              </button>
              <button
                onClick={() => setReaderTheme("light")}
                className={`px-2 py-1 rounded text-[11px] font-medium transition-colors flex items-center gap-1 ${
                  readerTheme === "light"
                    ? "bg-slate-200 text-slate-900 font-semibold"
                    : "text-slate-400 hover:text-slate-200"
                }`}
                title="Modo Blanco Editorial (Papel impreso)"
              >
                <Sun className="w-3 h-3" />
                Claro
              </button>
            </div>

            {/* Font Size Selector */}
            <div className="flex items-center gap-1 bg-slate-900 border border-slate-800 rounded-lg p-1">
              <span className="text-[10px] text-slate-400 uppercase tracking-wider px-1 font-mono font-semibold flex items-center gap-0.5">
                <Type className="w-3 h-3" />
              </span>
              <button
                onClick={() => setTextSize("sm")}
                className={`px-2 py-0.5 rounded text-xs font-mono transition-colors ${
                  textSize === "sm" ? "bg-indigo-600 text-white font-bold" : "text-slate-400 hover:text-slate-200"
                }`}
                title="Tamaño pequeño"
              >
                A-
              </button>
              <button
                onClick={() => setTextSize("base")}
                className={`px-2 py-0.5 rounded text-xs font-mono transition-colors ${
                  textSize === "base" ? "bg-indigo-600 text-white font-bold" : "text-slate-400 hover:text-slate-200"
                }`}
                title="Tamaño normal"
              >
                A
              </button>
              <button
                onClick={() => setTextSize("lg")}
                className={`px-2 py-0.5 rounded text-xs font-mono transition-colors ${
                  textSize === "lg" ? "bg-indigo-600 text-white font-bold" : "text-slate-400 hover:text-slate-200"
                }`}
                title="Tamaño grande"
              >
                A+
              </button>
            </div>
          </div>

          {/* Document Content Box */}
          {loading ? (
            <div className="h-[480px] bg-slate-950 rounded-xl border border-slate-800 flex flex-col items-center justify-center text-slate-400 gap-3">
              <Loader2 className="w-7 h-7 animate-spin text-indigo-500" />
              <div className="text-center">
                <span className="text-sm font-medium text-slate-300">Cargando documento...</span>
                <p className="text-xs text-slate-500">{activeDoc.title}</p>
              </div>
            </div>
          ) : error ? (
            <div className="h-[480px] bg-slate-950 rounded-xl border border-rose-900/60 p-6 flex flex-col items-center justify-center text-center gap-3">
              <AlertCircle className="w-8 h-8 text-rose-500" />
              <div className="text-rose-300 font-semibold text-sm">{error}</div>
              <button
                onClick={() => setSelectedDocId(selectedDocId)}
                className="px-3.5 py-1.5 rounded-lg bg-rose-950 border border-rose-800 text-rose-200 text-xs hover:bg-rose-900"
              >
                Reintentar
              </button>
            </div>
          ) : (
            <MarkdownDocumentViewer
              content={content}
              theme={readerTheme}
              textSize={textSize}
              searchQuery={searchQuery}
            />
          )}
        </div>
      </div>
    </div>
  );
};
