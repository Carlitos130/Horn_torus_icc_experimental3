"use client";

import React, { useMemo } from "react";
import Image from "next/image";
import {
  ShieldCheck,
  BookOpen,
  Award,
  AlertCircle,
  FileQuestion,
  Quote,
  CheckCircle2,
  ExternalLink,
} from "lucide-react";

export type ReaderTheme = "dark" | "sepia" | "light";
export type TextSize = "sm" | "base" | "lg";

interface MarkdownViewerProps {
  content: string;
  theme: ReaderTheme;
  textSize: TextSize;
  searchQuery?: string;
}

interface TableData {
  headers: string[];
  rows: string[][];
}

type Block =
  | { type: "h1"; text: string }
  | { type: "h2"; text: string }
  | { type: "h3"; text: string }
  | { type: "h4"; text: string }
  | { type: "hr" }
  | { type: "code"; language: string; code: string }
  | { type: "blockquote"; text: string; statute?: string }
  | { type: "table"; data: TableData }
  | { type: "image"; alt: string; src: string }
  | { type: "list"; items: string[] }
  | { type: "paragraph"; text: string };

function parseMarkdownBlocks(rawMarkdown: string): Block[] {
  const lines = rawMarkdown.replace(/\r\n/g, "\n").split("\n");
  const blocks: Block[] = [];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];
    const trimmed = line.trim();

    if (!trimmed) {
      i++;
      continue;
    }

    // Horizontal Rule
    if (/^(---|___|\*\*\*)$/.test(trimmed)) {
      blocks.push({ type: "hr" });
      i++;
      continue;
    }

    // Fenced Code Block
    if (trimmed.startsWith("```")) {
      const language = trimmed.slice(3).trim();
      const codeLines: string[] = [];
      i++;
      while (i < lines.length && !lines[i].trim().startsWith("```")) {
        codeLines.push(lines[i]);
        i++;
      }
      i++; // skip closing ```
      blocks.push({
        type: "code",
        language,
        code: codeLines.join("\n"),
      });
      continue;
    }

    // Table
    if (trimmed.startsWith("|") && trimmed.endsWith("|")) {
      const tableLines: string[] = [];
      while (i < lines.length && lines[i].trim().startsWith("|") && lines[i].trim().endsWith("|")) {
        tableLines.push(lines[i].trim());
        i++;
      }

      if (tableLines.length >= 2) {
        const parseRow = (rowStr: string) =>
          rowStr
            .slice(1, -1)
            .split("|")
            .map((c) => c.trim());

        const headers = parseRow(tableLines[0]);
        // line 1 is separator |---|---|
        const rows: string[][] = [];
        for (let r = 2; r < tableLines.length; r++) {
          rows.push(parseRow(tableLines[r]));
        }

        blocks.push({
          type: "table",
          data: { headers, rows },
        });
        continue;
      }
    }

    // Image: ![alt](src)
    const imgMatch = trimmed.match(/^!\[(.*?)\]\((.*?)\)$/);
    if (imgMatch) {
      let src = imgMatch[2].trim();
      // Normalize relative paths: ../figures/fig1.png -> /figures/fig1.png
      if (src.includes("figures/")) {
        const parts = src.split("figures/");
        src = "/figures/" + parts[parts.length - 1];
      }
      blocks.push({
        type: "image",
        alt: imgMatch[1] || "Diagrama de la Tesis",
        src,
      });
      i++;
      continue;
    }

    // Headings
    if (trimmed.startsWith("# ")) {
      blocks.push({ type: "h1", text: trimmed.slice(2).trim() });
      i++;
      continue;
    }
    if (trimmed.startsWith("## ")) {
      blocks.push({ type: "h2", text: trimmed.slice(3).trim() });
      i++;
      continue;
    }
    if (trimmed.startsWith("### ")) {
      blocks.push({ type: "h3", text: trimmed.slice(4).trim() });
      i++;
      continue;
    }
    if (trimmed.startsWith("#### ")) {
      blocks.push({ type: "h4", text: trimmed.slice(5).trim() });
      i++;
      continue;
    }

    // Blockquote (can be multi-line)
    if (trimmed.startsWith(">")) {
      const quoteLines: string[] = [];
      while (i < lines.length && lines[i].trim().startsWith(">")) {
        quoteLines.push(lines[i].trim().replace(/^>\s?/, ""));
        i++;
      }
      const fullQuote = quoteLines.join("\n");

      // Check if this quote represents an epistemological statute
      let statute: string | undefined = undefined;
      const lowerQuote = fullQuote.toLowerCase();
      if (lowerQuote.includes("hecho matemático")) statute = "HECHO MATEMÁTICO";
      else if (lowerQuote.includes("axioma")) statute = "AXIOMA";
      else if (lowerQuote.includes("cita")) statute = "CITA";
      else if (lowerQuote.includes("lectura")) statute = "LECTURA";
      else if (lowerQuote.includes("pendiente")) statute = "PENDIENTE";

      blocks.push({
        type: "blockquote",
        text: fullQuote,
        statute,
      });
      continue;
    }

    // Unordered List
    if (/^[-*+]\s/.test(trimmed)) {
      const items: string[] = [];
      while (i < lines.length && /^[-*+]\s/.test(lines[i].trim())) {
        items.push(lines[i].trim().replace(/^[-*+]\s+/, ""));
        i++;
      }
      blocks.push({ type: "list", items });
      continue;
    }

    // Paragraph (accumulate until blank line or special block)
    const paraLines: string[] = [];
    while (
      i < lines.length &&
      lines[i].trim() !== "" &&
      !lines[i].trim().startsWith("#") &&
      !lines[i].trim().startsWith(">") &&
      !lines[i].trim().startsWith("```") &&
      !/^(---|___|\*\*\*)$/.test(lines[i].trim()) &&
      !/^[-*+]\s/.test(lines[i].trim()) &&
      !(lines[i].trim().startsWith("|") && lines[i].trim().endsWith("|"))
    ) {
      paraLines.push(lines[i].trim());
      i++;
    }

    if (paraLines.length > 0) {
      blocks.push({
        type: "paragraph",
        text: paraLines.join(" "),
      });
    }
  }

  return blocks;
}

