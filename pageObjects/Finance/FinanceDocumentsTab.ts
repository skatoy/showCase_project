import { Locator, Page } from '@playwright/test'

import { DurationLikeObject } from 'luxon'
import { DateInput } from '#/components/DateInput'

import { Tabs } from '#/components/Tabs'
import { TextInput } from '#/components/TextInput'
import { BaseModal } from '#/pageObjects/Modal/Modals'
import * as allure from 'allure-js-commons'

export class FinanceDocumentsTab {
  readonly tab: Tabs
  readonly modal: BaseModal

  readonly filterDateFromInput: DateInput
  readonly filterDateToInput: DateInput
  readonly filterRegistryNumberInput: TextInput

  readonly filterIcon: Locator
  readonly documentDownloadButton: Locator
  readonly page: Page

  constructor(page: Page) {
    this.page = page
    this.tab = new Tabs(page)
    this.modal = new BaseModal(page)

    this.filterDateFromInput = new DateInput(page.getByTestId('date-picker--from'))
    this.filterDateToInput = new DateInput(page.getByTestId('date-picker--to'))
    this.filterRegistryNumberInput = new TextInput(page.locator('#ProcedureNumber'))

    this.filterIcon = page.getByTestId('filters')
    this.documentDownloadButton = page.getByTestId('document-link')
  }

  async goToDocumentsTab() {
    await allure.step('Перейти на вкладку документов', async () => {
      await this.tab.selectTab('/finance/documents')
    })
  }

  async openFilter() {
    await allure.step('Открыть: Фильтры', async () => {
      await this.filterIcon.click()
      await this.modal.waitForVisible()
    })
  }

  async fillFilterDateFrom(date: DurationLikeObject) {
    await allure.step('Заполнить дату начала ', async () => {
      await this.filterDateFromInput.fill(date)
    })
  }

  async fillFilterDateTo(date: DurationLikeObject) {
    await allure.step('Заполнить дату окончания', async () => {
      await this.filterDateToInput.fill(date)
    })
  }

  async fillFilterRegistryNumber(registryNumber: string, lotNumber: number) {
    await allure.step(`Заполнить поле Номер лота значением: ${registryNumber}-${lotNumber}`, async () => {
      const fullNumber = `${registryNumber}-${lotNumber.toString()}`
      await this.filterRegistryNumberInput.fill(fullNumber)
    })
  }

  async downloadDocument(lotNumber: string) {
    await allure.step(`Скачать документ по лоту: ${lotNumber}`, async () => {
      const row = this.page
        .getByRole('table')
        .locator('tr')
        .filter({ has: this.page.getByText(lotNumber, { exact: true }) })
      await row.locator(this.documentDownloadButton).click()
    })
  }
}
