import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
process.env = {
  ...process.env,
  ...loadEnv(process.env.NODE_ENV, process.cwd()),
};
export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    exclude: ["lucide-react"],
  },
  server: {
    host: true,
    allowedHosts: ["4fe7-180-248-30-157.ngrok-free.app"],
    // allowOverwrite: true,
    port: Number(process.env?.VITE_DEVELOPMENT_PORT || 5173),
    hmr: process.env.NODE_ENV !== "production",
    proxy: {
      "/api": {
        // using env variable later
        target: "http://localhost:32771/ponpes-be/public",
        changeOrigin: true,
        secure: true,
        rewrite: (path) => path.replace(/^\/api/, ""),
      },
    },
    cors: false,
  },
});
