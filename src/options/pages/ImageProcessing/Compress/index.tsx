export default function ImageProcessing() {
  return (
    <ImageProcessingProvider>
      <div className="relative min-w-400px p-4 sm:w-640px hfull overflow-auto select-none">
        <ConfigSelect />
        <ImageList />
        <Outlet />
      </div>
    </ImageProcessingProvider>
  );
}
