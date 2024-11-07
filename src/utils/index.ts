import { name, version } from "../../package.json";

// 定义变量

/**
 * 根据版本改变的 key
 * @param prefix 前缀
 * @returns {String}
 */
export const getKeyByVersion = (prefix?: string): string => {
  const _prefix = prefix ? `${prefix}-` : "";
  return `${_prefix}${name}_${version}`;
};

/**
 * 获取字节数 B KB MB GB
 */
export function getSizeText(fileSize: number) {
  const size = fileSize;
  if (size < 1024) {
    return `${size}B`;
  } else if (size < 1024 * 1024) {
    return `${(size / 1024).toFixed(2)}KB`;
  } else if (size < 1024 * 1024 * 1024) {
    return `${(size / (1024 * 1024)).toFixed(2)}MB`;
  } else {
    return `${(size / (1024 * 1024 * 1024)).toFixed(2)}GB`;
  }
}

export function getImgInfo(file: File | Blob): Promise<ImageFileInfo> {
  return new Promise((resolve) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      const base64Url = e.target?.result as string;
      if (base64Url) {
        const image = new Image();
        image.src = base64Url;

        image.onload = () => {
          resolve({
            imgFile: file,
            base64Url,
            image,
          });
        };
      }
    };

    reader.readAsDataURL(file);
  });
}
export const compressImage = (
  file: File,
  type: string = "image/png",
  quality: number = 0.8,
  onProgress?: (n: number) => void,
) => {
  return new Promise<CompressImageType>(async (resolve) => {
    onProgress?.(5);
    const oldImageData = await getImgInfo(file);

    onProgress?.(50);
    const { width, height } = oldImageData.image;

    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;

    const ctx = canvas.getContext("2d");
    ctx!.drawImage(oldImageData.image, 0, 0, width, height);
    onProgress?.(70);
    // 100 进度
    canvas.toBlob(
      async (blob) => {
        onProgress?.(80);
        if (blob) {
          const newImageData = await getImgInfo(blob);
          onProgress?.(100);

          resolve({
            oldValue: oldImageData,
            newValue: newImageData,
          });
        }
      },
      type,
      quality,
    );
  });
};

export function downloadImage(imageUrl: string, fileName: string) {
  // 创建隐藏的可下载链接
  var element = document.createElement("a");
  element.setAttribute("href", imageUrl);
  element.setAttribute("download", fileName);

  // 触发点击
  document.body.appendChild(element);
  element.click();

  // 然后移除
  document.body.removeChild(element);
}
/**
 * 获取在指定范围内的值
 * @param n 要校验的值
 * @param start 最小值
 * @param end	最大值
 * @returns
 */
export function getInRange(n: number, start = 0, end?: number) {
  if (end === undefined) {
    end = start;
    start = 0;
  }

  if (n < start) return start;
  if (n > end) return end;
  return n;
}
