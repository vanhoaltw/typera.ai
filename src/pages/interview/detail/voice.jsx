import VoiceButton from "@/components/VoiceButton";
import "regenerator-runtime/runtime";
import SpeechRecognition, {
	useSpeechRecognition,
} from "react-speech-recognition";
import { useContinueResearch, useStartResearch } from "@/hook/research";
import { useDebouncedCallback } from "use-debounce";
import { useEffect, useLayoutEffect, useState } from "react";
import { BeatLoader } from "react-spinners";
import {
	REGEX_FILE,
	getFileId,
	parsedText,
	safeParse,
	safePlay,
} from "@/utils/common";
import { useGeneralStore } from "@/store/general";
import { Link, useParams } from "react-router-dom";
import { useLazyQuery } from "@apollo/client";
import { STREAM } from "@/graphql/research";
import { audioBufferToBlob, playAudioBlob } from "@/utils/audioBufferToBlob";

const parseMessage = (v) =>
	parsedText(v, REGEX_FILE, (matchResult) => {
		const json = safeParse(matchResult);
		if (json?.question) return json.question;
		return "";
	});

const Voice = () => {
	const { id: paramId } = useParams();
	const [audio, setAudio] = useState();
	const [init, setInit] = useState(false);
	const [isSpeaking, setIsSpeaking] = useState(false);
	const [getStream, { loading: getStreamLoading }] = useLazyQuery(STREAM);
	const [currentText, setCurrentText] = useState("");
	const { setFileId } = useGeneralStore();
	const {
		transcript,
		resetTranscript,
		listening,
		browserSupportsSpeechRecognition,
		isMicrophoneAvailable,
	} = useSpeechRecognition({ clearTranscriptOnListen: true });

	const { doRequest: doStartResearch, data: startData } = useStartResearch();
	const startId = startData?.startRun?.uuid;

	const [doContinueResearch, { loading: continueLoading }] =
		useContinueResearch();

	const handleStartSpeech = useDebouncedCallback(() => {
		SpeechRecognition.startListening({ continuous: true });
	}, 250);

	const handleTTS = async (text) => {
		setIsSpeaking(true);
		const { data: { stream } = {} } = await getStream({
			variables: { text },
		});
		if (stream?.data && stream?.type === "Buffer") {
			const soundBuffer = stream?.data;
			const audioBlob = await audioBufferToBlob(soundBuffer);
			if (!audioBlob || audioBlob.size === 0) return;
			if (audio) audio.remove();
			if (audio?.src) URL.revokeObjectURL(audio.src);
			const { audio: newAudio } = playAudioBlob(audioBlob);
			setAudio(newAudio);
			safePlay(newAudio, () => setIsSpeaking(false));
		}
	};

	const handleInterrupt = () => {
		setIsSpeaking(false);
		if (audio) {
			audio.currentTime = 0;
			audio.pause();
			setAudio(null);
		}
	};

	const handleContinueResearch = () => {
		doContinueResearch({
			variables: {
				uuid: startId,
				content: transcript,
			},
			onCompleted: async (result) => {
				const messages = result?.continueRun?.messages || [];
				const fileId = await getFileId(messages);
				const parser = parseMessage(messages[0]?.content?.[0]?.text?.value);
				await handleTTS(parser.join(" "));
				setCurrentText(parser);
				if (fileId) setFileId(fileId);
			},
		});
		resetTranscript();
	};

	useLayoutEffect(() => {
		doStartResearch({
			onCompleted: async (result) => {
				setInit(true);
				const message = result?.startRun?.messages;
				const fileId = await getFileId(message);
				const parser = parseMessage(message[0]?.content?.[0]?.text?.value);
				setCurrentText(parser);
				if (fileId) setFileId(fileId);
			},
		});

		return () => {
			SpeechRecognition.stopListening();
			handleInterrupt();
		};
	}, []);

	useEffect(() => {
		const onAudioEnd = () => setIsSpeaking(false);
		if (audio) {
			audio.addEventListener("ended", onAudioEnd);
		}
		return () => {
			audio?.removeEventListener?.("ended", onAudioEnd);
		};
	}, [audio]);

	useEffect(() => {
		let timer;
		if (
			listening &&
			!init &&
			!continueLoading &&
			!isSpeaking &&
			!!transcript &&
			!!startId
		) {
			timer = setTimeout(() => handleContinueResearch(), 2000);
		}
		return () => {
			clearTimeout(timer);
		};
	}, [transcript, listening, init, continueLoading, startId, isSpeaking]);

	if (!browserSupportsSpeechRecognition) {
		return <span>Browser doesn't support speech recognition.</span>;
	}

	if (!isMicrophoneAvailable) {
		return <span>Please turn on your microphone</span>;
	}

	if (!init)
		return (
			<div className="flex items-center justify-center h-full">
				<BeatLoader />
			</div>
		);

	return (
		<div className="h-full flex flex-col items-center justify-center p-6 relative">
			<div className="relative w-full flex justify-center items-end h-40 z-0">
				<img
					className="absolute -top-20 left-1/2 -translate-x-1/2"
					src="/circle-wave-up.svg"
					height={650}
					width={650}
				/>
				<img src="/question.svg" width={41} height={39} />
			</div>

			<h3 className="text-center text-2xl z-10 mt-6 mb-8 min-w-0 break-words max-h-[100px] overflow-auto">
				{currentText}
			</h3>

			<div className="z-10 h-36">
				<VoiceButton
					audioRef={{ current: audio }}
					onStartSpeech={handleStartSpeech}
					onFinishSpeech={handleContinueResearch}
					onInterrupt={handleInterrupt}
					loading={continueLoading || getStreamLoading}
					listening={listening}
					speaking={isSpeaking}
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
