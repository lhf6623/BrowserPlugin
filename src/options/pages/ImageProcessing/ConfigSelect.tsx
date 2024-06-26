import { ChangeEvent, useEffect, useState } from "react";
import {
	CompressionMode,
	ConfigType,
	useConfig,
} from "./ImageProcessingContext";

interface RadioGroupProps {
	label: string;
	name: string;
	value: string;
	onChange: (opt: RadioGroupProps["options"][0]) => void;
	onClick?: (opt: RadioGroupProps["options"][0]) => void;
	options: { label: any; value: any }[];
}
function RadioGroup({
	label,
	name,
	value,
	onChange,
	onClick,
	options,
}: RadioGroupProps) {
	return (
		<div className='flex'>
			<p className='flex-shrink-0'>{label}</p>
			<div className='flex flex-wrap gap-4'>
				{options.map((item) => {
					return (
						<div
							key={item.value}
							className='cursor-pointer w-fit flex-shrink-0'
							onClick={() => onClick?.(item)}
						>
							<input
								className='mr-2px cursor-pointer'
								type='radio'
								name={name}
								id={item.value}
								value={item.value}
								checked={value === item.value}
								onChange={() => onChange(item)}
							/>
							<label htmlFor={item.value} className='cursor-pointer'>
								{item.label}
							</label>
						</div>
					);
				})}
			</div>
		</div>
	);
}

interface ConfigPanelProps {
	show: boolean;
	onChangeShow: (show: boolean) => void;
}
function CustomConfigPanel({ show, onChangeShow }: ConfigPanelProps) {
	const { configDispatch } = useConfig();
	const [custom, setCustom] = useState<{
		type: ConfigType["type"];
		quality: number;
	}>(CompressionMode["custom"]);

	const formatOptions: { value: ConfigType["type"]; label: string }[] = [
		{
			value: "original",
			label: "原格式",
		},
		{
			value: "image/png",
			label: "PNG",
		},
		{
			value: "image/jpeg",
			label: "JPEG",
		},
		{
			value: "image/webp",
			label: "WEBP",
		},
	];

	function handleChangeShow() {
		onChangeShow(false);
	}

	useEffect(() => {
		if (show) {
			configDispatch({
				type: "update",
				payload: custom,
			});
		}
	}, [custom, show]);

	function handleChangeQuality(e: ChangeEvent<HTMLInputElement>) {
		setCustom({
			...custom,
			quality: Number(e.target.value),
		});
	}
	function handleChangeFormat(opt: {
		value: ConfigType["type"];
		label: string;
	}) {
		setCustom({
			...custom,
			type: opt.value,
		});
	}
	return (
		<>
			{show && (
				<div className='border pl-4 relative py-1 my-1 flex flex-col gap-4 justify-center bg-#fafbfd'>
					<div className='flex items-center'>
						<label htmlFor='reduce'>清晰度：</label>
						<div>
							<input
								type='range'
								name='quality'
								value={custom.quality}
								step={0.01}
								min={0.1}
								max={1}
								onChange={handleChangeQuality}
							/>
							{custom.quality}%
						</div>
					</div>
					<RadioGroup
						label='压缩格式：'
						options={formatOptions}
						value={custom.type}
						onChange={handleChangeFormat}
						name='format'
					/>

					<button
						onClick={handleChangeShow}
						className='absolute right-2px top-2px bg-white text-12px'
					>
						收起
					</button>
				</div>
			)}
		</>
	);
}

export default function ConfigSelect() {
	const [type, setType] = useState("reduce");
	const [showConfig, setShowConfig] = useState(false);
	const { configDispatch } = useConfig();

	function handleSelectType(opt: {
		value: keyof typeof CompressionMode;
		label: string;
	}) {
		setType(opt.value);
		if (opt.value === "custom") {
			setShowConfig(true);
		} else {
			const payload = CompressionMode[opt.value];
			configDispatch({
				type: "update",
				payload,
			});
		}
	}
	const typeOptions = [
		{
			value: "reduce",
			label: "缩小优先",
		},
		{
			value: "clearness",
			label: "清晰优先",
		},
		{
			value: "custom",
			label: "自定义",
		},
	];

	function handleChangeShowConfig(show: boolean) {
		setShowConfig(show);
	}
	return (
		<div>
			<div className='flex-center border py-2 cursor-pointer'>
				<RadioGroup
					label='压缩模式：'
					options={typeOptions}
					value={type}
					onChange={handleSelectType}
					onClick={(opt) => {
						setShowConfig(opt.value === "custom");
					}}
					name='type'
				/>
			</div>
			<CustomConfigPanel
				show={showConfig}
				onChangeShow={handleChangeShowConfig}
			/>
		</div>
	);
}
