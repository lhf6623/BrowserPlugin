import dateUtils from "@/utils/dateUtils";
// 任务列表
export const TASK_LIST_KEY = "TASK_LIST_KEY";
export const defaultList: Task[] = [
  {
    id: crypto.randomUUID(),
    title: "朝九晚五",
    taskType: "date",
    start: dateUtils().hour(9).minute(0).second(0).millisecond(0).valueOf(),
    end: dateUtils().hour(17).minute(0).second(0).millisecond(0).valueOf(),
    color: "#a21211",
  },
];

// 任务配置
export const TASK_CONFIG_KEY = "TASK_CONFIG_KEY";
export const defaultConfig: PopupConfigType = {
  showNotice: true,
  showDate: true,
  showTitle: true,
  showTotal: true,
};

// 系统配置
export const SYSTEM_CONFIG_KEY = "SYSTEM_CONFIG_KEY";
export const defaultSystemConfig: SystemConfigType = {
  theme: "system",
  language: "zh",
};

// 假期配置
export const VACATION_KEY = "VACATION_KEY";
export const initialVacation: HolidayRequertData = {
  code: 0,
  holiday: {
    holiday: true,
    name: "",
    wage: 0,
    date: "",
    rest: 0,
  },
};
