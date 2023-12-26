import Micro from "@/assets/micro";
import useMicVisualize from "@/hook/useMicVisualize";
import { Button } from "./Button";
import { BeatLoader } from "react-spinners";
import AudioVisualizer from "./AudioVisualizer";
import { useDebounce } from "use-debounce";
import { memo } from "react";

const VoiceButton = ({
	audioRef,
	onStartSpeech,
	onFinishSpeech,
	onInterrupt,
	listening,
	speaking,
	loading,
}) => {
	const { level } = useMicVisualize({ disabled: !listening });
	const [stateSpeaking] = useDebounce(speaking || loading, 250);

	if (stateSpeaking) {
		return (
			<div className="flex items-center flex-col justify-center gap-3">
				<div className="h-[80px]  flex items-center justify-center">
					{loading ? <BeatLoader /> : <AudioVisualizer audioRef={audioRef} />}
				</div>

				<Button
					onClick={onInterrupt}
					disabled={loading}
					variant="outline"
					className="bg-white text-[#8F9BB3] hover:bg-white"
				>
					<span className="inline-block h-4 aspect-square rounded-sm bg-current" />
					Click to interrupt
				</Button>
			</div>
		);
	}

	return (
		<div className="flex items-center flex-col">
			<button
				type="button"
				onClick={listening ? onFinishSpeech : onStartSpeech}
				style={{ outline: `${level / 5}px solid #eee` }}
				className="aspect-square flex items-center cursor-pointer hover:bg-primary/60 transition-colors justify-center h-[80px] rounded-full bg-primary outline outline-primary/20"
			>
				<Micro />
			</button>
			<span className="text-base text-[#8F9BB3] mt-2 max-w-sm text-center">
				{!listening
					? "Press the button to speak"
					: "Simply stop talking or hit the microphone button to send your response."}
			</span>
		</div>
	);
};

export default memo(VoiceButton);
