import { RuleTester } from "eslint";
import tseslint from "typescript-eslint";

import rule from "../../rules/max-properties.mjs";

const ruleTester = new RuleTester({
	languageOptions: {
		parser: tseslint.parser,
		ecmaVersion: "latest",
		sourceType: "module",
	},
});

function props(count) {
	return Array.from({ length: count }, (_, i) => `  p${i} = 0;`).join("\n");
}

function classWith(count, extra) {
	return `class C {\n${props(count)}\n${extra}\n}`;
}

ruleTester.run("max-properties", rule, {
	valid: [
		{ code: `class C {\n${props(15)}\n}`, options: [{ max: 15 }] },
		{ code: `class C {\n${props(15)}\n}`, options: [15] },
		{
			code: classWith(
				15,
				Array.from({ length: 5 }, (_, i) => `  f${i} = () => {};`).join("\n"),
			),
			options: [{ max: 15 }],
		},
		{
			code: classWith(14, "  get x() {\n    return 0;\n  }\n  set x(v) {}"),
			options: [{ max: 15 }],
		},
		{
			code: classWith(14, "  get x() {\n    return 0;\n  }"),
			options: [{ max: 15 }],
		},
		{
			code: classWith(14, "  accessor a = 0;"),
			options: [{ max: 15 }],
		},
		{
			code: `class C {\n  constructor(public x: number) {}\n${props(14)}\n}`,
			options: [{ max: 15 }],
		},
		{
			code: `class C {\n  constructor(private x: number) {}\n${props(15)}\n}`,
			options: [{ max: 15 }],
		},
		{
			code: classWith(15, "  private q = 0;"),
			options: [{ max: 15 }],
		},
		{
			code: classWith(15, "  static s = 0;"),
			options: [{ max: 15 }],
		},
		{
			code: classWith(15, "  [k: string]: number;"),
			options: [{ max: 15 }],
		},
		{
			code: "interface I {\n  foo: () => void;\n}",
			options: [{ max: 0 }],
		},
		{
			code: "interface I {\n  a: number;\n  [k: string]: number;\n}",
			options: [{ max: 1 }],
		},
	],
	invalid: [
		{
			code: `class C {\n${props(16)}\n}`,
			options: [{ max: 15 }],
			errors: [
				{ messageId: "tooManyProperties", data: { count: 16, max: 15 } },
			],
		},
		{
			code: classWith(15, "  private q = 0;"),
			options: [{ max: 15, includePrivate: true }],
			errors: [{ messageId: "tooManyProperties" }],
		},
		{
			code: classWith(15, "  static s = 0;"),
			options: [{ max: 15, includeStatic: true }],
			errors: [{ messageId: "tooManyProperties" }],
		},
		{
			code: classWith(15, "  protected r = 0;"),
			options: [{ max: 15 }],
			errors: [
				{ messageId: "tooManyProperties", data: { count: 16, max: 15 } },
			],
		},
		{
			code: `class C {\n  constructor(private x: number) {}\n${props(15)}\n}`,
			options: [{ max: 15, includePrivate: true }],
			errors: [{ messageId: "tooManyProperties" }],
		},
	],
});
