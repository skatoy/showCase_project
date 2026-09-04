import { Buttons } from '#/components/Buttons'
import { expect, Locator, Page } from '@playwright/test'
import { DeliveryBlock } from '../Blocks/DeliveryBlock'
import { pageUtils } from '#/utils/pageUtils'
import * as allure from 'allure-js-commons'

export class RequestReviewPage {
  readonly page: Page
  readonly cancelRequestButton: Buttons
  readonly editRequestButton: Buttons
  readonly improveDocumentsButton: Buttons
  readonly improveAllRequestButton: Buttons
  readonly prolongateImproveButton: Buttons
  readonly cancelImproveButton: Buttons
  readonly pageTittle: Locator
  readonly requestInfo: Locator
  readonly procedureStatusApplicationAccept: Locator
  readonly supplierName: Locator
  readonly supplierInn: Locator
  readonly applicationDate: Locator
  readonly procedureType: Locator
  readonly procedureName: Locator
  readonly procedureStatusApplicationReview: Locator
  readonly procedureWithoutPriceType: Locator
  readonly procedureTotalPrice: Locator
  readonly applicationPositionParam: Locator
  readonly applicationAnalogParam: Locator
  readonly applicationVatParam: Locator
  readonly requestParam: Locator
  readonly requestCompetitorParam: Locator
  readonly procedureCurrency: Locator
  readonly procedureMultiCurrency: Locator
  readonly contactPersonFio: Locator
  readonly contactPersonPhone: Locator
  readonly contactPersonEmail: Locator
  readonly delivery: DeliveryBlock
  readonly positionOffers: Locator
  readonly positionTable: Locator
  readonly cancelRequestModal: Locator
  readonly submitCancel: Locator
  readonly refuseCancel: Locator

  constructor(page: Page) {
    this.page = page
    this.cancelRequestButton = new Buttons(
      page.getByTestId('cancel-request-btn'),
      'Отозвать заявку'
    )
    this.editRequestButton = new Buttons(
      page.getByTestId('edit-request-btn'),
      'Редактировать заявку'
    )
    this.improveDocumentsButton = new Buttons(
      page.getByTestId('improve-documents-btn'),
      'Запросить улучшение документов'
    )
    this.improveAllRequestButton = new Buttons(
      page.getByTestId('improve-all-request-btn'),
      'Запросить улучшение заявки'
    )
    this.prolongateImproveButton = new Buttons(
      page.getByTestId('prolongate-request-improve-btn'),
      'Продлить срок улучшения'
    )
    this.cancelImproveButton = new Buttons(
      page.getByTestId('cancel-improve-request-btn'),
      'Отменить улучшение заявки'
    )
    this.delivery = new DeliveryBlock(page)
    this.pageTittle = page.getByTestId('page-title')
    this.requestInfo = page.getByText('Информация о заявке')
    this.procedureStatusApplicationAccept = page.getByTestId(
      'procedure-status-applications_acceptance'
    )
    this.supplierName = page.getByTestId('request-supplier-name')
    this.supplierInn = page.getByText('request-supplier-inn-kpp')
    this.applicationDate = page.getByText('request-date-of-submission')
    this.procedureStatusApplicationReview = page.getByTestId(
      'procedure-status-applications_acceptance'
    )
    this.procedureName = page.getByText('procedure-name')
    this.procedureType = page.getByTestId('procedure-type')
    this.procedureTotalPrice = page.getByTestId('procedure-total-price')
    this.procedureWithoutPriceType = page.getByTestId('price-procedure')
    this.applicationPositionParam = page.getByText('procedure-application-is-submitted')
    this.applicationAnalogParam = page.getByText('procedure-is-analog-allowed')
    this.applicationVatParam = page.getByText('procedure-price-vat')
    this.requestParam = page.getByText('procedure-offer-is-being-submitted')
    this.requestCompetitorParam = page.getByText('procedure-viewing-competitors-offers')
    this.procedureCurrency = page.getByText('procedure-lot-currency')
    this.procedureMultiCurrency = page.getByText('procedure-multicurrency')
    this.contactPersonFio = page.getByText('contact-person-full-name')
    this.contactPersonPhone = page.getByText('contact-person-phone')
    this.contactPersonEmail = page.getByText('contact-person-email')
    this.positionOffers = page.getByText('Предложения по позициям')
    this.positionTable = page.getByTestId('table-loaded')
    this.cancelRequestModal = page.getByTestId('modal-window')
    this.submitCancel = this.cancelRequestModal.getByTestId('button-primary')
    this.refuseCancel = this.cancelRequestModal.getByTestId('button-outline')
  }

  async goToRequestLink(procedureUuid: string, requestUuid: string) {
    await allure.step(`Открыть страницу заявки: ${requestUuid}`, async () => {
      await pageUtils.goto(this.page, `requests/${procedureUuid}/view/${requestUuid}`)
    })
  }

  async goToEditRequestLink(procedureUuid: string, requestUuid: string) {
    await allure.step(`Открыть страницу редактирования заявки: ${requestUuid}`, async () => {
      await pageUtils.goto(this.page, `requests/${procedureUuid}/edit/${requestUuid}`)
    })
  }

  async checkTitleLink() {
    await allure.step('Проверить, что заголовок является ссылкой', async () => {
      await expect(this.pageTittle).toHaveRole('link')
    })
  }

  async cancelRequest() {
    await allure.step('Отозвать заявку', async () => {
      await this.cancelRequestButton.click()
      await this.submitCancel.click()
    })
  }

