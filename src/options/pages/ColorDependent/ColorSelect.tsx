import { useEffect, useRef, useState } from "react";
import MoveBoxBlock from "@opt/components/MoveBoxBlock";
import { getColorByPosition, colors } from "@/utils/color";

interface ColorSelectProps {
	x?: number;
	onColorChange: (p: number[]) => void;
}
/** 颜色选择 彩虹条颜色选择 */
export default function ColorSelect({ onColorChange, x }: ColorSelectProps) {
	const [position, setPosition] = useState(0);
	const progressRef = useRef<HTMLDivElement>(null);
	const height = 10; // 128
	const width = 128; // 232

	useEffect(() => {
		if (x !== undefined) {
			setPosition(x);
		}
	}, [x]);

	function handleChange(xy: { x: number; y: number }) {
		setPosition(xy.x);
		const rgb = getColorByPosition(xy.x, width);
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
			x={position}
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
