import { getInRange } from "@/utils";
import { useEffect, useRef, useId, useState } from "react";

interface ProgressBarProps {
	children: React.ReactNode;
	className?: string;
	onMoveChange: (p: { x: number; y: number }) => void;
	/** 盒子宽高 */
	width: number;
	height: number;
	/** 移动块实际距离 */
	x?: number;
	y?: number;
}

/**
 * 盒子中移动块,返回移动块在盒子中的位置 x y
 */
export default function MoveBoxBlock({
	children,
	className,
	onMoveChange,
	width,
	height,
	x,
	y,
}: ProgressBarProps) {
	/** 盒子 */
	const barRef = useRef<HTMLDivElement>(null);
	// 移动块
	const moveBoxRef = useRef<HTMLDivElement>(null);
	const [XY, setXY] = useState<{ x: number; y: number } | null>(null);

	const id = useId();

	function isBarRef(el: HTMLElement) {
		if (el === barRef.current) return true;
		if (el.parentElement === null) return false;

		return isBarRef(el.parentElement);
	}

	function setMoveRun(key: string) {
		if (moveBoxRef.current) {
			moveBoxRef.current.id = key;
		}
	}
	function isMoveRun() {
		if (moveBoxRef.current) {
			return moveBoxRef.current.id === id;
		}
		return false;
	}

	useEffect(() => {
		if (XY) {
			// BUG: 搞不懂 这个函数放在 addEventListener 里面，外面使用 onMoveChange 函数，函数上下文居然获取不到当前上下文的变量
			onMoveChange(XY);
		}
	}, [XY]);

	useEffect(() => {
		const bar = barRef.current;

		function mouse(e: MouseEvent) {
			const { left, width, top, height } = bar?.getBoundingClientRect() || {
				left: 0,
				width: 0,
				top: 0,
				height: 0,
			};
			e.preventDefault();
			e.stopPropagation();
			// 鼠标定位 向左上角偏移了一个像素
			const _clientX = e.clientX + 1;
			const _clientY = e.clientY + 1;

			const { type, target } = e;
			if (type === "mousedown") {
				if (target && isBarRef(target as HTMLElement)) {
					const x = getInRange(_clientX - left, width);
					const y = getInRange(_clientY - top, height);

					setMoveRun(id);
					setXY({ x, y });
				}
				return;
			} else if (type === "mousemove") {
				if (isMoveRun()) {
					const x = getInRange(_clientX - left, width);
					const y = getInRange(_clientY - top, height);
					setXY({ x, y });
				}
			} else if (type === "mouseup") {
				setMoveRun("");
			}
		}

		document.addEventListener("mousedown", mouse);
		document.addEventListener("mousemove", mouse);
		document.addEventListener("mouseup", mouse);

		return () => {
			document.removeEventListener("mousedown", mouse);
			document.removeEventListener("mousemove", mouse);
			document.removeEventListener("mouseup", mouse);
		};
	}, []);

	let cursor = "move"; // 上下左右移动
	if (x !== undefined && y === undefined) {
		cursor = "ew-resize"; // 左右
	} else if (x === undefined && y !== undefined) {
		cursor = "ns-resize"; // 上下
	}

	return (
		<div
			ref={barRef}
			className={`${className ?? ""} relative cursor-crosshair`}
			style={{ height: `${height}px`, width: `${width}px` }}
		>
			<div
				className='h-14px w-14px bg-#edf2f3 rounded-full z-99 shadow border absolute'
				style={{
					left: `${x ?? width / 2}px`,
					top: `${y ?? height / 2}px`,
					cursor: `${cursor}`,
					transform: `translate(-7px, -7px)`,
				}}
				ref={moveBoxRef}
			></div>
			{children}
		</div>
	);
}
