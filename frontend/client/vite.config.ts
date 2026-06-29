import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "path";

const backendUrl = process.env.BACKEND_URL || "http://localhost:5000";
const devPort = Number(process.env.VITE_PORT) || 3000;

export default defineConfig({
  plugins: [
    react({ jsxRuntime: "automatic" }),
    tailwindcss(),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      "@lib": path.resolve(__dirname, "./src/lib"),
      "@components": path.resolve(__dirname, "./src/components"),
      "@hooks": path.resolve(__dirname, "./src/hooks"),
      "@pages": path.resolve(__dirname, "./src/pages"),
      "@shared": path.resolve(__dirname, "../../backend/shared"),
      "@assets": path.resolve(__dirname, "../../attached_assets"),
    },
  },
  server: {
    host: "0.0.0.0",
    port: devPort,
    strictPort: true,
    allowedHosts: true,
    hmr: false,
    proxy: {
      "/api": {
        target: backendUrl,
        changeOrigin: true,
      },
      "/socket.io": {
        target: backendUrl,
        changeOrigin: true,
        ws: true,
      },
    },
  },
  build: {
    outDir: path.resolve(__dirname, "../dist/public"),
    emptyOutDir: true,
  },
});
