import { getInRange } from "@/utils";
import { CSSProperties, memo, useEffect, useRef } from "react";

export default memo(function CuttingArea({ width = 0, height = 0, onChange }: CuttingAreaProps) {
  const boxRef = useRef<HTMLDivElement>(null);

  function setOriginDataset({ type, x, y }: OriginDataset) {
    boxRef.current!.dataset.type = type ? type : "";
    boxRef.current!.dataset.x = `${x}`;
    boxRef.current!.dataset.y = `${y}`;
  }
  /** 获取原点信息 */
  function getOriginDataset() {
    const { type, x, y } = boxRef.current!.dataset;
    return { type, x: Number(x), y: Number(y) } as OriginDataset;
  }

  /** 设置 css 变量 */
  function setStyle(data: Partial<Omit<CuttingAreaStyleInfo, "w" | "h">>) {
    const _data = getStyle();
    const { bl, br, bt, bb } = { ..._data, ...data };
    const style = {
      "--w": `${width}px`,
      "--h": `${height}px`,
      "--bl": `${bl}px`,
      "--br": `${br}px`,
      "--bt": `${bt}px`,
      "--bb": `${bb}px`,
    } as CSSProperties;

    boxRef.current!.style.cssText = Object.entries(style).reduce((pre, curr) => {
      const [key, value] = curr;
      return `${pre}${key}:${value};`;
    }, "");

    onChange(_data);
  }

  /** 获取 css 变量 */
  function getStyle() {
    const cssText = boxRef.current!.style.cssText || "";
    const _cssText = cssText
      .replace(/--/g, "")
      .replace(/px/g, "")
      .replace(/\s+/g, "")
      .split(";")
      .reduce((pre, curr) => {
        const [key, value] = curr.split(":");
        if (!key) return pre;
        return {
          ...pre,
          [key]: Number(value || 0),
        };
      }, {} as CuttingAreaStyleInfo);
    return _cssText;
  }

  function handleBoxChange(e: MouseEvent) {
    e.preventDefault();
    e.stopPropagation();

    const { type: eventType, target } = e;
    const { dataset } = target as HTMLElement;
    const datasetKey = dataset.key as string;
    const { clientX, clientY } = e;

    if (eventType === "mousedown") {
      setOriginDataset({ type: datasetKey, x: clientX, y: clientY });
      return;
    }
    if (eventType === "mouseup") {
      setOriginDataset({ type: "", x: 0, y: 0 });
      return;
    }
    if (eventType === "mousemove") {
      const { x: originX, y: originY, type: originType } = getOriginDataset();

      if (originType) {
        const distanceX = clientX - originX;
        const distanceY = clientY - originY;
        const { w, h, bt, bl, bb, br } = getStyle();

        // 拖动上
        if (originType === "top") {
          setStyle({
            bt: getInRange(bt + distanceY, h + bb),
          });
        } else if (originType === "bottom") {
          setStyle({
            bb: getInRange(bb - distanceY, h - bt),
          });
        } else if (originType === "left") {
          setStyle({
            bl: getInRange(bl + distanceX, w - br),
          });
        } else if (originType === "right") {
          setStyle({
            br: getInRange(br - distanceX, w - bl),
          });
        } else if (["box"].includes(originType)) {
          setStyle({
            bt: getInRange(bt + distanceY, bt + bb),
            bb: getInRange(bb - distanceY, bt + bb),
            bl: getInRange(bl + distanceX, bl + br),
            br: getInRange(br - distanceX, bl + br),
          });
        } else if (originType === "top-left") {
          setStyle({
            bt: getInRange(bt + distanceY, h - bb),
            bl: getInRange(bl + distanceX, w - br),
          });
        } else if (originType === "top-right") {
          setStyle({
            bt: getInRange(bt + distanceY, h - bb),
            br: getInRange(br - distanceX, w - bl),
          });
        } else if (originType === "bottom-left") {
          setStyle({
            bb: getInRange(bb - distanceY, h - bt),
            bl: getInRange(bl + distanceX, w - br),
          });
        } else if (originType === "bottom-right") {
          setStyle({
            bb: getInRange(bb - distanceY, h - bt),
            br: getInRange(br - distanceX, w - bl),
          });
        }
        // 每次更新完 style 要重置一下原点信息
        setOriginDataset({ type: originType, x: clientX, y: clientY });
      }
    }
  }
  useEffect(() => {
    document.addEventListener("mousedown", handleBoxChange);
    document.addEventListener("mousemove", handleBoxChange);
    document.addEventListener("mouseup", handleBoxChange);
    return () => {
      document.removeEventListener("mousedown", handleBoxChange);
      document.removeEventListener("mousemove", handleBoxChange);
      document.removeEventListener("mouseup", handleBoxChange);
    };
  }, []);
  useEffect(() => {
    setStyle({ bt: 0, bl: 0, br: 0, bb: 0 });
    setOriginDataset({ type: "", x: 0, y: 0 });
  }, [width, height]);

  const cut_box = {
    width: "var(--w)",
    height: "var(--h)",
    borderWidth: "var(--bt) var(--br) var(--bb) var(--bl)",
  };
  const mask_box = {
    top: "var(--bt)",
    left: "var(--bl)",
    width: "calc(var(--w) - var(--bl) - var(--br))",
    height: "calc(var(--h) - var(--bt) - var(--bb))",
  };
  return (
    <div ref={boxRef} className='select-none inset-0 absolute'>
      <div
        style={cut_box}
        className='border-#00000099 *:absolute *:w-15px *:h-15px *:border-#0072ff *:border-solid absolute
        border-solid
        top-0
        left-0
        z-30'
      >
        <div
          data-key='top-left'
          className='left-0 cursor-nw-resize top-0 border-t-4px border-l-4px translate-x--4px translate-y--4px'
        ></div>
        <div
          data-key='top'
          className='bg-#0072ff cursor-n-resize h-4px w-19px top-0 left-50% translate-x--50% translate-y--100%'
        ></div>
        <div
          data-key='top-right'
          className='right-0 cursor-ne-resize top-0 border-t-4px border-r-4px translate-x-4px translate-y--4px'
        ></div>
        <div
          data-key='left'
          className='bg-#0072ff cursor-w-resize h-19px w-4px top-50% left-0 translate-y--50% translate-x--100%'
        ></div>
        <div
          data-key='right'
          className='bg-#0072ff cursor-e-resize h-19px w-4px top-50% right-0 translate-y--50% translate-x-100%'
        ></div>
        <div
          data-key='bottom-left'
          className='left-0 cursor-sw-resize bottom-0 border-l-4px border-b-4px translate-x--4px translate-y-4px'
        ></div>
        <div
          data-key='bottom'
          className='bg-#0072ff cursor-s-resize h-4px w-19px bottom-0 left-50% translate-x--50% translate-y-100%'
        ></div>
        <div
          data-key='bottom-right'
          className='right-0 cursor-se-resize bottom-0 border-r-4px border-b-4px translate-x-4px translate-y-4px'
        ></div>
      </div>
      <div
        style={mask_box}
        data-key='box'
        className='z-60 absolute border-none overflow-hidden border border-#0072ff border-solid border-2px'
      >
        <div
          data-key='box'
          className=' absolute h-1/3 w-full border-dashed border-y-2px border-#666 top-33.33% left-0'
        ></div>
        <div
          data-key='box'
          className=' absolute w-1/3 h-full border-dashed border-x-2px border-#666 left-33.33% top-0'
        ></div>
      </div>
    </div>
  );
});
