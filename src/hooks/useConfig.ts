import { useState, useEffect } from "react";
import localStorage from "@/utils/localStorage";
import { AllConfigType, ReturnData } from "@/types";
import { defaultDateConfig, defaultTaskListConfig } from "@/config/config";

const TASK_CONFIG_KEY = "TASK_CONFIG_KEY";

function getDefaultConfig(): ReturnData {
	const allData: AllConfigType = {
		...defaultDateConfig,
		...defaultTaskListConfig,
	};

	const _data = Object.entries(allData).reduce((acc, [key, item]) => {
		return {
			...acc,
			[key]: item.value,
		};
	}, {} as ReturnData);
	return _data;
}
export default function useConfig(): {
	config: ReturnData;
	setConfigData: (data: ReturnData) => void;
} {
	const [config, setConfig] = useState(getDefaultConfig());

	useEffect(() => {
		localStorage.getItem<ReturnData>(TASK_CONFIG_KEY, getDefaultConfig()).then((data) => {
			setConfig(data);
		});

		function showDate(allLocalData: {
			[name: string]: chrome.storage.StorageChange;
		}) {
			const { newValue } = allLocalData[localStorage.baseKey];

			const data = newValue?.[TASK_CONFIG_KEY];
			setConfig(data || getDefaultConfig());
		}
		localStorage.storage.onChanged.addListener(showDate);

		return () => {
			localStorage.storage.onChanged.removeListener(showDate);
		};
	}, []);

	return {
		config: config,
		setConfigData: (data) => localStorage.setItem(TASK_CONFIG_KEY, data),
	};
}
