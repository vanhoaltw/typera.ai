import VoiceButton from "@/components/VoiceButton";
import "regenerator-runtime/runtime";
import SpeechRecognition, {
	useSpeechRecognition,
} from "react-speech-recognition";
import { useContinueResearch, useStartResearch } from "@/hook/research";
import { useDebouncedCallback } from "use-debounce";
import { memo, useEffect, useState } from "react";
import { BeatLoader } from "react-spinners";
import { safePlay } from "@/utils/common";
import { useGeneralStore } from "@/store/general";
import { Link, useParams } from "react-router-dom";
import { useLazyQuery } from "@apollo/client";
import { STREAM } from "@/graphql/research";
import { audioBufferToBlob, playAudioBlob } from "@/utils/audioBufferToBlob";
import { extractJsonFromString } from "@/utils/string";
import { alphabet } from "@/components/ChatItem";

let audioRef = null;
const combineJsonWithText = (json, text) => {
	let result = `${text} ${json?.question || ""}`;
	if (json?.question_type === "radio" && !!json?.answer_options?.length) {
		result += json.answer_options
			?.map((i, idx) => `\n${alphabet[idx].toUpperCase()}: ${i}`)
			.join("");
	}
	return result;
};

const Voice = memo(({ startId, textStarter, transcript, resetTranscript }) => {
	const { id: paramId } = useParams();
	const [audio, setAudio] = useState();
	const [isSpeaking, setIsSpeaking] = useState(!!textStarter);

	const [currentText, setCurrentText] = useState(textStarter);
	const { setCurrentQuestion } = useGeneralStore();

	const [voiceLoading, setVoiceLoading] = useState(false);
	const [getStream] = useLazyQuery(STREAM);
	const [doContinueResearch] = useContinueResearch();

	const handleStartSpeech = useDebouncedCallback(() => {
		SpeechRecognition.startListening({ continuous: true });
	}, 250);

	const handleTTS = useDebouncedCallback(
		async (text) => {
			setIsSpeaking(true);
			const { data: { stream } = {} } = await getStream({
				variables: { text },
			});
			if (stream?.data && stream?.type === "Buffer") {
				const soundBuffer = stream?.data;
				const audioBlob = await audioBufferToBlob(soundBuffer);
				if (!audioBlob || audioBlob.size === 0) return;
				if (audio) {
					audio.remove();
					audio.currentTime = 0;
					audio.pause();
					URL.revokeObjectURL(audio.src);
				}
				const { audio: newAudio } = playAudioBlob(audioBlob);

				safePlay(newAudio, () => setIsSpeaking(false));
				setAudio(newAudio);
				audioRef = newAudio;
			}
		},
		250,
		{ leading: false, trailing: true }
	);

	const handleInterrupt = () => {
		if (audioRef) {
			audioRef.currentTime = 0;
			audioRef.pause();
			setAudio(null);
		}
	};

	const handleContinueResearch = () => {
		setVoiceLoading(true);
		doContinueResearch({
			variables: {
				uuid: startId,
				content: transcript,
			},
			onError: () => setVoiceLoading(false),
			onCompleted: async (result) => {
				const { messages = [] } = result?.continueRun || [];
				const { obj, str } = extractJsonFromString(
					messages?.[0]?.content?.[0]?.text?.value
				);
				const text = combineJsonWithText(obj, str);
				setCurrentText(text);
				await handleTTS(text);
				setCurrentText(text);
				if (obj) setCurrentQuestion(obj);
				setVoiceLoading(false);
			},
		});
		resetTranscript();
	};

	useEffect(() => {
		handleStartSpeech();
		handleTTS(currentText);
		return () => {
			SpeechRecognition.stopListening();
			handleInterrupt();
		};
	}, []);

	useEffect(() => {
		const onAudioEnd = () => {
			setIsSpeaking(false);
			resetTranscript();
		};
		if (audio) {
			audio.addEventListener("ended", onAudioEnd);
		}
		return () => {
			if (audio) {
				audio?.removeEventListener?.("ended", onAudioEnd);
			}
		};
	}, [audio?.src]);

	useEffect(() => {
		let timer;
		if (!voiceLoading && !isSpeaking && !!transcript?.trim?.() && !!startId) {
			timer = setTimeout(() => handleContinueResearch(), 2000);
		}
		return () => {
			clearTimeout(timer);
		};
	}, [transcript, voiceLoading, startId, isSpeaking]);

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

			<h3 className="text-center whitespace-pre-wrap text-2xl z-10 mt-6 mb-8 min-w-0 break-words max-h-[100px] overflow-auto">
				{currentText}
			</h3>

			<div className="z-10 h-36">
				<VoiceButton
					audio={audio}
					onFinishSpeech={handleContinueResearch}
					onInterrupt={handleInterrupt}
					loading={voiceLoading}
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
});

const VoiceWrapper = () => {
	const [init, setInit] = useState(false);
	const { setCurrentQuestion } = useGeneralStore();
	const { id: paramId } = useParams();
	const [currentText, setCurrentText] = useState(null);
	const {
		transcript,
		resetTranscript,
		browserSupportsSpeechRecognition,
		isMicrophoneAvailable,
	} = useSpeechRecognition();

	const { doRequest: doStartResearch, data: startData } = useStartResearch({
		onCompleted: async (result) => {
			const messages = result?.startRun?.messages || [];
			const { obj, str } = extractJsonFromString(
				messages?.[0]?.content?.[0]?.text?.value
			);

			const text = combineJsonWithText(obj, str);
			setCurrentText(text);
			if (obj) setCurrentQuestion(obj);
			setInit(true);
		},
	});

	const startId = startData?.startRun?.uuid;

	useEffect(() => {
		SpeechRecognition.startListening({ continuous: true }).then(() => {
			navigator.mediaDevices
				.getUserMedia({ audio: true })
				.then(() => doStartResearch())
				.catch(() => console.log("not premiit"));
		});
	}, []);

	if (!browserSupportsSpeechRecognition) {
		return <span>Browser doesn't support speech recognition.</span>;
	}

	if (!isMicrophoneAvailable) {
		return (
			<div className="relative flex items-center justify-center h-full flex-col gap-4 text-red-500 text-center px-4">
				<p>
					We're having trouble accessing your microphone. Please make sure
					you've granted access to your microphone in your browser settings and
					refresh the page.
				</p>
				<p>If you're unable, click the link below to switch to a text chat.</p>

				<Link
					to={`/interview/${paramId}/chat`}
					className="underline text-black opacity-60 text-sm absolute bottom-4 left-1/2 -translate-x-1/2"
				>
					Switch to text chat
				</Link>
			</div>
		);
	}

	if (!init) {
		return (
			<div className="flex items-center justify-center h-full">
				<BeatLoader />
			</div>
		);
	}

	return (
		<Voice
			transcript={transcript}
			resetTranscript={resetTranscript}
			startId={startId}
			textStarter={currentText}
		/>
	);
};

export default VoiceWrapper;
