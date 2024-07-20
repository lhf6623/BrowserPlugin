import { getInRange } from ".";

function abs(a: number, b: number) {
	return Math.max(a, b) - Math.min(a, b);
}
/** 左往右渐变 position 百分比，color 颜色 */
export const colors = [
	{ position: 0, color: [255, 0, 0] }, // red 红
	{ position: 17, color: [255, 0, 255] }, // magenta 洋红
	{ position: 33, color: [0, 0, 255] }, // blue 蓝
	{ position: 50, color: [0, 255, 255] }, // cyan 青色
	{ position: 66, color: [0, 255, 0] }, // lime 很像绿色
	{ position: 83, color: [255, 255, 0] }, // yellow 黄
	{ position: 100, color: [255, 0, 0] }, // red 红
];

/** 根据 当前位置x 获取开始颜色和结束颜色之间的渐变色 */
function startAndEndGradientColor({
	s_color,
	e_color,
	w,
	x,
}: {
	s_color: number[];
	e_color: number[];
	w: number;
	x: number;
}) {
	const factor = Math.round((x / w) * 100) / 100;
	return s_color.map((_, i) => {
		const value = Math.round(s_color[i] + factor * (e_color[i] - s_color[i]));
		return Math.abs(value);
	});
}

/** 根据当前位置获取 colors 渐变颜色 */
export function getColorByPosition(
	position: number,
	w?: number,
	c?: {
		position: number;
		color: number[];
	}[]
) {
	const width = w ?? 232;
	const x = position;
	const gradientColor = c ?? colors;

	if (width < x) {
		console.error(
			"getColorAtPosition position 大于 w， 需要传入第二个参数宽度"
		);
	}

	const _left = (x / width) * 100;

	let lt_rt_color = [];
	// 	获取区间段
	for (let i = 0; i < gradientColor.length - 1; i++) {
		const x0 = gradientColor[i].position;
		const x1 = gradientColor[i + 1].position;

		const isInRange = getInRange(_left, x0, x1);
		if (isInRange === _left) {
			lt_rt_color.push(gradientColor[i]);
			lt_rt_color.push(gradientColor[i + 1]);
		}
	}

	const [c_1, c_2] = lt_rt_color;

	const _width = ((c_2.position - c_1.position) / 100) * width;
	const _x = x - (c_1.position / 100) * width;

	return startAndEndGradientColor({
		s_color: c_1.color,
		e_color: c_2.color,
		w: _width,
		x: _x,
	});
}

