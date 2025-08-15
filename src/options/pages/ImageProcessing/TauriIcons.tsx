import SelectImage from "@opt/components/SelectImage";
import { changeImgSize, downloadImage, getImgInfo } from "@/utils";
import { useState } from "react";
import { useTranslation } from "react-i18next";

export default function TauriIcons() {
  const { t } = useTranslation();
  const [imageInfo, setImageInfo] = useState<ImgInfo | null>(null);
  async function handleChangeFile(list: { file: File; id: string }[]) {
    const imageInfo = await getImgInfo(list[0].file);
    setImageInfo(imageInfo);
  }
  function reset() {
    setImageInfo(null);
  }
  const imgList = [
    // {
    //   width: 256,
    //   height: 256,
    //   name: "icon",
    //   type: "ico",
    // },
    {
      width: 32,
      height: 32,
      name: "32x32",
    },
    {
      width: 128,
      height: 128,
      name: "128x128",
    },
    {
      width: 256,
      height: 256,
      name: "128x128@2x",
    },
    {
      width: 512,
      height: 512,
      name: "icon",
    },
    {
      width: 30,
      height: 30,
      name: "Square30x30Logo",
    },
    {
      width: 44,
      height: 44,
      name: "Square44x44Logo",
    },
    {
      width: 71,
      height: 71,
      name: "Square71x71Logo",
    },
    {
      width: 89,
      height: 89,
      name: "Square89x89Logo",
    },
    {
      width: 107,
      height: 107,
      name: "Square107x107Logo",
    },
    {
      width: 142,
      height: 142,
      name: "Square142x142Logo",
    },
    {
      width: 150,
      height: 150,
      name: "Square150x150Logo",
    },
    {
      width: 284,
      height: 284,
      name: "Square284x284Logo",
    },
    {
      width: 310,
      height: 310,
      name: "Square310x310Logo",
    },
    {
      width: 50,
      height: 50,
      name: "StoreLogo",
    },
  ];

  function downloadImg(i: number) {
    const item = imgList[i];
    if (!item) return;
    const dataURL = changeImgSize(imageInfo!.image, item.width, item.height);
    downloadImage(dataURL, `${item.name}.png`);

    // 浏览器下载数量限制
    setTimeout(() => {
      downloadImg(i + 1);
    }, 1000);
  }

  return (
    <div className='w-600px relative p-4 bg-base-100 border-base-300 text-base-content'>
      <div role='alert' className=' p-2 alert alert-warning b-dashed bg-transparent text-#fcb700 b-#fcb700'>
        <span>
          {t("TauriIcons.selectImage", { width: 512, height: 512 })}&nbsp;
          <a target='_blank' className='link link-info' href='http://www.ico51.cn/'>
            ico
          </a>{" "}
          {t("TauriIcons.icoFormatNotSupported", { ico: "" })}
        </span>
      </div>
      {!imageInfo && <SelectImage accept='image/png' onChange={handleChangeFile} multiple={false} />}
      {imageInfo &&
        imgList.map((item, i) => {
          return (
            <div key={i} className='w-ful relative flex-center *:flex-shrink-0 my-1'>
              <label htmlFor='w' className='ml-2'>
                {t("TauriIcons.width")}：
              </label>
              <input
                type='number'
                id='w'
                placeholder={t("TauriIcons.inputWidth")}
                defaultValue={item.width}
                className='b w-52px'
              />
              <label htmlFor='h' className='ml-2'>
                {t("TauriIcons.height")}：
              </label>
              <input
                type='number'
                id='h'
                placeholder={t("TauriIcons.inputHeight")}
                defaultValue={item.height}
                className='b w-52px'
              />
              <label htmlFor='n' className='ml-2'>
                {t("TauriIcons.name")}：
              </label>
              <input
                type='text'
                id='n'
                placeholder={t("TauriIcons.inputName")}
                defaultValue={item.name}
                className='b w-170px'
              />
              <code className='ml-2'>png</code>
            </div>
          );
        })}

      {imageInfo && (
        <div className='flex-center py-2 gap-1'>
          <button
            title={t("TauriIcons.reselect")}
            className='btn btn-outline btn-info btn-sm'
            type='button'
            onClick={reset}
          >
            {t("TauriIcons.reselect")}
          </button>
          <button
            title={t("TauriIcons.downloadImg")}
            className='btn btn-info btn-sm'
            type='button'
            onClick={() => downloadImg(0)}
          >
            {t("TauriIcons.downloadImg")}
          </button>
        </div>
      )}
    </div>
  );
}
