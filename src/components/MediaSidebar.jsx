import { useResearch } from "@/hook/research";
import { useForceUpdate } from "@/hook/useForceUpdate";
import { useGeneralStore } from "@/store/general";
import React, { useCallback, useState } from "react";
import Lightbox from "react-image-lightbox";
import BeatLoader from "react-spinners/BeatLoader";

const MediaSidebar = () => {
	const [isOpen, setIsOpen] = useState(false);
	const { fileId } = useGeneralStore();
	const { data, loading } = useResearch();
	const { files } = data?.research || {};
	const forceUpdate = useForceUpdate();

	const imgSrc = files?.[fileId];

	const renderMedia = useCallback(() => {
		if (loading) return <BeatLoader />;
		if (!!imgSrc) {
			return (
				<div className="flex items-center flex-col justify-center gap-4">
					<p className="text-lg font-bold max-w-sm text-center">
						Please look at this image as context for your answer.
					</p>
					<img
						onClick={() => setIsOpen(true)}
						src={imgSrc}
						height="auto"
						className="cursor-pointer"
						width={300}
						alt=""
					/>
				</div>
			);
		}
		return;
	}, [loading, imgSrc]);

	return (
		<aside className="bg-white overflow-hidden w-[568px] h-full relative hidden lg:flex items-center justify-center rounded-lg">
			{!fileId ? (
				<div className="bg-[#FFE9E2] absolute w-full h-full flex items-center justify-center">
					<img
						src="/images/welcome-banner.png"
						height="100%"
						width="100%"
						className="object-cover object-center"
					/>
				</div>
			) : (
				renderMedia()
			)}

			{isOpen && (
				<Lightbox
					onImageLoad={forceUpdate}
					mainSrc={imgSrc}
					onCloseRequest={() => setIsOpen(false)}
				/>
			)}
		</aside>
	);
};

export default MediaSidebar;
