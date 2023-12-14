import { useResearch } from "@/hook/research";
import { useGeneralStore } from "@/store/general";
import { isEmpty } from "@/utils/common";
import React, { useCallback } from "react";
import BeatLoader from "react-spinners/BeatLoader";

const MediaSidebar = () => {
	const { fileId } = useGeneralStore();
	const { data, loading } = useResearch();
	const { files } = data || {};

	const renderMedia = useCallback(() => {
		if (loading) return <BeatLoader />;
		if (isEmpty(files)) {
			const imgSrc = files?.[fileId];
			return <img src={imgSrc} height={250} width={250} alt="" />;
		}
		return;
	}, [loading, fileId, files]);

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
		</aside>
	);
};

export default MediaSidebar;
