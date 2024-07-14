import { useState } from "react";
import MoveBoxBlock from "./MoveBoxBlock";
import { bilinearInterpolation } from "@/utils/color";

/** 单一颜色选择 */
interface SingleColorSelectProps {
	rgb: number[];
	onChange: ({
		rgb,
		xy,
	}: {
		rgb: number[];
		xy: { x: number; y: number };
	}) => void;
}

export default function SingleColorSelect({
	rgb,
	onChange,
}: SingleColorSelectProps) {
	const [xy, setXy] = useState({ x: 232, y: 0 });
	const height = 128; // 128
	const width = 232; // 232

	function getColor({ x, y }: { x: number; y: number }) {
		const rgb = bilinearInterpolation({ x, y, w: width, h: height });

		onChange({ rgb, xy: { x, y } });
	}

	const [r, g, b] = rgb;
	const color = `rgb(${r}, ${g}, ${b})`;
	return (
		<MoveBoxBlock
			width={width}
			height={height}
			x={xy.x}
			y={xy.y}
			onMoveChange={(data) => {
				setXy(data);
				getColor(data);
			}}
		>
			<div
				className='w-full h-full'
				style={{
					background: `linear-gradient(to right, white, ${color}), 
  										 linear-gradient(to bottom, transparent, black)`,
					backgroundBlendMode: "multiply",
				}}
			></div>
		</MoveBoxBlock>
	);
}
