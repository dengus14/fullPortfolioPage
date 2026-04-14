import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  // served as a subpath of 3d-site in production (same-origin) — required so
  // Vite prefixes built asset URLs correctly
  base: process.env.INNER_BASE ?? "/",
  server: {
    port: 5174,
    host: true,
    strictPort: true,
  },
});
