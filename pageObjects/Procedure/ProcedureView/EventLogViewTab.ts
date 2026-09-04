import { Page, Locator } from '@playwright/test'
import * as allure from 'allure-js-commons'

export class EventLogViewTab {
  readonly page: Page
  readonly eventLogTable: Locator

  constructor(page: Page) {
    this.page = page
    this.eventLogTable = page.getByTestId('events-table')
  }

  async eventDataTable() {
    return await allure.step('Таблица уведомлений', async () => {
      return this.eventLogTable.textContent()
    })
  }
}
