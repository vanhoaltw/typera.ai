module.exports = {
	env: { browser: true, es2020: true, node: true },
	extends: [
		"eslint:recommended",
		"plugin:react/recommended",
		"plugin:react/jsx-runtime",
		"plugin:react-hooks/recommended",
	],
	settings: {
		react: {
			version: "detect", // Automatically detect the react version
		},
		"import/resolver": {
			alias: {
				map: [["@", "./src"]],
			},
			node: {
				paths: ["src"],
				extensions: [".js", ".jsx", ".ts", ".tsx"],
			},
		},
	},
	parserOptions: {
		ecmaFeatures: {
			jsx: true,
		},
		ecmaVersion: "latest",
		sourceType: "module",
	},
	plugins: ["react-refresh", "simple-import-sort", "prettier", "jsx-a11y"],
	rules: {
		"prettier/prettier": ["error", {}, { usePrettierrc: true }],
		"react/react-in-jsx-scope": "off",
		"jsx-a11y/accessible-emoji": "off",
		"react/prop-types": "off",
		"@typescript-eslint/explicit-function-return-type": "off",
		"simple-import-sort/imports": "error",
		"simple-import-sort/exports": "error",
		"jsx-a11y/anchor-is-valid": [
			"error",
			{
				components: ["Link"],
				specialLink: ["hrefLeft", "hrefRight"],
				aspects: ["invalidHref", "preferButton"],
			},
		],
		"no-unused-vars": "warn",
		"react-refresh/only-export-components": "warn",
	},
};
