import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Calendar, User, Tag, Clock } from "lucide-react";

export interface Post {
  id: string | number;
  title: string;
  content: string;
  author?: string;
  date?: string;
  category?: string;
}

// Next.js will invalidate the cache when a
// request comes in, at most once every 60 seconds.
export const revalidate = 60;

export async function generateStaticParams() {
  try {
    const posts: Post[] = await fetch("https://api.vercel.app/blog").then((res) => {
      if (!res.ok) throw new Error("Error fetching posts");
      return res.json();
    });
    return posts.map((post) => ({
      id: String(post.id),
    }));
  } catch (error) {
    console.error("Error in generateStaticParams:", error);
    return [];
  }
}

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  let post: Post | null = null;
  try {
    const res = await fetch(`https://api.vercel.app/blog/${id}`, {
      next: { revalidate: 60 },
    });
    if (!res.ok) {
      notFound();
    }
    post = await res.json();
  } catch {
    notFound();
  }

  if (!post) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      {/* Header */}
      <header className="border-b border-slate-800 bg-slate-900/80 backdrop-blur-sm sticky top-0 z-20">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-xs font-medium text-slate-400 hover:text-indigo-400 transition-colors"
            id="link-back-to-blog"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Volver al Blog</span>
          </Link>

          <Link
            href="/"
            className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white transition-colors"
            id="link-to-home"
          >
            Ir al Modelo Topológico
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-4xl w-full mx-auto p-4 sm:p-6 lg:p-8">
        <article className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-10 shadow-lg flex flex-col gap-6" id="blog-post-article">
          {/* Metadata badges */}
          <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400 border-b border-slate-800/80 pb-4">
            {post.category && (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-indigo-950/80 border border-indigo-700/60 text-indigo-300 font-medium">
                <Tag className="w-3 h-3" />
                {post.category}
              </span>
            )}
            {post.author && (
              <span className="inline-flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-slate-500" />
                {post.author}
              </span>
            )}
            {post.date && (
              <span className="inline-flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-slate-500" />
                {post.date}
              </span>
            )}
            <span className="inline-flex items-center gap-1.5 ml-auto text-slate-500">
              <Clock className="w-3 h-3" />
              ISR 60s
            </span>
          </div>

          {/* Title */}
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-50 tracking-tight leading-snug">
            {post.title}
          </h1>

          {/* Post Content */}
          <div className="text-slate-300 leading-relaxed text-base whitespace-pre-line border-t border-slate-800/60 pt-6">
            <p>{post.content}</p>
          </div>

          {/* Footer note */}
          <div className="mt-8 pt-6 border-t border-slate-800 flex items-center justify-between text-xs text-slate-500">
            <span>ID del Artículo: {post.id}</span>
            <Link
              href="/blog"
              className="text-indigo-400 hover:text-indigo-300 font-medium inline-flex items-center gap-1"
            >
              ← Explorar más artículos
            </Link>
          </div>
        </article>
      </main>
    </div>
  );
}
