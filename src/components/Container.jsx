import { cn } from "@/utils/common";
import React from "react";

const Container = ({ children, className, style }) => {
	return (
		<div className={cn("container", className)} style={style}>
			{children}
		</div>
	);
};

export default Container;
