import { useDraggable } from "@dnd-kit/core";
import { useEffect, useState } from "react";

export default function Image({ src, width }: { src: string; width?: number | string }) {
  // 旋转角度
  const [rotate, setRotate] = useState(0);
  // 放大倍数
  const [scale, setScale] = useState(1);
  // 显示隐藏
  const [show, setShow] = useState(false);

  useEffect(() => {
    setScale(1);
    setRotate(0);
  }, [show]);

  // 下载
  const download = () => {
    const link = document.createElement("a");
    link.href = src;
    link.download = "image.png";
    link.click();
  };

  // 拖动
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: "draggable",
  });
  const style = transform
    ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0) rotate(${rotate}deg) scale(${scale})`,
        transformOrigin: "center center",
        "transition-property": "none",
      }
    : {
        // 角度样式拼接, 放大倍数
        transform: `rotate(${rotate}deg) scale(${scale})`,
        transformOrigin: "center center",
      };

  return (
    <div className='w-fit h-fit relative'>
      <img
        width={width ?? ""}
        src={src}
        className='cursor-pointer'
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            setShow(true);
          }
        }}
        onClick={() => setShow(true)}
      />
      {show && (
        <div className='fixed top-0 left-0 z-999 flex-center wfull hfull bg-#0000004d' onClick={() => setShow(false)}>
          <img
            className='transition-all'
            width={width ?? ""}
            onClick={(e) => e.stopPropagation()}
            src={src}
            ref={setNodeRef}
            style={style}
            {...listeners}
            {...attributes}
          />
          <div
            onClick={(e) => e.stopPropagation()}
            className='absolute bottom-50px rounded-full flex items-center py-10px px-20px flex-center gap-4 bg-#0000004d *:text-30px'
          >
            <button
              className='btn btn-outline btn-xs text-base-content px-0 b-none !hover:bg-transparent h-30px w-30px'
              onClick={() => setRotate(rotate - 90)}
            >
              <i className='i-mdi:rotate-counter-clockwise h-30px w-30px'></i>
            </button>
            <button
              className='btn btn-outline btn-xs text-base-content px-0 b-none !hover:bg-transparent h-30px w-30px'
              onClick={() => setRotate(rotate + 90)}
            >
              <i className='i-mdi:rotate-clockwise h-30px w-30px'></i>
            </button>
            <button
              className='btn btn-outline btn-xs text-base-content px-0 b-none !hover:bg-transparent h-30px w-30px'
              onClick={() => setScale(scale - 0.1)}
            >
              <i className='i-gravity-ui:magnifier-minus h-30px w-30px'></i>
            </button>
            <button
              className='btn btn-outline btn-xs text-base-content px-0 b-none !hover:bg-transparent h-30px w-30px'
              onClick={() => setScale(scale + 0.1)}
            >
              <i className='i-gravity-ui:magnifier-plus h-30px w-30px'></i>
            </button>
            <button
              className='btn btn-outline btn-xs text-base-content px-0 b-none !hover:bg-transparent h-30px w-30px'
              onClick={download}
            >
              <i className='i-gg:software-download h-30px w-30px'></i>
            </button>
            <button
              className='btn btn-outline btn-xs text-base-content px-0 b-none !hover:bg-transparent h-30px w-30px'
              onClick={() => setShow(false)}
            >
              <i className='i-mdi:close h-30px w-30px'></i>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
