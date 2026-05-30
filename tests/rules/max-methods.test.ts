import { getRule, ruleTester } from "../rule-tester";

const rule = getRule("max-methods");

function classWithMethods(count: number): string {
	const body = Array.from({ length: count }, (_, i) => `  m${i}() {}`).join(
		"\n",
	);
	return `class C {\n${body}\n}`;
}

function interfaceWithMethods(count: number): string {
	const body = Array.from(
		{ length: count },
		(_, i) => `  m${i}(): void;`,
	).join("\n");
	return `interface I {\n${body}\n}`;
}

function methods(count: number): string {
	return Array.from({ length: count }, (_, i) => `  m${i}() {}`).join("\n");
}

ruleTester.run("max-methods", rule, {
	valid: [
		{ code: classWithMethods(10), options: [{ max: 10 }] },
		{ code: classWithMethods(10), options: [10] },
		{
			code: `class C {\n  constructor() {}\n${methods(10)}\n}`,
			options: [{ max: 10 }],
		},
		{
			code: `class C {\n${methods(10)}\n  private p() {}\n}`,
			options: [{ max: 10 }],
		},
		{
			code: `class C {\n${methods(10)}\n  #h() {}\n}`,
			options: [{ max: 10 }],
		},
		{
			code: `class C {\n${methods(10)}\n  static s() {}\n}`,
			options: [{ max: 10 }],
		},
		{
			code: `class C {\n${methods(10)}\n  protected pr() {}\n}`,
			options: [{ max: 10 }],
		},
		{
			code: "class C {\n  foo(x: number): void;\n  foo(x: string): void;\n  foo(x: unknown): void {}\n}",
			options: [{ max: 1 }],
		},
		{
			code: `class C {\n${Array.from({ length: 10 }, (_, i) => `  f${i} = () => {};`).join("\n")}\n}`,
			options: [{ max: 10 }],
		},
		{
			code: `class C {\n${Array.from({ length: 10 }, (_, i) => `  f${i} = function () {};`).join("\n")}\n}`,
			options: [{ max: 10 }],
		},
		{ code: interfaceWithMethods(10), options: [{ max: 10 }] },
		{
			code: "interface I {\n  foo: () => void;\n  (): void;\n  new (): I;\n}",
			options: [{ max: 2 }],
		},
		{
			code: "class Outer {\n  m() {\n    class Inner {\n      a() {}\n    }\n    return Inner;\n  }\n}",
			options: [{ max: 1 }],
		},
	],
	invalid: [
		{
			code: classWithMethods(11),
			options: [{ max: 10 }],
			errors: [{ messageId: "tooManyMethods", data: { count: 11, max: 10 } }],
		},
		{
			code: `class C {\n${methods(10)}\n  private p() {}\n}`,
			options: [{ max: 10, includePrivate: true }],
			errors: [{ messageId: "tooManyMethods" }],
		},
		{
			code: `class C {\n${methods(10)}\n  static s() {}\n}`,
			options: [{ max: 10, includeStatic: true }],
			errors: [{ messageId: "tooManyMethods" }],
		},
		{
			code: `class C {\n${methods(10)}\n  protected pr() {}\n}`,
			options: [{ max: 10, includeProtected: true }],
			errors: [{ messageId: "tooManyMethods" }],
		},
		{
			code: "class Outer {\n  m() {\n    class Inner {\n      a() {}\n      b() {}\n    }\n    return Inner;\n  }\n}",
			options: [{ max: 1 }],
			errors: [{ messageId: "tooManyMethods", data: { count: 2, max: 1 } }],
		},
		{
			code: `class C {\n${Array.from({ length: 11 }, (_, i) => `  f${i} = () => {};`).join("\n")}\n}`,
			options: [{ max: 10 }],
			errors: [{ messageId: "tooManyMethods" }],
		},
	],
});
