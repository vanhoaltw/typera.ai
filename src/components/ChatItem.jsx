import { cn } from "@/utils/common";
import React from "react";
import { BeatLoader } from "react-spinners";

const AvatarBot = () => {
	return (
		<svg
			width="48"
			height="48"
			viewBox="0 0 48 48"
			fill="none"
			xmlns="http://www.w3.org/2000/svg"
		>
			<circle cx="24" cy="24" r="24" fill="#FF4000" />
			<rect x="9" y="21" width="6.36364" height="6.36364" fill="white" />
			<rect
				x="20.8182"
				y="20.9998"
				width="6.36364"
				height="6.36364"
				fill="white"
			/>
			<rect
				x="32.6364"
				y="20.9998"
				width="6.36364"
				height="6.36364"
				fill="white"
			/>
		</svg>
	);
};

const Content = ({ data }) => {
	const { type, text } = data || {};
	if (type === "text") {
		return <p>{text?.value}</p>;
	}
};

const ChatItem = ({ data, isBot, isLoading }) => {
	const { content } = data || {};

	return (
		<div className={cn("flex gap-3 items-end", !isBot && "flex-row-reverse")}>
			<div className="shrink-0">
				{isBot ? (
					<AvatarBot />
				) : (
					<img
						src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRGN99LjQyUEjKNnTX_MVJVH56BhkJGw28CKg&usqp=CAU"
						className="rounded-full"
						height={48}
						width={48}
					/>
				)}
			</div>

			<div
				className={cn(
					"p-[22px] py-[16px] rounded-[20px] mb-6",
					isBot
						? " rounded-bl-none bg-[#F7F9FC]"
						: "rounded-br-none bg-[#FFDBC4]"
				)}
			>
				{isLoading ? (
					<BeatLoader color="currentColor" />
				) : (
					content?.map((i, idx) => (
						<Content data={i} key={`${i?.type}-${idx}`} />
					))
				)}
			</div>
		</div>
	);
};

export default ChatItem;
