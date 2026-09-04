# Procurement E2E Showcase

Enterprise Playwright + TypeScript end-to-end framework for a B2B procurement platform — presented as a **sanitized architectural portfolio**.

> **Disclaimer — NDA / showcase only**
>
> This repository was developed in an **NDA enterprise context**. It is a **curated, brand-neutral subset** of a private production test suite, not a runnable product clone.
>
> - Hostnames, product names, credentials, and internal identifiers have been **sanitized or replaced with placeholders**.
> - Default URLs point to `https://example.test` — tests are **not expected to pass** without access to a private stand and real `e2e.env.json`.
> - The goal is to demonstrate **framework architecture and patterns**, not green CI against a public demo app.

## Stack & patterns

| Area | Choice |
|------|--------|
| Runtime | Node.js 22+, TypeScript, ES modules |
| Test runner | [Playwright](https://playwright.dev/) (Desktop Chrome, `data-cy` test ids) |
| Reporting | Allure (`allure-playwright`, `allurerc.mjs`) |
| Tooling | ESLint, Prettier, `tsc --build` |

**Patterns demonstrated in this showcase:**

- **Page Object Model (POM)** — UI interactions encapsulated in `pageObjects/` and reusable `components/`.
- **Business Logic layer** — multi-step domain flows (create/edit procedure, create/edit request) orchestrated in `BusinessLogic/`, keeping specs thin.
- **API + UI hybrid** — setup and assertions via `api/` helpers; UI validation via POM (e.g. procedure created via API, edited via browser).
- **storageState auth** — dedicated setup projects persist session cookies to `.auth/`; main specs reuse pre-authenticated contexts.
- **Allure steps** — structured reporting with suite titles and step hierarchy.
- **Multi-env config** — `TEST_ENV` (`local` \| `staging` \| `demo`) with `BASE_URL`, `BASE_ADMIN_URL`, and `OIDC_CLIENT_ID` from environment variables.

## Architecture

```
tests/                    # Specs + auth setup projects
├── 0_auth.setup.ts       # User SSO session → .auth/
├── 0_auth_admin.setup.ts # Admin session → .auth/
├── smoke/                # Core CRUD smoke flows
└── examples/             # Extended multi-step scenario

BusinessLogic/            # Domain orchestration (create/edit flows)
pageObjects/              # Page Object classes per screen/modal
api/                      # HTTP clients (auth, procedure creation, …)
components/               # Shared UI widgets (date input, notifications, …)
fixtures/                 # Custom Playwright fixtures (e.g. apiAs)
factories/                # Step builders and test data factories
testData/                 # Default payloads and typed data models
utils/                    # Auth helpers, page state, setup paths
constants/                # Shared constants
files/                    # Static upload fixtures
vendor/                   # Vendored dependencies (xlsx)
```

**Call flow:** `tests` → `BusinessLogic` → `pageObjects` / `api` → `fixtures` / `utils`

Auth setup runs as Playwright **projects** (`user_setup`, `admin_setup`) that main specs depend on; see `playwright.config.ts`.

## Included examples

Five representative specs illustrate the layered style (names neutralized; no internal TMS ids):

| Spec | Suite | What it shows |
|------|-------|---------------|
| `tests/smoke/create_procedure.spec.ts` | Тест создания закупки | Full UI create flow via `BusinessLogic`, custom test data, questionnaire |
| `tests/smoke/create_request.spec.ts` | Тест заполнения заявки | API procedure prep + supplier request submission (API + UI hybrid) |
| `tests/smoke/edit_procedure.spec.ts` | Тест создания и редактирования закупки | API create, UI edit (positions, dates, overview assertions) |
| `tests/smoke/edit_request.spec.ts` | Тест редактирования заявки | End-to-end request edit after API setup |
| `tests/examples/questionnaire_single_answer.spec.ts` | Questionnaire: single-answer questions | Multi-step questionnaire scenario (single-answer types, supplier flow) |

## Transfer / restore

Portable archive (includes `.git`, no `node_modules`):

`../procurement-e2e-showcase-portable.zip`

After unpack: `npm install` (and optionally `npx playwright install chromium`).  
Do not ship `node_modules`, `e2e.env.json`, or `.auth/`.

`origin` is already set to `https://github.com/skatoy/defeat_auto_test_tutorial.git` for a later push (GitHub auth required; `--force` only if you intend to overwrite that repo’s `main`).

## Setup

1. **Clone, copy, or unzip** this folder locally (showcase is isolated from the source repo).

2. **Create local credentials file** (never commit):

   ```bash
   cp e2e.env.example.json e2e.env.json
   ```

   Edit `e2e.env.json` with stand-specific URLs and roles if you have access to a private environment. The example file uses **fake** emails and passwords only.

3. **Install dependencies** (public npm registry; no private `.npmrc` required):

   ```bash
   npm install
   ```

4. **Install browser** (Chromium channel used by config):

   ```bash
   npx playwright install chromium
   ```

5. **Optional — environment overrides** for a real stand:

   ```bash
   export TEST_ENV=local
   export BASE_URL=https://your-stand.example/
   export BASE_ADMIN_URL=https://admin.your-stand.example/
   export OIDC_CLIENT_ID=procurement-demo
   ```

## Commands

| Command | Purpose |
|---------|---------|
| `npm run type-check` | TypeScript project build / type validation |
| `npm run lint` | ESLint |
| `npm run fmt` | Prettier format |
| `npm run test:smoke` | Run smoke specs (requires live stand + `e2e.env.json`) |
| `npm run test:examples` | Run example specs (same requirement) |
| `npm run auth:clear` | Remove cached `.auth/` session files |
| `npm run allure:generate` | Generate Allure report from `allure-results/` |
| `npm run allure:open` | Open generated Allure report |

**Note:** E2E commands assume a **private procurement stand** and valid credentials. For portfolio review, `type-check` and `lint` are the intended static gates; do not expect `test:*` to pass against default `example.test` placeholders.

## What was removed

To keep this artifact focused and safe to share, the following from the full production suite were **omitted**:

- **Full regression packs** — billing, notifications, chats, auto-choice winners, requirements/questionnaires bulk suites, and 70+ ticket-linked specs
- **Product notification templates** — `notificationTemplates/` and related copy-heavy assets
- **Private registry config** — `.npmrc` / Nexus URLs (dependencies resolve from public npm)
- **Secrets and runtime artifacts** — `e2e.env.json`, `.auth/`, Allure/HTML report outputs, `node_modules/`
- **Internal tooling** — Husky hooks, CI job definitions, Postman collections, branch-specific docs
- **Company branding** — product names, SSO brand strings, and internal hostnames replaced with neutral placeholders (see sanitization in repo history)

The remaining code is the **minimal dependency closure** for the five curated examples plus auth setup.
