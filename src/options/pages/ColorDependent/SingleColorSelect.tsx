import { useEffect, useState } from "react";
import MoveBoxBlock from "@opt/components/MoveBoxBlock";
import { getColorByXY } from "@/utils/color";

/** 单一颜色选择 */
interface SingleColorSelectProps {
	rgb: number[];
	xy?: { x: number; y: number };
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
	xy,
	onChange,
}: SingleColorSelectProps) {
	const [XY, setXY] = useState({ x: 232, y: 0 });
	const height = 128; // 128
	const width = 232; // 232

	useEffect(() => {
		if (xy) {
			setXY(xy);
		}
	}, [xy]);

	function getColor({ x, y }: { x: number; y: number }) {
		const _rgb = getColorByXY({
			x,
			y,
			w: width,
			h: height,
			rt: { r: rgb[0], g: rgb[1], b: rgb[2] },
		});

		onChange({ rgb: _rgb, xy: { x, y } });
	}

	const [r, g, b] = rgb;
	const color = `rgb(${r}, ${g}, ${b})`;
	return (
		<div className='overflow-hidden'>
			<MoveBoxBlock
				width={width}
				height={height}
				x={XY.x}
				y={XY.y}
				blockType='transparent'
				onMoveChange={(data) => {
					setXY(data);
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
		</div>
	);
}
