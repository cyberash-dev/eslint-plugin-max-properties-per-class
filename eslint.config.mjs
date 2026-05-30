import js from "@eslint/js";
import globals from "globals";
import base from "./eslint.base.mjs";

export default [
	js.configs.recommended,
	{
		languageOptions: {
			ecmaVersion: "latest",
			sourceType: "module",
			globals: { ...globals.node },
		},
	},
	...base,
];
