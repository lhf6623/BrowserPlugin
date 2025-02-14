import SelectImage from "@opt/components/SelectImage";
import { changeImgSize, downloadImage, getImgInfo } from "@/utils";
import { useState } from "react";

export default function TauriIcons() {
  const [imageInfo, setImageInfo] = useState<ImgInfo | null>(null);
  async function handleChangeFile(list: { file: File; id: string }[]) {
    const imageInfo = await getImgInfo(list[0].file);
    setImageInfo(imageInfo);
  }
  function reset() {
    setImageInfo(null);
  }
  const imgList = [
    {
      width: 256,
      height: 256,
      name: "icon",
      type: "ico",
    },
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
    downloadImage(dataURL, `${item.name}.${item.type ?? "png"}`);

    // 浏览器下载数量限制
    setTimeout(() => {
      downloadImg(i + 1);
    }, 1000);
  }

  return (
    <div className="w-600px relative p-4">
      <p className="text-amber-500 p-2 b b-amber">
        选择一张 <code>512*512</code> 或者以上的 png 格式的图片，ico
        格式不能在浏览器上制作，只能改后缀
      </p>
      {!imageInfo && (
        <SelectImage accept="image/png" onChange={handleChangeFile} multiple={false} />
      )}
      {imageInfo &&
        imgList.map((item, i) => {
          return (
            <div key={i} className="w-full bg-#fafaff relative flex-center *:flex-shrink-0 my-1">
              <label htmlFor="w" className="ml-2">
                宽：
              </label>
              <input type="number" id="w" defaultValue={item.width} className="b w-52px" />
              <label htmlFor="h" className="ml-2">
                高：
              </label>
              <input type="number" id="h" defaultValue={item.height} className="b w-52px" />
              <label htmlFor="n" className="ml-2">
                名字：
              </label>
              <input type="text" id="n" defaultValue={item.name} className="b w-170px" />
              <code className="ml-2">{item.type ?? "png"}</code>
            </div>
          );
        })}

      {imageInfo && (
        <div className="flex-center py-2">
          <button className="l-button px-3" onClick={reset}>
            重新选择
          </button>
          <button
            className="l-button px-3 ml-5 bg-#0797E1 text-white"
            onClick={() => downloadImg(0)}
          >
            下载
          </button>
        </div>
      )}
    </div>
  );
}
