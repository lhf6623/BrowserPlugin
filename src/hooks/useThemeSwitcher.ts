import { useEffect, useState } from "react";
import { useCacheContext } from "./CacheContext";

/**
 * 主题切换钩子
 * 处理主题切换逻辑，包括应用主题到文档和监听系统主题变化
 */
export function useThemeSwitcher() {
  const { systemConfig, setSystemConfig } = useCacheContext();
  const [systemAutoTheme, setSystemAutoTheme] = useState("light");

  function _setSystemConfig(config: SystemConfigType["theme"]) {
    setSystemConfig({
      ...systemConfig,
      theme: config,
    });
  }

  // 应用主题到文档
  function applyTheme(theme: string) {
    if (theme === "system") {
      theme = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
    }
    document.documentElement.setAttribute("data-theme", theme);
    document.documentElement.setAttribute("class", theme);
  }

  // 初始化和监听主题变化
  useEffect(() => {
    // 使用文档过渡动画应用主题
    document.startViewTransition(() => applyTheme(systemConfig.theme));

    // 监听系统主题变化
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    setSystemAutoTheme(mediaQuery.matches ? "dark" : "light");
    const handleSystemThemeChange = () => {
      if (systemConfig.theme === "system") {
        applyTheme("system");
        setSystemAutoTheme(mediaQuery.matches ? "dark" : "light");
      }
    };

    mediaQuery.addEventListener("change", handleSystemThemeChange);
    return () => mediaQuery.removeEventListener("change", handleSystemThemeChange);
  }, [systemConfig]);

  return { setTheme: _setSystemConfig, systemConfig, systemAutoTheme };
}
