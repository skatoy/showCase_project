import { Page } from '@playwright/test'
import * as allure from 'allure-js-commons'

export const pageUtils = {
  async goto(page: Page, path: string) {
    await allure.step(`Перейти по адресу: ${path}`, async () => {
      await page.goto(path, {
        // Чтобы корректно работало в CI
        waitUntil: 'commit'
      })
    })
  }
}
