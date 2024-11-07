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
            name: "图片压缩",
            element: <Compress />,
          },
          {
            path: "/ImageProcessing/CutOut",
            name: "图片剪裁",
            element: <CutOut />,
          },
        ],
      },
    ],
  },
];

export const router = createHashRouter(routes);
