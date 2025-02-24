import { compressImage, getSizeText, downloadImage } from "@/utils";
import { useState, useEffect } from "react";
import { useImageList, useImgConfig } from "./ImageProcessingContext";
import Notify from "simple-notify";
import Image from "@opt/components/Image";

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

function Task({
  file,
  id,
  onOperation,
}: {
  file: File;
  id: string;
  onOperation: (id: string) => void;
}) {
  const { config } = useImgConfig();
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
    setImgData(null);
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
    <li className=" bg-#f0f0f0 border px-2 py1px mt-2">
      <div className="flex justify-between items-center">
        <span>{file.name}</span>
        <div className="flex">
          <span className="mr-4">{getSizeText(file.size)}</span>
          <div className="relative flex-center">
            <progress className="w-150px h-20px rounded-xl" max="100" value={load}>
              {load}%
            </progress>
            <div className="flex-center w-full h-full absolute top-0 left-0 text-white">
              {load === 100 && <span text="12px">已压缩 {compressionAmount}%</span>}
            </div>
          </div>
          <span className="ml-4">{getSizeText(imgData?.newValue.imgFile.size || 0)}</span>
        </div>
      </div>
      {load === 100 && (
        <div className="flex justify-between items-center border-t mt-1">
          <p className="flex items-center gap-x-2">
            <button
              className="i-mdi:content-copy"
              title="复制 base64 地址"
              onClick={() => copyBase64(imgData!.oldValue.base64Url)}
            ></button>
          </p>
          <p className="flex items-center gap-x-2">
            <button
              className="i-mdi:content-copy"
              title="复制压缩后的 base64"
              onClick={() => copyBase64(imgData!.newValue.base64Url)}
            ></button>
            <button
              className="i-mdi:print-preview"
              title="预览压缩后的图片"
              onClick={() => {
                setShowImg(!showImg);
              }}
            ></button>
            <button
              className="i-mdi:file-download-outline"
              title="下载压缩后的图片"
              onClick={() => downloadImage(imgData!.newValue.base64Url, name)}
            ></button>
            <button onClick={() => onOperation(id)}>删除</button>
          </p>
        </div>
      )}
      {showImg && (
        <Image width={`${imgData?.oldValue.image.width}`} src={imgData!.newValue.base64Url}></Image>
      )}
    </li>
  );
}
