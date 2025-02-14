import dayjs, { ManipulateType } from "dayjs";
import "dayjs/locale/zh-cn";

// 是否相同或之前
import isSameOrBefore from "dayjs/plugin/isSameOrBefore";

dayjs.locale("zh-cn");

dayjs.extend(isSameOrBefore);

/** 获取星期天数 */
export const getWeekday = () => {
  const weeks = ["周一", "周二", "周三", "周四", "周五", "周六", "周日"];
  return weeks[dayjs().day() - 1];
};

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

  const type: Cycle = task.taskType;

  const typeObj: Record<Cycle, ManipulateType> = {
    year: "y",
    month: "M",
    day: "w",
    date: "d",
    hour: "h",
  };
  const _type = typeObj[type];

  const startDiff = now.diff(start, _type, true) | 0;

  start = start.add(startDiff, _type);
  end = end.add(startDiff, _type);
  return {
    start: start.valueOf(),
    end: end.valueOf(),
  };
};

export default dayjs;
