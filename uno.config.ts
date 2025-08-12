import { defineConfig, presetMini, presetIcons } from "unocss";

import { presetDaisy } from "unocss-preset-daisy";

export default defineConfig({
  presets: [
    presetMini(),
    presetDaisy({
      styled: true,
      themes: ["light", "dark"],
    }),
    presetIcons({
      extraProperties: {
        display: "inline-block",
        "vertical-align": "middle",
      },
      prefix: "i-",
    }),
  ],
  shortcuts: {
    "flex-center": "flex justify-center items-center",
    "absolute-full": "absolute w-full h-full top-0 left-0",
  },
});
