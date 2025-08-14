import { useRef, useState } from "react";
import SelectImage from "@opt/components/SelectImage";
import { changeImgSize, getSizeText, downloadImage } from "@/utils";
import CopyButton from "@opt/components/CopyButton";

type ImgInfo = {
  width: number;
  height: number;
  type: string;
  size: number;
  name: string;
  src: string | undefined;
};

export default function Base64ToImg() {
  const imgRef = useRef<HTMLImageElement>(null);
  const [base64, setBase64] = useState("");
  const [errorStr, setErrorStr] = useState<string>("");
  const [imgInfo, setImgInfo] = useState<ImgInfo>({
    width: 0,
    height: 0,
    type: "",
    size: 0,
    name: "",
    src: undefined,
  });
  function getImageType(dataUrl: string) {
    const match = dataUrl.match(/^data:(image\/\w+);base64/);
    return match ? match[1] : "image/png";
  }
  function imgToBlob(img: HTMLImageElement, type: string) {
    const canvas = document.createElement("canvas");
    canvas.width = img.width;
    canvas.height = img.height;
    const ctx = canvas.getContext("2d");
    ctx!.drawImage(img, 0, 0, img.width, img.height);
    return new Promise<Blob>((resolve) => {
      canvas.toBlob(
        (blob) => {
          resolve(blob!);
        },
        type,
        1
      );
    });
  }

  function handleBaseToImg() {
    if (!base64) return;
    setErrorStr("");

    if (imgInfo.src) {
      URL.revokeObjectURL(imgInfo.src);
    }

    const img = new Image();
    img.src = base64;
    img.onload = async () => {
      // 匹配图片类型 data:image/png;base64, => image/png
      const type = getImageType(base64);
      // 图片转 Blob
      const blob = await imgToBlob(img, type);

      const src = URL.createObjectURL(blob);

      setImgInfo({
        width: img.width,
        height: img.height,
        type,
        size: base64.length,
        name: "base64.png",
        src,
      });
    };
    img.onerror = function () {
      setErrorStr("图片加载失败");
    };
  }
  // 图片转base64
  async function getBase64() {
    if (imgRef.current && imgInfo.src) {
      // 获取图片实例
      const base64 = await changeImgSize(imgRef.current, imgInfo.width, imgInfo.height, imgInfo.type);
      setBase64(base64);
      setErrorStr("");
    }
  }
  // 获取图片
  function handleChangeFile(files: { file: File; id: string }[]) {
    if (!files.length) return;

    const { name, type, size } = files[0].file;
    const src = URL.createObjectURL(files[0].file);

    const img = new Image();
    img.src = src;
    img.onload = () => {
      setImgInfo({
        width: img.width,
        height: img.height,
        type,
        size,
        name,
        src,
      });
    };
  }
  // 清空图片信息
  function clearImgInfo() {
    // 释放图片内存
    if (imgInfo?.src) {
      URL.revokeObjectURL(imgInfo?.src);
    }

    setImgInfo({
      width: 0,
      height: 0,
      type: "",
      size: 0,
      name: "",
      src: undefined,
    });
  }

  return (
    <div className='py-50px px-16px relative max-w-672px w-full h-full overflow-auto bg-base-100 border-base-300 text-base-content'>
      <h1 className='text-center text-2xl mb-30px'>支持图片或Base64互相转换</h1>
      <div className='mb-16px b-b b-dashed b-b-2px b-base-content/30 pb-6px'>
        <div className='flex justify-between mb-6px items-center'>
          <p>base64 输入</p>
          <div>
            <button
              title='base64 转图片'
              onClick={handleBaseToImg}
              type='button'
              className='btn btn-outline btn-info btn-sm'
            >
              base64 转图片
            </button>
            {base64 && (
              <button
                title='清空 base64'
                className='btn btn-outline btn-info btn-sm ml-6px'
                type='button'
                onClick={() => setBase64("")}
              >
                清空
              </button>
            )}
            {base64 && (
              <CopyButton
                title='复制 Base64'
                text={base64}
                className='btn btn-outline btn-info btn-sm ml-6px'
              ></CopyButton>
            )}
          </div>
        </div>
        {errorStr && <p className='text-red-500'>{errorStr}</p>}
        <textarea
          resize='none'
          value={base64}
          onChange={(e) => setBase64(e.target.value)}
          cols={10}
          rows={6}
          placeholder='请输入base64'
          className='textarea textarea-bordered wfull p6px b b-base'
        ></textarea>
      </div>
      <div>
        <div className='flex justify-between mb-6px items-center'>
          <p>图片选择</p>
          <div>
            <button title='图片转 base64' className='btn btn-outline btn-info btn-sm' type='button' onClick={getBase64}>
              图片转 base64
            </button>
            {imgInfo.src && (
              <button
                title='清空图片'
                className='btn btn-outline btn-info btn-sm ml-6px'
                type='button'
                onClick={clearImgInfo}
              >
                清空图片
              </button>
            )}
            {imgInfo.src && (
              <button
                title='下载图片'
                className='btn btn-outline btn-info btn-sm ml-6px'
                type='button'
                onClick={() => {
                  imgInfo.src && downloadImage(imgInfo.src, imgInfo.name);
                }}
              >
                下载
              </button>
            )}
          </div>
        </div>
        {imgInfo.src && (
          <div>
            <span className='mr-16px'>{imgInfo.name}</span>
            <span className='mr-16px'>
              {imgInfo.width}×{imgInfo.height}
            </span>
            <span className='mr-16px'>{getSizeText(imgInfo.size)}</span>
          </div>
        )}
        {!imgInfo.src && <SelectImage onChange={handleChangeFile} multiple={false}></SelectImage>}
        {imgInfo.src && (
          <div className='b b-base flex justify-center p-6px'>
            <img ref={imgRef} src={imgInfo.src} />
          </div>
        )}
      </div>
    </div>
  );
}
