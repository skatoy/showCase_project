import { Buttons } from '#/components/Buttons'
import { type Page, type Locator } from '@playwright/test'
import * as allure from 'allure-js-commons'

export class ActSignetTextPage {
  readonly page: Page
  readonly decisionSupplierTable: Locator
  readonly applicationViewIcon: Locator
  readonly supplierCheckIcon: Locator
  readonly publishActButton: Buttons

  constructor(page: Page) {
    this.page = page
    this.decisionSupplierTable = page.getByTestId('decisions-table') //Таблица решений
    this.applicationViewIcon = page
      .getByRole('table')
      .locator('tr')
      .filter({ has: this.page.getByTestId('icon-eye-on') }) //Просмотр заявки поставщика
    this.supplierCheckIcon = page
      .getByRole('table')
      .locator('tr')
      .filter({ has: this.page.getByTestId('icon-user') }) //Загрузка отчета по поставщику
    this.publishActButton = new Buttons(page.getByTestId('publish-act-btn'), 'Опубликовать акт')
  }

  async publishAct() {
    await allure.step('Опубликовать акт рассмотрения заявок', async () => {
      await this.publishActButton.click()
    })
  }
}
