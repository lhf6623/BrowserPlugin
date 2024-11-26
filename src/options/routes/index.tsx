export const routes = [
  {
    path: "/",
    element: <Root />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: "/",
        name: "常规设置",
        element: <GeneralSettings />,
      },
      {
        path: "/ImageProcessing",
        name: "图片相关",
        element: <ImageProcessing />,
        children: [
          {
            path: "/ImageProcessing",
            name: "压缩",
            element: <Compress />,
          },
          {
            path: "/ImageProcessing/CutOut",
            name: "剪裁",
            element: <CutOut />,
          },
          {
            path: "/ImageProcessing/ImageToText",
            name: "Tauri icon 生成",
            element: <TauriIcons />,
          },
        ],
      },
    ],
  },
];

export const router = createHashRouter(routes);
