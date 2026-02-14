import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import { fileURLToPath } from "url";

// Manually define __dirname for ES modules if needed
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default defineConfig({
  plugins: [
    react(),
    // Add production-ready plugins here (e.g., visualizer, compression)
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      "@lib": path.resolve(__dirname, "./src/lib"),
      "@components": path.resolve(__dirname, "./src/components"),
      "@hooks": path.resolve(__dirname, "./src/hooks"),
      "@pages": path.resolve(__dirname, "./src/pages"),
    },
  },
  server: {
    port: 3000,
    strictPort: true,
    host: true, // Helpful for Docker/mobile testing
  },
  build: {
    outDir: "dist",
    sourcemap: false, // Set to true only if you need to debug production builds
    rollupOptions: {
      output: {
        // Manual chunking helps with caching and performance
        manualChunks: {
          vendor: ["react", "react-dom"],
        },
      },
    },
  },
});
