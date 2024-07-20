import { useEffect, useRef, useState } from "react";
import SingleColorSelect from "./SingleColorSelect";
import MoveBoxBlock from "@opt/components/MoveBoxBlock";
import ColorSelect from "./ColorSelect";
import {
	getColorByXY,
	hexToRgb,
	getXYByColor,
	getColorSelectXY,
} from "@/utils/color";

const WIDTH = 128;
const DEFAULT_COLOR = [255, 0, 0];

export default function ColorDependent() {
	// 透明度
	const [transparency, setTransparency] = useState(WIDTH);
	const [singleData, setSingleData] = useState(DEFAULT_COLOR);
	const [colorRgb, setColorRgb] = useState(DEFAULT_COLOR);
	const [XY, setXY] = useState({ x: 232, y: 0 });
	const [singleXY, setSingleXY] = useState({ x: 232, y: 0 });
	const [selectColorX, setSelectColorX] = useState(0);

	function handleColorSelect(data: number[]) {
		const [r, g, b] = data;

		const rgb = getColorByXY({
			...XY,
			w: 232,
			h: 128,
			rt: { r, g, b },
		});

		setColorRgb(rgb);
		setSingleData([r, g, b]);
	}

	function singleColorSelect(data: {
		rgb: number[];
		xy: { x: number; y: number };
	}) {
		const { rgb, xy } = data;
		setColorRgb(rgb);
		setXY(xy);
	}

	function handleGetColor(p: number[]) {
		// @unocss-skip-start
		// 目标颜色
		const [r, g, b] = p;
		// 计算出的右上角颜色 和 模拟鼠标选择的坐标
		const { rgb, xy } = getXYByColor({ r, g, b });

		const _x = Math.round((xy!.x / 255) * 232);
		const _y = Math.round((xy!.y / 255) * 128);

		setColorRgb(p);
		setSingleData(rgb!);
		setSingleXY({ x: _x, y: _y });
		const selectColor = getColorSelectXY({ r: rgb[0], g: rgb[1], b: rgb[2] });
		setSelectColorX((selectColor / 255) * 128);
		// @unocss-skip-end
	}

	return (
		<div
			w-full
			h-full
			flex-center
			max-sm='pt-40px'
		>
			<div
				w-232px
				shadow
				rounded
				overflow-hidden
				bg='@dark:#282828'
			>
				<SingleColorSelect
					rgb={singleData}
					xy={singleXY}
					onChange={singleColorSelect}
				/>
				<div
					p-14px
					flex-center
					gap-x-2
				>
					<ColorExtraction onGetColor={handleGetColor} />
					<ColorCopy
						opacity={transparency / WIDTH}
						rgb={colorRgb}
					/>
					<div
						relative
						flex-shrink-0
					>
						<ColorSelect
							x={selectColorX}
							onColorChange={handleColorSelect}
						/>
						<TransparencySelect
							rgb={colorRgb}
							transparency={transparency}
							onTransparencyChange={setTransparency}
						/>
					</div>
				</div>
			</div>
		</div>
	);
}

interface ColorExtractionProps {
	onGetColor: (p: number[]) => void;
}
/** 取色 */
function ColorExtraction({ onGetColor }: ColorExtractionProps) {
	const [action, setAction] = useState(false);

	function getColor() {
		if (!window.EyeDropper) {
			console.error("你的浏览器不支持 EyeDropper API");
			return;
		}
		setAction(true);
		const eyeDropper = new window.EyeDropper();
		eyeDropper
			.open()
			.then((result) => {
				const rgb = hexToRgb(result.sRGBHex);

				onGetColor(rgb);
			})
			.catch((e) => {
				console.error(e);
			})
			.finally(() => {
				setAction(false);
			});
	}
	return (
		<div
			w-28px
			h-28px
			p-2px
			flex='center shrink-0'
			rounded-sm
			hover='@dark:bg-#484848 @light:bg-#f2f2f2'
			style={{ color: "black" }}
		>
			<div
				w-24px
				h-24px
				cursor-pointer
				text='@dark:white @light:#1f1f1f'
				i-mage:color-picker
				className={action ? "!text-#1c6ef3" : ""}
				onClick={getColor}
			></div>
		</div>
	);
}

