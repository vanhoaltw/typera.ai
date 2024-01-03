import AvatarHolder from "@/assets/avatarHolder";
import { cn } from "@/utils/common";
import { extractJsonFromString } from "@/utils/string";
import React, { memo, useMemo, useState } from "react";
import { BeatLoader } from "react-spinners";
import { Button } from "./Button";

export const alphabet = "abcdefghijklmnopqrstuvwxy";

const AnswerOptions = ({ options, optionAnswered, onAnswer, disabled }) => {
	const [selected, setSeleted] = useState(optionAnswered);
	const isAnswered = !!optionAnswered;

	return (
		<div className="p-[22px] py-[16px] flex flex-col gap-2 rounded-[20px] rounded-tl-none bg-[#F7F9FC] w-fit mt-2">
			{options.map((i, idx) => {
				const isSeleted = selected === i;
				return (
					<Button
						key={i}
						role="checkbox"
						variant="outline"
						onClick={() => !disabled && setSeleted(i)}
						className={cn(
							"border rounded-[4px] font-normal disabled:pointer-events-none py-2 px-2 flex justify-start gap-4 min-w-[180px] text-base",
							!isSeleted
								? "border-[#C5CEE0] text-[#8F9BB3] cursor-pointer"
								: "border-[#FF9A77] bg-[#FFDBC4] text-black pointer-events-none"
						)}
					>
						<div
							className={cn(
								"h-6 w-6 flex items-center justify-center text-white rounded-sm font-normal text-sm uppercase",
								isSeleted ? "bg-black" : "bg-[#8F9BB3]"
							)}
						>
							{alphabet[idx]}
						</div>
						{i}
					</Button>
				);
			})}
			{!isAnswered && !!selected && (
				<div className="mt-1.5">
					Confirm select this answer{" "}
					<Button
						onClick={() => onAnswer(selected)}
						size="sm"
						variant="link"
						className="underline"
					>
						Yes
					</Button>
				</div>
			)}
		</div>
	);
};

const ChatItem = ({ data, isBot, isLoading, optionAnswered, onAnswer }) => {
	const { content } = data || {};

	const { text } = content?.[0];
	const textValue = text?.value?.trim?.() || "";

	const { obj, str } = useMemo(
		() => extractJsonFromString(textValue),
		[textValue]
	);

	const safeObj = Array.isArray(obj) ? obj[0] : obj;

	return (
		<div className={cn("flex gap-3 items-end", !isBot && "flex-row-reverse")}>
			<div className="shrink-0">
				{isBot ? (
					<AvatarHolder />
				) : (
					<img
						src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRGN99LjQyUEjKNnTX_MVJVH56BhkJGw28CKg&usqp=CAU"
						className="rounded-full"
						height={48}
						width={48}
					/>
				)}
			</div>

			<div>
				<div
					className={cn(
						"p-[22px] py-[16px] rounded-[20px]",
						isBot
							? "rounded-bl-none bg-[#F7F9FC]"
							: "rounded-br-none bg-[#FFDBC4]"
					)}
				>
					{isLoading ? (
						<BeatLoader size={8} color="currentColor" />
					) : (
						<>
							<p>{str}</p>
							{!!safeObj?.question && (
								<p className="min-w-0 break-words whitespace-pre-wrap">
									{safeObj.question}
								</p>
							)}
						</>
					)}
				</div>

				{safeObj?.question_type === "radio" && safeObj?.answer_options && (
					<AnswerOptions
						optionAnswered={optionAnswered}
						options={safeObj.answer_options}
						onAnswer={onAnswer}
						disabled={
							optionAnswered && !optionAnswered.includes(safeObj.answer_options)
						}
					/>
				)}
			</div>
		</div>
	);
};

export default memo(ChatItem);
