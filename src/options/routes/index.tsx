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
        name: "routes.taskSettings",
        element: <GeneralSettings />,
      },
      {
        path: "/ImageProcessing",
        name: "routes.imageTool",
        element: <ImageProcessing />,
        children: [
          {
            path: "/ImageProcessing",
            name: "routes.compress",
            element: <Compress />,
          },
          {
            path: "/ImageProcessing/CutOut",
            name: "routes.cutOut",
            element: <CutOut />,
          },
          {
            path: "/ImageProcessing/ImageToText",
            name: "routes.tauriIcons",
            element: <TauriIcons />,
          },
          {
            path: "/ImageProcessing/Base64ToImg",
            name: "routes.base64ToImg",
            element: <Base64ToImg />,
          },
        ],
      },
    ],
  },
];

export const router = createHashRouter(routes);
