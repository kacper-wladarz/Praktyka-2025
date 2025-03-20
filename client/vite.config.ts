import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { TanStackRouterVite } from "@tanstack/router-plugin/vite";
import tsconfigPaths from "vite-tsconfig-paths";
import path from "path";

// https://vite.dev/config/
export default defineConfig({
    resolve: {
        alias: {
            "@": path.resolve(__dirname, "./src"),
            "@assets": path.resolve(__dirname, "./src/assets"),
            "@contexts": path.resolve(__dirname, "./src/contexts"),
            "@components": path.resolve(__dirname, "./src/components"),
            "@queries": path.resolve(__dirname, "./src/api/queries"),
            "@utils": path.resolve(__dirname, "./src/utils"),
        },
    },
    plugins: [
        TanStackRouterVite({ target: "react", autoCodeSplitting: true }),
        react(),
        tsconfigPaths(),
        tailwindcss(),
    ],
});
