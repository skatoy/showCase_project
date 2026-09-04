import { Locator, Page } from '@playwright/test'
import * as allure from 'allure-js-commons'

export class Tooltip {
  readonly page: Page

  constructor(page: Page) {
    this.page = page
  }

  async getTooltipText(targetLocator: Locator) {
    const stepTitle = 'Прочитать текст подсказки'

    return await allure.step(stepTitle, async () => {
      await targetLocator.hover()
      const tooltip = this.page.locator('#tooltip [data-cy^="tooltip-text-"]:visible').first()
      await tooltip.waitFor({ state: 'visible', timeout: 5000 })

      return (await tooltip.textContent())!.trim()
    })
  }
}
