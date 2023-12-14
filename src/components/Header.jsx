import React from "react";
import { Link } from "react-router-dom";

const Header = () => {
	return (
		<header className="h-[72px] fixed top-0 left-0 w-full flex items-center bg-white">
			<div className="container">
				<Link>
					<img
						height="auto"
						className="w-32 sm:w-[170px] transition-all"
						loading="eager"
						src="/logo.svg"
						alt="Logo"
					/>
				</Link>
			</div>
		</header>
	);
};

export default Header;
