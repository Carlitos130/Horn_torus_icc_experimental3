import React from "react";
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[50vh] text-center p-6 text-slate-100">
      <h2 className="text-2xl font-bold mb-2">404 - Página no encontrada</h2>
      <p className="text-slate-400 mb-4">El recurso solicitado no existe en el modelo del Horn Torus.</p>
      <Link
        href="/"
        className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 rounded-lg text-sm font-medium text-white transition-colors"
      >
        Volver al inicio
      </Link>
    </div>
  );
}
