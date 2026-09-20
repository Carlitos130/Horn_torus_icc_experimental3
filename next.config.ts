import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Use standalone output for containerized/Docker/Cloud Run environments; disable on Vercel where it is not needed
  output: process.env.VERCEL ? undefined : "standalone",
  reactStrictMode: true,
  // Note: distDir is intentionally not specified to use the standard '.next' directory expected by Vercel and Next.js tooling
};

export default nextConfig;

