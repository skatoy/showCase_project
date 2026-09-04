// Showcase alias: SSO session helpers (sanitized)
import {
  mkdirSync,
  openSync,
  closeSync,
  unlinkSync,
  readFileSync,
  writeFileSync,
  statSync
} from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { BrowserContext, Page, chromium, request } from '@playwright/test'
import * as allure from 'allure-js-commons'
import { BASE_ADMIN_URL, BASE_URL, TEST_ENV, TestEnv } from '../playwright.config'
import { ElkAuthApi } from '../api/elkAuthApi'
import { AuthPage } from '../pageObjects/Auth/AuthPage'
import { ProcedureListPage } from '../pageObjects/Procedure/ProcedureListPage'
import { decodeJwt, isTokenExpired } from './jwt'
import {
  businessAdminAuthFile,
  userBothRolesCustomerAuthFile,
  userBothRolesSupplierAuthFile,
  userOrganizationAdminAuthFile,
  userSecondCustomerAuthFile,
  userSupplierAuthFile,
  userSupplierIndividualAuthFile,
  userSupplierNotResident,
  userSupplierNotResidentCis,
  userSupplierSecondAuthFile,
  userSupplierWithoutFinance
} from './setupConfig'

export type PlaywrightRole =
  | 'userBothRoles'
  | 'secondCustomer'
  | 'supplier'
  | 'supplierSecond'
  | 'businessAdmin'
  | 'firstOperator'
  | 'secondOperator'
  | 'supplierIndividual'
  | 'supplierWithoutFinance'
  | 'organizationAdmin'
  | 'organizationCurator'
  | 'supplierNotResidentCis'
  | 'supplierNotResident'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const LS_TOKEN = 'LS_TOKEN'
const LS_REFRESH_TOKEN = 'LS_REFRESH_TOKEN'
const AUTH_TOKEN_KEYS = new Set([LS_TOKEN, LS_REFRESH_TOKEN])
const ACCESS_TOKEN_SKEW_SECONDS = 180
const LOCK_WAIT_MS = 180_000
const LOCK_POLL_MS = 100
const STALE_LOCK_MS = 180_000

type StorageItem = { name: string; value: string }
type StorageState = {
  cookies: unknown[]
  origins: { origin: string; localStorage: StorageItem[] }[]
}

type SessionAccount = {
  user: PlaywrightRole
  role: string
  admin?: boolean
}

let creds: UsersCreds | null = null

try {
  const data = readFileSync(path.resolve(__dirname, '../e2e.env.json'), 'utf8')
  creds = data ? (JSON.parse(data) as UsersCreds) : null
} catch {
  creds = null
}

if (!creds) {
  throw new Error(
    'Файл e2e.env.json не найден или пуст. Пожалуйста, создайте файл с корректными учетными данными.'
  )
}

export type UserCred = {
  email: string
  password: string
  shortName: string
  fullName: string
  inn: string
  kpp: string
  contactPerson: string
  contactFirstName: string
  contactLastName: string
  contactMidleName: string
  contactPhone: string
  contactEmail: string
}

export type UsersCreds = {
  runnerName: string
  users: Record<TestEnv, Record<PlaywrightRole, UserCred>>
}

export const loginInElk = async (email: string, password: string, page: Page) => {
  await allure.step(`Авторизоваться в SSO: ${email}`, async () => {
    await page.locator('#username').fill(email)
    await page.fill('#password', password)
    await page.locator('#password').blur()
    const captcha = page
      .locator('[data-testid="checkbox-iframe"]')
      .contentFrame()
      .getByRole('checkbox', { name: 'Я не робот' })

    if (await captcha.isVisible()) {
      await captcha.click()
      await page.waitForSelector('.CheckboxCaptcha-Checkbox[data-checked="true"]')
    }

    await page.locator('#kc-login').click()
  })
}

export const runnerName = creds.runnerName

export const userCreds = (creds.users[TEST_ENV] || creds.users.local)! as Record<
  PlaywrightRole,
  UserCred
