import SelectImage from "@opt/components/SelectImage";
import { getImgInfo, downloadImage } from "@/utils";
import { useState } from "react";
import CutImage from "./CutImage";
import Image from "@opt/components/Image";

export default function CutOut() {
  const [url, setUrl] = useState("");
  const [imageInfo, setImageInfo] = useState<ImgInfo | null>(null);
  const [cutData, setCutData] = useState<CuttingAreaStyleInfo>({
    w: 0,
    h: 0,
    bb: 0,
    bl: 0,
    br: 0,
    bt: 0,
  });

  async function handleChangeFile(list: { file: File; id: string }[]) {
    const imageInfo = await getImgInfo(list[0].file);
    setImageInfo(imageInfo);
    setUrl("");
  }

  /** 剪裁图片 */
  function getImgUrl() {
    if (!imageInfo) return;
    const { width } = imageInfo.image;

    const ratio = (width ?? 1) / cutData.w;

    const canvas = document.createElement("canvas");
    canvas.width = Number(((cutData.w - cutData.bl - cutData.br) * ratio).toFixed(0));
    canvas.height = Number(((cutData.h - cutData.bt - cutData.bb) * ratio).toFixed(0));

    const ctx = canvas.getContext("2d");
    ctx!.drawImage(
      imageInfo.image,
      cutData.bl * ratio,
      cutData.bt * ratio,
      canvas.width,
      canvas.height,
      0,
      0,
      canvas.width,
      canvas.height
    );

    const url = canvas.toDataURL(imageInfo.imgFile.type, 1);
    setUrl(url);
  }
  const ratio = (imageInfo?.image.width ?? 1) / cutData.w || 1;
  const w = ((cutData.w - cutData.bl - cutData.br) * ratio || 0).toFixed(0);
  const h = ((cutData.h - cutData.bt - cutData.bb) * ratio || 0).toFixed(0);
  return (
    <div className='w-600px box-content relative p-4'>
      {!imageInfo ? (
        <SelectImage onChange={handleChangeFile} multiple={false} />
      ) : (
        <div className='w-full bg-base-100 border-base-300 text-base-content relative py-4'>
          <CutImage imgInfo={imageInfo} onChange={(data) => setCutData(data)} />
          <p className='text-center text-13px mt-4'>
            原图像素：{`${imageInfo.image.width}*${imageInfo.image.height}`}
            &nbsp;&nbsp; 目标像素：
            <span className='text-blue'>{`${w}*${h} `}</span>
            &nbsp;&nbsp;为方便操作，已进行缩小展示
          </p>
          <div className='flex gap-2 justify-center my-4'>
            <button
              title='重新选择'
              className='btn btn-outline btn-info btn-sm'
              onClick={() => {
                setImageInfo(null);
              }}
              type='button'
            >
              重新选择
            </button>
            <button onClick={getImgUrl} type='button' title='立即剪裁' className='btn btn-outline btn-info btn-sm'>
              立即剪裁
            </button>
          </div>
          {url && (
            <div className='w-full pb-100px'>
              <p className='text-right mb-1'>
                <button
                  title='下载剪裁后的图片'
                  type='button'
                  onClick={() => {
                    downloadImage(url, (imageInfo.imgFile as File).name);
                  }}
                  className='btn btn-info btn-sm'
                >
                  下载
                </button>
              </p>
              <Image src={url} />
            </div>
          )}
        </div>
      )}
    </div>
  );
}
