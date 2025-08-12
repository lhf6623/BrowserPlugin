import RadioGroup from "@opt/components/RadioGroup";
import SelectImage from "@opt/components/SelectImage";
import { useState, useEffect } from "react";
import { useImgConfig, CompressionMode, useImageList } from "./ImageProcessingContext";

function CustomConfigPanel({ show }: ConfigPanelProps) {
  const { configDispatch } = useImgConfig();
  const [custom, setCustom] = useState<{
    type: ConfigType["type"];
    quality: number;
  }>(CompressionMode["custom"]);

  const formatOptions: { value: ConfigType["type"]; label: string }[] = [
    {
      value: "original",
      label: "原格式",
    },
    {
      value: "image/png",
      label: "PNG",
    },
    {
      value: "image/jpeg",
      label: "JPEG",
    },
    {
      value: "image/webp",
      label: "WEBP",
    },
  ];
  useEffect(() => {
    if (show) {
      configDispatch({
        type: "update",
        payload: custom,
      });
    }
  }, [custom, show]);

  function handleChangeQuality(e: { target: { value: any } }) {
    setCustom({
      ...custom,
      quality: Number(e.target.value),
    });
  }
  function handleChangeFormat(opt: { value: ConfigType["type"]; label: string }) {
    setCustom({
      ...custom,
      type: opt.value,
    });
  }
  return (
    <>
      {show && (
        <div className='border pl-4 relative py-1 my-1 flex flex-col gap-4 justify-center'>
          <div className='flex items-center'>
            <label htmlFor='reduce'>清晰度：</label>
            <div>
              <input
                type='range'
                name='quality'
                value={custom.quality}
                step={0.01}
                min={0.1}
                max={1}
                onChange={handleChangeQuality}
              />
              {custom.quality * 100}%
            </div>
          </div>
          <RadioGroup
            label='压缩格式：'
            options={formatOptions}
            value={custom.type}
            onChange={handleChangeFormat}
            name='format'
          />
        </div>
      )}
    </>
  );
}

export default function ConfigSelect() {
  const [type, setType] = useState("reduce");
  const [showConfig, setShowConfig] = useState(false);
  const { configDispatch } = useImgConfig();
  const { imageList, imageListDispatch } = useImageList();

  function handleFileChange(fileList: { file: File; id: string }[]) {
    imageListDispatch({
      type: "add",
      payload: fileList.filter(({ id }) => {
        return !imageList.find((item) => item.id === id);
      }),
    });
  }

  function handleSelectType(opt: { value: keyof typeof CompressionMode; label: string }) {
    setType(opt.value);
    if (opt.value === "custom") {
      setShowConfig(true);
    } else {
      const payload = CompressionMode[opt.value];
      configDispatch({
        type: "update",
        payload,
      });

      setShowConfig(false);
    }
  }
  const typeOptions = [
    {
      value: "reduce",
      label: "缩小优先",
    },
    {
      value: "clearness",
      label: "清晰优先",
    },
    {
      value: "custom",
      label: "自定义",
    },
  ];

  return (
    <>
      <div>
        <div className='flex-center border py-2 cursor-pointer'>
          <RadioGroup label='压缩模式：' options={typeOptions} value={type} onChange={handleSelectType} name='type' />
        </div>
        <CustomConfigPanel show={showConfig} />
      </div>
      <SelectImage onChange={handleFileChange} multiple={true} />
    </>
  );
}
