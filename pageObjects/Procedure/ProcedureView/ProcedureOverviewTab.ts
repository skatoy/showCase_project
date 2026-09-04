import { TextInput } from '#/components/TextInput'
import { Buttons } from '#/components/Buttons'

import { Page, Locator } from '@playwright/test'
import * as allure from 'allure-js-commons'

export class ProcedureOverviewTab {
  readonly page: Page
  readonly requestViewButton: Buttons
  readonly submitRequestButton: Buttons
  readonly applicationReviewButton: Buttons
  readonly commercialOfferButton: Buttons
  readonly rebiddingButton: Buttons
  readonly protocolPageButton: Buttons
  readonly rebiddingTradeButton: Buttons
  readonly initCorrectionRequestButton: Buttons
  readonly addCorrectRequestButton: Buttons
  readonly sendMessageButton: Buttons
  readonly moveBackIcon: Locator
  readonly procedureStatus: Locator
  readonly versionSelect: Locator
  readonly viewChangeIcon: Locator
  readonly competitiveListIcon: Locator
  readonly ipReportIcon: Locator
  readonly editIcon: Locator
  readonly tabs: Locator
  readonly procedureViewInfo: Locator
  readonly steps: Locator
  readonly requirementsForParticipants: Locator
  readonly delivery: Locator
  readonly prolongationTable: Locator
  readonly protocolTable: Locator
  readonly documentsForParticipation: Locator
  readonly documentsList: Locator
  readonly questionsAbout: Locator
  readonly questionsInput: TextInput
  readonly questionsAddFile: Locator
  readonly customerInfo: Locator
  readonly contactsInfo: Locator
  readonly countDownTimer: Locator

  constructor(page: Page) {
    this.page = page
    this.requestViewButton = new Buttons(page.getByTestId('view-request-btn'), 'Перейти к заявке')
    this.submitRequestButton = new Buttons(page.getByRole('button', { name: 'Подать заявку' }))
    this.applicationReviewButton = new Buttons(
      page.getByTestId('redirect-to-applications-review-btn'),
      'Рассмотрение заявок'
    )
    this.commercialOfferButton = new Buttons(
      page.getByTestId('redirect-to-commercial-offers-btn'),
      'Коммерческие предложения'
    )
    this.rebiddingButton = new Buttons(page.getByTestId('redirect-to-decision-btn'), 'Переторжка')
    this.protocolPageButton = new Buttons(
      page.getByTestId('redirect-to-protocol-btn'),
      'Протокол подведения итогов'
    )
    this.rebiddingTradeButton = new Buttons(
      page.getByTestId('go-to-rebidding-trade-btn'),
      'Перейти к торгам'
    )
    this.initCorrectionRequestButton = new Buttons(
      page.getByTestId('init-rebidding-trade-correction-btn'),
      'Корректировка заявок'
    )
    this.addCorrectRequestButton = new Buttons(
      page.getByTestId('add-request-btn'),
      'Корректировка заявки'
    )
    this.sendMessageButton = new Buttons(
      page.getByTestId('send-comment-btn'),
      'Отправить сообщение'
    )
    this.moveBackIcon = page.getByTestId('move-back-btn')
    this.procedureStatus = page.getByTestId('procedure-status')
    this.versionSelect = page.getByTestId('select-version')
    this.viewChangeIcon = page.getByTestId('icon-eye-on')
    this.competitiveListIcon = page.getByTestId('create-competitive-list-btn')
    this.ipReportIcon = page.getByTestId('icon-same_ip_groups_report')
    this.editIcon = page.getByTestId('edit-btn')
    this.tabs = page.getByTestId('tabs')
    this.procedureViewInfo = page.getByTestId('procedure-overview-tab')
    this.steps = page.getByTestId('procedure-steps')
    this.requirementsForParticipants = page.getByTestId('procedure-requirements')
    this.delivery = page.getByTestId('procedure-delivery')
    this.prolongationTable = page.getByTestId('prolongation-table')
    this.protocolTable = page.getByTestId('table-loaded')
    this.documentsForParticipation = page.getByTestId('procedure-documents')
    this.documentsList = page.getByTestId('procedure-document-list')
    this.questionsAbout = page.getByTestId('procedure-questions')
    this.questionsInput = new TextInput(
      page.getByTestId('procedure-comment-form').getByRole('textbox'),
      'сообщение'
    )
    this.questionsAddFile = page.getByTestId('procedure-comment-form').getByTestId('icon-paperclip')
    this.customerInfo = page.getByTestId('procedure-customers')
    this.contactsInfo = page.getByTestId('procedure-contacts')
    this.countDownTimer = page.getByTestId('count-down-timer')
  }

