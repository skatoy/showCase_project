import { DateInput } from '#/components/DateInput'
import { Select } from '#/components/Select'
import { TextInput } from '#/components/TextInput'
import { Buttons } from '#/components/Buttons'
import { BaseModal } from '#/pageObjects/Modal/Modals'

import { Page, Locator } from '@playwright/test'
import { DurationLikeObject } from 'luxon'
import * as allure from 'allure-js-commons'

export class RequestParticipantsViewTab {
  readonly page: Page
  readonly modal: BaseModal
  readonly notificationTable: Locator
  readonly showNotification: Locator
  readonly applyButton: Buttons
  readonly discardButton: Buttons
  readonly donloadAllRequestButton: Locator
  readonly requestFilterButton: Locator
  readonly requestCardBody: Locator
  readonly requestSupplierName: Locator
  readonly requestPrice: Locator
  readonly procedureStatusPublishRequest: Locator
  readonly requestStatusIcon: Locator
  readonly checkSupplierIcon: Locator
  readonly sendMessageSupplierIcon: Locator
  readonly goToRequestButton: Locator
  readonly filterBody: Locator
  readonly filterDatePublicationFromInput: DateInput
  readonly filterDatePublicationEndInput: DateInput
  readonly filterProcedureStatusSelect: Select
  readonly filterPriceFromInput: TextInput
  readonly filterPriceToInput: TextInput
  readonly filterCurencyTypeSelect: Select
  readonly filterRequestStatusSelect: Select

  constructor(page: Page) {
    this.page = page
    this.modal = new BaseModal(page)
    this.notificationTable = page.getByTestId('notifications-table')
    this.showNotification = page.getByTestId('icon-down')
    this.filterBody = this.modal.body
    this.applyButton = new Buttons(this.filterBody.getByRole('button', { name: 'Применить' }))
    this.discardButton = new Buttons(this.filterBody.getByRole('button', { name: 'Сбросить' }))
    this.donloadAllRequestButton = page.getByTestId('download-archive-btn')
    this.requestFilterButton = page.getByTestId('filters')
    this.requestCardBody = page.getByTestId('request-card')
    this.requestSupplierName = page.getByTestId('request-supplier')
    this.requestPrice = page.getByTestId('request-price')
    this.procedureStatusPublishRequest = page.getByTestId('procedure-status')
    this.requestStatusIcon = page.getByTestId('icon-check_circle')
    this.checkSupplierIcon = page.getByTestId('icon-user')
    this.sendMessageSupplierIcon = page.getByTestId('icon-mail')
    this.goToRequestButton = page.getByTestId('go-to-request-page')
    this.filterDatePublicationFromInput = new DateInput(
      this.filterBody.getByTestId('dateOfPublication-from')
    )
    this.filterDatePublicationEndInput = new DateInput(
      this.filterBody.getByTestId('dateOfPublication-to')
    )
    this.filterProcedureStatusSelect = new Select(this.filterBody.getByTestId('select-lotStatus'))
    this.filterPriceFromInput = new TextInput(this.filterBody.getByTestId('price-from-input'))
    this.filterPriceToInput = new TextInput(this.filterBody.getByTestId('price-to-input'))
    this.filterCurencyTypeSelect = new Select(this.filterBody.getByTestId('select-currency'))
    this.filterRequestStatusSelect = new Select(this.filterBody.getByTestId('select-requestStatus'))
  }

  async openRequestList() {
    await allure.step('Открыть: Заявки участников', async () => {
      await this.page.getByTestId('tab-label').getByText('Заявки участников').click()
    })
  }

  async donloadAllRequest() {
    await allure.step('Скачать все заявки', async () => {
      await this.donloadAllRequestButton.click()
    })
  }

  async openFilter() {
    await allure.step('Открыть: Фильтры', async () => {
      await this.requestFilterButton.click()
      await this.modal.waitForVisible()
    })
  }

  async supplierCheck(supplierName: string) {
    await allure.step(`Открыть отчет по поставщику: ${supplierName}`, async () => {
      await this.requestCardBody
        .filter({ hasText: supplierName })
        .locator(this.checkSupplierIcon)
        .click()
    })
  }

  async supplierSendMessage(supplierName: string) {
    await allure.step(`Отправить сообщение поставщику: ${supplierName}`, async () => {
      await this.requestCardBody
        .filter({ hasText: supplierName })
        .locator(this.sendMessageSupplierIcon)
        .click()
    })
  }

  async viewSupplierRequest(supplierName: string) {
    await allure.step(`Открыть заявку поставщика: ${supplierName}`, async () => {
      await this.requestCardBody
        .filter({ hasText: supplierName })
        .locator(this.goToRequestButton)
        .click()
    })
  }

  async fillDateFrom(dateStart: DurationLikeObject) {
    await allure.step('Заполнить дату начала', async () => {
      await this.filterDatePublicationFromInput.fill(dateStart)
    })
  }

  async fillDateTo(dateEnd: DurationLikeObject) {
    await allure.step('Заполнить дату окончания', async () => {
      await this.filterDatePublicationEndInput.fill(dateEnd)
    })
  }

  async selectProcedureStep(stepName: string) {
    await allure.step(`Выбрать этап закупки: ${stepName}`, async () => {
      await this.filterProcedureStatusSelect.select(stepName)
    })
  }

  async fillPriceFrom(priceFrom: string) {
    await allure.step(`Заполнить цену от: ${priceFrom}`, async () => {
      await this.filterPriceFromInput.fill(priceFrom)
    })
  }

  async fillPriceTo(priceTo: string) {
    await allure.step(`Заполнить цену до: ${priceTo}`, async () => {
      await this.filterPriceToInput.fill(priceTo)
    })
  }

  async selectCurrencyType(currency: string) {
    await allure.step(`Выбрать валюту: ${currency}`, async () => {
      await this.filterCurencyTypeSelect.select(currency)
    })
  }

  async selectRequestStatus(requestStatus: string) {
    await allure.step(`Выбрать статус заявки: ${requestStatus}`, async () => {
      await this.filterRequestStatusSelect.select(requestStatus)
    })
  }

  async filterApply() {
    await allure.step('Применить фильтр', async () => {
      await this.applyButton.click()
    })
  }

  async filterDiscard() {
    await allure.step('Сбросить фильтр', async () => {
      await this.discardButton.click()
    })
  }
}
