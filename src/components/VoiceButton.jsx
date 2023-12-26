import Micro from "@/assets/micro";
import useMicVisualize from "@/hook/useMicVisualize";
import { Button } from "./Button";
import { BeatLoader } from "react-spinners";
import AudioVisualizer from "./AudioVisualizer";
import { memo } from "react";

const MicroButton = ({ onFinishSpeech }) => {
	const { level } = useMicVisualize();
	const scalePercent = Math.min(Math.max(level / 50, 1), 1.2);

	return (
		<div className="flex items-center flex-col">
			<button
				type="button"
				onClick={onFinishSpeech}
				style={{ transform: `scale(${scalePercent})` }}
				className="aspect-square transition-transform flex items-center cursor-pointer justify-center h-[80px] rounded-full bg-primary"
			>
				<Micro />
			</button>
			<span className="text-base text-[#8F9BB3] mt-3 max-w-sm text-center">
				Simply stop talking or hit the microphone button to send your response.
			</span>
		</div>
	);
};

const VoiceButton = ({
	audio,
	onFinishSpeech,
	onInterrupt,
	speaking,
	loading,
}) => {
	if (speaking || loading) {
		return (
			<div className="flex items-center flex-col justify-center gap-3">
				<div className="h-[80px]  flex items-center justify-center">
					{loading ? <BeatLoader /> : <AudioVisualizer audio={audio} />}
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

	return <MicroButton onFinishSpeech={onFinishSpeech} />;
};

export default memo(VoiceButton);
