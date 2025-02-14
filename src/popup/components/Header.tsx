import useConfig from "@/hooks/useConfig";
import { getKeyByVersion } from "@/utils";
import cache from "@/utils/cache";
import dateUtils, { getWeekday } from "@/utils/dateUtils";
import { useState, useRef, useEffect } from "react";

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
export default function Header() {
  const { config } = useConfig();
  const { showVacation, showDateTitle } = config;
  return (
    <>
      {(showVacation || showDateTitle) && (
        <header className="mb-1 border-b border-b-#ccc flex justify-between">
          <span>{config.showVacation && <Holiday />}</span>
          {config.showDateTitle && <DateTitle config={config} />}
        </header>
      )}
    </>
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

      const [months, date, hours, minutes, seconds] = dateUtils().format("M-D-HH-mm-ss").split("-");

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
  const VACATION_KEY = getKeyByVersion("VACATION");

  async function getNextHoliday(): Promise<HolidayRequertData> {
    const res = await fetch(`http://timor.tech/api/holiday/next?week=Y`);

    const json = await res.json();

    return json;
  }
  async function getLocalNextHoliday(): Promise<HolidayRequertData> {
    const data = await cache.getItem<HolidayRequertData>(VACATION_KEY);

    if (
      !data ||
      !data?.holiday ||
      // 判断缓存内的数据是否过期 比较的是 天 所以当天是不会更新下一个节假日的
      (data && dateUtils(data.holiday.date).isBefore(dateUtils(), "D"))
    ) {
      const nextHoliday = await getNextHoliday();

      cache.setItem<HolidayRequertData>(VACATION_KEY, nextHoliday);
      return nextHoliday;
    }

    return data;
  }

  useEffect(() => {
    getLocalNextHoliday().then((res) => {
      const { name, rest } = res.holiday || {};
      let v = res.holiday ? `距离${name}还有${rest}天` : "今年没有假期了";

      setNextVacation(v);
    });
  }, []);

  return <span>{nextVacation}</span>;
}
