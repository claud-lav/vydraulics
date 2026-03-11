import { defineConfig } from "vite";
import path from "path";

export default defineConfig(({ command }) => ({
  base: command === "serve" ? "" : "/dist/",
  build: {
    emptyOutDir: true,
    manifest: true,
    outDir: "./web/dist",
    rollupOptions: {
      input: {
        app: "./src/scripts/main.js",
        css: "./src/styles/main.css",
      },
      output: {
        sourcemap: true,
      },
    },
  },
  publicDir: false,
  server: {
    origin: "http://localhost:5173",
    cors: true,
    hmr: {
      host: "localhost",
      protocol: "ws",
    },
    proxy: {
      "/assets/fonts": {
        target: "https://vydraulics.ddev.site",
        changeOrigin: true,
        secure: false,
      },
    },
  },
}));
