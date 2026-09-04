import { BrowserContext } from '@playwright/test'
import { BASE_ADMIN_URL, BASE_URL } from '#/playwright.config'
import { withSession, saveSession } from './elkLogin'
import { pageUtils } from './pageUtils'
import { businessAdminAuthFile } from './setupConfig'

export async function createPageState(browser: any, storageState: string) {
  await withSession(storageState)

  const context = await browser.newContext({ storageState })
  const originalClose = context.close.bind(context)

  context.close = async (...args: Parameters<BrowserContext['close']>) => {
    await saveSession(context, storageState)

    return originalClose(...args)
  }

  const page = await context.newPage()
  const url = storageState === businessAdminAuthFile ? BASE_ADMIN_URL : BASE_URL
  await pageUtils.goto(page, url)

  return { page, context }
}
