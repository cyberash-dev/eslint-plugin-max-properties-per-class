# AGENTS.md — adopting eslint-plugin-cyberash

Two ESLint 9 (flat-config) rules capping members per class/interface:

- `cyberash/max-methods` — methods (default `max` 10).
- `cyberash/max-properties` — properties (default `max` 15).

## Adopt in a repo

1. `npm install --save-dev eslint-plugin-cyberash`.
2. In `eslint.config.mjs`, either register the plugin and enable the rules
   explicitly, or use the bundled `recommended` config:

   ```js
   import cyberash from "eslint-plugin-cyberash";
   export default [cyberash.configs.recommended];
   ```

   The `recommended` config turns **both rules on at `error`** with the defaults.

## Rule behavior an agent must know

- A class and an interface are counted the same way; each declaration is
  counted from its own body, so nested classes are independent. The constructor
  is never counted.
- By default `private`/`#` and `static` members are excluded. Flip
  `includePrivate` / `includeStatic` to count them; `includeProtected` (methods
  rule only) counts protected methods. Protected properties always count.
- Arrow/function class fields count as methods; `get`/`set` of one key count as
  a single property; overloads collapse to one. Full table in `README.md`.
