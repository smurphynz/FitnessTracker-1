// vite.config.ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],

  /** -----------------------------------------------------------------
   *  Dev-server settings for Replit
   *  ---------------------------------------------------------------- */
  server: {
    host: true,          // 0.0.0.0 — accessible from outside the container
    port: 5173,          // preferred port
    strictPort: false,   // if 5173 is busy, Vite will try 5174, 5175…
    allowedHosts: "all"  // accept any *.repl.co or janeway.replit.dev host
  }
});
