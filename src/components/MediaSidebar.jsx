import { useForceUpdate } from "@/hook/useForceUpdate";
import { useGeneralStore } from "@/store/general";
import { isValidUrl } from "@/utils/string";
import React, { useMemo, useState } from "react";
import Lightbox from "react-image-lightbox";

const MediaSidebar = () => {
	const [isOpen, setIsOpen] = useState(false);
	const { currentQuestion, research } = useGeneralStore();
	const { files } = research || {};
	console.log({ currentQuestion })
	const forceUpdate = useForceUpdate();
	const { image_id } = currentQuestion || {};
	const imgSrc = useMemo(
		() => (isValidUrl(image_id) ? image_id : files?.[image_id]),
		[files, image_id]
	);

	const _media = useMemo(() => {
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
	}, [imgSrc]);

	return (
		<aside className="bg-white overflow-hidden w-[568px] h-full relative hidden lg:flex items-center justify-center rounded-lg">
			{!imgSrc ? (
				<div className="bg-[#FFE9E2] absolute w-full h-full flex items-center justify-center">
					<img
						src="/images/welcome-banner.png"
						height="100%"
						width="100%"
						className="object-cover object-center"
					/>
				</div>
			) : (
				_media
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
