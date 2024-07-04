import { getImgInfo } from "@/utils";
import CuttingArea, { CuttingAreaStyleInfo } from "./CuttingArea";

interface CutImageProps {
	imgInfo: UnwrapPromise<ReturnType<typeof getImgInfo>>;
	onChange: (data: CuttingAreaStyleInfo) => void;
}

/**
 * 图片尺寸适当缩放
 * @param image
 * @param max
 * @returns
 */
function getSize(
	image: HTMLImageElement,
	max: number = 477
): { width: number; height: number } {
	const { width, height } = image;
	const proportion = Math.max(width, height) / Math.min(width, height);

	if (width > height) {
		const _height = Number((max / proportion).toFixed(2));
		return { width: max, height: _height };
	} else {
		const _width = Number((max / proportion).toFixed(2));
		return { width: _width, height: max };
	}
}
export default function CutImage({ imgInfo, onChange }: CutImageProps) {
	const { width, height } = getSize(imgInfo.image);

	return (
		<div className='min-w-600px flex justify-center border border-dashed'>
			<div
				className='relative'
				style={{ width: `${width}px`, height: `${height}px` }}
			>
				<img
					className='w-full h-full z-1'
					src={imgInfo.base64Url}
				/>
				<CuttingArea
					width={width}
					height={height}
					onChange={(data) => onChange(data)}
				/>
			</div>
		</div>
	);
}
