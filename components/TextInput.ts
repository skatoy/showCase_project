import { Locator } from '@playwright/test'
import * as allure from 'allure-js-commons'

export class TextInput {
  readonly locator: Locator
  readonly fieldName?: string

  constructor(locator: Locator, fieldName?: string) {
    this.locator = locator
    this.fieldName = fieldName
  }

  async fill(text: string) {
    const stepTitle = this.fieldName
      ? `Заполнить поле "${this.fieldName}": ${text}`
      : `Заполнить поле: ${text}`
    await allure.step(stepTitle, async () => {
      await this.locator.click()
      await this.locator.clear()
      await this.locator.fill(text)
    })
  }

  async typeText(text: string) {
    const stepTitle = this.fieldName
      ? `Ввести в поле "${this.fieldName}": ${text}`
      : `Ввести в поле: ${text}`
    await allure.step(stepTitle, async () => {
      await this.locator.click()
      await this.locator.clear()
      await this.locator.pressSequentially(text)
    })
  }

  async clear() {
    const stepTitle = this.fieldName ? `Очистить поле "${this.fieldName}"` : 'Очистить поле'
    await allure.step(stepTitle, async () => {
      await this.locator.click()
      await this.locator.clear()
    })
  }

  async expectToHaveError() {
    await allure.step('Проверить наличие валидации поля', async () => {
      const errorContainer = this.locator
        .page()
        .locator('[data-cy="form-item-invalid"]')
        .filter({ has: this.locator })
      await errorContainer.waitFor({ state: 'visible' })
    })
  }
}
