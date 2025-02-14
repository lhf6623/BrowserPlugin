import { useState } from "react";
import packageJson from "../../package.json";
import Header from "./components/Header";
import TaskList from "./components/TaskList";
import TaskPanel from "./components/TaskPanel";
function App() {
  const [showPanel, setShowPanel] = useState(false);
  const [title, setTitle] = useState("修改任务");
  const [task, setTask] = useState<Task>({} as Task);

  function goOptions() {
    if (chrome.runtime?.openOptionsPage) {
      chrome.runtime.openOptionsPage();
    } else {
      window.open(chrome.runtime.getURL("/options.html"));
    }
  }
  function handleShowPanel() {
    setShowPanel(true);
    setTitle("添加任务");
    setTask({} as Task);
  }

  function handleEdit(task: Task) {
    setShowPanel(true);
    setTitle("修改任务");
    setTask(task);
  }

  function handleChange() {
    setShowPanel(false);
    setTask({} as Task);
  }

  return (
    <div className="w-280px p-1 text-12px">
      <Header />
      <TaskList onEdit={handleEdit} />
      <TaskPanel title={title} show={showPanel} onChange={handleChange} task={task} />
      <footer className="w-full overflow-hidden relative text-right mt-1 *:text-lg *:opacity-30 *:text-#409eff all:transition-400">
        <span className="absolute inline-block flex-center left-1 !text-#000 !text-12px">
          v: {packageJson.version}
        </span>
        <a
          className="i-mdi:github hover:opacity-100"
          target="_blank"
          href="https://github.com/lhf6623/BrowserPlugin"
          title="源代码"
        ></a>
        <button
          className="i-mdi:calendar-add hover:opacity-100"
          title="添加任务"
          onClick={handleShowPanel}
        ></button>
        <button
          className="i-mdi:mixer-settings hover:opacity-100"
          title="任务面板配置"
          onClick={goOptions}
        ></button>
      </footer>
    </div>
  );
}

export default App;
