import type { NextConfig } from "next";
import pkg from "./package.json";

// Static export: the whole app runs in the browser (progress in IndexedDB),
// so it can be hosted anywhere and wrapped with Capacitor later.
const nextConfig: NextConfig = {
  output: "export",
  images: { unoptimized: true },
  // Versions the service-worker cache per release (see public/sw.js).
  env: { NEXT_PUBLIC_APP_VERSION: pkg.version },
  // Let a phone on the same Wi-Fi (or Tailscale) load the dev server for testing.
  allowedDevOrigins: ["192.168.1.4", "100.85.46.42"],
};

export default nextConfig;
