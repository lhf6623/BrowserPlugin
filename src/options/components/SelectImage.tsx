import { useState, useRef, ChangeEvent, useEffect } from "react";
import CryptoJS from "crypto-js";

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
  // 加载状态
  const [loading, setLoading] = useState(false);

  async function getFileMD5(files: FileList) {
    const p = [...files].map((file) => {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = async function (e) {
          const wordArray = CryptoJS.lib.WordArray.create(e.target!.result as ArrayBuffer);
          const md5 = CryptoJS.MD5(wordArray).toString();
          resolve({ file, id: md5 });
        };
        reader.onerror = reject;
        reader.readAsArrayBuffer(file);
      });
    });
    return (await Promise.all(p)) as {
      file: File;
      id: string;
    }[];
  }

  async function handleFileChange(e: ChangeEvent<HTMLInputElement>) {
    let files = e.target.files;

    if (files) {
      try {
        setLoading(true);
        const fileList = await getFileMD5(files);
        onChange(fileList);
      } catch (e) {
      } finally {
        setLoading(false);
      }
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

  async function handleDrag(e: DragEvent) {
    if (isCurr(e.target as HTMLElement)) {
      e.preventDefault();
      e.stopPropagation();

      setIsDrag(false);
      const files = e.dataTransfer?.files;
      if (files) {
        try {
          setLoading(true);
          const fileList = await getFileMD5(files);

          onChange(fileList);
        } catch (e) {
        } finally {
          setLoading(false);
        }
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
    <div className="wfull hfit relative">
      <div
        onClick={handleOpenFileInput}
        ref={dragRef}
        className={`w-full box-border relative my-1 cursor-pointer border-#616778 text-#40444f text-center py-2 flex items-center flex-col border-2px ${style}`}
      >
        <i
          className={`${loading ? "i-eos-icons:three-dots-loading" : "i-mdi:file-image-plus-outline"} w-64px h-64px text-blue`}
        ></i>
        <span className="text-12px op-70">
          <span className="!text-blue">点击选择图片</span>
          或者将图片拖放到这里！
        </span>
      </div>

      {loading && <div onClick={(e) => e.stopPropagation()} className="absolute inset-0"></div>}

      <input
        ref={fileRef}
        type="file"
        accept={accept}
        multiple={multiple}
        onChange={handleFileChange}
        className="hidden w-0 h-0 op-0"
      />
    </div>
  );
}
