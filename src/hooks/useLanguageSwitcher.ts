import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useCacheContext } from "./CacheContext";
import { changeDateLocale } from "@/utils/dateUtils";

/**
 * 语言切换钩子
 * 处理语言切换逻辑，包括更新i18n、文档语言属性和日期显示语言
 */
export function useLanguageSwitcher() {
  const { systemConfig, setSystemConfig } = useCacheContext();
  const { i18n, t } = useTranslation();

  // 应用语言设置
  function applyLanguage(language: SystemConfigType["language"]) {
    setSystemConfig({
      ...systemConfig,
      language,
    });
    // i18n 语言切换
    i18n.changeLanguage(language);
    // 日期显示语言切换
    changeDateLocale(language);
    // 文档语言属性切换
    document.documentElement.setAttribute("lang", language);
    // 文档标题切换
    document.title = t("html.title");
  }

  // 初始化和监听语言变化
  useEffect(() => {
    applyLanguage(systemConfig.language);
  }, [systemConfig.language]);

  return { applyLanguage, systemConfig };
}
