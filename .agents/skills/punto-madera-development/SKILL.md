---
name: punto-madera-development
description: Project-specific development workflow for this Laravel 12, Inertia React 2, Wayfinder, TypeScript, and shadcn application. Use for any feature, bug fix, refactor, route, controller, model, migration, admin screen, SEO page, form, component, styling, test, or build change in this repository. Requires codebase-memory MCP discovery, applicable Laravel Boost guidance, the local shadcn skill for UI work, and KISS/DRY design gates.
---

# Punto Madera Development

Use this skill for all work in this repository. Treat the dependency gates below as mandatory: do not implement from memory when the project source, graph, or installed skill gives a current answer.

## Mandatory gates

Complete these gates before editing code:

1. Read `.agents/skills/shadcn/SKILL.md` before any frontend, TS/TSX, component, form, layout, styling, or visual change. Follow its rules and use the project's package runner (`npx` here because the repository has `package-lock.json`). For backend-only work, still preserve the existing shadcn/Inertia boundary.
2. Use the codebase-memory MCP with project identifier `richardwebsite`:
   - Use `get_architecture` for broad or unfamiliar work.
   - Use `search_graph` to find definitions and existing patterns.
   - Use `trace_path` to inspect callers, callees, and impact before changing behavior.
   - Use `get_code_snippet` only after resolving the exact qualified name with the graph.
   - Use `rg` only for string literals, config, scripts, non-code files, or a documented graph fallback. Do not use grep/glob as the primary way to discover code definitions.
3. Read the applicable Laravel project skills from `vendor/laravel/boost/.ai/`:
   - Always: `laravel/12/core.blade.php`.
   - Inertia React or TSX: `inertia-react/2/skill/inertia-react-development/SKILL.blade.php`.
   - Tests or test failures: `pest/4/skill/pest-testing/SKILL.blade.php`.
   - Fortify/authentication: `vendor/laravel/fortify/resources/boost/skills/fortify-development/SKILL.md`.
   Use version-specific Laravel documentation through `search-docs` when that tool is available; otherwise verify the installed source and package versions before relying on an API.
4. Apply KISS and DRY as design constraints:
   - Choose the smallest coherent change that solves the observed requirement.
   - Reuse an existing component, route contract, request, query pattern, helper, or type when the shape and ownership genuinely match.
   - Create an abstraction only after identifying at least two real consumers or a clear invariant; do not create speculative mega-types, wrapper layers, or generic helpers.
   - Keep one source of truth for validation, route names, UI primitives, and repeated data transformations.
   - Reject needless rewrites, duplicated markup, raw one-off styling, and cleverness that makes the next change harder.

## Workflow

### 1. Establish the change surface

- Read `references/error-prevention.md` before starting; apply any matching prevention rule.
- Classify the request as backend, frontend, or full-stack.
- Use the graph to map the route, controller/action, request, model, Inertia page, shared component, and tests involved. Trace both inbound callers and outbound dependencies when behavior changes.
- Inspect the nearest sibling implementation before choosing a new pattern. Treat generated code and current source as authoritative over this summary.
- For substantial work, write a compact Requirements → Design → Tasks note in the response or task artifact before implementation. Keep it proportional to the change.

### 2. Implement Laravel behavior

- Follow Laravel 12's current project structure: inspect `bootstrap/app.php`, `bootstrap/providers.php`, and the relevant `routes/*.php` before changing middleware, routing, or bootstrapping.
- Use named routes and `route()` in PHP. Keep Inertia web actions as redirects or Inertia responses; return JSON only for an established API contract.
- Use Form Request classes for non-trivial validation. Keep controllers coordinating, models expressing relationships, and reusable business logic in the existing project layer.
- Prefer Eloquent models, relationships, and eager loading over raw queries. Use `DB::` only when the existing pattern or query complexity clearly requires it.
- Use Artisan `make:* --no-interaction` for new Laravel artifacts when an appropriate generator exists. Inspect the generated file and its neighboring patterns before filling it in.
- For migrations, preserve all existing column attributes when modifying a column, use explicit short names for indexes/foreign keys, and validate with `php artisan migrate --pretend --no-interaction` when relevant.
- Keep environment reads in config files. Use `config()` from application code.
- For auth, follow the installed Fortify configuration, actions, middleware, and tests instead of inventing a parallel flow.

### 3. Implement Inertia React and shadcn UI

- Read the local shadcn skill and inspect `components.json` plus `resources/js/components/ui/` first.
- Run `npx shadcn@latest info` when project context is uncertain. Before adding or changing a component, search the registry and run `npx shadcn@latest docs <component>` as required by the shadcn skill. Do not guess a registry for a block.
- Compose installed shadcn components before writing custom markup. Keep semantic tokens, existing aliases, existing base/variant conventions, and accessibility requirements.
- Follow the local shadcn rules for form fields, overlays, groups, icons, spacing, loading states, and feedback. Do not silently replace a shadcn primitive with a custom equivalent.
- Use Inertia React 2 conventions already present in the repository (`Form`, `Link`, `router`, and generated Wayfinder helpers). Preserve the existing page/layout/data-prop contracts.
- When routes or route parameters change, run `php artisan wayfinder:generate --with-form`, inspect generated changes, and run the TypeScript check.
- Keep visible copy consistent with the existing locale/content approach. Do not invent translations, claims, or SEO facts to make a screen look complete.

### 4. Test and verify

Add or update the smallest relevant test before or alongside behavior changes. Prefer Pest feature tests for routes, controllers, validation, database behavior, and Inertia responses; use unit tests for genuinely isolated logic.

Run checks proportional to the change, normally:

```bash
php artisan test --compact <focused-test-file-or-filter>
vendor/bin/pint --dirty --format agent
npm run lint:check
npm run types:check
npm run build
git diff --check
```

For UI changes, use the browser skill for a real page smoke test when available, check the browser console, and exercise the changed flow at the relevant viewport. For auth/admin flows, use an authenticated session or report that live authentication was unavailable. Do not call a local build, inner-container request, or static test a deployed acceptance check.

Report focused results separately from broader baseline failures. Never hide an unrelated pre-existing failure or claim verification that was not run.

## Error-learning loop

When the chat or task reveals an agent error, update the skill's durable prevention record instead of relying on memory:

1. Stop and capture the observable symptom, exact cause, failed assumption, prevention rule, and verification evidence. Do not record secrets, tokens, credentials, or unnecessary personal data.
2. Fix the immediate issue and rerun the smallest check that proves the fix.
3. Append the lesson with the bundled script:

```bash
python3 .agents/skills/punto-madera-development/scripts/record_error.py \
  --category "category" \
  --symptom "what failed" \
  --cause "why it failed" \
  --prevention "what future agents must do" \
  --verification "how the fix was checked"
```

4. Re-read the updated `references/error-prevention.md` and apply the new rule to the rest of the task. If a lesson is general, repeated, or safety-critical, promote its concise rule into this `SKILL.md` with a patch.

Do not invent a lesson when no concrete error occurred. Do not silently rewrite global skills, user memory, or unrelated project files. This repository-local record is the source for future Punto Madera runs.

## Current project map

Use `references/project-map.md` as a navigation hint only; revalidate it through codebase-memory MCP and current source before relying on it.
