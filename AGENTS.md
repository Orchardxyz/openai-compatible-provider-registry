# AGENTS.md

## Project Overview

- Small TypeScript library for a curated OpenAI-compatible provider registry plus `fetchModels()`.
- No frontend, database, ORM, or codegen pipeline.

## Current Stack

- Node `>=20`
- TypeScript + ESM source
- Build: `tsup`
- Package manager: `pnpm`

## Important Structure

- `src/index.ts`: only public entrypoint; keep exports intentional.
- `src/types.ts`: shared public types and `PROVIDER_IDS`.
- `src/providers.ts`: canonical provider registry and lookup helpers.
- `src/fetch-models.ts`: network fetch, response checks, model normalization.
- `src/utils.ts`: internal helpers like `joinUrl()`.

## Development Commands

- `pnpm lint`
- `pnpm typecheck`
- `pnpm build`
- `pnpm clean`

## Coding Conventions

- Reuse `PROVIDER_IDS`, `ProviderId`, and shared types from `src/types.ts`.
- Keep provider metadata centralized in `src/providers.ts`.
- Resolve providers through `getProvider()`; do not duplicate registry data.
- Preserve `joinUrl()` behavior for versioned base URLs.
- Keep runtime dependency-free unless project scope clearly changes.
- Update `README.md` when exports or supported providers change.

## Agent Guardrails

- Do not change `package.json` exports, Node engine, or `tsup.config.ts` lightly; they define the published package contract.
- Do not add provider-specific behavior into the generic fetch flow unless the package scope is intentionally changing.
- Keep boundaries strict: `index.ts` = exports, `types.ts` = public types/constants, `providers.ts` = registry, `fetch-models.ts` = fetch + normalization, `utils.ts` = low-level helpers.

## Practical Defaults For Agents

- For normal changes, edit `src/` first, then run `pnpm typecheck` and `pnpm lint`.
- Run `pnpm build` when changing exports, build config, or published output shape.
- When adding/removing a provider, update `src/types.ts`, `src/providers.ts`, and `README.md`.
- If `README.md` conflicts with code, follow current implementation and config.
