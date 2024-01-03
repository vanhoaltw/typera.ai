import { STREAM } from "@/graphql/research";
import { audioBufferToBlob, playAudioBlob } from "@/utils/audioBufferToBlob";
import { useState } from "react";
import { useDebouncedCallback } from "use-debounce";

export const useTTS = () => {
	const [audio, setAudio] = useState(null);
	const [getStream] = useLazyQuery(STREAM);

	const destroy = useCallback(() => {
		if (audio) {
			audio.currentTime = 0;
			audio.pause();
			URL.revokeObjectURL(audio.src);
		}
		setAudio(null);

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [audio?.src]);

	const play = useDebouncedCallback(
		async (text) => {
			if (audio) {
				audio.remove();
				audio.currentTime = 0;
				audio.pause();
				URL.revokeObjectURL(audio.src);
			}

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
				setAudio(newAudio);
			}
		},
		250,
		{ leading: false, trailing: true }
	);

	return { audio, play, destroy };
};
