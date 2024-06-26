import useConfig from "@/hooks/useConfig";
import dayjs, { getWeekday } from "@/utils/dateUtils";
import { useEffect, useRef, useState } from "react";
import { ReturnData } from "@/types";
import useHoliday from "@/hooks/useHoliday";

export default function Header() {
	const { config } = useConfig();

	return (
		<header className='mb-1 border-b border-b-#ccc flex justify-between'>
			<Holiday />
			{config.showDateTitle && <DateTitle config={config} />}
		</header>
	);
}

function DateTitle({ config }: { config: ReturnData }) {
	// 闪动
	const [flash, setFlash] = useState(false);
	// 配置文件
	const [dateObject, setDateObject] = useState({
		/** 日期 */
		date: "",
		/** 星期 */
		week: "",
		/** 小时 */
		hour: "",
		/** 分钟 */
		minute: "",
		/** 秒 */
		second: "",
	});

	const intervalRef = useRef<number | null>(null);

	useEffect(() => {
		function getDate() {
			setFlash((prevState) => !prevState);

			const [months, date, hours, minutes, seconds] = dayjs()
				.format("M-D-HH-mm-ss")
				.split("-");

			setDateObject({
				date: `${Number(months)}月${date}日`,
				week: getWeekday(),
				hour: `${hours}`.padStart(2, "0"),
				minute: `${minutes}`.padStart(2, "0"),
				second: `${seconds}`.padStart(2, "0"),
			});
		}
		getDate();
		intervalRef.current = setInterval(() => {
			getDate();
		}, 1000);

		return () => {
			intervalRef.current && clearInterval(intervalRef.current);
		};
	}, []);

	const { showDate, showWeek, showSecond, showSeparator } = config;

	// @unocss-include
	const text = showSeparator ? (flash ? "text-transparent" : "") : "";
	return (
		<>
			<span>
				{showDate && <span>{dateObject.date}&nbsp;&nbsp;</span>}
				{showWeek && <span>{dateObject.week}&nbsp;&nbsp;</span>}
				<span>{dateObject.hour}</span>
				<span className={text}>:</span>
				<span>{dateObject.minute}</span>
				{showSecond && <span className={text}>:</span>}
				{showSecond && <span>{dateObject.second}</span>}
			</span>
		</>
	);
}

function Holiday() {
	const [nextVacation, setNextVacation] = useState("");
	const holiday = useHoliday();

	useEffect(() => {
		const { name, date } = holiday;
		const diff = dayjs(date).diff(dayjs(), "day");
		let v = `距离${name}还有${diff}天`;
		if (!diff) {
			v = name || "";
		}
		setNextVacation(v);
	}, [holiday]);

	return <span>{nextVacation}</span>;
}
