import Demo from "@/components/home/Demo";
import Features from "@/components/home/Features";
import Footer from "@/components/home/Footer";
import Landing from "@/components/home/Landing";
import NavHeader from "@/components/home/NavHeader";
import React from "react";

const IndexPage = () => {
	return (
		<div>
			<div
				className="absolute top-0 left-0 right-0 bg-no-repeat bg-cover shadow-lg -bottom-full brightness-90 filter md:bottom-0 md:bg-center md:brightness-100"
				style={{
					backgroundImage: "url('images/splash.jpeg')",
					zIndex: -1,
				}}
			/>
			<NavHeader />
			<Landing />
			<Features />
			<Demo />
			<Footer />
		</div>
	);
};

export default IndexPage;
