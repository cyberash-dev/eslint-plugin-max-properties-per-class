import js from "@eslint/js";
import globals from "globals";

import cyberash from "./index.mjs";

export default [
	js.configs.recommended,
	{
		languageOptions: {
			ecmaVersion: "latest",
			sourceType: "module",
			globals: { ...globals.node },
		},
	},
	cyberash.configs.recommended,
];
