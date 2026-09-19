import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const docName = searchParams.get("doc");

  const allowedDocs: Record<string, string> = {
    capitulo: "capitulo_horn_torus_icc.md",
    seccion16: "seccion16_familia_limite.md",
    trauma: "formalizacion_trauma_fantasma.md",
    leyenda: "leyenda_diagramas.md",
  };

  if (!docName || !allowedDocs[docName]) {
    return NextResponse.json({ error: "Documento no válido" }, { status: 400 });
  }

  try {
    const filePath = path.join(process.cwd(), "public", "docs", allowedDocs[docName]);
    if (!fs.existsSync(filePath)) {
      return NextResponse.json({ error: "Documento no encontrado" }, { status: 404 });
    }
    const content = fs.readFileSync(filePath, "utf-8");
    return NextResponse.json({
      title: allowedDocs[docName],
      content,
    });
  } catch {
    return NextResponse.json({ error: "Error al leer documento" }, { status: 500 });
  }
}
