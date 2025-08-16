import { defineManifest } from "@crxjs/vite-plugin";
import packageJson from "./package.json";

export default defineManifest(async (_env) => {
  return {
    manifest_version: 3,
    name: "__MSG_extName__",
    description: "__MSG_extDescription__",
    version: packageJson.version,
    default_locale: "zh_CN",
    icons: {
      "16": "image/icon16.png",
      "32": "image/icon32.png",
      "48": "image/icon48.png",
      "128": "image/icon128.png",
    },
    action: {
      default_title: "__MSG_extAction__",
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