>

const sessionAccounts: Record<string, SessionAccount> = {
  [userBothRolesCustomerAuthFile]: { user: 'userBothRoles', role: 'customer' },
  [userSecondCustomerAuthFile]: { user: 'secondCustomer', role: 'customer' },
  [userOrganizationAdminAuthFile]: { user: 'organizationAdmin', role: 'admin_for_users' },
  [userBothRolesSupplierAuthFile]: { user: 'userBothRoles', role: 'supplier' },
  [userSupplierAuthFile]: { user: 'supplier', role: 'supplier' },
  [userSupplierSecondAuthFile]: { user: 'supplierSecond', role: 'supplier' },
  [userSupplierIndividualAuthFile]: { user: 'supplierIndividual', role: 'supplier' },
  [userSupplierWithoutFinance]: { user: 'supplierWithoutFinance', role: 'supplier' },
  [userSupplierNotResidentCis]: { user: 'supplierNotResidentCis', role: 'supplier' },
  [userSupplierNotResident]: { user: 'supplierNotResident', role: 'supplier' },
  [businessAdminAuthFile]: { user: 'businessAdmin', role: 'business_admin', admin: true }
}

const sessionFile = (sessionPath: string) => path.resolve(__dirname, `../${sessionPath}`)

export const ensureAuthDir = () =>
  mkdirSync(path.dirname(sessionFile('.auth/placeholder.json')), { recursive: true })

const readSession = (sessionPath: string): StorageState | null => {
  try {
    return JSON.parse(readFileSync(sessionFile(sessionPath), 'utf8')) as StorageState
  } catch {
    return null
  }
}

const isFreshToken = (token: string | null | undefined, skewSeconds = 0): token is string => {
  if (!token) return false

  try {
    return !isTokenExpired(token, skewSeconds)
  } catch {
    return false
  }
}

const tokenExp = (token: string) => {
  try {
    return decodeJwt<{ exp: number }>(token).exp ?? 0
  } catch {
    return 0
  }
}

const getToken = (session: StorageState, name: string) => {
  const values: string[] = []

  for (const origin of session.origins ?? []) {
    const value = origin.localStorage?.find(item => item.name === name)?.value

    if (value) values.push(value)
  }

  return values.find(value => isFreshToken(value)) ?? values[0]
}

const setToken = (session: StorageState, name: string, value: string) => {
  const origins = session.origins ?? []
  let written = false

  for (const origin of origins) {
    const items = origin.localStorage

    if (!items) continue

    const item = items.find(entry => entry.name === name)
    const hasAuthStorage = items.some(entry => AUTH_TOKEN_KEYS.has(entry.name))

    if (item) {
      item.value = value
      written = true
    } else if (hasAuthStorage) {
      items.push({ name, value })
      written = true
    }
  }

  if (!written && origins[0]) {
    if (!origins[0].localStorage) origins[0].localStorage = []

    origins[0].localStorage.push({ name, value })
  }
}

const removeStaleLock = (lockPath: string) => {
  try {
    const age = Date.now() - statSync(lockPath).mtimeMs

    if (age > STALE_LOCK_MS) unlinkSync(lockPath)
  } catch {
    // ignore
  }
}

const withAuthFileLock = async <T>(sessionPath: string, doWork: () => Promise<T>): Promise<T> => {
  ensureAuthDir()
  const lockPath = `${sessionFile(sessionPath)}.lock`
  const started = Date.now()

  while (Date.now() - started < LOCK_WAIT_MS) {
    try {
      const lockFile = openSync(lockPath, 'wx')

      try {
        return await doWork()
      } finally {
        closeSync(lockFile)

        try {
          unlinkSync(lockPath)
        } catch {
          // ignore
        }
      }
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code !== 'EEXIST') throw error

      removeStaleLock(lockPath)
      await new Promise(resolve => setTimeout(resolve, LOCK_POLL_MS))
    }
  }

  throw new Error(`Не удалось дождаться доступа к сессии: ${sessionPath}`)
}

