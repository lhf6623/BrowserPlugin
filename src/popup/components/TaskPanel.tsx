import { Task } from "@/types";
import { FormEvent, useEffect, useRef, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import dayjs from "dayjs";
import useTaskList from "@/hooks/useTaskList";

type Timetype = "day" | "hour" | "minute";

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
].reverse();

interface AddTaskPanelProps {
	show: boolean;
	title?: string;
	onChange: (show: boolean) => void;
	task: Task;
}
export default function AddTaskPanel({
	show,
	title,
	task,
	onChange,
}: AddTaskPanelProps) {
	const { taskList, setList } = useTaskList();
	const formRef = useRef<HTMLFormElement>(null);
	const dialogRef = useRef<HTMLDialogElement>(null);
	const inputRef = useRef<HTMLInputElement>(null);
	useEffect(() => {
		if (show) {
			dialogRef.current?.showModal();
			document.body.style.height = "174px";
			document.body.style.width = "280px";
			document.body.style.overflow = "hidden";
			document.getElementById("root")!.style.height = "174px";
			document.getElementById("root")!.style.overflow = "hidden";
			inputRef.current?.focus();
		} else {
			document.body.style.height = "fit-content";
			document.body.style.width = "fit-content";
			document.getElementById("root")!.style.height = "fit-content";
			document.getElementById("root")!.style.overflow = "auto";
		}
	}, [show]);

	function handleClose() {
		onChange(false);
		formRef.current?.reset();
		dialogRef.current?.close();
	}
	function handleSubmit(e: FormEvent<HTMLFormElement>) {
		e.preventDefault();

		const { endType, ...formData } = Object.fromEntries(
			new FormData(e.currentTarget)
		) as unknown as Task & { endType: Timetype };

		const start = dayjs(formData.start).valueOf();
		const end = !endType
			? dayjs(formData.end).valueOf()
			: dayjs(formData.start).add(formData.end, endType).valueOf();
		// 新增
		if (!task.id) {
			setList([...taskList, { ...formData, id: uuidv4(), start, end }]);
		} else {
			const list = taskList.map((item) => {
				if (item.id === task.id) {
					return { ...item, ...formData, start, end };
				}
				return item;
			});
			setList(list);
		}
		handleClose();
	}

	const defaultStart = dayjs(task.start).format("YYYY-MM-DD HH:mm");

	return (
		<dialog
			ref={dialogRef}
			key={uuidv4()}
		>
			<form
				ref={formRef}
				className='w-280px p-1 bg-white'
				onSubmit={handleSubmit}
			>
				<div className='w-full h-26px flex justify-between items-center mb-2 border-b'>
					<h1 className='text-16px font-700'>{title}</h1>
					<div>
						<button
							className='l-button px-1 mr-1'
							type='submit'
						>
							保存
						</button>
						<button
							onClick={handleClose}
							className='i-mdi:close w-20px h-20px'
							type='button'
						></button>
					</div>
				</div>
				<div className='w-full flex justify-center pb-2'>
					<ul className='w-230px *:flex *:justify-between *:pb-3'>
						<li>
							<label
								htmlFor='title'
								className='w-40px mr-1'
							>
								标题
							</label>
							<input
								type='text'
								name='title'
								className='border'
								defaultValue={task.title}
								autoFocus
								ref={inputRef}
							/>
						</li>
						<li className='*:flex *:items-center'>
							<div>
								<label
									htmlFor='color'
									className='w-30px mr-1'
								>
									颜色
								</label>
								<input
									type='color'
									name='color'
									defaultValue={task.color || "#a21211"}
								/>
							</div>
							<div>
								<label
									htmlFor='type'
									className='w-30px mr-1'
								>
									类型
								</label>
								<select
									name='taskType'
									defaultValue={task.taskType}
								>
									{optionTypes.map((types) => {
										return (
											<option
												key={types.value}
												value={types.value}
											>
												{types.title}
											</option>
										);
									})}
								</select>
							</div>
						</li>
						<li>
							<label
								htmlFor='start'
								className='w-60px mr-1'
							>
								开始时间
							</label>
							<input
								type='datetime-local'
								className='max-w-162px'
								name='start'
								required
								defaultValue={defaultStart}
							/>
						</li>
						<li className='last:pb-0 relative flex'>
							<label
								htmlFor='end'
								className='w-60px mr-1 w-fit flex-shrink-0 min-w-60px'
							>
								结束时间
							</label>
							<EndTime
								task={task}
								key={uuidv4()}
							/>
						</li>
					</ul>
				</div>
			</form>
		</dialog>
	);
}

function EndTime({ task }: { task: Task }) {
	const [isDatetime, setDatetime] = useState(true);
	const [timetype, setTimetype] = useState<Timetype>("hour");
	const key = "end_time";
	const timeTypeKey = "time_type";

	useEffect(() => {
		const _isDatetime = localStorage.getItem(key);
		if (_isDatetime) {
			setDatetime(_isDatetime == "true");
		}

		const _timetype = localStorage.getItem(timeTypeKey);
		if (_timetype) {
			setTimetype(_timetype as Timetype);
		}
	}, []);

	let defaultEnd: number | string = dayjs(task.end).format("YYYY-MM-DD HH:mm");
	if (!isDatetime) {
		defaultEnd = dayjs(task.end).diff(dayjs(task.start), timetype, true);
	}

	function handleChangeTimeType(e: FormEvent<HTMLSelectElement>) {
		setTimetype(e.currentTarget.value as Timetype);
		localStorage.setItem(timeTypeKey, e.currentTarget.value);
	}

	function handleChangeEndType() {
		const _isDatetime = !isDatetime;
		setDatetime(() => _isDatetime);
		localStorage.setItem(key, String(_isDatetime));
	}
	return (
		<div className='flex relative h-20px'>
			<div>
				{isDatetime ? (
					<input
						className='max-w-130px'
						name='end'
						required
						type='datetime-local'
						defaultValue={defaultEnd}
					/>
				) : (
					<div className='flex'>
						<input
							key={uuidv4()}
							className='w-84px'
							name='end'
							required
							type='number'
							defaultValue={defaultEnd}
							step={0.1}
							min={0.1}
						/>
						<select
							className='w-44px'
							value={timetype}
							name='endType'
							onChange={handleChangeTimeType}
						>
							<option value='day'>天</option>
							<option value='hour'>小时</option>
							<option value='minute'>分钟</option>
						</select>
					</div>
				)}
			</div>
			<div>
				<button
					title={isDatetime ? "切换为时间段" : "切换为具体日期"}
					type='button'
					className='i-mdi:chevron-right w-18px h-18px text-#0797E1 hover:op-70'
					onClick={handleChangeEndType}
				></button>
			</div>
		</div>
	);
}
