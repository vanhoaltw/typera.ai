import { RouterProvider, createBrowserRouter } from "react-router-dom";
import ErrorPage from "@/pages/_error";
import Interview from "@/pages/interview/[id]";
import Chat from "@/pages/interview/[id]/chat";
import Voice from "@/pages/interview/[id]/voice";
import InterviewLayout from "./components/layouts/InterviewLayout";

const router = createBrowserRouter([
	{
		path: "/",
		errorElement: <ErrorPage />,
		children: [
			{
				path: "/interview/:id",
				element: <InterviewLayout />,
				children: [
					{ path: "", element: <Interview /> },
					{ path: "chat", element: <Chat /> },
					{ path: "voice", element: <Voice /> },
				],
			},
		],
	},
]);

export default function App() {
	return <RouterProvider router={router} />;
}
