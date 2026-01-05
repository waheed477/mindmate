import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [
    react({
      jsxRuntime: "automatic",
    }),
  ],
  resolve: {
    alias: {
      // Force single React version
      react: path.resolve(__dirname, "./node_modules/react"),
      "react-dom": path.resolve(__dirname, "./node_modules/react-dom"),
      "react-hook-form": path.resolve(__dirname, "./node_modules/react-hook-form"),
      "@hookform/resolvers": path.resolve(__dirname, "./node_modules/@hookform/resolvers"),
      "zod": path.resolve(__dirname, "./node_modules/zod"),
      
      // Your aliases
      "@": path.resolve(__dirname, "./src"),
      "@lib": path.resolve(__dirname, "./src/lib"),
      "@components": path.resolve(__dirname, "./src/components"),
      "@hooks": path.resolve(__dirname, "./src/hooks"),
      "@pages": path.resolve(__dirname, "./src/pages"),
      "@shared": path.resolve(__dirname, "../shared"),
      "@assets": path.resolve(__dirname, "../attached_assets"),
    },
  },
  build: {
    outDir: path.resolve(__dirname, "../dist/public"),
    emptyOutDir: true,
    rollupOptions: {
      external: ["react", "react-dom"],
    },
  },
  optimizeDeps: {
    include: [
      "react", 
      "react-dom", 
      "react-router-dom",
      "react-hook-form",
      "@hookform/resolvers",
      "zod"
    ],
    force: true,
  },
});
