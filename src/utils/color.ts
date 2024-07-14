export function hexToRgba(hex: string) {
	// 去掉 '#' 符号
	hex = hex.replace(/^#/, "");

	// 处理四位十六进制颜色代码（如 #fafa）
	if (hex.length <= 4) {
		hex = hex
			.split("")
			.map((char) => char + char)
			.join("");
	}

	// 提取 R、G、B、A 值
	const bigint = parseInt(hex, 16);
	const r = (bigint >> 24) & 255;
	const g = (bigint >> 16) & 255;
	const b = (bigint >> 8) & 255;
	const a = (bigint & 255) / 255; // 归一化 Alpha 值

	return { r, g, b, a };
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
export function bilinearInterpolation(data: BilinearInterpolationProps) {
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

interface GradientProps {
	/** 开始颜色 */
	startColor: number[];
	/** 结束颜色 */
	endColor: number[];
	/** 要获取的颜色位置 */
	point: number;
	/** 盒子宽高 */
	width: number;
}
/** 左右颜色渐变 获取某一点的颜色值 */

export function getGradientByPoint({
	startColor,
	endColor,
	point,
	width,
}: GradientProps) {
	const factor = point / width;
	const result = [...startColor];
	for (let i = 0; i < 3; i++) {
		const value = Math.round(
			result[i] + factor * (endColor[i] - startColor[i])
		);
		result[i] = Math.abs(value);
	}
	return result;
}
