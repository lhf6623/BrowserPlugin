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

  type PopupConfigType = {
    showNotice: boolean;
    showDate: boolean;
    showTitle: boolean;
    showTotal: boolean;
  };

  type SystemConfigType = {
    theme: string;
    language: "zh" | "en";
  };
  interface HolidayRequertData {
    code: 0 | -1;
    holiday: {
      /** 该字段一定为true */
      holiday: true;
      /** 节假日的中文名。 */
      name: string;
      /** 薪资倍数，3表示是3倍工资 */
      wage: number;
      /** 节假日的日期 2018-10-01 */
      date: string;
      /** 表示当前时间距离目标还有多少天。比如今天是 2018-09-28，距离 2018-10-01 还有3天 */
      rest: number;
    };
  }
  // 定义一个工具类型来提取 Promise<T> 中的 T 类型
  type UnwrapPromise<T> = T extends Promise<infer U> ? U : T;
  type Exclude<T, U> = T extends U ? never : T;
  interface Window {
    EyeDropper: EyeDropper;
  }
}
