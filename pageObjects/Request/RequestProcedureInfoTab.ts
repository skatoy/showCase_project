import { Page } from '@playwright/test'

export class ProcedureInfoTab {
  readonly page: Page

  constructor(page: Page) {
    this.page = page
  }
}
