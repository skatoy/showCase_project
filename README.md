# Playwright E2E Framework — B2B-закупки

Портфолио-showcase корпоративного end-to-end фреймворка на **Playwright + TypeScript**.

Цель репозитория — показать, как я выстраиваю **слоистую архитектуру автотестов** для сложного B2B-продукта: тонкие спеки, доменная оркестрация, Page Object Model, гибрид API+UI и переиспользуемая авторизация.

> Смотреть код важнее, чем запускать тесты: без закрытого стенда E2E не пройдут. Для проверки структуры достаточно `npm run type-check` и `npm run lint`.

## Зачем смотреть

| Что демонстрирую | Где в коде |
|------------------|------------|
| Тонкие спеки + Allure | `tests/smoke/`, `tests/examples/` |
| Доменные сценарии (не UI-клики в тесте) | `BusinessLogic/` |
| Page Object Model + переиспользуемые виджеты | `pageObjects/`, `components/` |
| Гибрид API-подготовки и UI-проверок | `api/` + smoke edit-спеки |
| Auth через Playwright `storageState` | `tests/0_auth*.setup.ts`, `utils/setupConfig.ts` |
| Типизированные тестовые данные | `testData/`, `factories/` |

## Как смотреть за 5 минут

1. [`tests/smoke/create_procedure.spec.ts`](tests/smoke/create_procedure.spec.ts) — как выглядит спека: данные → вызов Business Logic → Allure.
2. [`BusinessLogic/CreateProcedure.ts`](BusinessLogic/CreateProcedure.ts) и [`BusinessLogic/Procedure/`](BusinessLogic/Procedure/) — оркестрация доменного сценария.
3. [`pageObjects/Procedure/`](pageObjects/Procedure/) — POM по экранам и вкладкам.
4. [`tests/0_auth.setup.ts`](tests/0_auth.setup.ts) — setup-проект и сохранение сессии.
5. [`playwright.config.ts`](playwright.config.ts) — projects, зависимости setup → smoke/examples.

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

Спека не знает селекторов экрана. Business Logic не знает деталей HTTP. API и POM переиспользуются между сценариями.

## Примеры в репозитории

| Спека | Что показывает |
|-------|----------------|
| [`create_procedure.spec.ts`](tests/smoke/create_procedure.spec.ts) | Полный UI-сценарий создания закупки через Business Logic |
| [`create_request.spec.ts`](tests/smoke/create_request.spec.ts) | API-подготовка процедуры + заявка поставщика (гибрид) |
| [`edit_procedure.spec.ts`](tests/smoke/edit_procedure.spec.ts) | Создание через API, правка в UI |
| [`edit_request.spec.ts`](tests/smoke/edit_request.spec.ts) | End-to-end редактирование заявки |
| [`questionnaire_single_answer.spec.ts`](tests/examples/questionnaire_single_answer.spec.ts) | Многошаговая анкета |

## Быстрый старт (статическая проверка)

```bash
npm install
npm run type-check
npm run lint
```

Этого достаточно для ревью портфолио.

### E2E (нужен закрытый стенд)

```bash
cp e2e.env.example.json e2e.env.json   # подставить реальные URL/учётные данные
npx playwright install chromium
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
