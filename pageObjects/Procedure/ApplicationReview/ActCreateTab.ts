import { Select } from '#/components/Select'
import { Page, Locator } from '@playwright/test'
import * as allure from 'allure-js-commons'

export type ApplicationDecision = 'Допущен' | 'Не допущен'

export type CreateActParams = {
  admitAll: boolean
  supplierDecisions: {
    name: string
    decision: ApplicationDecision
  }[]
}

export class ActCreateTab {
  readonly page: Page
  readonly applicationViewIcon: Locator
  readonly supplierCheckIcon: Locator
  readonly downloadActButton: Locator
  readonly supplierDecisionSelect: Locator
  readonly admitAllCheckBox: Locator

  constructor(page: Page) {
    this.page = page
    this.supplierDecisionSelect = page.getByTestId('select-decision')
    this.applicationViewIcon = page.getByTestId('icon-eye-on')
    this.supplierCheckIcon = page.getByTestId('icon-user')
    this.downloadActButton = page.getByTestId('icon-report')
    this.admitAllCheckBox = page.getByTestId('checkbox-').getByText('Допустить всех')
  }

  async selectSupplierDecision(supplierName: string, supplierDecision: string) {
    await allure.step(`Выбрать решение "${supplierDecision}" для поставщика: ${supplierName}`, async () => {
      const supplierRow = this.page
        .getByRole('table')
        .locator('tr')
        .filter({ has: this.page.getByText(supplierName, { exact: true }) })
      const decisionSelect = new Select(supplierRow.locator(this.supplierDecisionSelect))
      await decisionSelect.select(supplierDecision)
    })
  }

  async clickAdmitAll() {
    await allure.step('Нажать: Допустить всех', async () => {
      await this.admitAllCheckBox.click()
    })
  }

  async viewApplication(supplierName: string) {
    await allure.step(`Открыть заявку поставщика: ${supplierName}`, async () => {
      const supplierRow = this.page
        .getByRole('table')
        .locator('tr')
        .filter({ has: this.page.getByText(supplierName, { exact: true }) })
      await supplierRow.locator(this.applicationViewIcon).click()
    })
  }

  async checkSupplier(supplierName: string) {
    await allure.step(`Открыть отчет по поставщику: ${supplierName}`, async () => {
      const supplierRow = this.page
        .getByRole('table')
        .locator('tr')
        .filter({ has: this.page.getByText(supplierName, { exact: true }) })
      await supplierRow.locator(this.supplierCheckIcon).click()
    })
  }

  async fillActCreateTab(params: CreateActParams) {
    await allure.step('Заполнить вкладку создания акта', async () => {
      if (params.admitAll) {
        await this.clickAdmitAll()
      }

      if (params.supplierDecisions?.length) {
        for (const param of params.supplierDecisions) {
          await this.selectSupplierDecision(param.name, param.decision)
        }
      }
    })
  }
}
