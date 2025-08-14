import { defineConfig, presetMini, presetIcons } from "unocss";
import themes from "./src/assets/themes.json";

import { presetDaisy } from "unocss-preset-daisy";

export default defineConfig({
  presets: [
    presetMini({
      dark: "class",
    }),
    presetDaisy({
      styled: true,
      themes,
    }),
    presetIcons({
      extraProperties: {
        display: "inline-block",
        "vertical-align": "middle",
      },
      prefix: "i-",
    }),
  ],
  rules: [
    [
      "line-clamp-4",
      {
        overflow: "hidden",
        display: "-webkit-box",
        "-webkit-box-orient": "vertical",
        "-webkit-line-clamp": 4,
      },
    ],
  ],
  shortcuts: {
    "flex-center": "flex justify-center items-center",
    "absolute-full": "absolute w-full h-full top-0 left-0",
    "btn-icon-info": "btn btn-info text-info btn-outline btn-xs px-0 b-none !bg-transparent hover:text-info/70",
  },
});