export function hexToRgb(hex: string): number[] {
	// 去掉 '#' 符号
	hex = hex.replace(/#/g, "");

	let r = "0",
		g = "0",
		b = "0";
	if ((hex.length === 3, hex.length === 4)) {
		r = hex[0].padStart(2, "0");
		g = hex[1].padStart(2, "0");
		b = hex[2].padStart(2, "0");
	} else if (hex.length === 6) {
		r = hex.slice(0, 2);
		g = hex.slice(2, 4);
		b = hex.slice(4, 6);
	}
	return [parseInt(r, 16), parseInt(g, 16), parseInt(b, 16)];
}

interface ColorGRB {
	r: number;
	g: number;
	b: number;
}

interface BilinearInterpolationProps {
	/** 鼠标坐标 x 轴 */
	x: number;
	/** 鼠标坐标 y 轴 */
	y: number;
	/** 盒子宽高 */
	w: number;
	/** 盒子宽高 */
	h: number;
	/** 左上角颜色 */
	lt?: ColorGRB;
	/** 右上角颜色 */
	rt?: ColorGRB;
	/** 左下角颜色 */
	lb?: ColorGRB;
	/** 右下角颜色 */
	rb?: ColorGRB;
}
/**
 * 双线性插值（Bilinear Interpolation）
 * 四角颜色渐变 利用x y 坐标获取某一点的颜色值
 */
export function getColorByXY(data: BilinearInterpolationProps) {
	const { x, y, w, h, lt, rt, lb, rb } = data;
	// 定义角点颜色
	const C00 = lt ?? { r: 255, g: 255, b: 255 }; // 左上角 (0, 0)
	const C10 = rt ?? { r: 255, g: 0, b: 0 }; // 右上角 (w, 0)
	const C01 = lb ?? { r: 0, g: 0, b: 0 }; // 左下角 (0, h)
	const C11 = rb ?? { r: 0, g: 0, b: 0 }; // 右下角 (w, h)

	// 计算位置比例
	const xRatio = x / w;
	const yRatio = y / h;

	// 插值计算
	const r =
		(1 - xRatio) * (1 - yRatio) * C00.r +
		xRatio * (1 - yRatio) * C10.r +
		(1 - xRatio) * yRatio * C01.r +
		xRatio * yRatio * C11.r;

	const g =
		(1 - xRatio) * (1 - yRatio) * C00.g +
		xRatio * (1 - yRatio) * C10.g +
		(1 - xRatio) * yRatio * C01.g +
		xRatio * yRatio * C11.g;

	const b =
		(1 - xRatio) * (1 - yRatio) * C00.b +
		xRatio * (1 - yRatio) * C10.b +
		(1 - xRatio) * yRatio * C01.b +
		xRatio * yRatio * C11.b;

	// 返回插值颜色
	return [Math.round(r), Math.round(g), Math.round(b)];
}

/**
 * 根据目标颜色去色谱中寻找右上角颜色和XY
 * @param targetColor 目标颜色
 * @returns
 */
export function getXYByColor(targetColor: ColorGRB, threshold: number = 1) {
	// 16 进制最高为 255 parseInt('ff', 16) === 255
	const boxWidth = 255;
	const boxHeight = 255;

	type ColorPosition = ColorGRB & { x: number; y: number };

	// 颜色插值函数
	function interpolateColor(c1: ColorGRB, c2: ColorGRB, t: number) {
		return {
			r: c1.r + (c2.r - c1.r) * t,
			g: c1.g + (c2.g - c1.g) * t,
			b: c1.b + (c2.b - c1.b) * t,
		};
	}

	// 双线性插值函数
	function bilinearInterpolation(
		x: number,
		y: number,
		tl: ColorPosition,
		tr: ColorPosition,
		bl: ColorPosition,
		br: ColorPosition
	) {
		const tx = x / boxWidth;
		const ty = y / boxHeight;

		const top = interpolateColor(tl, tr, tx);
		const bottom = interpolateColor(bl, br, tx);

		return interpolateColor(top, bottom, ty);
	}

	// 定义四个角的颜色值和对应的坐标
	function quadrangleColor(data?: {
		tl?: ColorGRB;
		tr?: ColorGRB;
		bl?: ColorGRB;
		br?: ColorGRB;
	}) {
		const { tl, tr, bl, br } = data || {};
		const _tlColor = tl ?? { r: 255, g: 255, b: 255 };
		const _trColor = tr ?? { r: 255, g: 0, b: 0 };
		const _blColor = bl ?? { r: 0, g: 0, b: 0 };
		const _brColor = br ?? { r: 0, g: 0, b: 0 };
		return {
			tl: (tl ?? { ..._tlColor, x: 0, y: 0 }) as ColorPosition,
			tr: (tr ?? { ..._trColor, x: boxWidth, y: 0 }) as ColorPosition,
			bl: (bl ?? { ..._blColor, x: 0, y: boxHeight }) as ColorPosition,
			br: (br ?? { ..._brColor, x: boxWidth, y: boxHeight }) as ColorPosition,
		};
	}

	function _run(trColor: ColorGRB) {
		const { tl, tr, bl, br } = quadrangleColor({ tr: trColor });
		const { r, g, b } = targetColor;
		// 计算 (x, y) 坐标
		function findCoordinates(
			tl: ColorPosition,
			tr: ColorPosition,
			bl: ColorPosition,
			br: ColorPosition
		) {
			for (let y = 0; y <= boxHeight; y++) {
				for (let x = 0; x <= boxWidth; x++) {
					const color = bilinearInterpolation(x, y, tl, tr, bl, br);
					const _r = abs(color.r, r);
					const _g = abs(color.g, g);
					const _b = abs(color.b, b);

					if (_r <= threshold && _g <= threshold && _b <= threshold) {
						return { x, y, threshold };
					}
				}
			}
			return null;
		}

		return findCoordinates(tl, tr, bl, br);
	}

	let _rgb = null;
	let _threshold = Infinity;
	let _tr = null;

	for (let i = 1; i <= 255; i++) {
		const [r, g, b] = getColorByPosition(i, 255);
		const data = _run({ r, g, b });

		if (data) {
			const { x, y, threshold } = data;

			if (threshold && threshold < _threshold) {
				_rgb = [r, g, b];
				_threshold = threshold;
				_tr = { x, y };
			}
		}
	}

	if (_rgb === null) {
		return getXYByColor(targetColor, threshold + 1);
	}

	return {
		rgb: _rgb,
		xy: _tr,
	};
}

export function getColorSelectXY(targetColor: ColorGRB, threshold: number = 1) {
	let _x = null;

	for (let x = 1; x <= 255; x++) {
		const [r, g, b] = getColorByPosition(x, 255);
		const _r = abs(targetColor.r, r);
		const _g = abs(targetColor.g, g);
		const _b = abs(targetColor.b, b);

		if (_r <= threshold && _g <= threshold && _b <= threshold) {
			_x = Math.round(x);
		}
	}
	if (_x === null) {
		return getColorSelectXY(targetColor, threshold + 1);
	}
	return _x;
}
