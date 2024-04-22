import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Login } from "./routes";
import "./index.css";

const router = createBrowserRouter([
	{
		path: "/login",
		element: <Login />,
	},
]);

// TODO: react-error-boundary
ReactDOM.createRoot(document.getElementById("root")!).render(
	<React.StrictMode>
		<RouterProvider router={router} />
	</React.StrictMode>,
);
