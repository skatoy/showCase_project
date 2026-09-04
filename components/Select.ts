import { Locator } from '@playwright/test'
import * as allure from 'allure-js-commons'

export class Select {
  readonly input: Locator
  readonly optionList: Locator
  readonly fieldName?: string

  constructor(input: Locator, fieldName?: string) {
    this.input = input
    this.fieldName = fieldName
    this.optionList = this.input
      .page()
      .getByTestId('select-options-scroll-wrapper')
      .filter({ visible: true })
      .last()
  }

  async select(option: string) {
    const stepTitle = this.fieldName ? `Выбрать ${this.fieldName}: ${option}` : `Выбрать: ${option}`
    await allure.step(stepTitle, async () => {
      await this.input.click()
      await this.optionList.waitFor({ state: 'visible' })
      await this.optionList.getByText(option, { exact: true }).first().click()
    })
  }

  async searchAndSelect(option: string) {
    const stepTitle = this.fieldName
      ? `Найти и выбрать ${this.fieldName}: ${option}`
      : `Найти и выбрать: ${option}`
    await allure.step(stepTitle, async () => {
      await this.input.click()
      await this.input.pressSequentially(option)
      await this.optionList.waitFor({ state: 'visible' })
      await this.optionList.getByText(option).first().click()
    })
  }

  async clear() {
    const stepTitle = this.fieldName ? `Очистить поле "${this.fieldName}"` : 'Очистить список'
    await allure.step(stepTitle, async () => {
      const closeIcon = this.input.getByTestId('icon-close')

      if (await closeIcon.isVisible()) {
        await closeIcon.click()
      }
    })
  }

  async getOptionsTexts() {
    await this.optionList.waitFor({ state: 'visible' })
    const items = this.optionList.locator('li')

    return await items.allTextContents()
  }
}
