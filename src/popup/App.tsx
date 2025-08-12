import packageJson from "../../package.json";
import useTaskList from "@/hooks/useTaskList";
import dateUtils, { getDateRange } from "@/utils/dateUtils";
import { getKeyByVersion, hexToHsl, taskTypeColor } from "@/utils";
import cache from "@/utils/cache";
import { useState, useEffect } from "react";
import useTime from "@/hooks/useTime";

export default function App() {
  function goOptions() {
    if (chrome.runtime?.openOptionsPage) {
      chrome.runtime.openOptionsPage();
    } else {
      window.open(chrome.runtime.getURL("/options.html"));
    }
  }

  return (
    <div className='w-280px max-h-600px h-full flex flex-col relative overflow-hidden'>
      <Header />
      <TaskList />
      <footer className='text-14px b-t flex-center justify-between px-6px text-base-content/50'>
        <span className='text-12px'>{packageJson.version}</span>
        <div className='flex gap-1'>
          <a
            className='i-mdi:github'
            target='_blank'
            href='https://github.com/lhf6623/BrowserPlugin'
            title='源代码'
          ></a>
          <button className='i-mdi:mixer-settings' title='任务面板配置' onClick={goOptions}></button>
        </div>
      </footer>
    </div>
  );
}
function TaskList() {
  const { taskList } = useTaskList();
  const date = useTime();

  return (
    <ul className='flex flex-col gap-2 p-6px flex-1 overflow-auto'>
      {taskList.map((item) => {
        const { start, end } = getDateRange(item);
        const { title, color } = item;

        const liStyle = {
          "--in": hexToHsl(color),
          backgroundColor: taskTypeColor[item.taskType],
        } as React.CSSProperties;
        // 还未开始 已完成
        const diff = start > date ? "未开始" : end < date ? "已完成" : dateUtils(item.end).to(date, true);

        return (
          <li key={item.id} className='bg-base-300 p-6px rounded-sm' style={liStyle}>
            <div className='flex justify-between items-center text-base-content/70'>
              <span className='text-ellipsis overflow-hidden whitespace-nowrap'>{title}</span>
              <span className='text-ellipsis overflow-hidden whitespace-nowrap'>{diff}</span>
            </div>
            <progress className='progress progress-info w-full flex' value={date - start} max={end - start} />
          </li>
        );
      })}
    </ul>
  );
}

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
function Header() {
  const date = useTime();
  // 闪动
  const [flash, setFlash] = useState(false);
  const [dateStr, setDateStr] = useState("");

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
    const _date = `${dateUtils().format("M月D日")} ${dateUtils().format("ddd")} ${
      flash ? dateUtils().format("HH:mm:ss") : dateUtils().format("HH mm ss")
    }`;
    setDateStr(_date);
    setFlash(!flash);

    getLocalNextHoliday().then((res) => {
      const { name, rest } = res.holiday || {};
      let v = res.holiday ? `距离${name}还有${rest}天` : "今年没有假期了";

      setNextVacation(v);
    });
  }, [date]);

  return (
    <header className='b-b flex justify-between px-6px py-6px'>
      <span>{nextVacation}</span>
      <span>{dateStr}</span>
    </header>
  );
}
