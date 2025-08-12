import { Outlet } from "react-router-dom";
import ConfigSelect from "./ConfigSelect";
import ImageList from "./ImageList";
import { ImageProcessingProvider } from "./ImageProcessingContext";

export default function ImageProcessing() {
  return (
    <ImageProcessingProvider>
      <div className='relative min-w-400px p-4 sm:w-640px hfull overflow-auto select-none bg-base-100 border-base-300 text-base-content'>
        <ConfigSelect />
        <ImageList />
        <Outlet />
      </div>
    </ImageProcessingProvider>
  );
}
