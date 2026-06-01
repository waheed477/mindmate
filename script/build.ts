import { build } from "esbuild";
import { execSync } from "child_process";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, "..");

console.log("Building frontend...");
execSync("npm run build", {
  cwd: path.join(rootDir, "frontend", "client"),
  stdio: "inherit",
});

console.log("Building backend...");
await build({
  entryPoints: [path.join(rootDir, "backend", "server", "index.ts")],
  bundle: true,
  platform: "node",
  target: "node20",
  format: "cjs",
  outfile: path.join(rootDir, "dist", "index.cjs"),
  external: [
    "mongoose",
    "mongodb",
    "bcrypt",
    "express",
    "jsonwebtoken",
    "nodemailer",
    "socket.io",
    "passport",
    "passport-local",
    "express-session",
    "memorystore",
  ],
  banner: {
    js: `
const require = (await import("module")).createRequire(import.meta.url);
const __filename = (await import("url")).fileURLToPath(import.meta.url);
const __dirname = (await import("path")).dirname(__filename);
    `.trim(),
  },
  loader: {
    ".ts": "ts",
  },
});

console.log("Build complete!");
