import Link from "next/link";
import { ArrowLeft, BookOpen, Calendar, User, Tag, ArrowRight } from "lucide-react";
import type { Post } from "./[id]/page";

export const revalidate = 60;

export default async function BlogIndexPage() {
  let posts: Post[] = [];
  try {
    const res = await fetch("https://api.vercel.app/blog", {
      next: { revalidate: 60 },
    });
    if (res.ok) {
      posts = await res.json();
    }
  } catch (error) {
    console.error("Error fetching blog posts:", error);
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      {/* Header */}
      <header className="border-b border-slate-800 bg-slate-900/80 backdrop-blur-sm sticky top-0 z-20">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-slate-200 transition-colors bg-slate-800/80 px-2.5 py-1.5 rounded-lg border border-slate-700"
              id="link-home-from-blog"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Volver al Modelo 3D</span>
            </Link>
            <h1 className="text-sm font-semibold text-slate-200 flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-indigo-400" />
              Blog & Publicaciones
            </h1>
          </div>

          <span className="text-[11px] font-mono text-emerald-400 bg-emerald-950/60 border border-emerald-800/60 px-2.5 py-1 rounded-full">
            Next.js ISR (60s)
          </span>
        </div>
      </header>

      {/* Hero */}
      <main className="flex-1 max-w-5xl w-full mx-auto p-4 sm:p-6 lg:p-8 flex flex-col gap-6">
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8">
          <h2 className="text-2xl font-bold text-slate-100 tracking-tight mb-2">
            Publicaciones y Artículos
          </h2>
          <p className="text-sm text-slate-400 max-w-2xl leading-relaxed">
            Ruta dinámica implementada con <code className="text-indigo-300 font-mono text-xs">generateStaticParams()</code> y revalidación incremental estática (ISR cada 60 segundos).
          </p>
        </div>

        {/* Posts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4" id="blog-posts-grid">
          {posts.map((post) => (
            <Link
              key={post.id}
              href={`/blog/${post.id}`}
              className="group bg-slate-900 border border-slate-800 hover:border-indigo-600/70 rounded-xl p-5 transition-all duration-200 hover:shadow-md hover:shadow-indigo-950/20 flex flex-col justify-between gap-4"
              id={`post-card-${post.id}`}
            >
              <div className="flex flex-col gap-2.5">
                <div className="flex items-center justify-between text-xs text-slate-400">
                  {post.category ? (
                    <span className="inline-flex items-center gap-1 text-[11px] font-medium text-indigo-300 bg-indigo-950/60 border border-indigo-800/50 px-2 py-0.5 rounded-full">
                      <Tag className="w-2.5 h-2.5" />
                      {post.category}
                    </span>
                  ) : (
                    <span className="text-[11px] text-slate-500">Artículo #{post.id}</span>
                  )}
                  {post.date && (
                    <span className="text-[11px] text-slate-500 flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {post.date}
                    </span>
                  )}
                </div>

                <h3 className="text-base font-semibold text-slate-100 group-hover:text-indigo-300 transition-colors line-clamp-2">
                  {post.title}
                </h3>

                <p className="text-xs text-slate-400 line-clamp-3 leading-relaxed">
                  {post.content}
                </p>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-slate-800/80 text-xs">
                {post.author ? (
                  <span className="text-slate-400 flex items-center gap-1.5">
                    <User className="w-3 h-3 text-slate-500" />
                    {post.author}
                  </span>
                ) : (
                  <span />
                )}
                <span className="text-indigo-400 group-hover:translate-x-0.5 transition-transform flex items-center gap-1 font-medium">
                  Leer artículo
                  <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
}
