import { defineManifest } from "@crxjs/vite-plugin";
import packageJson from "./package.json";

export default defineManifest(async (_env) => {
  return {
    manifest_version: 3,
    name: "工具箱 - 基于浏览器API制作",
    description: "基于浏览器API制作，图片压缩，base64，图片剪裁，tauri 图片剪裁，base64与图片互转",
    version: packageJson.version,
    icons: {
      "16": "image/icon16.png",
      "32": "image/icon32.png",
      "48": "image/icon48.png",
      "128": "image/icon128.png",
    },
    action: {
      default_title: "工具箱",
      default_popup: "popup.html",
      default_icon: {
        "16": "image/icon16.png",
        "32": "image/icon32.png",
        "48": "image/icon48.png",
        "128": "image/icon128.png",
      },
    },
    options_page: "options.html",
    permissions: ["storage", "notifications", "webNavigation", "alarms"],
    // content_scripts: [
    // 	{
    // 		matches: ["<all_urls>"],
    // 		js: ["src/contentScripts/content-script.ts"],
    // 		all_frames: true,
    // 	},
    // ],
    background: {
      service_worker: "src/background.ts",
    },
  };
});
