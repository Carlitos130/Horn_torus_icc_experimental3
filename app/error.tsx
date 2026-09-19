"use client";

import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Application error:", error);
  }, [error]);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col items-center justify-center p-4">
      <div className="max-w-md text-center flex flex-col items-center gap-4">
        <h2 className="text-xl font-semibold text-rose-400">Error inesperado</h2>
        <p className="text-sm text-slate-400">
          Ocurrió un problema al cargar el modelo topológico.
        </p>
        <button
          onClick={() => reset()}
          className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-lg transition-colors"
        >
          Reintentar
        </button>
      </div>
    </div>
  );
}
