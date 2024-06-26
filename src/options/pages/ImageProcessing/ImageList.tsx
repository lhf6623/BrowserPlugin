import { useEffect, useState } from "react";
import { useImageList, useConfig } from "./ImageProcessingContext";
import Notify from "simple-notify";
import {
	getSizeText,
	compressImage,
	downloadImage,
	CompressImageType,
} from "@/utils";

export default function ImageList() {
	const { imageList } = useImageList();
	return (
		<ul>
			{imageList.map((item) => {
				return <Task file={item.file} key={item.id} />;
			})}
		</ul>
	);
}

function Task({ file }: { file: File }) {
	const { config } = useConfig();
	const [load, setLoad] = useState(0);
	const [showImg, setShowImg] = useState(false);
	const [imgData, setImgData] = useState<CompressImageType | null>(null);

	function getImageName() {
		const { type } = config;
		let suffix = type.split("/")[1];
		if (type === "original") {
			suffix = file.name.split(".").pop() || file.type.split("/")[1];
		}

		const name_arr = file.name.split(".");
		name_arr.pop();
		const name = [...name_arr, suffix].join(".");
		return name;
	}
	function _compressImage() {
		let _type = config.type as string;
		if (_type === "original") {
			_type = file.type;
		}
		setLoad(0);
		setShowImg(false);
		compressImage(file, _type, config.quality, (n) => {
			setLoad(n);
		}).then((res) => {
			setImgData(res);
		});
	}
	function copyBase64(text: string) {
		navigator.clipboard.writeText(text).then(() => {
			new Notify({
				text: "复制成功",
				autotimeout: 1000,
				showCloseButton: false,
			});
		});
	}
	useEffect(() => {
		if (file) {
			_compressImage();
		}
	}, [file]);

	useEffect(() => {
		if (file) {
			_compressImage();
		}
	}, [config]);

	const compressionAmount = (
		((file.size - Number(imgData?.newValue.imgFile.size || 0)) / file.size) *
		100
	).toFixed(2);

	const name = getImageName();
	return (
		<li className=' bg-#f0f0f0 border px-2 py1px mt-2'>
			<div className='flex justify-between items-center'>
				<span>{file.name}</span>
				<div className='flex'>
					<span className='mr-4'>{getSizeText(file.size)}</span>
					<div className='relative flex-center'>
						<progress
							className='w-150px h-20px rounded-xl'
							max='100'
							value={load}
						>
							{load}%
						</progress>
						<div className='flex-center w-full h-full absolute top-0 left-0 text-white'>
							{load === 100 && (
								<span className='text-12px'>已压缩 {compressionAmount}%</span>
							)}
						</div>
					</div>
					<span className='ml-4'>
						{getSizeText(imgData?.newValue.imgFile.size || 0)}
					</span>
				</div>
			</div>
			<div className='flex justify-between items-center border-t mt-1'>
				<p className='flex items-center gap-x-2'>
					<button
						className='i-tabler:image-in-picture'
						title='复制 base64 地址'
						onClick={() => copyBase64(imgData!.oldValue.base64Url)}
					></button>
				</p>
				<p className='flex items-center gap-x-2'>
					<button
						className='i-tabler:image-in-picture'
						title='复制压缩后的 base64'
						onClick={() => copyBase64(imgData!.newValue.base64Url)}
					></button>
					<button
						className='i-material-symbols:eye-tracking-rounded'
						title='预览压缩后的图片'
						onClick={() => {
							setShowImg(!showImg);
						}}
					></button>
					<button
						className='i-solar:gallery-download-outline'
						title='下载压缩后的图片'
						onClick={() => downloadImage(imgData!.newValue.base64Url, name)}
					></button>
				</p>
			</div>
			{showImg && (
				<img
					className='my-2'
					height={`${imgData?.oldValue.image.height}px`}
					width={`${imgData?.oldValue.image.width}px`}
					src={imgData?.newValue.base64Url}
					alt=''
				/>
			)}
		</li>
	);
}
