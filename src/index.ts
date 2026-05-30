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
	plugins: { cyberash: plugin },
	rules: {
		"cyberash/max-methods": ["error", { max: 10 }],
		"cyberash/max-properties": ["error", { max: 15 }],
	},
};

export default plugin;
