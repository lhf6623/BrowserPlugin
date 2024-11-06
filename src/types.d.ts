export type TaskType = "unrestricted" | "year" | "month" | "day" | "date" | "hour";

export type Task = {
	id: string;
	title: string;
	taskType: TaskType;
	start: number; // 秒
	end: number; // 秒
	color: string;
};

export type DateConfigKey =
	| "showDateTitle"
	| "showDate"
	| "showWeek"
	| "showSeparator"
	| "showSecond";
export type TaskConfigKey = "showTitle" | "spacing" | "radius" | "height";

export type ItemConfig = {
	key?: string;
	value: boolean | number;
	title: string;
	subtitle: string;
	type: "checkbox" | "number";
	disabled?: boolean;
};

export type DateConfigType = Record<DateConfigKey, ItemConfig>;
export type TaskConfigType = Record<TaskConfigKey, ItemConfig>;
export type AllConfigType = DateConfigType | TaskConfigType;

export type ReturnData = Record<DateConfigKey | TaskConfigKey, boolean | number>;

interface EyeDropper {
	new (): EyeDropper;
	open: (options?: { signal: AbortSignal }) => Promise<{ sRGBHex: string }>;
}
declare global {
	// 定义一个工具类型来提取 Promise<T> 中的 T 类型
	type UnwrapPromise<T> = T extends Promise<infer U> ? U : T;
	type Exclude<T, U> = T extends U ? never : T;
	interface Window {
		EyeDropper: EyeDropper;
	}
}
