import cyberash from "./eslint-plugin/index.mjs";

export default [
	{
		plugins: { cyberash },
		rules: {
			"cyberash/max-methods": ["error", { max: 10 }],
			"cyberash/max-properties": ["error", { max: 15 }],
		},
	},
];
