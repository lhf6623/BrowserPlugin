import { createContext, ReactNode, useReducer, useContext, useEffect, Dispatch } from "react";
import cache from "@/utils/cache.ts";
import {
  TASK_CONFIG_KEY,
  TASK_LIST_KEY,
  SYSTEM_CONFIG_KEY,
  VACATION_KEY,
  defaultList,
  defaultConfig,
  defaultSystemConfig,
  initialVacation,
} from "./cacheConfig";

// 定义 action 类型
type ActionType =
  | { type: "INITIALIZE"; payload: any }
  | { type: "SET_TASK_LIST"; payload: Task[] }
  | { type: "SET_TASK_CONFIG"; payload: PopupConfigType }
  | { type: "SET_SYSTEM_CONFIG"; payload: SystemConfigType }
  | { type: "SET_VACATION"; payload: HolidayRequertData };

// 定义上下文类型
type CacheContextType = {
  taskList: Task[];
  taskConfig: PopupConfigType;
  systemConfig: SystemConfigType;
  vacation: HolidayRequertData;
  setTaskList: (list: Task[]) => void;
  setTaskConfig: (config: PopupConfigType) => void;
  setSystemConfig: (config: SystemConfigType) => void;
  setVacation: (vacation: HolidayRequertData) => void;
};

export const CacheContext = createContext<CacheContextType | undefined>(undefined);
export const CacheDispatchContext = createContext<Dispatch<ActionType> | undefined>(undefined);

const initialCache = {
  taskList: defaultList,
  taskConfig: defaultConfig,
  systemConfig: defaultSystemConfig,
  vacation: initialVacation,
};

// 这里会在组件初始化之前获取缓存数据
cache.getAllLocal().then(async (data) => {
  initialCache.taskList = data[TASK_LIST_KEY] || defaultList;
  initialCache.taskConfig = data[TASK_CONFIG_KEY] || defaultConfig;
  initialCache.systemConfig = data[SYSTEM_CONFIG_KEY] || defaultSystemConfig;
  initialCache.vacation = data[VACATION_KEY] || initialVacation;

  if (!data[TASK_LIST_KEY]) {
    await cache.setItem(TASK_LIST_KEY, defaultList);
  }
  if (!data[TASK_CONFIG_KEY]) {
    await cache.setItem(TASK_CONFIG_KEY, defaultConfig);
  }
  if (!data[SYSTEM_CONFIG_KEY]) {
    await cache.setItem(SYSTEM_CONFIG_KEY, defaultSystemConfig);
  }
  if (!data[VACATION_KEY]) {
    await cache.setItem(VACATION_KEY, initialVacation);
  }
});

// Reducer 函数
function tasksReducer(state: typeof initialCache, action: ActionType) {
  switch (action.type) {
    case "INITIALIZE":
      return {
        ...state,
        ...action.payload,
      };
    case "SET_TASK_LIST":
      return {
        ...state,
        taskList: action.payload,
      };
    case "SET_TASK_CONFIG":
      return {
        ...state,
        taskConfig: action.payload,
      };
    case "SET_SYSTEM_CONFIG":
      return {
        ...state,
        systemConfig: action.payload,
      };
    case "SET_VACATION":
      return {
        ...state,
        vacation: action.payload,
      };
    default:
      throw new Error("Unknown action type");
  }
}

// Provider 组件
export function CacheProvider({ children }: { children: ReactNode }) {
  const [cacheData, dispatch] = useReducer(tasksReducer, initialCache);

  // 初始化缓存数据
  useEffect(() => {
    async function initializeCache() {
      const data = await cache.getAllLocal();
      dispatch({
        type: "INITIALIZE",
        payload: {
          taskList: data[TASK_LIST_KEY] || defaultList,
          taskConfig: data[TASK_CONFIG_KEY] || defaultConfig,
          systemConfig: data[SYSTEM_CONFIG_KEY] || defaultSystemConfig,
          vacation: data[VACATION_KEY] || initialVacation,
        },
      });
    }

    initializeCache();

    // 监听缓存变化
    function handleStorageChange(changes: { [key: string]: chrome.storage.StorageChange }) {
      const { newValue } = changes[cache.baseKey] || {};
      if (newValue) {
        dispatch({
          type: "INITIALIZE",
          payload: {
            taskList: newValue[TASK_LIST_KEY] || defaultList,
            taskConfig: newValue[TASK_CONFIG_KEY] || defaultConfig,
            systemConfig: newValue[SYSTEM_CONFIG_KEY] || defaultSystemConfig,
          },
        });
      }
    }

    cache.storage.onChanged.addListener(handleStorageChange);
    return () => {
      cache.storage.onChanged.removeListener(handleStorageChange);
    };
  }, []);

  // 保存任务列表到缓存
  const setTaskList = (list: Task[]) => {
    dispatch({ type: "SET_TASK_LIST", payload: list });
    cache.setItem(TASK_LIST_KEY, list);
  };

  // 保存任务配置到缓存
  const setTaskConfig = (config: PopupConfigType) => {
    dispatch({ type: "SET_TASK_CONFIG", payload: config });
    cache.setItem(TASK_CONFIG_KEY, config);
  };

  // 保存系统配置到缓存
  const setSystemConfig = (config: SystemConfigType) => {
    dispatch({ type: "SET_SYSTEM_CONFIG", payload: config });
    cache.setItem(SYSTEM_CONFIG_KEY, config);
  };

  // 保存假期配置到缓存
  const setVacation = (vacation: HolidayRequertData) => {
    dispatch({ type: "SET_VACATION", payload: vacation });
    cache.setItem(VACATION_KEY, vacation);
  };

  // 提供给子组件的值
  const contextValue = {
    ...cacheData,
    setTaskList,
    setTaskConfig,
    setSystemConfig,
    setVacation,
  };

  return (
    <CacheContext.Provider value={contextValue}>
      <CacheDispatchContext.Provider value={dispatch}>{children}</CacheDispatchContext.Provider>
    </CacheContext.Provider>
  );
}

// 自定义 hook，方便使用缓存数据
export function useCacheContext() {
  const context = useContext(CacheContext);
  if (context === undefined) {
    throw new Error("useCacheContext must be used within a CacheProvider");
  }
  return context;
}
