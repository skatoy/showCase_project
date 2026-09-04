import { expect, Locator, Page } from '@playwright/test'
import * as allure from 'allure-js-commons'
export class PageNotification {
  readonly page: Page
  readonly warningNotification: Locator
  readonly locator: Locator

  constructor(page: Page, locator: Locator) {
    this.page = page
    this.locator = locator
    this.warningNotification = page.getByTestId('notification-text')
  }

  async getNotificationText() {
    return await this.locator.textContent()
  }

  async getWarningNotificationText() {
    return await this.warningNotification.textContent()
  }

  async checkWarningNotificationText(message: string) {
    await allure.step('Проверить текст уведомления', async () => {
      const warningNotificationText = await this.getWarningNotificationText()
      await this.warningNotification.waitFor({ state: 'visible' })
      await expect(warningNotificationText).toContain(message)
    })
  }
}
