export const defaultVacationConfig: VacationConfigType = {
  /** 展示时间 */
  showVacation: {
    key: "showVacation",
    value: true,
    title: "显示假期",
    subtitle: "顶部左上角假期显示",
    type: "checkbox",
  },
};

/** 时间配置 */
export const defaultDateConfig: DateConfigType = {
  /** 展示时间 */
  showDateTitle: {
    value: true,
    title: "显示时间",
    subtitle: "顶部右上角时间是否显示： 【6月18日  周二  11:42:56】",
    type: "checkbox",
  },
  /** 显示日期 */
  showDate: {
    value: true,
    title: "显示日期",
    subtitle: "日期展示： 【6月18日】 周二  11:42:56",
    type: "checkbox",
  },
  /** 显示星期 */
  showWeek: {
    value: true,
    title: "显示星期",
    subtitle: "星期展示： 6月18日 【周二】 11:42:56",
    type: "checkbox",
  },
  /** 分割符闪动 */
  showSeparator: {
    value: true,
    title: "分割符闪动",
    subtitle: "闪动分割符： 6月18日 周二 11【:】42【:】56",
    type: "checkbox",
  },
  /** 显示秒 */
  showSecond: {
    value: true,
    title: "显示秒",
    subtitle: "秒展示： 6月18日 周二 11:42:【56】",
    type: "checkbox",
  },
};

/** 每个任务统一配置 */
export const defaultTaskListConfig: TaskConfigType = {
  /** 标题展示 */
  showTitle: {
    value: true,
    title: "标题展示",
    subtitle: "任务进度条上方的标题展示",
    type: "checkbox",
  },
  height: {
    value: 8,
    title: "高度",
    subtitle: "任务进度条的高度",
    type: "number",
  },
  radius: {
    value: 0,
    title: "圆角",
    subtitle: "每个任务进度条的圆角",
    type: "number",
  },
  /** 任务间距距离 */
  spacing: {
    value: 0,
    title: "任务间距",
    subtitle: "每个任务进度条之间的距离",
    type: "number",
  },
};
