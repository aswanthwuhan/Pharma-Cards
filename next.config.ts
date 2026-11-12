import type { NextConfig } from "next";
import pkg from "./package.json";

// Static export: the whole app runs in the browser (progress in IndexedDB),
// so it can be hosted anywhere and wrapped with Capacitor later.
// GitHub Pages serves the PWA from /<repo>/, so the release workflow sets PAGES_BASE_PATH.
// Desktop (Electron) and Android (Capacitor) builds leave it empty and load from the root.
const basePath = process.env.PAGES_BASE_PATH ?? "";

const nextConfig: NextConfig = {
  output: "export",
  basePath,
  images: { unoptimized: true },
  // Versions the service-worker cache per release (see public/sw.js).
  env: { NEXT_PUBLIC_APP_VERSION: pkg.version, NEXT_PUBLIC_BASE_PATH: basePath },
  // Let a phone on the same Wi-Fi (or Tailscale) load the dev server for testing.
  // The hosts come from DEV_ORIGINS in .env.local (comma separated).
  allowedDevOrigins: (process.env.DEV_ORIGINS ?? "").split(",").map((s) => s.trim()).filter(Boolean),
};

export default nextConfig;
