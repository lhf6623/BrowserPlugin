import { createHashRouter } from "react-router-dom";
import ErrorPage from "@page/ErrorPage";
import GeneralSettings from "@page/GeneralSettings";
import ImageProcessing from "@page/ImageProcessing";
import Compress from "@page/ImageProcessing/Compress";
import CutOut from "@page/ImageProcessing/CutOut";
import TauriIcons from "@page/ImageProcessing/TauriIcons";
import Base64ToImg from "@page/ImageProcessing/Base64ToImg";
import Root from "@page/Root";

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
          {
            path: "/ImageProcessing/Base64ToImg",
            name: "Base64和图片互转",
            element: <Base64ToImg />,
          },
        ],
      },
    ],
  },
];

export const router = createHashRouter(routes);
