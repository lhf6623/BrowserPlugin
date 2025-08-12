import useConfig from "@/hooks/useConfig";
import useTaskList from "@/hooks/useTaskList";
import dateUtils from "@/utils/dateUtils";
import { ChangeEvent } from "react";
import { taskTypeColor } from "@/utils";

export default function GeneralSettings() {
  return (
    <div className='py-50px px-16px relative w-full h-full overflow-auto select-none bg-base-100 border-base-300 text-base-content'>
      <h1 className='text-24px'>常规设置</h1>
      <ConfigLists />
      <h1 className='text-24px mt-16px'>任务列表</h1>
      <TaskLists />
    </div>
  );
}

function TaskLists() {
  const { taskList, setList } = useTaskList();

  function addNewTask() {
    setList([
      ...taskList,
      {
        id: crypto.randomUUID(),
        title: "新任务",
        color: "#a21211",
        taskType: "unrestricted",
        start: dateUtils().valueOf(),
        end: dateUtils().add(1, "h").valueOf(),
      },
    ]);
  }

  return (
    <div className='overflow-auto'>
      <table className='table border border-base-200 b-rounded '>
        <thead>
          <tr>
            <th>标题</th>
            <th>颜色</th>
            <th>类型</th>
            <th>开始时间</th>
            <th>结束时间</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          {taskList.map((item, index) => {
            return <TaskForm task={item} key={item.id} index={index} />;
          })}
          <tr>
            <td colSpan={6} className='text-center'>
              <button className='btn btn-xs btn-info' onClick={addNewTask}>
                新增一行
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

const optionTypes = [
  {
    value: "year",
    title: "每年循环",
  },
  {
    value: "month",
    title: "每月循环",
  },
  {
    value: "day",
    title: "每周循环",
  },
  {
    value: "date",
    title: "每日循环",
  },
  {
    value: "hour",
    title: "每小时循环",
  },
  {
    value: "unrestricted",
    title: "不循环",
  },
];
function TaskForm({ task, index }: { task: Task; index: number }) {
  const { taskList, setList } = useTaskList();
  const start = dateUtils(task.start).format("YYYY-MM-DD HH:mm");
  const end = dateUtils(task.end).format("YYYY-MM-DD HH:mm");
  function handleDelete() {
    const list = taskList.filter((item) => item.id !== task.id);
    setList(list);
  }
  function handleMove(type: "up" | "down") {
    const list = [...taskList];
    if (type === "up") {
      if (isFirst) return;
      [list[index], list[index - 1]] = [list[index - 1], list[index]];
    } else {
      if (isLast) return;
      [list[index], list[index + 1]] = [list[index + 1], list[index]];
    }
    setList(list);
  }
  function changeValue(e: ChangeEvent<HTMLInputElement> | ChangeEvent<HTMLSelectElement>) {
    const name = e.target.name as keyof Task;
    let value = e.target.value as Task[keyof Task];

    if (name === "start" || name === "end") {
      value = dateUtils(value).valueOf();
    }

    const list = [...taskList];
    const newTask = { ...list[index] };
    // 使用类型断言解决类型不匹配问题
    (newTask[name] as Task[keyof Task]) = value;
    list[index] = newTask;
    setList(list);
  }
  const isLast = index === taskList.length - 1;
  const isFirst = index === 0;

  const bgColor = taskTypeColor[task.taskType];
  return (
    <tr
      style={{
        backgroundColor: bgColor,
      }}
    >
      <td>
        <input
          type='text'
          className='input input-info input-xs w-165px'
          placeholder='标题'
          name='title'
          id='title'
          defaultValue={task.title}
          onChange={changeValue}
        />
      </td>
      <td>
        <input
          type='color'
          className='input-xs'
          name='color'
          id='color'
          defaultValue={task.color}
          onChange={changeValue}
        />
      </td>
      <td>
        <select
          name='taskType'
          className='select select-info select-sm'
          id='taskType'
          defaultValue={task.taskType}
          onChange={changeValue}
        >
          {optionTypes.map((types) => {
            return (
              <option key={types.value} value={types.value}>
                {types.title}
              </option>
            );
          })}
        </select>
      </td>
      <td>
        <input
          className='input input-info input-xs w-165px'
          type='datetime-local'
          id='start'
          name='start'
          step={1}
          defaultValue={start}
          onChange={changeValue}
        />
      </td>
      <td>
        <input
          className='input input-info input-xs w-165px'
          type='datetime-local'
          id='end'
          name='end'
          step={1}
          defaultValue={end}
          onChange={changeValue}
        />
      </td>
      <td className='flex gap-1'>
        {!isFirst && (
          <button className='btn btn-xs btn-square w-fit btn-info whitespace-nowrap' onClick={() => handleMove("up")}>
            上移
          </button>
        )}
        {!isLast && (
          <button className='btn btn-xs btn-square w-fit btn-info whitespace-nowrap' onClick={() => handleMove("down")}>
            下移
          </button>
        )}
        <button className='btn btn-xs w-fit btn-error whitespace-nowrap' onClick={handleDelete}>
          删除
        </button>
      </td>
    </tr>
  );
}

function ConfigLists() {
  const { config, setConfigData } = useConfig();

  function handleChange(e: ChangeEvent<HTMLInputElement>) {
    const key = e.target.id as keyof PopupConfigType;
    const _config = {
      ...config,
      [key]: e.target.checked,
    };
    setConfigData(_config);
  }
  function test() {
    chrome.notifications.create("cake-notification", {
      type: "progress",
      iconUrl: chrome.runtime.getURL("image/icon128.png"),
      title: "测试用例",
      message: "这是一条测试用例",
      progress: 100,
    });
  }
  return (
    <>
      <label
        htmlFor='showNotice'
        className='p-14px relative b-rounded bg-base-200 hover:bg-base-300 flex justify-between cursor-pointer'
      >
        <div>
          <h1>通知显示</h1>
          <p className='text-14px mt-4px text-base-content/70'>
            通过系统级通知提醒
            <button className='btn btn-xs btn-info  btn-outline ml-10px px-6px' onClick={test}>
              测试
            </button>
          </p>
        </div>
        <input
          type='checkbox'
          checked={config.showNotice}
          id='showNotice'
          className='checkbox checkbox-info'
          onChange={handleChange}
        />
      </label>
    </>
  );
}
