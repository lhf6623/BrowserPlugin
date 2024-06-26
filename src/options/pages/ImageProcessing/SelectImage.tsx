import { ChangeEvent, useEffect, useRef, useState } from "react";
import { useImageList } from "./ImageProcessingContext";
import { v4 as uuidv4 } from "uuid";

/** 选择图片 */
export default function SelectImage() {
	const [isDrag, setIsDrag] = useState(false);
	const fileRef = useRef<HTMLInputElement | null>(null);
	const dragRef = useRef<HTMLDivElement | null>(null);
	const { imageListDispatch } = useImageList();

	async function handleFileChange(e: ChangeEvent<HTMLInputElement>) {
		const files = e.target.files;
		if (files) {
			imageListDispatch({
				type: "add",
				payload: Array.from(files).map((item) => {
					return {
						file: item,
						id: uuidv4(),
					};
				}),
			});
		}
	}

	function handleOpenFileInput() {
		fileRef.current!.value = "";
		fileRef.current?.click();
	}

	function isCurr(el: EventTarget | null) {
		if (!el || el === document.body) return false;

		if (el === dragRef.current) return true;

		const _el = el as HTMLElement;
		return isCurr(_el.parentElement);
	}

	function handleDrag(e: DragEvent) {
		if (isCurr(e.target as HTMLElement)) {
			e.preventDefault();
			e.stopPropagation();

			setIsDrag(false);
			const files = e.dataTransfer?.files;
			if (files) {
				imageListDispatch({
					type: "add",
					payload: Array.from(files).map((item) => {
						return {
							file: item,
							id: uuidv4(),
						};
					}),
				});
			}
		}
	}
	function handleDragOver(e: DragEvent) {
		const _isCurr = isCurr(e.target);
		if (_isCurr) {
			e.preventDefault();
			e.stopPropagation();

			setIsDrag(_isCurr);
		} else {
			setIsDrag(false);
		}
	}

	useEffect(() => {
		dragRef.current!.addEventListener("drop", handleDrag);
		document.addEventListener("dragover", handleDragOver);
		return () => {
			if (dragRef.current) {
				dragRef.current!.removeEventListener("drop", handleDrag);
			}
			document.removeEventListener("dragover", handleDragOver);
		};
	}, []);

	// @unocss-include
	const style = isDrag ? "border-sllid" : "border-dashed";

	return (
		<>
			<div
				onClick={handleOpenFileInput}
				ref={dragRef}
				className={`w-full my-1 cursor-pointer border-#616778 text-#40444f text-center py-2 flex items-center flex-col border border-2px ${style}`}
			>
				<i className='i-lucide:image-plus w-64px h-64px text-#777'></i>
				<span className='text-12px op-70'>
					<span className='!text-blue'>点击选择图片</span>
					或者将图片拖放到这里！
				</span>
			</div>

			<input
				ref={fileRef}
				type='file'
				accept='image/*'
				multiple
				onChange={handleFileChange}
				className='hidden w-0 h-0 op-0'
			/>
		</>
	);
}
