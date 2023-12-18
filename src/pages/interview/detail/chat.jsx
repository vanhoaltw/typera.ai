import ChatComposer from "@/components/ChatComposer";
import ChatItem from "@/components/ChatItem";
import { RESEARCH } from "@/graphql/research";
import { useContinueResearch, useStartResearch } from "@/hook/research";
import { useGeneralStore } from "@/store/general";
import { getFileId, isBot } from "@/utils/common";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { BeatLoader } from "react-spinners";

const mockDataMessage = (role = "user", content) => {
	return {
		id: `${role}-${Date.now()}`,
		role,
		content: [
			{
				type: "text",
				text: { value: content, annotations: [] },
			},
		],
	};
};

const Chat = () => {
	const scrollRef = useRef();

	const { setFileId } = useGeneralStore();
	const [messages, setMessages] = useState([]);
	const [doContinueResearch, { loading: continueLoading }] =
		useContinueResearch();

	const {
		doRequest: doStartResearch,
		loading: startLoading,
		data: startData,
	} = useStartResearch({
		onCompleted: async (result) => {
			if (result?.startRun?.status === "published") {
				setIsFinished(true);
			} else {
				const reverseMessage = result?.startRun?.messages?.reverse?.() || [];
				const fileId = await getFileId(reverseMessage);

				if (fileId) setFileId(fileId);
				setMessages(reverseMessage);
			}
		},
	});

	useMemo(() => doStartResearch(), []);

	const startId = startData?.startRun?.uuid;

	useEffect(() => {
		if (scrollRef.current && !startLoading) {
			scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
		}
	}, [messages?.length, startLoading, continueLoading]);

	const handleSendMessage = (content) => {
		setMessages((pre) => {
			const clone = [...pre];
			clone.push(mockDataMessage("user", content));
			clone.push(mockDataMessage("assistant", ""));
			return clone;
		});
		doContinueResearch({
			variables: {
				uuid: startId,
				content,
			},
			refetchQueries: [RESEARCH],
			onCompleted: async (result) => {
				const reverseMessage = result?.continueRun?.messages?.reverse?.() || [];
				const fileId = await getFileId(reverseMessage);
				if (fileId) setFileId(fileId);
				setMessages(reverseMessage);
			},
		});
	};

	return (
		<div className="relative h-full pb-4 overflow-hidden">
			{startLoading ? (
				<div className="h-full flex items-center justify-center">
					<BeatLoader />
				</div>
			) : (
				<div className="relative h-full">
					<div
						ref={scrollRef}
						className="flex flex-col w-full gap-[24px] overflow-auto h-full pb-20 pt-[40px] px-[25px]"
					>
						{messages?.map?.((item, idx) => (
							<ChatItem
								isLoading={continueLoading && idx === messages?.length - 1}
								isBot={isBot(item?.role)}
								isLast={idx === messages.length - 1}
								key={item?.id}
								data={item}
							/>
						))}
					</div>

					<div className="absolute bottom-0 left-0 w-full px-[25px] bg-white">
						<ChatComposer
							loading={continueLoading}
							onSend={handleSendMessage}
						/>
					</div>
				</div>
			)}
		</div>
	);
};

export default Chat;
