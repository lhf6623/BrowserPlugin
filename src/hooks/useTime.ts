import dateUtils from "@/utils/dateUtils";
import { useState, useRef, useEffect } from "react";

export default function useTime() {
  const [time, setTime] = useState(dateUtils().valueOf());
  const timer = useRef<number | null>(null);

  useEffect(() => {
    timer.current = setInterval(() => {
      setTime(dateUtils().valueOf());
    }, 1000);

    return () => {
      timer.current && clearInterval(timer.current);
    };
  }, []);

  return time;
}
