interface EyeDropper {
  new (): EyeDropper;
  open: (options?: { signal: AbortSignal }) => Promise<{ sRGBHex: string }>;
}

export {};
declare global {
  interface ImageFileInfo {
    imgFile: Blob;
    base64Url: string;
    image: HTMLImageElement;
  }
  interface CompressImageType {
    oldValue: ImageFileInfo;
    newValue: ImageFileInfo;
  }
  type TaskType = "unrestricted" | "year" | "month" | "day" | "date" | "hour";
  type Task = {
    id: string;
    title: string;
    taskType: TaskType;
    start: number; // 秒
    end: number; // 秒
    color: string;
  };
  type VacationConfigKey = "showVacation";
  type DateConfigKey = "showDateTitle" | "showDate" | "showWeek" | "showSeparator" | "showSecond";
  type TaskConfigKey = "showTitle" | "spacing" | "radius" | "height";
  type ItemConfig = {
    key?: string;
    value: boolean | number;
    title: string;
    subtitle: string;
    type: "checkbox" | "number";
    disabled?: boolean;
  };
  type AllConfigKey = VacationConfigKey | DateConfigKey | TaskConfigKey;
  type VacationConfigType = Record<VacationConfigKey, ItemConfig>;
  type DateConfigType = Record<DateConfigKey, ItemConfig>;
  type TaskConfigType = Record<TaskConfigKey, ItemConfig>;
  type AllConfigType = VacationConfigType | DateConfigType | TaskConfigType;

  type ReturnData = Record<AllConfigKey, boolean | number>;
  // 定义一个工具类型来提取 Promise<T> 中的 T 类型
  type UnwrapPromise<T> = T extends Promise<infer U> ? U : T;
  type Exclude<T, U> = T extends U ? never : T;
  interface Window {
    EyeDropper: EyeDropper;
  }
}
