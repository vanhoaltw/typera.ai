import { memo, useEffect, useRef, useState } from "react";

const getAudioContext = () =>
	new (window.AudioContext || window.webkitAudioContext)();

const maxHeight = 80;
const minHeight = 40;
const count = 5;
const barsSet = Array.from({ length: (count + 1) / 2 }).fill(0);

const DEBUG = process.env.NODE_ENV !== "production";

const AudioVisualizer = ({ audio }) => {
	const [bars, setBars] = useState([0, 0, 0, 0]);
	const audioContextRef = useRef(null);
	const audioSourceRef = useRef(null);
	const analyserRef = useRef(null);
	const dataArrayRef = useRef(null);
	const animationFrameIdRef = useRef(null);

	const renderFrame = () => {
		animationFrameIdRef.current = requestAnimationFrame(renderFrame);
		if (analyserRef.current && dataArrayRef.current) {
			analyserRef.current.getByteFrequencyData(dataArrayRef.current);
			const step = Math.floor(dataArrayRef.current.length / barsSet.length);
			const newBars = barsSet.map((_, i) => {
				return dataArrayRef.current?.[i * step] || 0;
			});
			setBars(newBars);
		}
	};

	const resetRenderFrame = () => {
		if (animationFrameIdRef.current) {
			cancelAnimationFrame(animationFrameIdRef.current);
		}
	};

	useEffect(() => {
		if (!audio) return;

		try {
			if (!audioSourceRef.current) {
				audioContextRef.current = getAudioContext();
				analyserRef.current = audioContextRef.current.createAnalyser();
				analyserRef.current.fftSize = 256;
				analyserRef.current.connect(audioContextRef.current.destination);
				const bufferLength = analyserRef.current.frequencyBinCount;
				dataArrayRef.current = new Uint8Array(bufferLength);

				audioSourceRef.current =
					audioContextRef.current.createMediaElementSource(audio);
				audioSourceRef.current.connect(audioContextRef.current.destination);
				audioSourceRef.current.connect(analyserRef.current);
			}
			renderFrame();
		} catch (error) {
			if (DEBUG) console.error("Error useAudioVisualizer:", error);
		}

		return () => {
			resetRenderFrame();
		};
	}, [audio?.src]);

	useEffect(() => {
		return () => {
			audioSourceRef.current?.disconnect?.();
			analyserRef.current?.disconnect?.();
			audioContextRef.current?.close?.();
		};
	}, []);

	const reverseBars = [...bars].slice(1, bars.length).reverse();

	return (
		<div className="h-20 overflow-hidden flex items-center justify-center gap-1.5">
			{[...reverseBars, ...bars].map((bar, index) => (
				<div
					key={index}
					className="bg-primary rounded-md w-6 transform-gpu"
					style={{
						height: minHeight + (bar / 255) * (maxHeight - minHeight),
						transition: "height 50ms cubic-bezier(.2,-0.5,.8,1.5)",
					}}
				/>
			))}
		</div>
	);
};

export default memo(AudioVisualizer, (pre, next) => {
	return pre?.src !== next?.src;
});
