import { useRef, useState } from "react";
import MoveBoxBlock from "./MoveBoxBlock";
import { getGradientByPoint } from "@/utils/color";
import { getInRange } from "@/utils";

interface ColorSelectProps {
	onColorChange: (p: number[]) => void;
}
/** 颜色选择 彩虹条颜色选择 */
export default function ColorSelect({ onColorChange }: ColorSelectProps) {
	const [x, setX] = useState(0);
	const progressRef = useRef<HTMLDivElement>(null);
	const height = 10; // 128
	const width = 128; // 232

	const colors = [
		{ position: 0, color: [255, 0, 0] }, // red
		{ position: 17, color: [255, 0, 255] }, // magenta
		{ position: 33, color: [0, 0, 255] }, // blue
		{ position: 50, color: [0, 255, 255] }, // cyan
		{ position: 66, color: [0, 255, 0] }, // lime
		{ position: 83, color: [255, 255, 0] }, // yellow
		{ position: 100, color: [255, 0, 0] }, // red
	];

	function getRGB(x: number) {
		const _left = (x / width) * 100;

		let lt_rt_color = [];
		// 	获取区间段
		for (let i = 0; i < colors.length - 1; i++) {
			const x0 = colors[i].position;
			const x1 = colors[i + 1].position;

			const isInRange = getInRange(_left, x0, x1);
			if (isInRange === _left) {
				lt_rt_color.push(colors[i]);
				lt_rt_color.push(colors[i + 1]);
			}
		}

		const [c_1, c_2] = lt_rt_color;

		const _width = ((c_2.position - c_1.position) / 100) * width;
		const _x = x - (c_1.position / 100) * width;

		const rgb = getGradientByPoint({
			startColor: c_1.color,
			endColor: c_2.color,
			point: _x,
			width: _width,
		});
		console.log(rgb);

		return rgb;
	}

	function handleChange(xy: { x: number; y: number }) {
		setX(xy.x);
		const rgb = getRGB(xy.x);
		onColorChange(rgb);
	}

	const backgroundImage = colors.reduce((pre, { position, color }, index) => {
		// linear-gradient(to left, red 0%, #ff0 17%, lime 33%, cyan 50%, blue 66%, #f0f 83%, red 100%)
		const [r, g, b] = color;
		const isLast = colors.length - 1 === index;
		return `${pre} rgb(${r}, ${g}, ${b}) ${position}%${isLast ? "" : ","}`;
	}, "");

	return (
		<MoveBoxBlock
			className='cursor-pointer'
			width={width}
			height={height}
			x={x}
			onMoveChange={handleChange}
		>
			<div
				ref={progressRef}
				className='rounded-sm overflow-hidden w-full h-full'
				style={{
					backgroundImage: `linear-gradient(to right, ${backgroundImage})`,
				}}
			></div>
		</MoveBoxBlock>
	);
}
