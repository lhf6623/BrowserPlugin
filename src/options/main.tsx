import React from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import { router } from "@/options/routes/index";

import "virtual:uno.css";
import "@unocss/reset/tailwind-compat.css";
import "simple-notify/dist/simple-notify.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
	<React.StrictMode>
		<RouterProvider router={router} />
	</React.StrictMode>
);
