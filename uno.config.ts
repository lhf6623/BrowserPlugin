import {
  defineConfig,
  presetMini,
  presetIcons,
  presetAttributify,
  presetTypography,
  transformerAttributifyJsx,
} from "unocss";

export default defineConfig({
  presets: [
    presetMini(),
    presetAttributify(),
    presetIcons({
      extraProperties: {
        display: "inline-block",
        "vertical-align": "middle",
      },
      prefix: "i-",
    }),
    presetTypography(),
  ],
  shortcuts: {
    "l-button":
      "rounded-sm border border-#0797E1 bg-white transition-all hover:bg-#0797E1 hover:text-white active:opacity-70",
    "flex-center": "flex justify-center items-center",
    "absolute-full": "absolute w-full h-full top-0 left-0",
  },
  transformers: [transformerAttributifyJsx()],
});
