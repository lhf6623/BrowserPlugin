export {};
declare global {
  interface ConfigPanelProps {
    show: boolean;
  }
  interface ImageListContextAction {
    type: "add" | "remove" | "update";
    id?: string;
    payload: ImageListContextType | ImageListContextType[];
  }
  interface ImageListContextType {
    file: File;
    id: string;
  }
  interface ConfigType {
    type: "image/png" | "image/jpeg" | "image/webp" | "original";
    quality: number;
  }
  interface ConfigAction {
    type: "update";
    payload: ConfigType;
  }
  interface CutImageProps {
    imgInfo: UnwrapPromise<ReturnType<typeof getImgInfo>>;
    onChange: (data: CuttingAreaStyleInfo) => void;
  }

  type KeyType =
    | "top-left"
    | "top-right"
    | "bottom-left"
    | "bottom-right"
    | "top"
    | "left"
    | "right"
    | "bottom"
    | "box"
    | string;

  /** 原点信息 */
  interface OriginDataset {
    type: KeyType;
    x: number;
    y: number;
  }
  interface CuttingAreaStyleInfo {
    /** 宽度 */
    w: number;
    /** 高度 */
    h: number;
    /** 左边距 */
    bl: number;
    /** 右边距 */
    br: number;
    /** 上边距 */
    bt: number;
    /** 下边距 */
    bb: number;
  }

  interface CuttingAreaProps {
    width: number;
    height: number;
    onChange: (data: CuttingAreaStyleInfo) => void;
  }
  type ImgInfo = UnwrapPromise<ReturnType<typeof getImgInfo>>;
}
