import { countBucket } from "../lib/count-members.mjs";

const DEFAULT_MAX = 10;

const schema = {
	oneOf: [
		{ type: "integer", minimum: 0 },
		{
			type: "object",
			properties: {
				max: { type: "integer", minimum: 0 },
				includePrivate: { type: "boolean" },
				includeStatic: { type: "boolean" },
				includeProtected: { type: "boolean" },
			},
			additionalProperties: false,
		},
	],
};

function normalize(option) {
	if (typeof option === "number") {
		return { max: option };
	}
	return option || {};
}

export default {
	meta: {
		type: "suggestion",
		docs: {
			description:
				"Enforce a maximum number of methods in a class or interface.",
		},
		schema: [schema],
		messages: {
			tooManyMethods:
				"Too many methods ({{count}}); maximum allowed is {{max}}.",
		},
	},
	create(context) {
		const option = normalize(context.options[0]);
		const max = option.max ?? DEFAULT_MAX;
		const flags = {
			includePrivate: option.includePrivate ?? false,
			includeStatic: option.includeStatic ?? false,
			includeProtected: option.includeProtected ?? false,
		};

		function check(node) {
			const count = countBucket(node, "method", flags);
			if (count > max) {
				context.report({
					node,
					messageId: "tooManyMethods",
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
