export const audioBufferToBlob = async (audioBuffer) => {
	const uInt8Array = new Uint8Array(audioBuffer);
	const arrayBuffer = uInt8Array.buffer;
	return new Blob([arrayBuffer], { type: "audio/wav" });
};

export const playAudioBlob = (blob) => {
	const url = URL.createObjectURL(blob);
	const audio = new Audio(url);
	audio.preload = "auto";
	return {
		audio,
		url,
	};
};
