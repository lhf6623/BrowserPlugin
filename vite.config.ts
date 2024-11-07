import { defineConfig } from "vite";
import UnoCSS from "unocss/vite";
import React from "@vitejs/plugin-react";
import { crx as Crx } from "@crxjs/vite-plugin";
import manifest from "./manifest";
import { resolve } from "path";
import { rmSync } from "fs";
import AutoImport from "unplugin-auto-import/vite";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    Crx({ manifest }),
    UnoCSS(),
    React(),
    {
      // 删除打包后的vite文件夹
      name: "remove-vite-folder",
      closeBundle() {
        const viteFolder = resolve(__dirname, "dist/.vite");
        rmSync(viteFolder, { recursive: true, force: true });
      },
    },
    AutoImport({
      include: [
        /\.[tj]sx?$/, // .ts, .tsx, .js, .jsx
      ],
      imports: [
        "react",
        "react-router-dom", // example type import
        {
          from: "react",
          imports: [
            "CSSProperties",
            "RouteObject",
            "ChangeEvent",
            "ReactNode",
            "Reducer",
            "Dispatch",
            "FormEvent",
          ],
          type: true,
        },
        {
          from: "dayjs",
          imports: ["ManipulateType"],
          type: true,
        },
        {
          dayjs: [["default", "dayjs"]],
        },
        {
          from: "react",
          imports: ["createContext"],
          type: false,
        },
        {
          from: "react-router-dom",
          imports: [["useRouteError"], ["useNavigate"], ["createHashRouter"]],
          type: false,
        },
        {
          "simple-notify": [["default", "Notify"]],
        },
        {
          uuid: [
            ["v4", "uuidv4"], // import { v4 as uuidv4 } from 'uuid',
          ],
        },
      ],
      dts: "src/types/auto-import.d.ts",
      dirs: ["src/**/*"],
    }),
  ],
  server: {
    host: true,
    port: 5173,
    strictPort: true,
    hmr: {
      port: 5173,
    },
  },
  resolve: {
    alias: {
      "@": resolve(__dirname, "./src"),
      "@opt": resolve(__dirname, "./src/options"),
      "@pages": resolve(__dirname, "./src/options/pages"),
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
        chunkFileNames: "assets/js/[name]-[hash].js",
        entryFileNames: "assets/js/[name]-[hash].js",
        assetFileNames: "assets/[ext]/[name]-[hash].[ext]",
        manualChunks(id: string) {
          const checkId = "/node_modules/";
          if (id.includes(checkId)) {
            const ids = id.split(checkId);
            if (ids.length) {
              const lastIds = ids.at(-1);
              const regex = /^(\w+)/;
              const match = lastIds!.match(regex);

              if (match && match[1]) {
                return match[1];
              }
            }
          }
        },
      },
    },
  },
});
