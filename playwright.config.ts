import { defineConfig, devices } from '@playwright/test'
import * as os from 'node:os'

export type TestEnv = 'local' | 'staging' | 'demo'

const baseURLConfig: Record<TestEnv, string> = {
  local: process.env.BASE_URL ?? 'https://example.test/',
  staging: process.env.BASE_URL ?? 'https://example.test/',
  demo: process.env.BASE_URL ?? 'https://example.test/'
}

export const baseApiURLConfig: Record<TestEnv, string> = {
  local: process.env.BASE_URL?.replace(/\/$/, '') ?? 'https://example.test',
  staging: process.env.BASE_URL?.replace(/\/$/, '') ?? 'https://example.test',
  demo: process.env.BASE_URL?.replace(/\/$/, '') ?? 'https://example.test'
}

export const adminBaseApiURLConfig: Record<TestEnv, string> = {
  local: process.env.BASE_ADMIN_URL ?? 'https://admin.example.test',
  staging: process.env.BASE_ADMIN_URL ?? 'https://admin.example.test',
  demo: process.env.BASE_ADMIN_URL ?? 'https://admin.example.test'
}

export const TEST_ENV = (process.env.TEST_ENV as TestEnv) || 'local'
export const TEST_TYPE = process.env.TEST_TYPE
export const BASE_URL = baseURLConfig[TEST_ENV]
export const BASE_ADMIN_URL = adminBaseApiURLConfig[TEST_ENV]

const TEST_TIMEOUT = 240000
const EXPECT_TIMEOUT = 90000
const ACTION_TIMEOUT = 90000

export default defineConfig({
  testDir: './tests',
  testMatch: ['**/*.spec.ts'],
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: 0,
  workers: 2,
  reporter: [
    ['list'],
    [
      'allure-playwright',
      {
        resultsDir: 'allure-results',
        detail: false,
        suiteTitle: true,
        environmentInfo: {
          os_platform: os.platform(),
          node_version: process.version,
          TEST_ENV,
          BASE_URL
        },
        globalLabels: { layer: 'e2e', env: TEST_ENV }
      }
    ]
  ],
  timeout: TEST_TIMEOUT,
  outputDir: './test-results',
  use: {
    video: 'retain-on-failure',
    screenshot: 'only-on-failure',
    actionTimeout: ACTION_TIMEOUT,
    ignoreHTTPSErrors: true,
    trace: 'retain-on-failure',
    testIdAttribute: 'data-cy',
    baseURL: BASE_URL,
    ...devices['Desktop Chrome'],
    viewport: { width: 1920, height: 1080 },
    channel: 'chrome',
    locale: 'en-US'
  },
  expect: { timeout: EXPECT_TIMEOUT },
  projects: [
    {
      name: 'main',
      testMatch: ['**/smoke/**/*.spec.ts', '**/examples/**/*.spec.ts'],
      dependencies: ['user_setup', 'admin_setup']
    },
    { name: 'user_setup', testMatch: /.0_auth\.setup\.ts/ },
    {
      name: 'admin_setup',
      testMatch: /.0_auth_admin\.setup\.ts/,
      use: { baseURL: BASE_ADMIN_URL }
    }
  ]
})
