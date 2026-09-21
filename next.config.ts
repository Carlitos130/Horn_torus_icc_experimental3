import type { NextConfig } from "next";
import { PHASE_DEVELOPMENT_SERVER } from "next/constants";

export default function nextConfig(phase: string): NextConfig {
  const isDevServer = phase === PHASE_DEVELOPMENT_SERVER;

  return {
    // Isolate development cache (.next-dev) only when running the development server ('next dev'),
    // so production builds ('next build') generate standard production artifacts in .next
    distDir: isDevServer ? ".next-dev" : ".next",
    output: isDevServer ? undefined : "standalone",
    reactStrictMode: true,
  };
}
