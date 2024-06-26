import { ImageProcessingProvider } from "./ImageProcessingContext";
import ConfigSelect from "./ConfigSelect";
import SelectImage from "./SelectImage";
import ImageList from "./ImageList";

// 图片压缩 修改尺寸 添加水印 base64 图片剪裁 图片旋转 修改分辨率
export default function ImageProcessing() {
	return (
		<ImageProcessingProvider>
			<div className='py-50px px-16px relative max-w-672px wfull hfull overflow-auto select-none'>
				<div className='p-14px pt-0 relative'>
					<ConfigSelect />
					<SelectImage />
					<ImageList />
				</div>
			</div>
		</ImageProcessingProvider>
	);
}
