import { Buttons } from '#/components/Buttons'
import { DateInput } from '#/components/DateInput'
import { Select } from '#/components/Select'
import { Tabs } from '#/components/Tabs'
import { TextInput } from '#/components/TextInput'
import { BaseModal } from '#/pageObjects/Modal/Modals'
import { Locator, Page } from '@playwright/test'
import { DurationLikeObject } from 'luxon'
import * as allure from 'allure-js-commons'

export class FinanceHistoryTab {
  readonly page: Page
  readonly tab: Tabs
  readonly modal: BaseModal

  readonly transactionTypeSelect: Select
  readonly filterDateFromInput: DateInput
  readonly filterDateToInput: DateInput
  readonly filterRegistryNumberInput: TextInput

  readonly count: Locator
  readonly filterIcon: Locator
  readonly transactionTypeCloseIcon: Locator
  readonly table: Locator
  readonly tableNoData: Locator
  readonly columnHeaders: Locator
  readonly pagination: Locator
  readonly perPageSelect: Locator
  readonly applyButton: Buttons
  readonly discardButton: Buttons

  constructor(page: Page) {
    this.page = page
    this.tab = new Tabs(page)
    this.modal = new BaseModal(page)

    this.transactionTypeSelect = new Select(page.getByTestId('select-Type'))
    this.filterDateFromInput = new DateInput(page.getByTestId('date-picker--from'))
    this.filterDateToInput = new DateInput(page.getByTestId('date-picker--to'))
    this.filterRegistryNumberInput = new TextInput(page.locator('#ProcedureNumber'))
    this.tableNoData = page.getByTestId('table-no-data')
    this.count = page.getByTestId('total-count-title')
    this.filterIcon = page.getByTestId('filters')
    this.transactionTypeCloseIcon = page.getByTestId('icon-down')
    this.table = page.getByTestId('history-table')
    this.columnHeaders = page.locator('thead th')
    this.pagination = page.getByTestId('pagination-btns')
    this.perPageSelect = page.getByTestId('select-perPage')
    this.applyButton = new Buttons(page.getByRole('button', { name: 'Применить' }))
    this.discardButton = new Buttons(page.getByRole('button', { name: 'Сбросить' }))
  }

  async applyFilter() {
    await allure.step('Применить фильтр', async () => {
      await this.applyButton.click()
    })
  }

  async openFilter() {
    await allure.step('Открыть фильтр', async () => {
      await this.filterIcon.click()
      await this.modal.waitForVisible()
    })
  }

  async waitForTableLoaded() {
    await allure.step('Дождаться загрузки', async () => {
      await this.page.getByTestId('table-loaded').waitFor({ state: 'visible' })
    })
  }

  async goToHistoryTab() {
    await allure.step('Вкладка История операций', async () => {
      await this.tab.selectTab('/finance/history')
    })
  }

  async selectFilterTransactionType(transactionType: string) {
    await allure.step(`Выбрать тип транзакции: ${transactionType}`, async () => {
      await this.transactionTypeSelect.select(transactionType)
    })
  }

  async closeTransactionList() {
    await allure.step('Закрыть список транзакций', async () => {
      await this.transactionTypeSelect.input.locator(this.transactionTypeCloseIcon).click()
    })
  }

  async fillFilterDateFrom(date: DurationLikeObject) {
    await allure.step('Заполнить поле: Дата транзакции с', async () => {
      await this.filterDateFromInput.fill(date)
    })
  }

  async fillFilterDateTo(date: DurationLikeObject) {
    await allure.step('Заполнить поле: Дата транзакции до', async () => {
      await this.filterDateToInput.fill(date)
    })
  }

  async fillFilterRegistryNumber(registryNumber: string) {
    await allure.step(`Заполнить реестровый номер: ${registryNumber}`, async () => {
      await this.filterRegistryNumberInput.fill(registryNumber)
    })
  }

  async getTransactionRow(transactionType: string) {
    return await allure.step(`Получить строку транзакции: ${transactionType}`, async () => {
      return this.page
        .getByRole('table')
        .locator('tr')
        .filter({ has: this.page.getByRole('cell', { name: transactionType, exact: true }) })
    })
  }

  async getPriceTransaction(lotNumber: string, transactionType: string) {
    return await allure.step(`Получить сумму транзакции по лоту: ${lotNumber}`, async () => {
      const row = this.page
        .getByRole('table')
        .locator('tr')
        .filter({ has: this.page.getByText(lotNumber, { exact: true }) })
        .filter({ has: this.page.getByText(transactionType, { exact: true }) })
      const priceText = await row
        .locator('td[data-cy="table-col-sum"] [data-cy="price-cell"]')
        .textContent()
      const numericString = priceText!.split('.')[0].replaceAll(' ', '')

      return parseInt(numericString, 10)
    })
  }

  async getTransactionTypeOptions() {
    return await allure.step('Получить тип транзакции', async () => {
      return await this.transactionTypeSelect.getOptionsTexts()
    })
  }
}
