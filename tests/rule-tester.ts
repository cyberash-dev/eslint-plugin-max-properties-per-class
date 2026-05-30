import { type Linter, type Rule, RuleTester } from "eslint";
import tseslint from "typescript-eslint";

import plugin from "../src/index";

export const ruleTester = new RuleTester({
	languageOptions: {
		parser: tseslint.parser as unknown as Linter.Parser,
		ecmaVersion: "latest",
		sourceType: "module",
	},
});

export function getRule(name: "max-methods" | "max-properties"): Rule.RuleModule {
	return plugin.rules?.[name] as unknown as Rule.RuleModule;
}
