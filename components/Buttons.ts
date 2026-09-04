import { Locator } from '@playwright/test'
import * as allure from 'allure-js-commons'

export class Buttons {
  readonly locator: Locator
  readonly name?: string

  constructor(locator: Locator, name?: string) {
    this.locator = locator
    this.name = name
  }

  async click() {
    const stepTitle = this.name ? `Нажать: ${this.name}` : 'Нажать'
    await allure.step(stepTitle, async () => {
      await this.locator.click()
    })
  }

  async textContent() {
    return this.locator.textContent()
  }
}