interface TransparencySelectProps {
	rgb: number[];
	transparency: number;
	onTransparencyChange: (p: number) => void;
}
/** 透明度选择 */
function TransparencySelect({
	rgb,
	transparency,
	onTransparencyChange,
}: TransparencySelectProps) {
	const [r, g, b] = rgb;
	const color = `rgb(${r}, ${g}, ${b})`;
	const width = WIDTH;
	const height = 10;
	return (
		<MoveBoxBlock
			className='mt-8px cursor-pointer'
			width={width}
			height={height}
			x={transparency}
			onMoveChange={(xy) => {
				onTransparencyChange(xy.x);
			}}
		>
			<div className='relative rounded-sm h-10px overflow-hidden'>
				<div
					className='w-full h-full z-20 relative'
					style={{
						background: `linear-gradient(to right, transparent, ${color})`,
					}}
				></div>
				<Marshall size={5} />
			</div>
		</MoveBoxBlock>
	);
}
/** 最终颜色展示 复制 */
function ColorCopy({ opacity, rgb }: { opacity: number; rgb: number[] }) {
	const [r, g, b] = rgb;
	const color = `rgb(${r}, ${g}, ${b})`;
	const [isDown, setIsDown] = useState(false);

	function copy() {
		navigator.clipboard
			.writeText(color)
			.then(() => {
				console.log("复制成功", color);
				setIsDown(true);
			})
			.catch((err) => {
				console.error("复制失败", err);
			});
	}
	// @unocss-include
	const icon = isDown ? "i-mdi:check" : "i-mdi:content-copy";

	return (
		<div
			rounded-full
			relative
			border
			h-30px
			w-30px
			box-content
			overflow-hidden
			hover='*:h-full'
			cursor-pointer
			flex-shrink-0
			onClick={copy}
		>
			<Marshall size={5} />
			<div
				w-full
				h-full
				absolute
				top-0
				left-0
				z-20
				style={{ opacity, backgroundColor: color }}
				onMouseOut={() => setIsDown(false)}
			></div>
			<div
				bg='@dark:#ffffff4a @light:#0000004a'
				flex-center
				w-full
				h-0
				absolute
				left-0
				top-0
				z-30
				overflow-hidden
			>
				<div
					className={`${icon}`}
					w-14px
					h-14px
					text=' @light:white @dark:#282828'
				></div>
			</div>
		</div>
	);
}

/**
 * 黑白格子
 * @param 每个格子的大小
 * @returns
 */
function Marshall({ size }: { size: number }) {
	const divRef = useRef<HTMLDivElement>(null);
	const [len, setLen] = useState({ w: 0, h: 0 });

	useEffect(() => {
		// 获取div 的宽高
		if (divRef.current) {
			const { width, height } = divRef.current!.getBoundingClientRect();
			setLen({ w: width, h: height });
		}
	}, []);
	// 列 先上取整
	const col = Math.ceil(len.w / size);
	// 行 向上取整
	const row = Math.ceil(len.h / size);
	return (
		<div
			ref={divRef}
			className='w-full h-full absolute left-0 top-0 z-10'
		>
			{Array(row)
				.fill(0)
				.map((_, r) => {
					const delivery = r % 2;

					return (
						<div
							key={r}
							className='flex'
							style={{ height: `${size}px` }}
						>
							{Array(col)
								.fill(0)
								.map((_, c) => {
									const _c = ((c % 2) + delivery) % 2;
									return (
										<div
											key={`${r}_${c}`}
											style={{
												width: `${size}px`,
												height: `${size}px`,
												background: `${_c ? "#fff" : "#ccc"}`,
											}}
										></div>
									);
								})}
						</div>
					);
				})}
		</div>
	);
}
