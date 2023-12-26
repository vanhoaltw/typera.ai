import { Button } from "@/components/Button";
import { useState } from "react";
import { Link } from "react-router-dom";
import Voice from "./voice";

export default function Interview() {
	const [isVoice, setIsVoice] = useState(false);

	if (isVoice) return <Voice />;

	return (
		<div className="h-full">
			<div className="flex h-full flex-col items-center justify-center text-center max-w-lg mx-auto">
				<img
					src="/images/chat-w-question.jpg"
					height={53}
					width={53}
					alt="Welcome"
				/>
				<h1 className="mt-3 mb-1 leading-normal">Welcome to Typera AI!</h1>
				<p>
					Thank you for participating in our survey. We value your insights and
					are excited to hear from you.
				</p>

				<div className="flex items-stretch gap-x-[38px] my-14 text-left">
					<div>
						<h3 className="mb-2">Voice Interview:</h3>
						<p>
							Click the "Voice Interview" button below. If prompted. Pause or
							stop anytime with the buttons. Good luck! 🎤🎙️
						</p>
					</div>
					<img src="/divider.svg" height={115} width={1} />
					<div>
						<h3 className="mb-2">Chatbot Interview:</h3>
						<p>
							Prefer typing? Select the "Chatbot Interview" button to proceed
							with a text-based conversation. 💬
						</p>
					</div>
				</div>

				<p className="mb-4">
					Are you ready to start? Click your preferred option below and let's
					begin!
				</p>

				<Button
					onClick={() => setIsVoice(true)}
					className="mb-2 w-[250px]"
					size="lg"
				>
					Start Voice Interview
				</Button>

				<Button
					variant="ghost"
					className="w-[250px] !text-primary hover:bg-primary/10"
					size="lg"
				>
					<Link to="chat">Switch to Chatbot Interview</Link>
				</Button>
			</div>
		</div>
	);
}
