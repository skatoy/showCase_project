import { Page, Locator } from '@playwright/test'

export class ProcedureNotificationsTab {
  readonly page: Page
  readonly notificationTable: Locator
  readonly showNotification: Locator

  constructor(page: Page) {
    this.page = page
    this.notificationTable = page.getByTestId('notifications-table')
    this.showNotification = page.getByTestId('icon-down')
  }
}
