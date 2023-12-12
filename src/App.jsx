import React from "react";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import Home from "@/pages";
import RootLayout from "@/components/layouts/RootLayout";
import ErrorPage from "@/pages/_error";

const router = createBrowserRouter([
	{
		path: "/",
		element: <RootLayout />,
		errorElement: <ErrorPage />,
		children: [{ path: "/", element: <Home /> }],
	},
]);

export default function App() {
	return <RouterProvider router={router} />;
}
