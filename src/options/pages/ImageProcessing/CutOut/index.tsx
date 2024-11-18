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
      canvas.height,
    );

    const url = canvas.toDataURL(imageInfo.imgFile.type, 1);
    setUrl(url);
  }
  const ratio = (imageInfo?.image.width ?? 1) / cutData.w || 1;
  const w = ((cutData.w - cutData.bl - cutData.br) * ratio || 0).toFixed(0);
  const h = ((cutData.h - cutData.bt - cutData.bb) * ratio || 0).toFixed(0);
  return (
    <div className="w-600px box-content relative p-4">
      {!imageInfo ? (
        <SelectImage onChange={handleChangeFile} multiple={false} />
      ) : (
        <div className="w-full bg-#fafaff relative py-4">
          <CutImage imgInfo={imageInfo} onChange={(data) => setCutData(data)} />
          <p className="text-center text-13px mt-4">
            原图像素：{`${imageInfo.image.width}*${imageInfo.image.height}`}
            &nbsp;&nbsp; 目标像素：
            <span className="text-blue">{`${w}*${h} `}</span>
            &nbsp;&nbsp;为方便操作，已进行缩小展示
          </p>
          <div className="text-center *:border *:py-1 *:px-4 *: *:bg-white text-blue my-4">
            <button
              className="rounded-s-full active:op70 hover:op80"
              onClick={() => {
                setImageInfo(null);
              }}
            >
              重新选择
            </button>
            <button
              onClick={getImgUrl}
              className="border-l-white rounded-e-full active:op70 hover:op80"
            >
              立即剪裁
            </button>
          </div>
          {url && (
            <div className="w-full pb-100px">
              <p className="text-right mb-1">
                <button
                  onClick={() => {
                    downloadImage(url, (imageInfo.imgFile as File).name);
                  }}
                  className="l-button px-2 py-1"
                >
                  下载
                </button>
              </p>
              <img src={url} alt="" />
            </div>
          )}
        </div>
      )}
    </div>
  );
}
