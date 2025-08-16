import packageJson from "../../package.json";
import dateUtils, { getDateRange, getDateStyle } from "@/utils/dateUtils";
import { hexToHsl, taskTypeColor } from "@/utils";
import { useState, useEffect } from "react";
import useTime from "@/hooks/useTime";
import { CacheProvider, useCacheContext } from "@/hooks/CacheContext";
import { useTranslation } from "react-i18next";
import { useLanguageSwitcher } from "@/hooks/useLanguageSwitcher";
import { useThemeSwitcher } from "@/hooks/useThemeSwitcher";

export default function App() {
  return (
    <CacheProvider>
      <div className='w-280px max-h-600px h-full flex flex-col relative overflow-hidden'>
        <Header />
        <TaskList />
        <Footer />
      </div>
    </CacheProvider>
  );
}
function TaskList() {
  const { taskList, taskConfig } = useCacheContext();
  const date = useTime();
  const { t } = useTranslation();

  const { showDate, showTitle, showTotal } = taskConfig;

  return (
    <ul className='flex flex-col gap-2 p-6px flex-1 overflow-auto'>
      {taskList.map((item) => {
        const { start, end } = getDateRange(item);
        const { title, color } = item;

        const liStyle = {
          "--in": hexToHsl(color),
          backgroundColor: taskTypeColor[item.taskType],
        } as React.CSSProperties;
        // 还未开始
        const diff = start > date ? t("popop.notStart") : dateUtils().to(end, true);

        return (
          <li key={item.id} className='bg-base-300 p-6px rounded-sm' style={liStyle}>
            <div className='flex justify-between items-center text-base-content/70'>
              <div>
                {showTitle && <span className='text-ellipsis overflow-hidden whitespace-nowrap flex-1'>{title}</span>}
              </div>
              {showTotal && (
                <span className='text-ellipsis overflow-hidden whitespace-nowrap'>
                  {diff} / {dateUtils(start).to(end, true)}
                </span>
              )}
            </div>
            <progress className='progress progress-info w-full flex' value={date - start} max={end - start} />
            {showDate && (
              <div className='flex justify-between text-base-content/50'>
                <span>{getDateStyle(start)}</span>
                <span>{getDateStyle(end)}</span>
              </div>
            )}
          </li>
        );
      })}
    </ul>
  );
}

function Header() {
  const date = useTime();
  const { vacation, setVacation, systemConfig } = useCacheContext();
  // 闪动
  const [flash, setFlash] = useState(false);
  // 右上角时间显示
  const [dateStr, setDateStr] = useState("");
  // 左上角 下一个假期
  const [nextVacation, setNextVacation] = useState("");

  async function getLocalNextHoliday(): Promise<HolidayRequertData> {
    if (
      !vacation.holiday.date ||
      // 当天只会更新一次，接口调用限制
      (vacation && dateUtils(vacation.holiday.date).isBefore(dateUtils(), "D"))
    ) {
      const res = await fetch(`http://timor.tech/api/holiday/next?week=Y`);

      const nextHoliday = await res.json();

      setVacation(nextHoliday);
      return nextHoliday;
    }

    return vacation;
  }

  useEffect(() => {
    const dateStr = `${dateUtils().format(flash ? "MMMM D ddd HH:mm:ss" : "MMMM D ddd HH mm ss")}`;
    setDateStr(dateStr);
    setFlash(!flash);

    if (systemConfig.language !== "zh") return setNextVacation("");

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
function Footer() {
  useLanguageSwitcher();
  useThemeSwitcher();

  const { t } = useTranslation();

  function goOptions() {
    if (chrome.runtime?.openOptionsPage) {
      chrome.runtime.openOptionsPage();
    } else {
      window.open(chrome.runtime.getURL("/options.html"));
    }
  }

  return (
    <footer className='text-14px b-t flex-center justify-between px-6px text-base-content/50'>
      <span className='text-12px op-60 btn btn-xs bg-transparent b-none'>{packageJson.version}</span>
      <div className='flex gap-1 op-60'>
        <button className='btn btn-xs bg-transparent b-none' type='button' title={t("popop.sourceCode")}>
          <a
            className='i-mdi:github'
            target='_blank'
            href='https://github.com/lhf6623/BrowserPlugin'
            title={t("popop.sourceCode")}
          ></a>
        </button>
        <button
          className=' btn btn-xs bg-transparent b-none'
          type='button'
          title={t("popop.taskPanelConfig")}
          onClick={goOptions}
        >
          <i className='i-mdi:mixer-settings'></i>
        </button>
      </div>
    </footer>
  );
}
