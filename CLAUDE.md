# CLAUDE.md

This file points AI agents at the canonical guidance for this repo.

See [AGENTS.md](./AGENTS.md) for how to adopt and configure
`eslint-plugin-max-properties-per-class`, and [README.md](./README.md) for the full rule
reference (options, defaults, and what counts as a method vs a property).

## Working in this repo

- Written in TypeScript under `src/` (`index.ts` plugin object, `rules/`,
  `lib/count-members.ts`); typed via `@typescript-eslint/utils` (`TSESTree`,
  `RuleModule`).
- Build: `npm run build` (tsdown → dual ESM+CJS + `.d.ts` in `dist/`). `dist/`
  is git-ignored and only produced for publishing.
- Tests: `npm test` runs the `RuleTester` suites against `src/` via `tsx`
  (no build needed for the test loop).
- Typecheck: `npm run typecheck` (`tsc --noEmit`).
- Lint: `npm run lint` (dogfoods `typescript-eslint` on the source).
- All of typecheck, test, and lint must be green before a commit;
  `prepublishOnly` runs build + test.
