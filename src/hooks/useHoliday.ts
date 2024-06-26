import dayjs from "@/utils/dateUtils";
import localStorage from "@/utils/localStorage";
import { useEffect, useState } from "react";
const VACATION_KEY = "VACATION_KEY";

interface RequertData {
	code: 0 | -1;
	holiday: {
		holiday: true; // 该字段一定为true
		name: string; // 节假日的中文名。
		wage: number; // 薪资倍数，3表示是3倍工资
		date: string; // 节假日的日期 2018-10-01
		rest: number; // 表示当前时间距离目标还有多少天。比如今天是 2018-09-28，距离 2018-10-01 还有3天
	};
}
async function getNextHoliday(): Promise<RequertData> {
	const res = await fetch(`http://timor.tech/api/holiday/next`);

	const json = await res.json();

	return json;
}

interface LocalNextHoliday {
	requestTime: string; // 这次请求的时间 比如：'2024-06-17'
	data: RequertData;
}

async function getLocalNextHoliday(): Promise<RequertData> {
	const data = await localStorage.getItem<LocalNextHoliday>(VACATION_KEY);

	if (!data || !data?.data) {
		const nextHoliday = await getNextHoliday();
		const local = {
			requestTime: dayjs().format("YYYY-MM-DD"),
			data: nextHoliday,
		};
		localStorage.setItem<LocalNextHoliday>(VACATION_KEY, local);
		return nextHoliday;
	}

	if (data.requestTime === dayjs().format("YYYY-MM-DD")) {
		return data.data;
	}

	// 判断缓存内的数据是否过期
	if (dayjs(data.data.holiday.date).isBefore(dayjs(), "D")) {
		const nextHoliday = await getNextHoliday();
		const local = {
			requestTime: dayjs().format("YYYY-MM-DD"),
			data: nextHoliday,
		};
		localStorage.setItem<LocalNextHoliday>(VACATION_KEY, local);

		return nextHoliday
	}

	return data.data;
}

export default function useHoliday(): RequertData["holiday"] {
	const [holiday, setHoliday] = useState({} as RequertData["holiday"]);

	useEffect(() => {
		getLocalNextHoliday().then((res) => {
			setHoliday(res.holiday);
		});
	}, []);
	return holiday;
}
