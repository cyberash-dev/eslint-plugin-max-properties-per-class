import maxMethods from "./rules/max-methods.mjs";
import maxProperties from "./rules/max-properties.mjs";

const plugin = {
	meta: { name: "cyberash", version: "1.0.0" },
	rules: {
		"max-methods": maxMethods,
		"max-properties": maxProperties,
	},
};

plugin.configs = {
	recommended: {
		plugins: { cyberash: plugin },
		rules: {
			"cyberash/max-methods": ["error", { max: 10 }],
			"cyberash/max-properties": ["error", { max: 15 }],
		},
	},
};

export default plugin;
