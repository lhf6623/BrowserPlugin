import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import "virtual:uno.css";
import "@unocss/reset/tailwind-compat.css";
import cache from "@/utils/cache.ts";
import { TASK_CONFIG_KEY, defaultConfig } from "@/hooks/useConfig.ts";
import { TASK_LIST_KEY, defaultList } from "@/hooks/useTaskList.ts";

cache.getAllLocal().then((data) => {
  if (!data[TASK_LIST_KEY]) {
    cache.setItem(TASK_LIST_KEY, defaultList);
  }
  if (!data[TASK_CONFIG_KEY]) {
    cache.setItem(TASK_CONFIG_KEY, defaultConfig);
  }
});

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