  async createCorrectionRequest() {
    await allure.step('Объявить корректировку заявок после торгов', async () => {
      await this.initCorrectionRequestButton.locator.waitFor({ state: 'visible' })
      await this.initCorrectionRequestButton.click()
    })
  }

  async goToCorrectionRequest() {
    await allure.step('Перейти к корректировке заявки', async () => {
      await this.addCorrectRequestButton.locator.waitFor()
      await this.addCorrectRequestButton.click()
    })
  }

  async goToRebiddingTrade() {
    await allure.step('Перейти к очной переторжке', async () => {
      await this.rebiddingTradeButton.click()
    })
  }

  async goToRebidding() {
    await allure.step('Перейти к переторжке', async () => {
      await this.rebiddingButton.locator.waitFor()
      await this.rebiddingButton.click()
    })
  }

  async goToApplicationReview() {
    await allure.step('Перейти к акту рассмотрения заявок', async () => {
      await this.applicationReviewButton.locator.waitFor()
      await this.applicationReviewButton.click()
    })
  }

  async goToCommertialOffer() {
    await allure.step('Перейти к объявлению этапа коммерческих предложений', async () => {
      await this.commercialOfferButton.locator.waitFor()
      await this.commercialOfferButton.click()
    })
  }

  async editProcedure(procedureTitle?: string, procedureStatus?: string) {
    await allure.step('Редактировать закупку', async () => {
      if (procedureStatus) {
        await this.waitStatus(procedureStatus)
      }

      await this.editIcon.click()

      if (procedureTitle) {
        await this.page.getByTestId('tab-label').getByText(`${procedureTitle}`).click()
      }
    })
  }

  async waitStatus(procedureStatus: string, timeout = 90_000) {
    await allure.step(`Дождаться статуса: ${procedureStatus}`, async () => {
      await this.procedureStatus
        .getByText(`${procedureStatus}`)
        .waitFor({ state: 'visible', timeout })
    })
  }

  async waitCountDownTimer(timeout = 90_000) {
    await allure.step('Дождаться окончания таймера этапа', async () => {
      await this.countDownTimer.waitFor({ state: 'hidden', timeout })
    })
  }

  async goViewRequest() {
    await allure.step('Посмотреть заявку', async () => {
      await this.requestViewButton.locator.waitFor()
      await this.requestViewButton.click()
    })
  }

  async submitRequest() {
    await allure.step('Подать заявку', async () => {
      await this.submitRequestButton.click()
    })
  }

  async goToProtocolPage() {
    await allure.step('Подведение итогов', async () => {
      await this.protocolPageButton.locator.waitFor()
      await this.protocolPageButton.click()
    })
  }

  async addNewMessage(message: string) {
    await allure.step(`Добавить сообщение: ${message}`, async () => {
      await this.questionsInput.fill(message)
      await this.sendMessageButton.click()
    })
  }

  async replyMessage(messageNumber: number, messageText: string) {
    await allure.step(`Ответ на сообщение: ${messageText}`, async () => {
      const message = this.questionsAbout.getByTestId(
        `procedure-message-block-${messageNumber.toString()}`
      )
      await message.getByTestId('procedure-comment-answer-btn').click()
      const messageInput = new TextInput(message.getByRole('textbox'))
      await messageInput.fill(messageText)
      await message.locator(this.sendMessageButton.locator).click()
    })
  }

  async addFileInMessage(fileName: string) {
    await allure.step(`Добавить вложение к сообщению: ${fileName}`, async () => {
      const path = `./fixtures/${fileName}`
      await this.questionsAddFile.click()
      await this.questionsAddFile.setInputFiles(path)
    })
  }
}
