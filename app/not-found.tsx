import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col items-center justify-center p-4">
      <div className="max-w-md text-center flex flex-col items-center gap-4">
        <h1 className="text-4xl font-bold text-indigo-400">404</h1>
        <h2 className="text-xl font-semibold">Página no encontrada</h2>
        <p className="text-sm text-slate-400">
          La página que buscas no existe o ha sido movida.
        </p>
        <Link
          href="/"
          className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-lg transition-colors"
        >
          Volver al modelo 3D
        </Link>
      </div>
    </div>
  );
}
