"use client";

import React, { useEffect } from "react";

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[50vh] text-center p-6 text-slate-100">
      <h2 className="text-2xl font-bold mb-2">Error inesperado</h2>
      <p className="text-slate-400 mb-4">{error.message || "Ha ocurrido un error en la aplicación."}</p>
      <button
        onClick={() => reset()}
        className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 rounded-lg text-sm font-medium text-white transition-colors"
      >
        Reintentar
      </button>
    </div>
  );
}
