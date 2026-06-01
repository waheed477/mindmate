import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default defineConfig({
  plugins: [
    react({ jsxRuntime: "automatic" }),
    tailwindcss(),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "frontend/client/src"),
      "@lib": path.resolve(__dirname, "frontend/client/src/lib"),
      "@components": path.resolve(__dirname, "frontend/client/src/components"),
      "@hooks": path.resolve(__dirname, "frontend/client/src/hooks"),
      "@pages": path.resolve(__dirname, "frontend/client/src/pages"),
      "@shared": path.resolve(__dirname, "backend/shared"),
      "@assets": path.resolve(__dirname, "attached_assets"),
    },
  },
  root: path.resolve(__dirname, "frontend/client"),
});
