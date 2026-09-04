import { DateInput } from '#/components/DateInput'
import { Select } from '#/components/Select'
import { TextInput } from '#/components/TextInput'

import { BaseModal } from '#/pageObjects/Modal/Modals'
import { Locator, Page } from '@playwright/test'
import { DurationLikeObject } from 'luxon'
import * as allure from 'allure-js-commons'

export class BillingPage {
  readonly page: Page
  readonly count: Locator
  readonly billingTable: Locator
  readonly billingTableColOperations: Locator
  readonly billingTableColDirection: Locator
  readonly billingTableColDate: Locator
  readonly billingTableColRegistryNumber: Locator
  readonly billingTableColRegistryStatus: Locator
  readonly billingTableOpenDataIcon: Locator
  readonly billingTableCopyIcon: Locator
  readonly billingTableRequest: Locator
  readonly billingTableResponse: Locator
  readonly filterIcon: Locator
  readonly modal: BaseModal
  readonly filterBody: Locator
  readonly filterOperationDropdown: Select
  readonly filterDateInput: DateInput
  readonly filterProcedureNumberInput: TextInput
  readonly filterOperationStatusDropdown: Select

  constructor(page: Page) {
    this.page = page
    this.count = page.getByTestId('total-count-title')
    this.billingTable = page.getByTestId('billing-table')
    this.billingTableColOperations = page.getByTestId('table-col-operation')
    this.billingTableColDirection = page.getByTestId('table-col-directionTo')
    this.billingTableColDate = page.getByTestId('table-col-sentAt')
    this.billingTableColRegistryNumber = page.getByTestId('table-col-registryNumber')
    this.billingTableColRegistryStatus = page.getByTestId('table-col-success')
    this.billingTableOpenDataIcon = page.getByTestId('expand-row')
    this.billingTableCopyIcon = page.getByTestId('icon-copy')
    this.billingTableRequest = page.getByTestId('request-container')
    this.billingTableResponse = page.getByTestId('response-container')
    this.filterIcon = page.getByTestId('filters')
    this.modal = new BaseModal(page)
    this.filterBody = this.modal.window
    this.filterOperationDropdown = new Select(page.getByTestId('select-operation'))
    this.filterDateInput = new DateInput(page.getByTestId('date-picker-sentAt'))
    this.filterProcedureNumberInput = new TextInput(page.getByTestId('registry-number-input'))
    this.filterOperationStatusDropdown = new Select(page.getByTestId('select-success'))
  }

  async openOperationRecord(recordNumber: string) {
    await allure.step('Открыть: Журнал интеграции', async () => {
      const operationRecord = this.page.getByTestId(`table-row-${recordNumber}`)
      await operationRecord.locator(this.billingTableOpenDataIcon).click()
    })
  }

  async openFilter() {
    await allure.step('Открыть: Фильтры', async () => {
      await this.filterIcon.click()
      await this.modal.waitForVisible()
    })
  }

  async selectFilterOperationInput(operation: string) {
    await allure.step('Поиск и выбор типа операции', async () => {
      await this.filterOperationDropdown.searchAndSelect(operation)
    })
  }

  async fillFilterDateSetAt(date: DurationLikeObject) {
    await allure.step('Заполнить дату начала', async () => {
      await this.filterDateInput.fill(date)
    })
  }

  async fillFilterProcedureNumber(procedureNumber: string) {
    await allure.step('Заполнить дату окончания', async () => {
      await this.filterProcedureNumberInput.fill(procedureNumber)
    })
  }

  async selectStatus(status: string) {
    await allure.step('Выбрать статус запроса', async () => {
      await this.filterOperationStatusDropdown.select(status)
    })
  }

  async getRequestData() {
    return await allure.step('Получить тело запроса', async () => {
      return this.billingTableRequest.textContent()
    })
  }

  async getResponseData() {
    return await allure.step('Получить тело ответа', async () => {
      return this.billingTableResponse.textContent()
    })
  }
}
