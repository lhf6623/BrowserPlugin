import { createHashRouter } from "react-router-dom";

import Root from "./Layout";
import ErrorPage from "./ErrorPage";
import GeneralSettings from "../pages/GeneralSettings";
import ImageProcessing from "../pages/ImageProcessing";

export const routes = [
	{
		path: "/",
		element: <Root />,
		errorElement: <ErrorPage />,
		children: [
			{
				path: "/",
				name: "常规设置",
				index: true,
				element: <GeneralSettings />,
			},
			{
				path: "/ImageProcessing",
				name: "图片相关",
				element: <ImageProcessing />,
			},
		],
	},
];

export const router = createHashRouter(routes);
