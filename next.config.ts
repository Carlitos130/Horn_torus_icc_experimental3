import type { NextConfig } from "next";

const isDev = process.env.NODE_ENV !== "production";

const nextConfig: NextConfig = {
  // Isolate development cache and builds (.next-dev) from production builds (.next)
  // to avoid runtime conflicts and missing chunk errors (e.g. ./331.js) during concurrent builds
  distDir: isDev ? ".next-dev" : ".next",
  output: isDev ? undefined : (process.env.VERCEL ? undefined : "standalone"),
  reactStrictMode: true,
};

export default nextConfig;

