import { useResearch } from "@/hook/research";
import { useGeneralStore } from "@/store/general";
import { isEmpty } from "@/utils/common";
import React, { useCallback } from "react";
import BeatLoader from "react-spinners/BeatLoader";

const MediaSidebar = () => {
	const { fileId } = useGeneralStore();
	const { data, loading } = useResearch();
	const { files } = data?.research || {};

	console.log({ fileId })

	const renderMedia = useCallback(() => {
		if (loading) return <BeatLoader />;
		if (!isEmpty(files)) {
			const imgSrc = files?.[fileId];
			return (
				<div className="flex items-center flex-col justify-center gap-4">
					<p className="text-lg font-bold max-w-sm text-center">Please look at this image as context for your answer.</p>
					<img src={imgSrc} height="auto" width={300} alt="" />
				</div>
			);
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
