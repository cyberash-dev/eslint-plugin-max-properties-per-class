import type { TSESLint } from "@typescript-eslint/utils";

import maxMethods from "./rules/max-methods";
import maxProperties from "./rules/max-properties";

const configs: Record<string, TSESLint.FlatConfig.Config> = {};

const plugin: TSESLint.FlatConfig.Plugin = {
	meta: { name: "cyberash", version: "1.0.0" },
	rules: {
		"max-methods": maxMethods,
		"max-properties": maxProperties,
	},
	configs,
};

configs.recommended = {
	plugins: { "max-properties-per-class": plugin },
	rules: {
		"max-properties-per-class/max-methods": ["error", { max: 10 }],
		"max-properties-per-class/max-properties": ["error", { max: 15 }],
	},
};

export default plugin;
