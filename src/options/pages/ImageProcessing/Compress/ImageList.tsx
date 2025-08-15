import { compressImage, getSizeText, downloadImage } from "@/utils";
import { useState, useEffect } from "react";
import { useImageList, useImgConfig } from "./ImageProcessingContext";
import Image from "@opt/components/Image";
import CopyButton from "@opt/components/CopyButton";
import { useTranslation } from "react-i18next";

export default function ImageList() {
  const { imageList, imageListDispatch } = useImageList();
  function remove(id: string) {
    const payload = imageList.find((item) => item.id === id)!;
    imageListDispatch({ type: "remove", id, payload });
  }
  return (
    <ul>
      {imageList.map((item) => {
        return <Task file={item.file} id={item.id} key={item.id} onOperation={remove} />;
      })}
    </ul>
  );
}

function Task({ file, id, onOperation }: { file: File; id: string; onOperation: (id: string) => void }) {
  const { config } = useImgConfig();
  const [load, setLoad] = useState(0);
  const [showImg, setShowImg] = useState(false);
  const [imgData, setImgData] = useState<CompressImageType | null>(null);
  const { t } = useTranslation();

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
    setImgData(null);
    compressImage(file, _type, config.quality, (n) => {
      setLoad(n);
    }).then((res) => {
      setImgData(res);
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

  const compressionAmount = (((file.size - Number(imgData?.newValue.imgFile.size || 0)) / file.size) * 100).toFixed(2);

  const name = getImageName();
  return (
    <li className='border px-2 py1px mt-2'>
      <div className='flex justify-between items-center'>
        <span>{file.name}</span>
        <div className='flex'>
          <span className='mr-4'>{getSizeText(file.size)}</span>
          <div className='relative flex-center'>
            <progress className='progress w-150px h-20px progress-info' max='100' value={load}>
              {load}%
            </progress>
            <div className='flex-center w-full h-full absolute top-0 left-0 text-base-300'>
              {load === 100 && (
                <span text='12px'>
                  {t("Compress.compressed")} {compressionAmount}%
                </span>
              )}
            </div>
          </div>
          <span className='ml-4'>{getSizeText(imgData?.newValue.imgFile.size || 0)}</span>
        </div>
      </div>
      {load === 100 && (
        <div className='flex justify-between items-center border-t mt-1'>
          <p className='flex items-center gap-x-2'>
            <CopyButton
              className='btn btn-xs btn-info btn-outline'
              text={imgData!.oldValue.base64Url}
              title={t("Compress.copyBase64")}
            />
          </p>
          <p className='flex items-center gap-x-2'>
            <CopyButton
              className='btn btn-xs btn-info btn-outline'
              text={imgData!.newValue.base64Url}
              title={t("Compress.copyCompressedBase64")}
            />
            <button
              type='button'
              className='btn-icon-info'
              title={t("Compress.previewCompressedImage")}
              onClick={() => {
                setShowImg(!showImg);
              }}
            >
              <i className='i-mdi:print-preview w-24px h-24px inline-block'></i>
            </button>
            <button
              type='button'
              className='btn-icon-info'
              title={t("Compress.downloadCompressedImage")}
              onClick={() => downloadImage(imgData!.newValue.base64Url, name)}
            >
              <i className='i-mdi:file-download-outline w-24px h-24px inline-block'></i>
            </button>
            <button
              title={t("Compress.delete")}
              className='btn btn-xs btn-info btn-outline btn-error'
              type='button'
              onClick={() => onOperation(id)}
            >
              {t("Compress.delete")}
            </button>
          </p>
        </div>
      )}
      {showImg && <Image width={`${imgData?.oldValue.image.width}`} src={imgData!.newValue.base64Url}></Image>}
    </li>
  );
}
