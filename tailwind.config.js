/** @type {import('tailwindcss').Config} */

const { fontFamily } = require("tailwindcss/defaultTheme");

module.exports = {
	content: ["./index.html", "./src/**/*.{vue,js,ts,jsx,tsx}"],
	theme: {
		container: {
			center: true,
			padding: "2rem",
			screens: {
				"2xl": "1400px",
			},
		},
		extend: {
			fontFamily: {
				primary: ["Inter", ...fontFamily.sans],
			},
			colors: {
				primary: {
					400: "#00E0F3",
					500: "#00c4fd",
				},
				dark: "#333333",
			},
		},
	},
	variants: {
		extend: {},
	},
	plugins: [require('tailwindcss-animate')]

};
