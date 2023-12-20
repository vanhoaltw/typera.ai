import VoiceButton from "@/components/VoiceButton";
import "regenerator-runtime/runtime";
import SpeechRecognition, {
	useSpeechRecognition,
} from "react-speech-recognition";
import { useContinueResearch, useStartResearch } from "@/hook/research";
import { useDebouncedCallback } from "use-debounce";
import { useEffect, useLayoutEffect, useMemo, useState } from "react";
import { BeatLoader } from "react-spinners";
import { REGEX_FILE, getFileId, parsedText } from "@/utils/common";
import { useGeneralStore } from "@/store/general";
import { RESEARCH } from "@/graphql/research";
import { Link, useParams } from "react-router-dom";

const parseMessage = (v) =>
	parsedText(v, REGEX_FILE, (matchResult) => {
		const json = safeParse(matchResult);
		if (json?.question) return json.question;
		return "";
	});

const Voice = () => {
	const { id: paramId } = useParams();

	const [currentText, setCurrentText] = useState("");
	const { setFileId } = useGeneralStore();
	const {
		transcript,
		resetTranscript,
		listening,
		browserSupportsSpeechRecognition,
		isMicrophoneAvailable,
	} = useSpeechRecognition({ clearTranscriptOnListen: true });

	const {
		doRequest: doStartResearch,
		loading: startLoading,
		data: startData,
	} = useStartResearch();
	const startId = startData?.startRun?.uuid;

	const [doContinueResearch, { loading: continueLoading }] =
		useContinueResearch();

	const handleContinueResearch = () => {
		doContinueResearch({
			variables: {
				uuid: startId,
				content: transcript,
			},
			onCompleted: async (result) => {
				const messages = result?.continueRun?.messages || [];
				const fileId = await getFileId(messages);
				setCurrentText(parseMessage(messages[0]?.content?.[0]?.text?.value));
				if (fileId) setFileId(fileId);
			},
		});
		resetTranscript();
	};

	const startListening = useDebouncedCallback(
		() => SpeechRecognition.startListening({ continuous: true }),
		250
	);

	const stopListening = () => SpeechRecognition.stopListening();

	useLayoutEffect(() => {
		doStartResearch({
			onCompleted: async (result) => {
				if (result?.startRun?.status === "published") {
					setIsFinished(true);
				} else {
					const message = result?.startRun?.messages;
					const fileId = await getFileId(message);
					setCurrentText(parseMessage(message[0]?.content?.[0]?.text?.value));
					if (fileId) setFileId(fileId);
				}
			},
		});

		return () => {
			stopListening();
		};
	}, []);

	useEffect(() => {
		let timer;
		if (
			listening &&
			!startLoading &&
			!continueLoading &&
			!!transcript?.trim?.() &&
			!!startId
		) {
			timer = setTimeout(() => handleContinueResearch(), 2000);
		}
		return () => {
			clearTimeout(timer);
		};
	}, [transcript, listening, startLoading, continueLoading, startId]);

	if (!browserSupportsSpeechRecognition) {
		return <span>Browser doesn't support speech recognition.</span>;
	}

	if (!isMicrophoneAvailable) {
		return <span>Please turn on your microphone</span>;
	}

	if (startLoading)
		return (
			<div className="flex items-center justify-center h-full">
				<BeatLoader />
			</div>
		);

	return (
		<div className="h-full flex flex-col items-center justify-center p-6 relative">
			<div className="relative w-full flex justify-center items-end h-40 z-0">
				<img
					className="absolute -top-24 left-1/2 -translate-x-1/2"
					src="/circle-wave-up.svg"
					height={650}
					width={650}
				/>
				<img src="/question.svg" width={41} height={39} />
			</div>

			<h1 className="text-center text-3xl z-10 mt-6 mb-8 min-w-0 break-words line-clamp-4">
				{currentText}
			</h1>

			<div className="z-10 h-36">
				<VoiceButton
					onStartSpeech={startListening}
					onFinishSpeech={handleContinueResearch}
					onStopSpeech={stopListening}
					loading={continueLoading}
					listening={listening}
				/>
			</div>

			<Link
				to={`/interview/${paramId}/chat`}
				className="underline opacity-60 text-sm absolute bottom-4 left-1/2 -translate-x-1/2"
			>
				Switch to text chat
			</Link>
		</div>
	);
};

export default Voice;
