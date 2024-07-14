import TaskList from "./components/TaskList";
import TaskPanel from "./components/TaskPanel";
import { Task } from "@/types";
import { useState } from "react";
import Header from "./components/Header";

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
		<div className='w-280px p-1 text-12px'>
			<Header />
			<TaskList onEdit={handleEdit} />
			<TaskPanel
				title={title}
				show={showPanel}
				onChange={handleChange}
				task={task}
			/>
			<footer className='w-full text-right mt-1 *:text-lg *:opacity-30 *:text-#409eff all:transition-400'>
				<a
					className='i-mdi:github hover:opacity-100'
					target='_blank'
					href='https://github.com/lhf6623/BrowserPlugin'
					title='源代码'
				></a>
				<button
					className='i-mdi:calendar-add hover:opacity-100'
					title='添加任务'
					onClick={handleShowPanel}
				></button>
				<button
					className='i-mdi:mixer-settings hover:opacity-100'
					title='任务面板配置'
					onClick={goOptions}
				></button>
			</footer>
		</div>
	);
}

export default App;
