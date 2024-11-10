export const TASK_CONFIG_KEY = "TASK_CONFIG_KEY";

function getDefaultConfig(): ReturnData {
  const allData: TaskConfigType = {
    ...defaultNoticeConfig,
    ...defaultVacationConfig,
    ...defaultDateConfig,
    ...defaultTaskListConfig,
  };

  const _data = Object.entries(allData).reduce((acc, [key, item]) => {
    return {
      ...acc,
      [key]: item.value,
    };
  }, {} as ReturnData);
  return _data;
}

export const defaultConfig = getDefaultConfig();

export default function useConfig(): {
  config: ReturnData;
  setConfigData: (data: ReturnData) => void;
} {
  const [config, setConfig] = useState(defaultConfig);

  useEffect(() => {
    cache.getItem<ReturnData>(TASK_CONFIG_KEY).then((data) => {
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
