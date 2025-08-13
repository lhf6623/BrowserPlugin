import cache from "@/utils/cache";
import { useState, useEffect } from "react";

export const TASK_CONFIG_KEY = "TASK_CONFIG_KEY";

export const defaultConfig: PopupConfigType = { showNotice: true, showDate: true, showTitle: true, showTotal: true };

export default function useConfig(): {
  config: PopupConfigType;
  setConfigData: (data: PopupConfigType) => void;
} {
  const [config, setConfig] = useState(defaultConfig);

  useEffect(() => {
    cache.getItem<PopupConfigType>(TASK_CONFIG_KEY).then((data) => {
      setConfig(data ?? defaultConfig);
    });

    function showDate(allLocalData: { [name: string]: chrome.storage.StorageChange }) {
      const { newValue } = allLocalData[cache.baseKey];

      const data = newValue?.[TASK_CONFIG_KEY];
      setConfig(data || defaultConfig);
    }
    cache.storage.onChanged.addListener(showDate);

    return () => {
      cache.storage.onChanged.removeListener(showDate);
    };
  }, []);

  return {
    config: config,
    setConfigData: (data) => cache.setItem(TASK_CONFIG_KEY, data),
  };
}
