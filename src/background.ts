import dateUtils, { getDateRange } from "@/utils/dateUtils";
import cache from "@/utils/cache";
import { TASK_CONFIG_KEY } from "@/hooks/useConfig";
import { TASK_LIST_KEY } from "@/hooks/useTaskList";

const getTaskKey = (id = "") => `taskReminder_${id}`;

/** 获取任务列表 */
async function getTasks() {
  return await cache.getItem(TASK_LIST_KEY).then((data) => {
    let tasks: Task[] = [];
    if (data && Array.isArray(data)) {
      tasks = data || [];
    }
    return tasks;
  });
}
/** 创建闹钟 */
function addAlarms(task: Task) {
  if (task.taskType === "unrestricted" && task.end < Date.now()) {
    return;
  }
  // 获取任务的结束时间
  const { end } = getDateRange(task);

  // when: Date.now() + 1000 * 60 指定触发时间的任务 1 分钟后触发
  chrome.alarms.create(getTaskKey(task.id), { when: end });
}

/** 初始化任务闹钟，创建任务时会清除之前的任务 */
async function initTaskAlarms() {
  // 全部任务闹钟
  const allTask = await chrome.alarms.getAll();

  // 过滤出本项目的提醒
  const clearTask = allTask.filter((item) => item.name.startsWith(getTaskKey()));

  if (clearTask.length) {
    clearTask.forEach(({ name }) => chrome.alarms.clear(name));
  }

  // 全部任务
  const tasks = await getTasks();

  tasks.forEach(addAlarms);
}

/** 闹钟提醒 */
async function notifyUser(task: Task) {
  const { showNotice } = await cache.getItem<PopupConfigType>(TASK_CONFIG_KEY);
  if (!showNotice) return;
  chrome.notifications.create(getTaskKey(task.id), {
    type: "basic",
    iconUrl: "image/icon128.png",
    title: "",
    message: `${task.title} ${dateUtils().format("HH:mm:ss")}`,
  });
}

// 当安装了此扩展程序的个人资料首次启动时触发。即使此扩展程序在“分离式”无痕模式下运行，当无痕配置文件启动时，也不会触发此事件。
chrome.runtime.onStartup.addListener(initTaskAlarms);
// 在首次安装扩展程序、将扩展程序更新到新版本以及将 Chrome 更新到新版本时触发。
chrome.runtime.onInstalled.addListener(initTaskAlarms);

// 监听配置的变化,重新初始化任务提醒
chrome.storage.onChanged.addListener(initTaskAlarms);

// 监听闹钟触发，通知用户后重新添加闹钟
chrome.alarms.onAlarm.addListener(async (alarm) => {
  // 过滤出本项目的闹钟
  if (alarm.name.startsWith(getTaskKey())) {
    const taskId = alarm.name.split("_")[1];
    const tasks = await getTasks();

    const task = tasks.find((item) => item.id === taskId);
    if (task) {
      notifyUser(task);
      addAlarms(task);
    }
  }
});
