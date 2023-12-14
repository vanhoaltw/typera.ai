import ChatComposer from "@/components/ChatComposer";
import ChatItem from "@/components/ChatItem";
import VoiceButton from "@/components/VoiceButton";
import { useGeneralStore } from "@/store/general";
import React, { useEffect } from "react";

const Voice = () => {
	const { setMedia } = useGeneralStore();
	// useEffect(() => {
	// 	setMedia("/");
	// }, []);

	return (
		<div className="h-full flex flex-col items-center justify-center">
			<div className="relative w-full flex justify-center items-end h-40">
				<img
					className="absolute -top-28 left-1/2 -translate-x-1/2"
					src="/circle-wave-up.svg"
					height={650}
					width={650}
				/>
				<img src="/question.svg" width={41} height={39} />
			</div>

			<h1 className="text-center text-[32px] mt-6 mb-[72px]">
				Hey Trung, What is the nature of the man's interaction with the fish?
				Does he appear curious, protective, or indifferent?
			</h1>

			<VoiceButton />
		</div>
	);
};

export default Voice;
