import type { CapacitorConfig } from "@capacitor/cli";

// Wraps the Next.js static export (out/) in a native Android shell.
const config: CapacitorConfig = {
  appId: "com.aurapharmlab.pharmacards",
  appName: "Pharmacards",
  webDir: "out",
  server: {
    androidScheme: "https",
  },
};

export default config;
