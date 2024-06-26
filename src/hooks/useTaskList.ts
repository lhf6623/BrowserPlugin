import { Task } from "@/types";
import { useState, useEffect } from "react";
import localStorage from "@/utils/localStorage";
import dayjs from "@/utils/dateUtils";
import { v4 as uuidv4 } from "uuid";

const TASK_LIST_KEY = "TASK_LIST_KEY";

export const newTask: Task = {
	id: uuidv4(),
	title: "默认任务",
	taskType: "unrestricted",
	start: dayjs().valueOf(),
	end: dayjs().valueOf() + 1000 * 60 * 60,
	color: "#a21211",
};
const defaultList: Task[] = [newTask];
export default function useTaskList() {
	const [taskList, setTaskList] = useState<Task[]>(defaultList);

	useEffect(() => {
		localStorage.getItem<Task[]>(TASK_LIST_KEY, defaultList).then((data) => {
			setTaskList(data);
		});
		function showDate(allLocalData: {
			[name: string]: chrome.storage.StorageChange;
		}) {
			const { newValue } = allLocalData[localStorage.baseKey];

			const data = newValue?.[TASK_LIST_KEY];
			setTaskList(data || defaultList);
		}
		localStorage.storage.onChanged.addListener(showDate);

		return () => {
			localStorage.storage.onChanged.removeListener(showDate);
		};
	}, []);

	return {
		taskList,
		setList: (list: Task[]) => localStorage.setItem(TASK_LIST_KEY, list),
	};
}
