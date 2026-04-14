import { defineConfig } from "vite";

export default defineConfig({
  server: {
    port: 5173,
    host: true,
    strictPort: true,
    proxy: {
      // same-origin proxy for inner-site — avoids Chromium OOPIF hit-testing
      // issues when the iframe lives inside a CSS3DRenderer preserve-3d chain
      "/inner": {
        target: "http://localhost:5174",
        changeOrigin: true,
        ws: true,
        rewrite: (path) => path.replace(/^\/inner/, ""),
      },
    },
  },
  assetsInclude: ["**/*.glb", "**/*.gltf"],
});
