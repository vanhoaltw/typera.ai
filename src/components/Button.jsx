import { cn } from "@/utils/common";
import { cva } from "class-variance-authority";
import { Loader } from "lucide-react";
import { BeatLoader } from "react-spinners";

const buttonVariants = cva(
	"inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
	{
		variants: {
			variant: {
				default: "bg-primary text-primary-foreground hover:bg-primary/90",
				destructive:
					"bg-destructive text-destructive-foreground hover:bg-destructive/90",
				outline:
					"border border-input bg-background hover:bg-accent hover:text-accent-foreground",
				secondary:
					"bg-secondary text-secondary-foreground hover:bg-secondary/80",
				ghost: "hover:bg-accent hover:text-accent-foreground",
				link: "text-primary underline-offset-4 hover:underline",
			},
			size: {
				default: "h-10 px-4 py-2",
				sm: "h-9 rounded-md px-3",
				lg: "h-[48px] rounded-lg px-8",
			},
		},
		defaultVariants: {
			variant: "default",
			size: "default",
		},
	}
);

const Button = ({
	className,
	children,
	variant,
	size,
	isLoading,
	asChild = false,
	icon,
	isCircle = false,
	isIconOnly = false,
	...props
}) => {
	return (
		<button
			className={cn(
				"overflow-hidden gap-2 relative transform-gpu transition-colors select-none",
				"disabled:cursor-not-allowed disabled:select-none disabled:opacity-60",
				buttonVariants({
					variant,
					size,
					className,
				}),
				isCircle && "rounded-full",
				isIconOnly && "aspect-square"
			)}
			disabled={isLoading}
			{...props}
		>
			{isLoading ? (
				<BeatLoader size={11} color="currentColor" />
			) : (
				<>
					{icon}
					{children}
				</>
			)}
		</button>
	);
};

Button.displayName = "Button";

export { Button, buttonVariants };
