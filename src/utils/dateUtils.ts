import dayjs, { ManipulateType } from "dayjs";
import "dayjs/locale/zh-cn";

// 是否相同或之前
import isSameOrBefore from "dayjs/plugin/isSameOrBefore";
// RelativeTime 增加了 .from .to .fromNow .toNow 4 个 API 来展示相对的时间 (例如：3 小时以前)。
import relativeTime from "dayjs/plugin/relativeTime";
// WeekDay 增加了 .weekday() API 来获取或设置当前语言的星期。
import weekday from "dayjs/plugin/weekday";

dayjs.locale("zh-cn");

dayjs.extend(isSameOrBefore);
dayjs.extend(relativeTime);
dayjs.extend(weekday);

/**
 * 原始时间范围 根据 taskType 字段获取时间范围
 */
export const getDateRange = (task: Task): { start: number; end: number } => {
  let start = dayjs(task.start),
    end = dayjs(task.end),
    now = dayjs();

  if (task.taskType === "unrestricted") {
    return { start: task.start, end: task.end };
  }

  type Cycle = Exclude<TaskType, "unrestricted">;
  const typeObj: Record<Cycle, ManipulateType> = {
    year: "y",
    month: "M",
    day: "w",
    date: "d",
    hour: "h",
  };
  const dateType = typeObj[task.taskType];

  const startDiff = now.diff(start, dateType, true) | 0;

  start = start.add(startDiff, dateType);
  end = end.add(startDiff, dateType);

  if (end.valueOf() < Date.now()) {
    start = dayjs(start).add(1, dateType);
    end = dayjs(end).add(1, dateType);
  }
  return {
    start: start.valueOf(),
    end: end.valueOf(),
  };
};

export function getDateStyle(date: number) {
  const diff = Math.abs(date - Date.now());

  // 相差小于一天
  if (diff < 24 * 60 * 60 * 1000) {
    return dayjs(date).format("H时m分s秒");
  }
  // 如果于当前时间相隔一个星期，只显示星期
  if (diff < 7 * 24 * 60 * 60 * 1000) {
    return dayjs(date).format("dddd");
  }
  // 如果小于一个月，只显示日期
  if (diff < 30 * 24 * 60 * 60 * 1000) {
    return dayjs(date).format("M月D号");
  }
  // 其余显示日期
  return dayjs(date).format("YYYY年M月D号");
}

export default dayjs;
