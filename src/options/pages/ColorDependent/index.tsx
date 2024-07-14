import { useEffect, useRef, useState } from "react";
import SingleColorSelect from "./SingleColorSelect";
import MoveBoxBlock from "./MoveBoxBlock";
import ColorSelect from "./ColorSelect";
import { bilinearInterpolation } from "@/utils/color";

const WIDTH = 128;

export default function ColorDependent() {
	// 透明度
	const [transparency, setTransparency] = useState(WIDTH);
	const [singleData, setSingleData] = useState([255, 0, 0]);
	const [colorRgb, setColorRgb] = useState([255, 0, 0]);
	const [XY, setXY] = useState({ x: 232, y: 0 });

	function handleColorSelect(data: number[]) {
		const [r, g, b] = data;

		const rgb = bilinearInterpolation({
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
	return (
		<div className="w-full h-full flex-center max-sm:pt-40px'">
			<div className='w-232px shadow rounded overflow-hidden'>
				<SingleColorSelect
					rgb={singleData}
					onChange={singleColorSelect}
				/>
				<div className='p-14px flex-center gap-x-3'>
					<div className='i-mdi:colorize w-18px h-18px cursor-pointer'></div>
					<ColorCopy
						opacity={transparency / WIDTH}
						rgb={colorRgb}
					/>
					<div className='relative'>
						<ColorSelect onColorChange={handleColorSelect} />
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
	return (
		<div className='rounded-full relative border h-30px w-30px box-content overflow-hidden *:hover:h-full cursor-pointer'>
			<Marshall size={5} />
			<div
				className='w-full h-full absolute top-0 left-0 z-20'
				style={{ opacity, backgroundColor: color }}
			></div>
			<div className=' bg-#0000004a flex-center w-full h-0 absolute left-0 top-0 z-30 overflow-hidden'>
				<div className='i-mdi:content-copy w-20px h-20px text-white'></div>
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
