import { Locator, Page } from '@playwright/test'
import * as allure from 'allure-js-commons'

export class Tabs {
  readonly page: Page
  readonly tabLabel: Locator

  constructor(page: Page) {
    this.page = page
    this.tabLabel = page.getByTestId('tab-label')
  }

  async selectTab(tabName: string) {
    const tab = this.page.getByTestId(`tab-element-${tabName}`)
    const dataActiveValue = await tab.getAttribute('data-active')

    if (dataActiveValue !== 'true') {
      const tabTitle = (await tab.locator(this.tabLabel).innerText()).trim() || tabName

      await allure.step(`Вкладка: "${tabTitle}"`, async () => {
        await tab.click()
      })
    }
  }
}
