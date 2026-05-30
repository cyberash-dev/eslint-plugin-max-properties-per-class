# CLAUDE.md

This file points AI agents at the canonical guidance for this repo.

See [AGENTS.md](./AGENTS.md) for how to adopt and configure
`eslint-plugin-cyberash`, and [README.md](./README.md) for the full rule
reference (options, defaults, and what counts as a method vs a property).

## Working in this repo

- Source: `eslint-plugin/` (`index.mjs`, `rules/`, `lib/count-members.mjs`).
- Tests: `npm test` runs the `RuleTester` suites in `tests/`.
- Lint: `npm run lint` (the package dogfoods its own base config).
- Both must be green before a commit.
