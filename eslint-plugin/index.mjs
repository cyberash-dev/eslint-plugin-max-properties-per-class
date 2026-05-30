import maxMethods from "./rules/max-methods.mjs";
import maxProperties from "./rules/max-properties.mjs";

export default {
	meta: { name: "cyberash", version: "1.0.0" },
	rules: {
		"max-methods": maxMethods,
		"max-properties": maxProperties,
	},
};
