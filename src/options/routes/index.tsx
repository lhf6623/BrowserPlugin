import { createHashRouter } from "react-router-dom";

import Root from "@pages/index";
import ErrorPage from "@pages/ErrorPage";
import GeneralSettings from "@pages/GeneralSettings";
import ImageProcessing from "@pages/ImageProcessing/index";
import Compress from "@pages/ImageProcessing/Compress";
import CutOut from "@pages/ImageProcessing/CutOut";

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
