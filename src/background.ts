import { ManipulateType } from "dayjs";
import dateUtils from "@/utils/dateUtils";
import cache from "@/utils/cache";
import { TASK_CONFIG_KEY } from "@/hooks/useConfig";
import { TASK_LIST_KEY } from "@/hooks/useTaskList";

const getTaskKey = (id = "") => `taskReminder_${id}`;

function getEnd(task: Task) {
  if (task.end > Date.now()) {
    return task.end;
  }
  if (task.taskType === "unrestricted") {
    return task.end;
  }

  type Cycle = Exclude<TaskType, "unrestricted">;
  const typeObj: Record<Cycle, ManipulateType> = {
    year: "y",
    month: "M",
    day: "w",
    date: "d",
    hour: "h",
  };
  const _type = typeObj[task.taskType];
  const startDiff = dateUtils().diff(task.end, _type, true) | 0;
  const _end = dateUtils(task.end).add(startDiff, _type).valueOf();

  if (_end < Date.now()) {
    return dateUtils(_end).add(1, _type).valueOf();
  }
  return _end;
}

async function getTasks() {
  // 初始化任务提醒
  return await cache.getItem(TASK_LIST_KEY).then((data) => {
    let tasks: Task[] = [];
    if (data && Array.isArray(data)) {
      tasks = data || [];
    }
    return tasks;
  });
}

function addAlarms(task: Task) {
  if (task.taskType === "unrestricted" && task.end < Date.now()) {
    return;
  }
  const _end = getEnd(task);
  // when: Date.now() + 1000 * 60 指定触发时间的任务 1 分钟后触发
  chrome.alarms.create(getTaskKey(task.id), { when: _end });
}

// 监听配置的变化,重新初始化任务提醒
chrome.storage.onChanged.addListener(() => {
  scheduleTaskReminders();
});

// 监听 chrome.alarms 事件
chrome.alarms.onAlarm.addListener(async (alarm) => {
  if (alarm.name.startsWith(getTaskKey())) {
    const taskIndex = alarm.name.split("_")[1];
    const tasks = await getTasks();

    const _task = tasks.flatMap((item) => (item.id === taskIndex ? [item] : []));
    if (_task.length) {
      const item = _task[0];
      notifyUser(item);
      addAlarms(item);
    }
  }
});
async function initListener() {
  // 插件启动时初始化提醒
  chrome.runtime.onStartup.addListener(scheduleTaskReminders);
  chrome.runtime.onInstalled.addListener(scheduleTaskReminders);
}
initListener();

// 清除任务
async function clearTaskReminders() {
  const allTask = await chrome.alarms.getAll();
  // 过滤出本项目的提醒
  const clearTask = allTask.filter((item) => item.name.startsWith(getTaskKey()));

  if (clearTask.length) {
    clearTask.forEach(({ name }) => chrome.alarms.clear(name));
  }
}

/**
 * 初始化任务提醒，创建任务时会清除之前的任务
 */
async function scheduleTaskReminders() {
  await clearTaskReminders();
  const tasks = await getTasks();

  tasks.forEach(addAlarms);
}

// 通知用户
async function notifyUser(task: Task) {
  const { showNotice } = await cache.getItem<ReturnData>(TASK_CONFIG_KEY);
  if (!showNotice) return;
  chrome.notifications.create({
    type: "progress",
    iconUrl: "image/icon128.png",
    title: "任务提醒",
    message: `${task.title} ${dateUtils(task.end).format("HH:mm:ss")}`,
    progress: 100,
  });
}
