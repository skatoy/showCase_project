import { Locator, Page } from '@playwright/test'
import * as allure from 'allure-js-commons'

export const tooltip = {
  text: (page: Page, id?: string) => page.locator(`[data-cy="tooltip-text-${id || ''}"]`)
}

export async function getTooltipText(page: Page, targetLocator: Locator) {
  return await allure.step('Получить текст тултипа', async () => {
    await targetLocator.hover()
    const tooltip = page.locator('#tooltip [data-cy^="tooltip-text-"]:visible').first()
    await tooltip.waitFor({ state: 'visible', timeout: 5000 })

    return (await tooltip.textContent())!.trim()
  })
}
