import { DateConfigKey, ItemConfig, TaskConfigKey } from "@/types";
import { ChangeEvent } from "react";
import useConfig from "@/hooks/useConfig";

export default function ConfigLists({
	defaultConfig,
}: {
	defaultConfig: [string, ItemConfig][];
}) {
	const { config, setConfigData } = useConfig();

	const disabledKey = defaultConfig.flatMap(([_, { key }]) => {
		return key ? [key] : [];
	})[0] as DateConfigKey | TaskConfigKey;

	function handleChange(e: ChangeEvent<HTMLInputElement>) {
		const key = e.target.id as DateConfigKey | TaskConfigKey;
		const _config = {
			...config,
			[key]: typeof config[key] === "boolean" ? !config[key] : e.target.value,
		};
		setConfigData(_config);
	}
	return (
		<>
			{defaultConfig.map(([key, item]) => {
				const _key = key as DateConfigKey | TaskConfigKey;
				const value = config[_key] ?? item.value;
				let disabled = false;
				if (!!disabledKey && disabledKey !== _key) {
					if (config[_key]) {
						disabled = !config[disabledKey] as boolean;
					}
				}
				const _task = {
					value,
					title: item.title,
					subtitle: item.subtitle,
					type: item.type,
					disabled,
					id: _key,
				};
				return <FormItem key={_key} task={_task} onChange={handleChange} />;
			})}
		</>
	);
}

interface InputProps {
	type: string;
	id: string;
	value: boolean | number;
	disabled: boolean;
	onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
}
function Input({ type, id, value, disabled, onChange }: InputProps) {
	// @unocss-include
	let attr: Record<string, any> = {
		value: value,
		min: 0,
		max: 100,
		className: "w-62px h-30px border rounded flex-shrink-0",
	};
	if (type === "checkbox") {
		attr = {
			checked: value,
			className: "w-22px flex-shrink-0",
		};
	}
	return (
		<input
			type={type}
			disabled={disabled}
			id={id}
			{...attr}
			onChange={onChange}
		/>
	);
}

interface FormItemProps {
	task: {
		id: string;
		title: string;
		value: number | boolean;
		type: "number" | "checkbox";
		disabled: boolean;
		subtitle: string;
	};
	onChange: (e: ChangeEvent<HTMLInputElement>) => void;
}
function FormItem({ task, onChange }: FormItemProps) {
	return (
		<div className='p-14px relative'>
			<label htmlFor={task.id} className='flex justify-between cursor-pointer'>
				<div>
					<h1 className='font-500 text-16px'>{task.title}</h1>
					<p className='text-14px font-400 text-#888888 mt-4px'>
						{task.subtitle}
					</p>
				</div>
				<Input
					onChange={onChange}
					disabled={task.disabled}
					value={task.value}
					id={task.id}
					type={task.type}
				/>
			</label>
		</div>
	);
}
