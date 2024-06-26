import { useState, useEffect, useRef } from "react";
import dayjs from "@/utils/dateUtils";

export default function useTime() {
	const [time, setTime] = useState(dayjs().valueOf());
	const timer = useRef<number | null>(null);

	useEffect(() => {
		timer.current = setInterval(() => {
			setTime(dayjs().valueOf());
		}, 1000);

		return () => {
			timer.current && clearInterval(timer.current);
		};
	}, []);

	return time;
}
