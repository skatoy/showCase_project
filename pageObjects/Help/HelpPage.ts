import { Files } from '#/utils/files'
import { Page, expect } from '@playwright/test'
import * as allure from 'allure-js-commons'

export class HelpPage {
  files: Files

  constructor(private readonly page: Page) {
    this.files = new Files(page)
  }

  instructionsTab = () => this.page.locator('[data-cy="tab-element-/help/"]')
  cookiesTab = () => this.page.locator('[data-cy="tab-element-/help/cookies"]')
  cookiePolicy = () => this.page.locator('[data-cy="cookie-policy"]')

  async checkCookiePolicy() {
    await allure.step('Проверить политику куки', async () => {
      await this.cookiesTab().click()
      await expect(this.cookiePolicy()).toContainText(
        'The procurement platform protects user confidential information'
      )
    })
  }

  async checkInstructions() {
    await allure.step('Проверить инструкции и скачивание файлов', async () => {
      await this.instructionsTab().click()
      await this.files.checkFileSuccessDownloaded(
        () => this.files.buttonDownloadFile().nth(1).click(),
        () => 'Руководство Заказчик_Procurement Portal 5.5.0.pdf'
      )
      await this.files.checkFileSuccessDownloaded(
        () => this.files.buttonDownloadFile().nth(2).click(),
        () => 'Руководство Поставщик_Коммерческая procurement platform 5.5.0.pdf'
      )
    })
  }
}
