import { Locator } from '@playwright/test'
import { DateTime, DurationLikeObject } from 'luxon'
import * as allure from 'allure-js-commons'

export const nowAtMsk = (): DateTime => DateTime.now().setZone('Europe/Moscow') // Заменить и утилизировать

export class DateInput {
  readonly locator: Locator
  readonly fieldName?: string

  constructor(locator: Locator, fieldName?: string) {
    this.locator = locator
    this.fieldName = fieldName
  }

  async fill(duration: DurationLikeObject) {
    const expectedDate = nowAtMsk().plus(duration)
    const formatted = expectedDate.toFormat('dd.MM.yyyy HH:mm')
    const stepTitle = this.fieldName
      ? `Указать дату "${this.fieldName}": ${formatted}`
      : `Указать дату: ${formatted}`
    await allure.step(stepTitle, async () => {
      await this.locator.click()
      await this.locator.clear()
      await this.locator.pressSequentially(formatted)
    })
  }

  async clear() {
    const stepTitle = this.fieldName ? `Очистить дату "${this.fieldName}"` : 'Очистить дату'
    await allure.step(stepTitle, async () => {
      await this.locator.click()
      await this.locator.clear()
    })
  }
}
