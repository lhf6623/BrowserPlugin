import Title from "../../components/Title";
import ConfigLists from "./ConfigLists";
import { defaultDateConfig, defaultTaskListConfig } from "@/config/config";

export default function GeneralSettings() {
	const dateConfig = Object.entries(defaultDateConfig);
	const taskConfig = Object.entries(defaultTaskListConfig);

	return (
		<div className='py-50px px-16px relative max-w-672px w-full h-full overflow-auto select-none'>
			<Title
				title='常规设置'
				subtitle='可以设置看板的样式，看板右上角时间样式配置和每个任务样式配置'
			/>
			<details open name='date'>
				<summary className='font-500 text-18px cursor-pointer'>
					时间样式配置
				</summary>
				<ConfigLists defaultConfig={dateConfig} />
			</details>
			<details open name='task'>
				<summary className='font-500 text-18px cursor-pointer'>
					任务统一配置
				</summary>
				<ConfigLists defaultConfig={taskConfig} />
			</details>
		</div>
	);
}
