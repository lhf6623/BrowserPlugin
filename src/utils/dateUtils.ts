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
 * 获取指定年份和类型的日期范围。
 * @param {Object} param0 - 包含年份和类型的对象。
 * @param {number} [param0.year] - 可选参数，指定的年份。如果未提供，则使用当前年份。
 * @param {'year' | 'month' | 'week'} param0.type - 日期类型，可选值为 'year'、'month'、'week'。
 * @returns {Object} - 返回一个包含开始时间和结束时间（以Unix时间戳格式）的对象。
 */
export const getDateRange = (task: Task): { start: number; end: number } => {
  let start = dayjs(task.start),
    end = dayjs(task.end),
    now = dayjs();

  if (task.taskType === "unrestricted") {
    return { start: task.start, end: task.end };
  }
  const type: Exclude<TaskType, "unrestricted"> = task.taskType;

  const typeObj: Record<Exclude<TaskType, "unrestricted">, ManipulateType> = {
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
