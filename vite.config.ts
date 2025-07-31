import { defineConfig } from "vite";
import UnoCSS from "unocss/vite";
import React from "@vitejs/plugin-react";
import { crx as Crx } from "@crxjs/vite-plugin";
import manifest from "./manifest";
import { resolve } from "path";
import zip from "vite-plugin-zip-pack";
import packageJson from "./package.json";

function getKeyByVersion() {
  return `${packageJson.name}-${packageJson.version}`;
}

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    Crx({ manifest }),
    UnoCSS(),
    React(),
    // 打包压缩
    zip({
      outDir: "release",
      outFileName: `${getKeyByVersion()}.zip`,
      filter: (_fileName: string, filePath: string, _isDirectory: boolean) => {
        return !filePath.includes(".vite");
      },
    }),
  ],
  legacy: {
    skipWebSocketTokenCheck: true,
  },
  server: {
    host: true,
    port: 5173,
    strictPort: true,
    hmr: {
      port: 5173,
    },
    cors: {
      origin: [/chrome-extension:\/\//],
    },
  },
  resolve: {
    alias: {
      "@": resolve(__dirname, "./src"),
      "@opt": resolve(__dirname, "./src/options"),
      "@page": resolve(__dirname, "./src/options/pages"),
    },
  },
  build: {
    rollupOptions: {
      input: {
        popup: resolve(__dirname, "popup.html"),
        options: resolve(__dirname, "options.html"),
      },
      // 把 README 描述图片从打包中过滤
      external: ["README_IMG/**"],
      output: {
        // chunkFileNames: "assets/js/[name]-[hash].js",
        // entryFileNames: "assets/js/[name]-[hash].js",
        // assetFileNames: "assets/[ext]/[name]-[hash].[ext]",
        // manualChunks(id: string) {
        //   const checkId = "/node_modules/";
        //   if (id.includes(checkId)) {
        //     const ids = id.split(checkId);
        //     if (ids.length) {
        //       const lastIds = ids.at(-1);
        //       const regex = /^(\w+)/;
        //       const match = lastIds!.match(regex);
        //       if (match && match[1]) {
        //         return match[1];
        //       }
        //     }
        //   }
        // },
      },
    },
  },
});