const checkSession = (sessionPath: string) => {
  try {
    const session = readSession(sessionPath)
    const token = session ? getToken(session, LS_TOKEN) : null

    return isFreshToken(token, ACCESS_TOKEN_SKEW_SECONDS)
  } catch {
    return false
  }
}

export const getSessionAccessToken = (sessionPath: string) => {
  const session = readSession(sessionPath)

  return session ? (getToken(session, LS_TOKEN) ?? null) : null
}

const tryRefreshTokens = async (sessionPath: string) => {
  const session = readSession(sessionPath)
  const refreshToken = session ? getToken(session, LS_REFRESH_TOKEN) : null

  if (!session || !refreshToken) return false

  try {
    if (isTokenExpired(refreshToken)) return false
  } catch {
    return false
  }

  let api

  try {
    api = await request.newContext({ storageState: sessionPath })
    const issuer = decodeJwt<{ iss: string }>(refreshToken).iss
    const elk = new ElkAuthApi(api, issuer)

    if (!(await elk.refreshToken(refreshToken))) {
      return false
    }

    setToken(session, LS_TOKEN, elk.access_token)
    setToken(session, LS_REFRESH_TOKEN, elk.refresh_token)
    writeFileSync(sessionFile(sessionPath), JSON.stringify(session, null, 2), 'utf8')

    return true
  } catch {
    return false
  } finally {
    await api?.dispose()
  }
}

const recreateSessionViaUi = async (sessionPath: string) => {
  const account = sessionAccounts[sessionPath]

  if (!account) {
    throw new Error(
      `Нет учётных данных для пересоздания сессии (${sessionPath}). Добавьте маппинг в sessionAccounts.`
    )
  }

  const user = userCreds[account.user]
  await allure.step(`Авторизоваться через UI: ${user.email}`, async () => {
    const browser = await chromium.launch({ channel: 'chrome' })

    try {
      const context = await browser.newContext({
        locale: 'ru',
        viewport: { width: 1920, height: 1080 },
        ignoreHTTPSErrors: true
      })
      const page = await context.newPage()
      const authPage = new AuthPage(page)

      if (account.admin) {
        const procedureListPage = new ProcedureListPage(page)

        await authPage.navigate(BASE_ADMIN_URL)
        await loginInElk(user.email, user.password, page)
        await procedureListPage.waitProcedureListLoaded()
      } else {
        await authPage.navigate(BASE_URL)
        await loginInElk(user.email, user.password, page)
        await authPage.checkIsAuthPage()
        await authPage.userAuth(account.role)
      }

      ensureAuthDir()
      await context.storageState({ path: sessionPath })
      await context.close()
    } finally {
      await browser.close()
    }
  })

  if (!checkSession(sessionPath)) {
    throw new Error(`Логин не создал валидную сессию: ${sessionPath}`)
  }
}

export const withSession = async (sessionPath: string) => {
  if (checkSession(sessionPath)) return

  await withAuthFileLock(sessionPath, async () => {
    if (checkSession(sessionPath)) return

    if (await tryRefreshTokens(sessionPath)) return

    await recreateSessionViaUi(sessionPath)
  })
}

export const saveSession = async (context: BrowserContext, sessionPath: string) => {
  await withAuthFileLock(sessionPath, async () => {
    let incoming: StorageState

    try {
      incoming = await context.storageState()
    } catch {
      return
    }

    const incomingToken = getToken(incoming, LS_TOKEN)

    if (!isFreshToken(incomingToken)) return

    const existing = readSession(sessionPath)
    const existingToken = existing ? getToken(existing, LS_TOKEN) : null

    if (
      existingToken &&
      isFreshToken(existingToken) &&
      tokenExp(existingToken) > tokenExp(incomingToken)
    ) {
      return
    }

    ensureAuthDir()
    writeFileSync(sessionFile(sessionPath), JSON.stringify(incoming, null, 2), 'utf8')
  })
}