  async goToEditRequest() {
    await allure.step('Перейти к редактированию заявки', async () => {
      await this.editRequestButton.click()
    })
  }

  async checkRequestInfo(name: string, inn: string, kpp: string, date: string) {
    await allure.step('Проверить информацию о заявке', async () => {
      await this.checkSupplierName(name)
      await this.checkSupplierInnKpp(inn, kpp)
      await this.checkRequestDate(date)
    })
  }

  async checkSupplierName(name: string) {
    await allure.step(`Проверить наименование поставщика: ${name}`, async () => {
      await expect(this.supplierName).toHaveText(name)
    })
  }

  async checkSupplierInnKpp(inn: string, kpp: string) {
    await allure.step(`Проверить ИНН и КПП поставщика: ${inn}, ${kpp}`, async () => {
      await expect(this.supplierInn).toHaveText([inn, kpp])
    })
  }

  async checkRequestDate(date: string) {
    await allure.step(`Проверить дату подачи заявки: ${date}`, async () => {
      await expect(this.applicationDate).toHaveText(date)
    })
  }

  async checkProcedureInfo(
    procedureName: string,
    procedureType: string,
    withoutPrice: boolean,
    applicationParam: string,
    analogParam: boolean,
    vatParam: boolean,
    requestParam: string,
    competitorsView: boolean,
    currencyType: string,
    price?: string
  ) {
    await allure.step('Проверить информацию о закупке', async () => {
      await this.checkProcedureName(procedureName)
      await this.checkProcedureType(procedureType)

      if (price) {
        await this.checkProcedureTotalPrice(price)
      }

      await this.checkProcedureWithoutPrice(withoutPrice)
      await this.checkApplicationSubmitParam(applicationParam)
      await this.checkAnalogParam(analogParam)
      await this.checkVatParam(vatParam)
      await this.checkRequestSubmitParam(requestParam)
      await this.checkCompetitorApplicationView(competitorsView)
      await this.checkCurrencyType(currencyType)
    })
  }

  async checkProcedureName(procedureName: string) {
    await allure.step(`Проверить наименование закупки: ${procedureName}`, async () => {
      await expect(this.procedureName).toHaveText(procedureName)
    })
  }

  async checkProcedureType(procedureType: string) {
    await allure.step(`Проверить тип закупки: ${procedureType}`, async () => {
      await expect(this.procedureType).toHaveText(procedureType)
    })
  }

  async checkProcedureTotalPrice(price: string) {
    await allure.step(`Проверить общую цену закупки: ${price}`, async () => {
      await expect(this.procedureTotalPrice).toHaveText(price)
    })
  }

  async checkProcedureWithoutPrice(withoutPrice: boolean) {
    await allure.step(
      `Проверить признак закупки без начальной цены: ${withoutPrice ? 'Да' : 'Нет'}`,
      async () => {
        if (withoutPrice === true) {
          await expect(this.procedureWithoutPriceType).toHaveText('Да')
        } else {
          await expect(this.procedureWithoutPriceType).toHaveText('Нет')
        }
      }
    )
  }

  async checkApplicationSubmitParam(applicationParam: string) {
    await allure.step(`Проверить параметр подачи заявки: ${applicationParam}`, async () => {
      await expect(this.applicationPositionParam).toHaveText(applicationParam)
    })
  }

  async checkAnalogParam(analogParam: boolean) {
    await allure.step(`Проверить параметр аналогов: ${analogParam ? 'Допущены' : 'Не допущены'}`, async () => {
      if (analogParam === true) {
        await expect(this.applicationAnalogParam).toHaveText('Допущены')
      } else {
        await expect(this.applicationAnalogParam).toHaveText('Не допущены')
      }
    })
  }

  async checkVatParam(vatParam: boolean) {
    await allure.step(`Проверить параметр НДС: ${vatParam ? 'С НДС' : 'Без НДС'}`, async () => {
      if (vatParam === true) {
        await expect(this.applicationVatParam).toHaveText('С НДС')
      } else {
        await expect(this.applicationVatParam).toHaveText('Без НДС')
      }
    })
  }

  async checkRequestSubmitParam(requestParam: string) {
    await allure.step(`Проверить параметр предложения: ${requestParam}`, async () => {
      await expect(this.requestParam).toHaveText(requestParam)
    })
  }

  async checkCompetitorApplicationView(competitorsView: boolean) {
    await allure.step(
      `Проверить параметр просмотра предложений конкурентов: ${competitorsView ? 'Да' : 'Нет'}`,
      async () => {
        if (competitorsView === true) {
          await expect(this.requestCompetitorParam).toHaveText('Да')
        } else {
          await expect(this.requestCompetitorParam).toHaveText('Нет')
        }
      }
    )
  }

  async checkCurrencyType(currencyType: string) {
    await allure.step(`Проверить валюту закупки: ${currencyType}`, async () => {
      await expect(this.procedureCurrency).toHaveText(currencyType)
    })
  }

  async improveDocumentsRequest() {
    await allure.step('Запросить улучшение документов', async () => {
      await this.improveDocumentsButton.click()
    })
  }

  async improveRequest() {
    await allure.step('Запросить улучшение заявки', async () => {
      await this.improveAllRequestButton.click()
    })
  }

  async prologateImproveRequest() {
    await allure.step('Продлить срок улучшения заявки', async () => {
      await this.prolongateImproveButton.click()
    })
  }

  async cancelImproveRequest() {
    await allure.step('Отменить улучшение заявки', async () => {
      await this.cancelImproveButton.click()
    })
  }
}
