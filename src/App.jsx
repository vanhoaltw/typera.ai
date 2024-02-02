import { RouterProvider, createBrowserRouter } from "react-router-dom";
import ErrorPage from "@/pages/_error";
import Interview from "@/pages/interview/detail";
import Chat from "@/pages/interview/detail/chat";
import InterviewLayout from "./components/layouts/InterviewLayout";
import IndexPage from "./pages";

const router = createBrowserRouter([
	{
		path: "/",
		errorElement: <ErrorPage />,
		children: [
			{ path: "/", element: <IndexPage /> },
			{
				path: "/interview/:id",
				element: <InterviewLayout />,
				children: [
					{ path: "", element: <Interview /> },
					{ path: "chat", element: <Chat /> },
				],
			},
		],
	},
]);

export default function App() {
	return <RouterProvider router={router} />;
}
