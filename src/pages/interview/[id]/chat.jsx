import ChatComposer from "@/components/ChatComposer";
import ChatItem from "@/components/ChatItem";
import { RESEARCH } from "@/graphql/research";
import { useContinueResearch, useStartResearch } from "@/hook/research";
import { isBot } from "@/utils/common";
import React, {
	useCallback,
	useEffect,
	useMemo,
	useRef,
	useState,
} from "react";
import { BeatLoader } from "react-spinners";

const mockDataMessage = (role = "user", content) => {
	return {
		id: Date.now(),
		role,
		content: [
			{
				type: "text",
				text: {
					value: content,
					annotations: [],
				},
			},
		],
	};
};

const Chat = () => {
	const scrollRef = useRef();
	const [messages, setMessages] = useState([]);
	const [doContinueResearch, { loading: continueLoading }] =
		useContinueResearch();

	const {
		doRequest: doStartResearch,
		loading: startLoading,
		data: startData,
	} = useStartResearch({
		onCompleted: (result) => {
			if (result?.startRun?.status === "published") {
				setIsFinished(true);
			} else {
				setMessages(result?.startRun?.messages?.reverse?.() || []);
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

	const handleSendMessage = useCallback(
		(content) => {
			const optimisticMessages = [
				...startData.startRun.messages,
				mockDataMessage("user", content),
				mockDataMessage("assistant", ""),
			];
			setMessages(optimisticMessages);
			doContinueResearch({
				variables: {
					uuid: startId,
					content,
				},
				refetchQueries: [RESEARCH],
				onCompleted: (result) => {
					setMessages(result?.continueRun?.messages?.reverse?.() || []);
				},
			});
		},
		[startId]
	);

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
