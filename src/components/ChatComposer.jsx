import { cn, isEmpty } from "@/utils/common";
import React, { useState } from "react";
import { BeatLoader, BounceLoader } from "react-spinners";

const Send = () => (
	<svg
		width="16"
		height="16"
		viewBox="0 0 16 16"
		fill="none"
		xmlns="http://www.w3.org/2000/svg"
	>
		<path
			d="M14.2833 2.36857C10.1675 4.08967 6.05201 5.81082 1.93621 7.53182C2.83421 7.90598 3.80695 8.28014 4.70492 8.65431C5.3036 8.28014 11.5894 4.61355 11.739 4.61355C11.8138 4.61355 11.8886 4.68843 11.8886 4.7632C11.8886 4.98772 7.62327 9.17812 7.09954 9.7021L6.50086 12.1715L8.74576 10.3008L12.0382 13.3689C12.2627 12.2464 13.9089 3.86523 14.2083 2.36858L14.2833 2.36857ZM13.984 0.797142C15.1813 0.348197 16.2289 1.09645 15.9296 2.44346C15.9296 2.44346 13.9091 12.6954 13.6847 13.7429C13.5351 14.8654 12.0384 15.3143 11.0656 14.4912L8.7458 12.3959L6.87506 13.9674C5.97707 14.6408 5.22875 13.8177 4.92947 12.9946C4.77982 12.5457 4.18114 10.7497 3.95672 10.0013C3.20839 9.70201 1.4873 9.02857 1.03845 8.80405C-0.308456 8.28025 -0.38334 6.70879 1.03845 6.18491C5.37859 4.38895 9.71898 2.44328 14.0591 0.722284L13.984 0.797142Z"
			fill="currentColor"
		/>
	</svg>
);

const ChatComposer = ({ loading, onSend }) => {
	const [content, setContent] = useState("");

	const handleSend = async () => {
		if (isEmpty(content)) return null;
		onSend(content);
		setContent("");
	};

	const handleKeyDown = (e) => {
		if (!loading) {
			const keyCode = e.which || e.keyCode;
			if (keyCode === 13 && !e.shiftKey) {
				e.preventDefault();
				handleSend();
			}
		}
	};

	return (
		<div className="flex font-normal rounded-[10px] p-3 border items-center border-solid border-[#EDF1F7] bg-[#F7F9FC] focus:border-black">
			<input
				type="text"
				onKeyDown={handleKeyDown}
				value={content}
				onChange={(e) => setContent(e.target.value)}
				placeholder="Input your answer"
				className="flex-1 resize-none text-[16px] font-sans border-none outline-none bg-transparent"
			/>
			<button
				role="button"
				arial-label="Send message"
				onClick={handleSend}
				disabled={!isEmpty(content) || loading}
				className={cn(
					"disabled:text-[#8F9BB3] disabled:cursor-not-allowed",
					"bg-[#E4E9F2] w-8 h-8 flex items-center justify-center  rounded-md  text-black active:translate-y-0.5"
				)}
			>
				{loading ? <BounceLoader size={16} color="currentColor" /> : <Send />}
			</button>
		</div>
	);
};

export default ChatComposer;
