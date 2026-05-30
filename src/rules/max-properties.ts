import type { JSONSchema, TSESLint } from "@typescript-eslint/utils";

import {
	countBucket,
	type CountFlags,
	type Declaration,
} from "../lib/count-members";

const DEFAULT_MAX = 15;

interface PropertiesOptions {
	max?: number;
	includePrivate?: boolean;
	includeStatic?: boolean;
}

type Options = readonly [(number | PropertiesOptions)?];
type MessageIds = "tooManyProperties";

const schema: JSONSchema.JSONSchema4[] = [
	{
		oneOf: [
			{ type: "integer", minimum: 0 },
			{
				type: "object",
				properties: {
					max: { type: "integer", minimum: 0 },
					includePrivate: { type: "boolean" },
					includeStatic: { type: "boolean" },
				},
				additionalProperties: false,
			},
		],
	},
];

function normalize(
	option: number | PropertiesOptions | undefined,
): PropertiesOptions {
	if (typeof option === "number") {
		return { max: option };
	}
	return option ?? {};
}

const rule: TSESLint.RuleModule<MessageIds, Options> = {
	defaultOptions: [{ max: DEFAULT_MAX }],
	meta: {
		type: "suggestion",
		docs: {
			description:
				"Enforce a maximum number of properties in a class or interface.",
			url: "https://github.com/cyberash-dev/eslint-plugin-max-properties-per-class#max-properties",
		},
		schema,
		messages: {
			tooManyProperties:
				"Too many properties ({{count}}); maximum allowed is {{max}}.",
		},
	},
	create(context) {
		const option = normalize(context.options[0]);
		const max = option.max ?? DEFAULT_MAX;
		const flags: CountFlags = {
			includePrivate: option.includePrivate ?? false,
			includeStatic: option.includeStatic ?? false,
			includeProtected: false,
		};

		function check(node: Declaration): void {
			const count = countBucket(node, "property", flags);
			if (count > max) {
				context.report({
					node,
					messageId: "tooManyProperties",
					data: { count, max },
				});
			}
		}

		return {
			ClassDeclaration: check,
			ClassExpression: check,
			TSInterfaceDeclaration: check,
		};
	},
};

export default rule;
