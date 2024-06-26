import { defineManifest } from "@crxjs/vite-plugin";
import packageJson from "./package.json";

export default defineManifest(async (_env) => {
	return {
		manifest_version: 3,
		name: "一个小工具",
		description: "小工具",
		version: packageJson.version,
		action: {
			default_title: "Default Title",
			default_popup: "popup.html",
			default_icon: {
				"32": "emo.png",
				"72": "emo.png",
				"128": "emo.png",
				"512": "emo.png",
			},
		},
		options_page: "options.html",
		permissions: ["storage"],
		// content_scripts: [
		// 	{
		// 		matches: ["<all_urls>"],
		// 		js: ["src/contentScripts/content-script.ts"],
		// 		all_frames: true,
		// 	},
		// ],
		// background: {
		// 	service_worker: "src/background/background.ts",
		// },
	};
});
