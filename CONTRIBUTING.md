# Contributing

Thanks for your interest in contributing to `openai-compatible-provider-registry`.

This repository welcomes small fixes, documentation improvements, provider metadata updates, and site updates. For larger behavioral changes, please open an issue or start with a draft pull request first so we can align on scope before implementation.

## Local Setup

- Use Node `>=20`.
- Use `pnpm`.
- Install dependencies with `pnpm install`.

## Project Layout

The repository contains two main parts:

- The root package is the published TypeScript library.
- `site/` contains the Astro documentation site and playground.

Please keep the root package boundaries strict:

- `src/index.ts` exposes public exports only.
- `src/types.ts` contains shared public types and constants.
- `src/providers.ts` contains provider registry metadata and lookup helpers.
- `src/fetch-models.ts` handles fetch logic, response checks, and model normalization.
- `src/utils.ts` contains low-level internal helpers.

## Making Changes

- Keep the runtime package dependency-free unless the project scope intentionally changes.
- Do not add provider-specific behavior into the generic fetch flow unless the package scope is intentionally expanding.
- Keep provider metadata centralized in `src/providers.ts` and resolve providers through `getProvider()`.

If you add, remove, or update a provider, update all of the following:

- `src/types.ts`
- `src/providers.ts`
- `README.md`

## Validation

Run the checks that match your change:

- Library changes: `pnpm typecheck` and `pnpm lint`
- Export or published output changes: also run `pnpm build`
- Site changes: `pnpm site:typecheck` and `pnpm site:build`

You do not need to run every command for every PR if your change is narrowly scoped.

## Versioning And Releases

This repository uses Changesets to manage versions for the root package only.
The `site/` workspace is private and does not participate in npm releases.

Add a `.changeset/*.md` file when your PR changes any public root-package
behavior, including:

- public exports or public types
- provider registry contents or defaults
- `fetchModels()` behavior or response normalization
- README-documented behavior promises for the root package

You can skip a changeset when your PR only changes:

- `site/`
- wording, formatting, or non-behavior documentation
- maintenance notes under `docs/plans/` or `docs/reviews/`

Version bump guidance before `1.0.0`:

- use `patch` for backward-compatible fixes
- use `minor` for new capabilities and breaking changes

Maintainers use the following scripts:

- `pnpm changeset`
- `pnpm changeset:status`
- `pnpm changeset:version`
- `pnpm release:check`

Releases are created through a GitHub version PR on `main`. Publishing to npm
remains a manual maintainer step.

For prerelease cycles, maintainers can use Changesets prerelease mode:

- `pnpm exec changeset pre enter beta`
- `pnpm exec changeset pre exit`

While prerelease mode is active, Changesets keeps pending `.changeset/*.md`
files so the final stable release can still consume them. Those files are
removed when maintainers exit prerelease mode and run `pnpm changeset:version`
for the stable release line.

## Pull Request Expectations

- Keep PRs focused and reasonably small.
- Include a clear summary of what changed.
- Include the validation commands you ran.
- Mention any documentation updates when public behavior or supported providers changed.

## Out Of Scope

This repository keeps release governance intentionally lightweight. Changesets
and the version PR workflow are the only required release-management layers
unless the project scope clearly changes.
