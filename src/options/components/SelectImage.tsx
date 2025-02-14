import { useState, useRef, ChangeEvent, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";

interface SelectImageProps {
  multiple?: boolean;
  accept?: string;
  onChange: (file: { file: File; id: string }[]) => void;
}
export default function SelectImage({
  onChange,
  multiple = false,
  accept = "image/*",
}: SelectImageProps) {
  const [isDrag, setIsDrag] = useState(false);
  const fileRef = useRef<HTMLInputElement | null>(null);
  const dragRef = useRef<HTMLDivElement | null>(null);

  async function handleFileChange(e: ChangeEvent<HTMLInputElement>) {
    const files = e.target.files;
    if (files) {
      const fileList = Array.from(files).map((item) => {
        return {
          file: item,
          id: uuidv4(),
        };
      });
      onChange(fileList);
    }
  }

  function handleOpenFileInput() {
    fileRef.current!.value = "";
    fileRef.current?.click();
  }

  function isCurr(el: EventTarget | null) {
    if (!el || el === document.body) return false;

    if (el === dragRef.current) return true;

    const _el = el as HTMLElement;
    return isCurr(_el.parentElement);
  }

  function handleDrag(e: DragEvent) {
    if (isCurr(e.target as HTMLElement)) {
      e.preventDefault();
      e.stopPropagation();

      setIsDrag(false);
      const files = e.dataTransfer?.files;
      if (files) {
        const fileList = Array.from(files).map((item) => {
          return {
            file: item,
            id: uuidv4(),
          };
        });
        onChange(fileList);
      }
    }
  }
  function handleDragOver(e: DragEvent) {
    const _isCurr = isCurr(e.target);
    if (_isCurr) {
      e.preventDefault();
      e.stopPropagation();

      setIsDrag(_isCurr);
    } else {
      setIsDrag(false);
    }
  }

  useEffect(() => {
    dragRef.current!.addEventListener("drop", handleDrag);
    document.addEventListener("dragover", handleDragOver);
    return () => {
      if (dragRef.current) {
        dragRef.current!.removeEventListener("drop", handleDrag);
      }
      document.removeEventListener("dragover", handleDragOver);
    };
  }, []);

  // @unocss-include
  const style = isDrag ? "border-solid" : "border-dashed";

  return (
    <>
      <div
        onClick={handleOpenFileInput}
        ref={dragRef}
        className={`w-full my-1 cursor-pointer border-#616778 text-#40444f text-center py-2 flex items-center flex-col border-2px ${style}`}
      >
        <i className="i-mdi:file-image-plus-outline w-64px h-64px text-blue"></i>
        <span className="text-12px op-70">
          <span className="!text-blue">点击选择图片</span>
          或者将图片拖放到这里！
        </span>
      </div>

      <input
        ref={fileRef}
        type="file"
        accept={accept}
        multiple={multiple}
        onChange={handleFileChange}
        className="hidden w-0 h-0 op-0"
      />
    </>
  );
}