// Render formatted text with search highlighting, inline code, bold, italics, links
function renderFormattedInlineText(text: string, theme: ReaderTheme, searchQuery?: string) {
  // Regex to split by inline code `...`, bold **...**, italics *...*, links [...](...)
  const parts: React.ReactNode[] = [];
  const regex = /(`[^`]+`|\*\*[^*]+\*\*|\*[^*]+\*|\[[^\]]+\]\([^)]+\))/g;
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  const pushTextWithHighlight = (plainText: string, keyPrefix: string) => {
    if (!searchQuery || searchQuery.trim().length === 0) {
      parts.push(plainText);
      return;
    }
    const q = searchQuery.toLowerCase();
    const subParts = plainText.split(new RegExp(`(${searchQuery.replace(/[-/\\^$*+?.()|[\]{}]/g, "\\$&")})`, "gi"));
    subParts.forEach((part, idx) => {
      if (part.toLowerCase() === q) {
        parts.push(
          <mark
            key={`${keyPrefix}-hl-${idx}`}
            className={
              theme === "dark"
                ? "bg-amber-400 text-slate-950 font-semibold px-0.5 rounded"
                : "bg-amber-300 text-slate-900 font-semibold px-0.5 rounded"
            }
          >
            {part}
          </mark>
        );
      } else {
        parts.push(part);
      }
    });
  };

  let tokenIndex = 0;
  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      pushTextWithHighlight(text.slice(lastIndex, match.index), `t-${tokenIndex++}`);
    }
    const token = match[0];

    if (token.startsWith("`") && token.endsWith("`")) {
      const codeContent = token.slice(1, -1);
      parts.push(
        <code
          key={`code-${tokenIndex++}`}
          className={`px-1.5 py-0.5 rounded font-mono text-[0.9em] font-medium ${
            theme === "dark"
              ? "bg-slate-800 text-indigo-300 border border-slate-700/60"
              : theme === "sepia"
              ? "bg-[#ede5d6] text-[#703b14] border border-[#d8cbb8]"
              : "bg-slate-100 text-indigo-800 border border-slate-200"
          }`}
        >
          {codeContent}
        </code>
      );
    } else if (token.startsWith("**") && token.endsWith("**")) {
      const boldContent = token.slice(2, -2);
      // Check if this bold content is a statute
      const upper = boldContent.toUpperCase();
      let badgeColor = "";
      if (upper.includes("HECHO MATEMÁTICO")) {
        badgeColor = theme === "dark" ? "bg-blue-900/60 text-blue-200 border-blue-700" : "bg-blue-100 text-blue-900 border-blue-300";
      } else if (upper.includes("AXIOMA")) {
        badgeColor = theme === "dark" ? "bg-purple-900/60 text-purple-200 border-purple-700" : "bg-purple-100 text-purple-900 border-purple-300";
      } else if (upper.includes("CITA")) {
        badgeColor = theme === "dark" ? "bg-emerald-900/60 text-emerald-200 border-emerald-700" : "bg-emerald-100 text-emerald-900 border-emerald-300";
      } else if (upper.includes("LECTURA")) {
        badgeColor = theme === "dark" ? "bg-amber-900/60 text-amber-200 border-amber-700" : "bg-amber-100 text-amber-900 border-amber-300";
      } else if (upper.includes("PENDIENTE")) {
        badgeColor = theme === "dark" ? "bg-rose-900/60 text-rose-200 border-rose-700" : "bg-rose-100 text-rose-900 border-rose-300";
      }

      if (badgeColor) {
        parts.push(
          <span
            key={`statute-${tokenIndex++}`}
            className={`inline-block px-1.5 py-0.5 rounded text-[0.85em] font-bold uppercase tracking-wider border mx-1 align-baseline ${badgeColor}`}
          >
            {boldContent}
          </span>
        );
      } else {
        parts.push(
          <strong
            key={`b-${tokenIndex++}`}
            className={`font-bold ${
              theme === "dark" ? "text-slate-100" : theme === "sepia" ? "text-[#1a140e]" : "text-slate-950"
            }`}
          >
            {boldContent}
          </strong>
        );
      }
    } else if (token.startsWith("*") && token.endsWith("*")) {
      const italicContent = token.slice(1, -1);
      parts.push(
        <em
          key={`i-${tokenIndex++}`}
          className={`italic ${
            theme === "dark" ? "text-slate-300" : theme === "sepia" ? "text-[#473b2c]" : "text-slate-700"
          }`}
        >
          {italicContent}
        </em>
      );
    } else if (token.startsWith("[") && token.includes("](") && token.endsWith(")")) {
      const linkMatch = token.match(/^\[(.*?)\]\((.*?)\)$/);
      if (linkMatch) {
        parts.push(
          <a
            key={`a-${tokenIndex++}`}
            href={linkMatch[2]}
            target="_blank"
            rel="noopener noreferrer"
            className="text-indigo-400 hover:text-indigo-300 underline font-medium inline-flex items-center gap-0.5"
          >
            {linkMatch[1]}
            <ExternalLink className="w-2.5 h-2.5 inline" />
          </a>
        );
      }
    }
    lastIndex = regex.lastIndex;
  }

  if (lastIndex < text.length) {
    pushTextWithHighlight(text.slice(lastIndex), `t-${tokenIndex++}`);
  }

  return parts;
}

export const MarkdownDocumentViewer: React.FC<MarkdownViewerProps> = ({
  content,
  theme,
  textSize,
  searchQuery,
}) => {
  const blocks = useMemo(() => parseMarkdownBlocks(content), [content]);

  // Color theme classes mapping
  const themeStyles = useMemo(() => {
    switch (theme) {
      case "dark":
        return {
          container: "bg-slate-950 text-slate-200 border-slate-800",
          h1: "text-slate-100 border-slate-800",
          h2: "text-indigo-300 border-slate-800/70",
          h3: "text-slate-200",
          h4: "text-slate-300",
          p: "text-slate-300",
          list: "text-slate-300",
          bullet: "text-indigo-400",
          hr: "border-slate-800",
          codeBlock: "bg-slate-900 border-slate-800 text-cyan-300",
          quoteDefault: "bg-slate-900/60 border-slate-700 text-slate-300",
          tableContainer: "border-slate-800",
          tableHeader: "bg-slate-900 text-slate-200 border-slate-800",
          tableRow: "border-slate-800 hover:bg-slate-900/40 text-slate-300",
        };
      case "sepia":
        return {
          container: "bg-[#fbf7ee] text-[#2b241b] border-[#e7dcce]",
          h1: "text-[#1a140e] border-[#d8cbb8]",
          h2: "text-[#6b3a1a] border-[#d8cbb8]",
          h3: "text-[#1a140e]",
          h4: "text-[#473b2c]",
          p: "text-[#2b241b]",
          list: "text-[#2b241b]",
          bullet: "text-[#8a4b22]",
          hr: "border-[#e7dcce]",
          codeBlock: "bg-[#252019] border-[#383127] text-[#86e1fc]",
          quoteDefault: "bg-[#f2ebdc] border-[#cbb99f] text-[#2b241b]",
          tableContainer: "border-[#d8cbb8]",
          tableHeader: "bg-[#ede4d4] text-[#1a140e] border-[#d8cbb8]",
          tableRow: "border-[#e7dcce] hover:bg-[#f2ebdc] text-[#2b241b]",
        };
      case "light":
      default:
        return {
          container: "bg-white text-slate-800 border-slate-200",
          h1: "text-slate-950 border-slate-200",
          h2: "text-indigo-900 border-slate-200",
          h3: "text-slate-900",
          h4: "text-slate-800",
          p: "text-slate-700",
          list: "text-slate-700",
          bullet: "text-indigo-600",
          hr: "border-slate-200",
          codeBlock: "bg-slate-900 border-slate-800 text-cyan-300",
          quoteDefault: "bg-slate-50 border-slate-300 text-slate-800",
          tableContainer: "border-slate-200",
          tableHeader: "bg-slate-100 text-slate-900 border-slate-200",
          tableRow: "border-slate-200 hover:bg-slate-50 text-slate-800",
        };
    }
  }, [theme]);

  // Typography font size mapping
  const textSizeClass = useMemo(() => {
    switch (textSize) {
      case "sm":
        return "text-xs leading-relaxed";
      case "lg":
        return "text-sm leading-relaxed";
      case "base":
      default:
        return "text-[13px] leading-relaxed";
    }
  }, [textSize]);

  return (
    <div
      className={`rounded-xl border p-6 min-h-[500px] overflow-y-auto font-sans transition-colors duration-200 ${themeStyles.container}`}
    >
      <div className={`space-y-4 max-w-4xl mx-auto ${textSizeClass}`}>
        {blocks.map((block, idx) => {
          switch (block.type) {
            case "h1":
              return (
                <div key={idx} className={`pt-2 pb-3 border-b ${themeStyles.h1}`}>
                  <h1 className="text-xl md:text-2xl font-bold tracking-tight">
                    {renderFormattedInlineText(block.text, theme, searchQuery)}
                  </h1>
                </div>
              );

            case "h2":
              return (
                <div key={idx} className={`pt-4 pb-2 border-b ${themeStyles.h2}`}>
                  <h2 className="text-base md:text-lg font-bold flex items-center gap-2">
                    <BookOpen className="w-4 h-4 shrink-0 opacity-80" />
                    <span>{renderFormattedInlineText(block.text, theme, searchQuery)}</span>
                  </h2>
                </div>
              );

            case "h3":
              return (
                <h3 key={idx} className={`text-sm md:text-base font-bold pt-3 ${themeStyles.h3}`}>
                  {renderFormattedInlineText(block.text, theme, searchQuery)}
                </h3>
              );

            case "h4":
              return (
                <h4 key={idx} className={`text-xs md:text-sm font-semibold uppercase tracking-wider pt-2 ${themeStyles.h4}`}>
                  {renderFormattedInlineText(block.text, theme, searchQuery)}
                </h4>
              );

            case "hr":
              return <hr key={idx} className={`my-6 ${themeStyles.hr}`} />;

            case "paragraph":
              return (
                <p key={idx} className={`${themeStyles.p} leading-relaxed`}>
                  {renderFormattedInlineText(block.text, theme, searchQuery)}
                </p>
              );

            case "list":
              return (
                <ul key={idx} className="space-y-1.5 my-2 pl-4">
                  {block.items.map((item, itemIdx) => (
                    <li key={itemIdx} className={`flex items-start gap-2 ${themeStyles.list}`}>
                      <span className={`font-bold mt-1 text-xs shrink-0 ${themeStyles.bullet}`}>•</span>
                      <span className="flex-1">{renderFormattedInlineText(item, theme, searchQuery)}</span>
                    </li>
                  ))}
                </ul>
              );

            case "blockquote": {
              let calloutColor = themeStyles.quoteDefault;
              let Icon = Quote;
              let badgeTitle = "";

              if (block.statute === "HECHO MATEMÁTICO") {
                Icon = ShieldCheck;
                badgeTitle = "HECHO MATEMÁTICO (TEOREMA)";
                calloutColor =
                  theme === "dark"
                    ? "bg-blue-950/40 border-l-4 border-blue-500 text-blue-100"
                    : theme === "sepia"
                    ? "bg-blue-50/90 border-l-4 border-blue-600 text-blue-950"
                    : "bg-blue-50 border-l-4 border-blue-600 text-blue-950";
              } else if (block.statute === "AXIOMA") {
                Icon = Award;
                badgeTitle = "AXIOMA FORMAL DEL MODELO";
                calloutColor =
                  theme === "dark"
                    ? "bg-purple-950/40 border-l-4 border-purple-500 text-purple-100"
                    : theme === "sepia"
                    ? "bg-purple-50/90 border-l-4 border-purple-600 text-purple-950"
                    : "bg-purple-50 border-l-4 border-purple-600 text-purple-950";
              } else if (block.statute === "CITA") {
                Icon = Quote;
                badgeTitle = "CITA TEXTUAL (FREUD / LACAN)";
                calloutColor =
                  theme === "dark"
                    ? "bg-emerald-950/40 border-l-4 border-emerald-500 text-emerald-100"
                    : theme === "sepia"
                    ? "bg-emerald-50/90 border-l-4 border-emerald-600 text-emerald-950"
                    : "bg-emerald-50 border-l-4 border-emerald-600 text-emerald-950";
              } else if (block.statute === "LECTURA") {
                Icon = BookOpen;
                badgeTitle = "LECTURA CLÍNICA / TOPOLÓGICA";
                calloutColor =
                  theme === "dark"
                    ? "bg-amber-950/40 border-l-4 border-amber-500 text-amber-100"
                    : theme === "sepia"
                    ? "bg-amber-50/90 border-l-4 border-amber-600 text-amber-950"
                    : "bg-amber-50 border-l-4 border-amber-600 text-amber-950";
              } else if (block.statute === "PENDIENTE") {
                Icon = AlertCircle;
                badgeTitle = "DECISIÓN TEÓRICA PENDIENTE";
                calloutColor =
                  theme === "dark"
                    ? "bg-rose-950/40 border-l-4 border-rose-500 text-rose-100"
                    : theme === "sepia"
                    ? "bg-rose-50/90 border-l-4 border-rose-600 text-rose-950"
                    : "bg-rose-50 border-l-4 border-rose-600 text-rose-950";
              }

              return (
                <div key={idx} className={`p-4 rounded-r-lg my-3 shadow-sm ${calloutColor}`}>
                  {badgeTitle && (
                    <div className="flex items-center gap-1.5 mb-2 font-mono text-[11px] font-bold tracking-wider uppercase opacity-90">
                      <Icon className="w-3.5 h-3.5" />
                      <span>{badgeTitle}</span>
                    </div>
                  )}
                  <div className="whitespace-pre-wrap leading-relaxed">
                    {renderFormattedInlineText(block.text, theme, searchQuery)}
                  </div>
                </div>
              );
            }

            case "code":
              return (
                <div key={idx} className={`rounded-lg border p-3.5 my-3 overflow-x-auto ${themeStyles.codeBlock}`}>
                  {block.language && (
                    <div className="text-[10px] font-mono uppercase tracking-wider text-slate-400 mb-1 border-b border-slate-800 pb-1">
                      {block.language}
                    </div>
                  )}
                  <pre className="font-mono text-xs leading-relaxed">
                    <code>{block.code}</code>
                  </pre>
                </div>
              );

            case "table":
              return (
                <div key={idx} className={`overflow-x-auto my-4 rounded-lg border ${themeStyles.tableContainer}`}>
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className={`border-b ${themeStyles.tableHeader}`}>
                        {block.data.headers.map((h, hIdx) => (
                          <th key={hIdx} className="p-2.5 font-bold uppercase tracking-wider text-[11px]">
                            {renderFormattedInlineText(h, theme, searchQuery)}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {block.data.rows.map((row, rIdx) => (
                        <tr key={rIdx} className={`border-b transition-colors ${themeStyles.tableRow}`}>
                          {row.map((cell, cIdx) => (
                            <td key={cIdx} className="p-2.5 align-top">
                              {renderFormattedInlineText(cell, theme, searchQuery)}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              );

            case "image":
              return (
                <div key={idx} className="my-5 flex flex-col items-center">
                  <div className="relative w-full max-w-2xl aspect-[16/10] bg-slate-950 rounded-xl overflow-hidden border border-slate-800 shadow-md">
                    <Image
                      src={block.src}
                      alt={block.alt}
                      fill
                      sizes="(max-width: 768px) 100vw, 700px"
                      className="object-contain"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  {block.alt && (
                    <div className="mt-2 text-xs text-center text-slate-400 font-mono italic">
                      {block.alt}
                    </div>
                  )}
                </div>
              );

            default:
              return null;
          }
        })}
      </div>
    </div>
  );
};
