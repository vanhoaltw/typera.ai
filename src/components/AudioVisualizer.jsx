import { memo, useEffect, useRef } from "react";

const getAudioContext = () =>
	new (window.AudioContext || window.webkitAudioContext)();

const colorShades = ["#F99B56", "#DF7733", "#C45B1C", "#A73E07"];

const AudioVisualizer = ({ audioRef }) => {
	const audioContextRef = useRef(null);
	const audioSourceRef = useRef(null);
	const analyserRef = useRef(null);
	const dataArrayRef = useRef(null);
	const animationFrameIdRef = useRef(null);
	const canvasRef = useRef(null);

	const renderFrame = () => {
		animationFrameIdRef.current = requestAnimationFrame(renderFrame);
		if (analyserRef.current && dataArrayRef?.current) {
			const bufferLength = analyserRef.current.frequencyBinCount;
			analyserRef.current.getByteFrequencyData(dataArrayRef.current);

			const { width, height } = canvasRef.current || {};
			const barWidth = Math.ceil(width / bufferLength) * 2.5;

			const canvasContext = canvasRef.current.getContext("2d");
			canvasContext.clearRect(0, 0, width, height);

			let x = 0;
			dataArrayRef.current.forEach((item) => {
				const y = (item / 255) * height * 1.1;
				const shade = Math.floor((item / 255) * colorShades.length); // generate a shade of blue based on the audio input
				const colorHex = colorShades[shade];
				canvasContext.fillStyle = colorHex;
				canvasContext.fillRect(x, height - y, barWidth, y);
				x = x + barWidth;
			});
		}
	};

	const resetRenderFrame = () => {
		if (animationFrameIdRef.current) {
			cancelAnimationFrame(animationFrameIdRef.current);
		}
	};

	useEffect(() => {
		if (!audioRef.current || !canvasRef.current) return;
		try {
			if (!audioSourceRef.current) {
				audioContextRef.current = getAudioContext();
				analyserRef.current = audioContextRef.current.createAnalyser();
				analyserRef.current.fftSize = 256;
				analyserRef.current.connect(audioContextRef.current.destination);
				const bufferLength = analyserRef.current.frequencyBinCount;
				dataArrayRef.current = new Uint8Array(bufferLength);

				audioSourceRef.current =
					audioContextRef.current.createMediaElementSource(audioRef.current);
				audioSourceRef.current.connect(audioContextRef.current.destination);
				audioSourceRef.current.connect(analyserRef.current);
			}
			renderFrame();
		} catch (error) {
			console.error("Error useAudioVisualizer:", error);
		}

		return () => {
			if (!audioSourceRef.current) {
				audioSourceRef.current?.disconnect();
				analyserRef.current?.disconnect();
				audioContextRef.current?.close();
			}
			resetRenderFrame();
		};
	}, [audioRef?.current?.src]);

	return <canvas ref={canvasRef} className="h-20 w-40 mx-auto" />;
};

export default memo(AudioVisualizer);
