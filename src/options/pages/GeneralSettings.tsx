import dateUtils from "@/utils/dateUtils";
import { ChangeEvent, ReactNode, useState } from "react";
import { taskTypeColor } from "@/utils";
import useCurrRouters from "@/hooks/useCurrRouters";
import { useCacheContext } from "@/hooks/CacheContext";

export default function GeneralSettings() {
  const routerList = useCurrRouters("/");
  const currRouter = routerList.find((item) => item.path === "/");

  return (
    <div className='py-50px px-16px relative w-full h-full overflow-auto select-none bg-base-100 border-base-300 text-base-content'>
      <h1 className='text-24px'>{currRouter?.name}</h1>
      <ConfigLists />
      <h1 className='text-24px mt-16px'>任务列表</h1>
      <TaskLists />
    </div>
  );
}

function TaskLists() {
  const { taskList, setTaskList } = useCacheContext();
  function addNewTask() {
    setTaskList([
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
              <button className='btn btn-xs btn-info' type='button' title='新增一行' onClick={addNewTask}>
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
  const { taskList, setTaskList } = useCacheContext();
  const start = dateUtils(task.start).format("YYYY-MM-DD HH:mm");
  const end = dateUtils(task.end).format("YYYY-MM-DD HH:mm");
  function handleDelete() {
    const list = taskList.filter((item) => item.id !== task.id);
    setTaskList(list);
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
    setTaskList(list);
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
    setTaskList(list);
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
          placeholder='选择颜色'
        />
      </td>
      <td>
        <select
          name='taskType'
          className='select select-info select-xs'
          id='taskType'
          defaultValue={task.taskType}
          onChange={changeValue}
          title='任务类型'
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
          placeholder='选择开始时间'
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
          placeholder='选择结束时间'
          defaultValue={end}
          onChange={changeValue}
        />
      </td>
      <td className='flex gap-1'>
        {!isFirst && (
          <button
            title='上移'
            className='btn btn-xs btn-square w-fit btn-info whitespace-nowrap'
            type='button'
            onClick={() => handleMove("up")}
          >
            上移
          </button>
        )}
        {!isLast && (
          <button
            title='下移'
            className='btn btn-xs btn-square w-fit btn-info whitespace-nowrap'
            type='button'
            onClick={() => handleMove("down")}
          >
            下移
          </button>
        )}
        <button
          title='删除'
          className='btn btn-xs w-fit btn-error whitespace-nowrap'
          type='button'
          onClick={handleDelete}
        >
          删除
        </button>
      </td>
    </tr>
  );
}

function ConfigLists() {
  const { taskConfig, setTaskConfig } = useCacheContext();
  const [notificationsId, setNotificationsId] = useState<string>("");

  function handleChange(e: ChangeEvent<HTMLInputElement>) {
    const target = e.target as HTMLInputElement;
    const key = target.id as IdType;
    const value = target.checked;
    setTaskConfig({
      ...taskConfig,
      [key]: value,
    });
  }
  async function test() {
    if (notificationsId) {
      chrome.notifications.clear(notificationsId);
    }
    const id = await chrome.notifications.create("cake-notification", {
      type: "basic",
      iconUrl: "image/icon128.png",
      title: "",
      message: "测试通知",
    });
    setNotificationsId(id);
  }
  type IdType = keyof PopupConfigType;

  type ConfigItem = {
    title: string;
    msg: string;
    id: IdType;
    value: boolean;
    children?: () => ReactNode;
  };

  // 剔除 theme 相关配置
  const configList: ConfigItem[] = [
    {
      title: "通知显示",
      msg: "通过系统级通知提醒",
      id: "showNotice" as IdType,
      value: false,
      children: () => {
        if (!taskConfig.showNotice) return null;
        return (
          <button
            className='btn btn-xs btn-info  btn-outline ml-10px px-6px'
            type='button'
            title='测试通知'
            onClick={test}
          >
            测试通知
          </button>
        );
      },
    },
    {
      title: "标题显示",
      msg: "进度条顶部标题",
      id: "showTitle" as IdType,
      value: false,
    },
    {
      title: "剩余时间显示",
      msg: "剩余时间和总时间显示",
      id: "showTotal" as IdType,
      value: false,
    },
    {
      title: "时间显示",
      msg: "进度条底部开始时间和结束时间",
      id: "showDate" as IdType,
      value: false,
    },
  ].map((item) => {
    return {
      ...item,
      value: taskConfig[item.id],
    };
  });
  return (
    // 宽度不够自动换行
    <div className='flex gap-1 flex-wrap'>
      {configList.map((item) => {
        return (
          <div key={item.id} className='p-14px relative b-rounded bg-base-200 flex justify-between'>
            <div>
              <h1>{item.title}</h1>
              <p className='text-14px mt-4px mr-6px text-base-content/70'>
                {item.msg}
                {item.children && item.children()}
              </p>
            </div>
            <input
              type='checkbox'
              checked={item.value}
              id={item.id}
              placeholder={item.title}
              className='checkbox checkbox-info'
              onChange={handleChange}
            />
          </div>
        );
      })}
    </div>
  );
}
