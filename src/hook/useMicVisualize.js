import { useEffect, useRef, useState } from "react";

const useMicVisualize = () => {
	const [level, setLevel] = useState(0);

	const audioContextRef = useRef(null);
	const analyserRef = useRef(null);
	const dataArrayRef = useRef(null);
	const animationFrameIdRef = useRef(null);
	const audioSourceRef = useRef();

	const renderFrame = () => {
		animationFrameIdRef.current = requestAnimationFrame(renderFrame);
		if (analyserRef.current) {
			const bufferLength = analyserRef.current.frequencyBinCount;
			dataArrayRef.current = new Uint8Array(bufferLength);
			analyserRef.current.getByteFrequencyData(dataArrayRef.current);
			const dataLevel = Math.max.apply(null, dataArrayRef.current);
			setLevel(dataLevel);
		}
	};

	const resetRenderFrame = () => {
		if (animationFrameIdRef.current) {
			cancelAnimationFrame(animationFrameIdRef.current);
		}
		setLevel(0);
	};

	useEffect(() => {
		let tracks = [];
		try {
			const init = async () => {
				const stream = await navigator.mediaDevices.getUserMedia({
					audio: true,
				});
				audioContextRef.current = new (window.AudioContext ||
					window.webkitAudioContext)();

				analyserRef.current = audioContextRef.current.createAnalyser();
				analyserRef.current.minDecibels = -90;
				analyserRef.current.maxDecibels = -10;
				analyserRef.current.fftSize = 256;

				let distortion = audioContextRef.current.createWaveShaper();
				let gainNode = audioContextRef.current.createGain();
				let biquadFilter = audioContextRef.current.createBiquadFilter();

				tracks = stream.getTracks();
				audioSourceRef.current =
					audioContextRef.current.createMediaStreamSource(stream);
				audioSourceRef.current.connect(distortion);
				distortion.connect(biquadFilter);
				biquadFilter.connect(gainNode);
				gainNode.connect(analyserRef.current);
				analyserRef.current.connect(audioContextRef.current.destination);

				renderFrame();
			};
			init();
		} catch (error) {
			console.log("The following gUM error occured: " + error);
		}

		return () => {
			tracks.forEach((track) => {
				track.stop();
			});
			resetRenderFrame;
		};
	}, []);

	return { level };
};

export default useMicVisualize;
