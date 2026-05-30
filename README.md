# eslint-plugin-cyberash

Two ESLint rules that cap how many **methods** and **properties** a class or
interface may declare. Works on JavaScript classes, TypeScript classes, and
TypeScript interfaces (a class and the interface it implements are counted the
same way). ESLint 9 flat config only.

- `cyberash/max-methods` — caps methods.
- `cyberash/max-properties` — caps properties.

Each declaration is counted from its **own** body, so a nested class is counted
independently of the class that encloses it. The constructor is never counted.

## Install

```sh
npm install --save-dev eslint-plugin-cyberash
```

`eslint` (>=9) is a peer dependency.

## Usage

Wire the plugin into your flat config and turn the rules on:

```js
// eslint.config.mjs
import cyberash from "eslint-plugin-cyberash";

export default [
	{
		plugins: { cyberash },
		rules: {
			"cyberash/max-methods": ["error", { max: 10 }],
			"cyberash/max-properties": ["error", { max: 15 }],
		},
	},
];
```

Or spread the bundled base config, which enables both at `error` with the
defaults above:

```js
import base from "eslint-plugin-cyberash/base";

export default [...base];
```

## Options

Each rule takes either a number shorthand or an options object:

```js
"cyberash/max-methods": ["error", 10]
"cyberash/max-methods": ["error", { max: 10, includePrivate: true }]
```

| Option | Type | Default | Rules | Meaning |
|---|---|---|---|---|
| `max` | integer | 10 (methods) / 15 (properties) | both | Maximum allowed count. |
| `includePrivate` | boolean | `false` | both | Count `private` / `#`-private members toward the cap. |
| `includeStatic` | boolean | `false` | both | Count `static` members toward the cap. |
| `includeProtected` | boolean | `false` | `max-methods` only | Count `protected` methods toward the cap. |

By default private and static members are excluded; a member is counted only
when it clears every active filter. **Asymmetry:** `includeProtected` exists
only on `max-methods`. `max-properties` has no such option, so protected
properties always count.

Interfaces have no visibility or `static` modifiers, so these filters are
no-ops there: every interface member always counts.

## What counts as a method vs a property

### Class

| Declaration | Counted as |
|---|---|
| `foo() {}` | method |
| `constructor() {}` | nothing (never counted) |
| `get x()` / `set x()` (same key) | one property |
| `abstract foo()` | method |
| `foo = () => {}` / `foo = function () {}` | method |
| `foo = 0` (non-function field) | property |
| `abstract foo: T` | property |
| `accessor foo = 0` | property |
| `constructor(private foo: T)` (parameter property) | property |
| index signature, static block | nothing |

### Interface

| Declaration | Counted as |
|---|---|
| `foo(): void` | method |
| `foo: () => void` (function-typed) | method |
| `foo: T` (other) | property |
| `(): void` (call signature) | method |
| `new (): T` (construct signature) | nothing |
| index signature | nothing |

### Notes

- **Overloads collapse.** Multiple method signatures sharing one key (TS method
  overloads, interface method overloads, repeated call signatures) count as one.
- **Computed keys.** A non-literal computed key (`[Symbol.iterator]()`,
  `[expr]()`) is treated as distinct and never collapses with another member.
