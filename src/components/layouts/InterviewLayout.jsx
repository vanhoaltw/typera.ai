import React from "react";
import { Outlet } from "react-router-dom";
import Header from "../Header";
import Container from "../Container";
import MediaSidebar from "../MediaSidebar";
import { useResearch } from "@/hook/research";
import { BeatLoader } from "react-spinners";

const InterviewLayout = () => {
	const { loading } = useResearch();

	if (loading) {
		return (
			<div>
				<Header />
				<Container
					className="flex items-center gap-[20px] mt-[72px] p-0 sm:px-10 sm:py-6 max-h-none sm:max-h-[800px]"
					style={{ height: "calc(100vh - 72px)" }}
				>
					<MediaSidebar />
					<main className="w-full flex items-center justify-center flex-1 bg-white h-full rounded-lg">
						<BeatLoader />
					</main>
				</Container>
			</div>
		);
	}

	return (
		<div>
			<Header />
			<Container
				className="flex items-center gap-[20px] mt-[72px] p-0 sm:px-10 sm:py-6 max-h-none sm:max-h-[800px]"
				style={{ height: "calc(100vh - 72px)" }}
			>
				<MediaSidebar />
				<main className="w-full flex-1 bg-white h-full rounded-lg">
					<Outlet />
				</main>
			</Container>
		</div>
	);
};

export default InterviewLayout;
