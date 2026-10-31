import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  build: {
    sourcemap: false,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes("/node_modules/three/build/three.core.js")) return "three-core";
          if (id.includes("/node_modules/three/")) return "three-renderer";
          if (id.includes("/node_modules/@react-three/")) return "react-three";
          if (
            id.includes("/node_modules/framer-motion/") ||
            id.includes("/node_modules/motion-")
          )
            return "motion";
        },
      },
    },
  },
});
