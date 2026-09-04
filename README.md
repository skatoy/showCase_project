# Playwright E2E Framework — B2B-закупки

Портфолио-showcase корпоративного end-to-end фреймворка на **Playwright + TypeScript** для автоматизации тестирования B2B-платформы закупок.

Репозиторий показывает, как я выстраиваю **слоистую архитектуру автотестов**: тонкие спеки, доменная оркестрация, Page Object Model, гибрид API+UI и переиспользуемая авторизация через `storageState`.

> Смотреть код важнее, чем запускать тесты: без закрытого стенда E2E не пройдут. Для ревью портфолио достаточно `npm run type-check` и `npm run lint`.

## Зачем смотреть

| Что демонстрирую | Где в коде |
|------------------|------------|
| Тонкие спеки + Allure | [`tests/smoke/`](tests/smoke/), [`tests/examples/`](tests/examples/) |
| Доменные сценарии без UI-кликов в тесте | [`BusinessLogic/`](BusinessLogic/) |
| Page Object Model + переиспользуемые виджеты | [`pageObjects/`](pageObjects/), [`components/`](components/) |
| Гибрид API-подготовки и UI-проверок | [`api/`](api/), edit/create request-спеки |
| Auth через Playwright projects + `storageState` | [`tests/0_auth.setup.ts`](tests/0_auth.setup.ts), [`utils/setupConfig.ts`](utils/setupConfig.ts) |
| Типизированные данные и фабрики шагов | [`testData/`](testData/), [`factories/`](factories/) |
| Мульти-окружения | `TEST_ENV` / `BASE_URL` в [`playwright.config.ts`](playwright.config.ts) |

## Как смотреть за 5 минут

1. [`tests/smoke/create_procedure.spec.ts`](tests/smoke/create_procedure.spec.ts) — спека: данные → Business Logic → Allure.
2. [`BusinessLogic/CreateProcedure.ts`](BusinessLogic/CreateProcedure.ts) → [`BusinessLogic/Procedure/`](BusinessLogic/Procedure/) — оркестрация доменного сценария.
3. [`pageObjects/Procedure/`](pageObjects/Procedure/) — POM по экранам и вкладкам.
4. [`tests/smoke/create_request.spec.ts`](tests/smoke/create_request.spec.ts) — гибрид: API создаёт закупку, UI заполняет заявку.
5. [`tests/0_auth.setup.ts`](tests/0_auth.setup.ts) + [`playwright.config.ts`](playwright.config.ts) — setup-проекты и зависимости `user_setup` / `admin_setup` → `main`.

## Стек

| Область | Выбор |
|---------|--------|
| Runtime | Node.js 22+, TypeScript, ES modules |
| Тест-раннер | [Playwright](https://playwright.dev/) (Desktop Chrome, `data-cy`) |
| Отчёты | Allure (`allure-playwright`) |
| Качество кода | ESLint, Prettier, `tsc --build` |

## Архитектура

```
tests/            # спеки + auth setup
BusinessLogic/    # доменные сценарии (create/edit procedure & request)
pageObjects/      # экраны и вкладки
api/              # HTTP-клиенты для подготовки данных
components/       # общие UI-виджеты
fixtures/         # кастомные Playwright fixtures
factories/        # сборщики шагов и данных
testData/         # типизированные payload
utils/            # auth, page state, конфиг setup
```

**Цепочка:** `tests` → `BusinessLogic` → `pageObjects` / `api` → `fixtures` / `utils`

- Спека описывает сценарий и данные, а не селекторы.
- Селекторы живут в POM / components.
- API используется для быстрой подготовки состояния; UI — для проверки пользовательского потока.

## Примеры в репозитории

| Спека | Что показывает |
|-------|----------------|
| [`create_procedure.spec.ts`](tests/smoke/create_procedure.spec.ts) | Полный UI-сценарий создания закупки через Business Logic |
| [`create_request.spec.ts`](tests/smoke/create_request.spec.ts) | API-подготовка процедуры + заявка поставщика (гибрид) |
| [`edit_procedure.spec.ts`](tests/smoke/edit_procedure.spec.ts) | Создание через API, правка в UI |
| [`edit_request.spec.ts`](tests/smoke/edit_request.spec.ts) | End-to-end редактирование заявки |
| [`questionnaire_single_answer.spec.ts`](tests/examples/questionnaire_single_answer.spec.ts) | Многошаговая анкета |

## Быстрый старт (статическая проверка)

Требуется **Node.js 22+**.

```bash
npm install
npm run type-check
npm run lint
```

Этого достаточно для ревью портфолио.

### E2E (нужен закрытый стенд)

```bash
cp e2e.env.example.json e2e.env.json   # подставить реальные URL/учётные данные
npx playwright install chrome          # в конфиге channel: 'chrome'
npm run test:smoke
```

| Команда | Назначение |
|---------|------------|
| `npm run test:smoke` | Smoke-спеки |
| `npm run test:examples` | Расширенный пример |
| `npm run auth:clear` | Сбросить `.auth/` |
| `npm run allure:generate` / `allure:open` | Отчёт Allure |
| `npm run fmt` | Prettier |

## NDA / ограничения

Репозиторий — **курируемое, обезличенное подмножество** корпоративного набора тестов:

- хосты, бренды и секреты заменены заглушками;
- URL по умолчанию — `https://example.test`;
- цель — архитектура и паттерны, а не зелёный CI на публичном демо.
