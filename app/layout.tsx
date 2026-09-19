import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Horn Torus Icc Experimental",
  description:
    "Modelo topológico interactivo del inconsciente freudiano: el horn torus como límite de la familia de toros r → R (Tesis RSI-Poincaré)",
  openGraph: {
    title: "Horn Torus Icc Experimental",
    description:
      "Modelo topológico interactivo del inconsciente freudiano: el horn torus como límite de la familia de toros r → R (Tesis RSI-Poincaré)",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className="h-full">
      <body className="h-full antialiased bg-slate-900 text-slate-100 flex flex-col">
        {children}
      </body>
    </html>
  );
}
