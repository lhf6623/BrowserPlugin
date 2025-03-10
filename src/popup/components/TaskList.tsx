import useConfig from "@/hooks/useConfig";
import useTaskList from "@/hooks/useTaskList";
import useTime from "@/hooks/useTime";
import dateUtils, { getDateRange } from "@/utils/dateUtils";

export default function TaskList({ onEdit }: { onEdit: (task: Task) => void }) {
  const { config } = useConfig();
  const { taskList, setList } = useTaskList();
  const date = useTime();
  const { spacing, radius, height, showDateRange } = config;

  function updateList(type: "up" | "down", id: string) {
    const direction = type === "up" ? -1 : 1;
    const index = taskList.findIndex((item) => item.id === id);
    const target = index + direction;
    const list = taskList.map((item, i) => {
      if ([index, target].includes(i)) return taskList[i == index ? target : index];
      return item;
    });
    setList(list);
  }

  function handleDelete(_task: Task) {
    const _list = taskList.filter((t) => t.id !== _task.id);
    setList(_list);
  }
  function formatTime(date: number) {
    return dateUtils(date).format("YYYY-MM-DD HH:mm:ss");
  }
  return (
    <>
      <ul>
        {taskList.map((item, index) => {
          const { start, end } = getDateRange(item);

          const { color, title } = item;

          const progressBarStyle = {
            "--color": color,
            "--radius": radius,
            "--height": height,
          } as React.CSSProperties;

          const liStyle = {
            "--mb": spacing,
          } as React.CSSProperties;

          const isFirst = index === 0;
          const isLast = index === taskList.length - 1;

          return (
            <li key={index} className="progress_li group" style={liStyle}>
              <div className="w-full flex items-center justify-between">
                {config.showTitle ? <label>{title}</label> : <span></span>}
                <div className="hidden py-1px group-hover:flex float-right text-#0797E1 cursor-pointer *:text-14px *:mr-1">
                  {!isFirst && (
                    <button
                      title="移动到上一行"
                      className="l-button h-14px w-14px flex-center"
                      onClick={() => updateList("up", item.id)}
                    >
                      <i className="i-mdi:arrow-up h-14px w-14px"></i>
                    </button>
                  )}
                  {!isLast && (
                    <button
                      title="移动到下一行"
                      className="l-button h-14px w-14px flex-center"
                      onClick={() => updateList("down", item.id)}
                    >
                      <i className="i-mdi:arrow-down h-14px w-14px"></i>
                    </button>
                  )}
                  <button
                    title="修改当前行"
                    className="l-button h-14px w-14px flex-center"
                    onClick={() => onEdit(item)}
                  >
                    <i className="i-mdi:calendar-edit-outline h-14px w-14px"></i>
                  </button>
                  <button
                    title="删除当前行"
                    className="i-mdi:delete-outline text-red h-14px w-14px"
                    onClick={() => handleDelete(item)}
                  ></button>
                </div>
              </div>
              <div className="relative">
                <progress
                  className="progress w-full flex"
                  style={progressBarStyle}
                  value={date - start}
                  max={end - start}
                />
                {showDateRange && (
                  <span className="flex-center text-12px">
                    {formatTime(start)} - {formatTime(end)}
                  </span>
                )}
              </div>
            </li>
          );
        })}
      </ul>
    </>
  );
}
