export default function GeneralSettings() {
  function test() {
    chrome.notifications.create("cake-notification", {
      type: "progress",
      iconUrl: chrome.runtime.getURL("image/icon128.png"),
      title: "测试用例",
      message: "这是一条测试用例",
      progress: 100,
    });
  }
  return (
    <div className="py-50px px-16px relative max-w-672px w-full h-full overflow-auto select-none">
      <label className="p-16px relative flex flex-col justify-between">
        <h1 className="text-24px font-700">常规设置</h1>
        <p className="text-14px font-400 text-#888888 mt-8px">
          可以设置看板的样式，看板右上角时间样式配置和每个任务样式配置
        </p>
      </label>
      <ConfigLists defaultConfig={defaultNoticeConfig}>
        {() => (
          <button className="l-button ml-10px px-6px" onClick={test}>
            测试
          </button>
        )}
      </ConfigLists>
      <ConfigLists defaultConfig={defaultVacationConfig} />
      <details open name="task">
        <summary className="font-500 text-18px cursor-pointer">时间样式配置</summary>
        <ConfigLists defaultConfig={defaultDateConfig} disabledKey="showDateTitle" />
      </details>
      <details name="task">
        <summary className="font-500 text-18px cursor-pointer">任务统一配置</summary>
        <ConfigLists defaultConfig={defaultTaskListConfig} />
      </details>
    </div>
  );
}

type ConfigListsProps = {
  disabledKey?: TaskConfigKey;
  defaultConfig: TaskConfigType;
  children?: (key: string) => ReactNode;
};
function ConfigLists({ disabledKey, defaultConfig, children }: ConfigListsProps) {
  const { config, setConfigData } = useConfig();
  const _defaultConfig = Object.entries(defaultConfig) as unknown as [TaskConfigKey, ItemConfig][];

  function handleChange(e: ChangeEvent<HTMLInputElement>) {
    const key = e.target.id as TaskConfigKey;
    const _config = {
      ...config,
      [key]: typeof config[key] === "boolean" ? !config[key] : e.target.value,
    };
    setConfigData(_config);
  }
  return (
    <>
      {_defaultConfig.map(([key, item]) => {
        const value = config[key] ?? item.value;
        let disabled = false;
        if (disabledKey && disabledKey !== key) {
          if (config[key]) {
            disabled = !config[disabledKey] as boolean;
          }
        }
        const attr = {
          value,
          title: item.title,
          type: item.type,
          disabled,
          id: key,
        };
        return (
          <label
            htmlFor={key}
            key={key}
            className="p-14px relative hover:bg-#f3f3f3 flex justify-between cursor-pointer"
          >
            <div>
              <h1 className="font-500 text-16px">{item.title}</h1>
              <p className="text-14px font-400 text-#888888 mt-4px">
                {item.subtitle}
                {children?.(key)}
              </p>
            </div>
            <Input onChange={handleChange} {...attr} />
          </label>
        );
      })}
    </>
  );
}

interface InputProps {
  type: string;
  id: string;
  value: boolean | number;
  disabled: boolean;
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
}
function Input({ type, id, value, disabled, onChange }: InputProps) {
  // @unocss-include
  let attr: Record<string, any> = {
    value: value,
    min: 0,
    max: 100,
    className: "w-62px h-30px border rounded flex-shrink-0",
  };
  if (type === "checkbox") {
    attr = {
      checked: value,
      className: "w-22px flex-shrink-0",
    };
  }
  return <input type={type} disabled={disabled} id={id} {...attr} onChange={onChange} />;
}
