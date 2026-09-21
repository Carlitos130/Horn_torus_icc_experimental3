import fs from "node:fs";
import path from "node:path";

function copyFolderSync(from, to) {
  if (!fs.existsSync(from)) return;
  fs.mkdirSync(to, { recursive: true });
  fs.readdirSync(from).forEach((element) => {
    const stat = fs.lstatSync(path.join(from, element));
    if (stat.isFile()) {
      fs.copyFileSync(path.join(from, element), path.join(to, element));
    } else if (stat.isDirectory()) {
      copyFolderSync(path.join(from, element), path.join(to, element));
    }
  });
}

console.log("[postbuild] Packaging artifacts for deployment...");

// 1. Prepare Next.js standalone bundle if present
const standaloneDir = path.resolve(".next/standalone");
if (fs.existsSync(standaloneDir)) {
  const staticSrc = path.resolve(".next/static");
  const staticDest = path.resolve(".next/standalone/.next/static");
  if (fs.existsSync(staticSrc)) {
    copyFolderSync(staticSrc, staticDest);
    console.log("[postbuild] Copied .next/static to standalone bundle");
  }

  const publicSrc = path.resolve("public");
  const publicDest = path.resolve(".next/standalone/public");
  if (fs.existsSync(publicSrc)) {
    copyFolderSync(publicSrc, publicDest);
    console.log("[postbuild] Copied public/ to standalone bundle");
  }
}

// 2. Prepare dist/ directory with build artifacts
const distDir = path.resolve("dist");
fs.mkdirSync(distDir, { recursive: true });

if (fs.existsSync(".next")) {
  copyFolderSync(path.resolve(".next"), distDir);
  console.log("[postbuild] Copied .next artifacts to dist/");
}

if (fs.existsSync("public")) {
  copyFolderSync(path.resolve("public"), path.resolve(distDir, "public"));
}

// Ensure an index.html exists in dist if available
const appHtml = path.resolve(".next/server/app/index.html");
if (fs.existsSync(appHtml)) {
  fs.copyFileSync(appHtml, path.resolve(distDir, "index.html"));
}

const distFiles = fs.readdirSync(distDir);
console.log(`[postbuild] Build completed successfully. dist/ contains ${distFiles.length} root items:`, distFiles.join(", "));
