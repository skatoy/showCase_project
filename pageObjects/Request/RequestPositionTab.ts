import { Buttons } from '#/components/Buttons'

import { Tabs } from '#/components/Tabs'
import { Page, Locator } from '@playwright/test'
import { TextInput } from '#/components/TextInput'
import { Select } from '#/components/Select'
import * as allure from 'allure-js-commons'

export type RequirementAnswerData = {
  title: string
  type?: 'single' | 'multiple' | 'text' | 'file' | 'date' | 'number'
  answers: string[]
  customAnswer?: string
  commentAnswer?: string
}
export type RebiddingPositionConfig = {
  positionName: string
  price?: string
  vat?: string
}
export type PositionConfig = {
  positionName?: string
  clearOffer?: boolean
  customName?: string
  quantity?: string
  currency?: string
  price?: string
  vat?: string
  positionRequirements?: RequirementAnswerData[]
  addictionRequirements?: RequirementAnswerData[]
  downloadTemplate?: boolean
  uploadTemplate?: boolean
}

export class RequestPositionTab {
  readonly page: Page
  readonly saveButton: Buttons
  readonly clearOfferButton: Buttons
  readonly tab: Tabs
  readonly priceExchange: Locator
  readonly currencySeparated: Locator
  readonly positionEdit: Locator
  readonly positionCustomName: TextInput
  readonly positionQuantity: TextInput
  readonly positionCurrency: Select
  readonly positionPrice: TextInput
  readonly positionVat: TextInput
  readonly addictionalRequirement: Locator
  readonly positionRequirement: Locator
  readonly requirementQuestion: Locator
  readonly requirementSingleAnswer: Locator
  readonly requirementComments: Locator
  readonly requirementCustomAnswerSingle: Locator
  readonly requirementCustomAnswerMulti: Locator
  readonly requirementMultipleAnswer: Locator
  readonly requirementTextAnswer: Locator
  readonly requirementFileAnswer: Locator
  readonly requirementDateAnswer: Locator
  readonly requirementNumberAnswer: Locator
  readonly autoUpdateOfferButton: Buttons

  constructor(page: Page) {
    this.page = page
    this.saveButton = new Buttons(page.getByRole('button', { name: 'Сохранить', exact: true }))
    this.clearOfferButton = new Buttons(page.getByTestId('reset-offer-btn'), 'Очистить предложение')
    this.tab = new Tabs(page)

    this.priceExchange = page.getByTestId('convert-currency-wrapper')
    this.currencySeparated = page.getByTestId('radio-buttons-isCurrencyByPosition')
    this.positionEdit = page.getByTestId('icon-edit')
    this.positionCustomName = new TextInput(
      page.getByTestId('text-input-title'),
      'наименование позиции'
    )
    this.positionQuantity = new TextInput(page.locator('#quantity'), 'количество')
    this.positionCurrency = new Select(page.getByTestId('select-currency'), 'валюту')
    this.positionPrice = new TextInput(page.locator('#price'), 'цену')
    this.addictionalRequirement = page.getByTestId('additional-position-requirements')
    this.positionRequirement = page.getByTestId('position-requirements')
    this.positionVat = new TextInput(page.locator('#vatPercent'), 'НДС')
    this.requirementQuestion = page.getByTestId('questionary-view')
    this.requirementSingleAnswer = page.getByTestId('single-answer-radio-buttons')
    this.requirementComments = page.getByTestId('text-input-comment')
    this.requirementCustomAnswerSingle = page.getByTestId('text-input-custom-answer-single')
    this.requirementCustomAnswerMulti = page.getByTestId('text-input-custom-answer-multiple')
    this.requirementMultipleAnswer = page.getByTestId('checkbox-multipleAnswer')
    this.requirementTextAnswer = page.getByTestId('custom-answer-block')
    this.requirementFileAnswer = page.getByTestId('document-answer-dropzone')
    this.requirementDateAnswer = page.getByTestId('date-answer-input')
    this.requirementNumberAnswer = page.getByTestId('numeric-answer-input')
    this.autoUpdateOfferButton = new Buttons(
      page.getByTestId('auto-update-price-btn'),
      'Автообновление цены'
    )
  }

  async clickAutoUpdate() {
    await allure.step('Нажать: Автообновление', async () => {
      await this.autoUpdateOfferButton.click()
      await this.page
        .getByRole('cell')
        .filter({ hasText: 'Наименование' })
        .getByTestId('skeleton')
        .waitFor()
    })
  }

  async exchangePriceCurrency() {
    await allure.step('Пересчитать валюту цены', async () => {
      await this.priceExchange.click()
    })
  }

  async editPosition(positionName: string) {
    await allure.step(`Редактировать позицию: ${positionName}`, async () => {
      const position = this.page
        .getByRole('table')
        .locator('tr')
        .filter({ has: this.page.getByText(positionName, { exact: true }) })
      await position.locator(this.positionEdit).click()
    })
  }

  async fillPositions(positionsData: PositionConfig[]) {
    await allure.step('Заполнить позиции заявки', async () => {
      await this.tab.selectTab('positions')

      if (positionsData && positionsData.length) {
        for (const positionContent of positionsData) {
          await this.fillPosition(positionContent)
        }
      }
    })
  }

  async fillRequirementAnswer(
    requirementName: string,
    answerData: RequirementAnswerData,
    requirementBlock?: Locator
  ) {
    await allure.step(`Заполнить ответ на требование: ${requirementName}`, async () => {
      const block = requirementBlock || this.requirementQuestion
      const question = block.filter({ hasText: requirementName }).first()
      const { type, answers, customAnswer, commentAnswer } = answerData

      switch (type) {
        case 'single':
          await this.fillSingleAnswer(question, answers, customAnswer, commentAnswer)
          break
        case 'multiple':
          await this.fillMultipleAnswer(question, answers, customAnswer, commentAnswer)
          break
        case 'text':
          await this.fillTextAnswer(question, answers)
          break
        case 'file':
          await this.fillFileAnswer(question, answers)
          break
        case 'date':
          await this.fillDateAnswer(question, answers)
          break
        case 'number':
          await this.fillNumberAnswer(question, answers)
          break
      }
    })
  }

  async fillSingleAnswer(
    question: Locator,
    answers: string[],
    customAnswer?: string,
    commentAnswer?: string
  ) {
    await allure.step(`Заполнить одиночный ответ: ${answers[0]}`, async () => {
      await question.getByText(answers[0]).click()

      if (customAnswer) {
        await question.locator(this.requirementCustomAnswerSingle).fill(customAnswer)
      }

      if (commentAnswer) {
        await question.locator(this.requirementComments).fill(commentAnswer)
      }
    })
  }

  async fillMultipleAnswer(
    question: Locator,
    answers: string[],
    customAnswer?: string,
    commentAnswer?: string
  ) {
    await allure.step(`Заполнить множественный ответ: ${answers.join(', ')}`, async () => {
      for (const answer of answers) {
        await question.getByText(answer).click()
      }

      if (customAnswer) {
        await question.locator(this.requirementCustomAnswerMulti).fill(customAnswer)
      }

      if (commentAnswer) {
        await question.locator(this.requirementComments).fill(commentAnswer)
      }
    })
  }

  async fillTextAnswer(question: Locator, answers: string[]) {
    await allure.step(`Заполнить текстовый ответ: ${answers[0]}`, async () => {
      await question.locator(this.requirementTextAnswer).fill(answers[0])
    })
  }

  async fillFileAnswer(question: Locator, answers: string[]) {
    await allure.step(`Прикрепить файл к ответу: ${answers.join(', ')}`, async () => {
      const dropzone = question.locator(this.requirementFileAnswer)
      const fileInput = dropzone.locator('input[type="file"]')
      const filePaths = answers.map(file => `./fixtures/${file}`)
      await fileInput.setInputFiles(filePaths)
    })
  }

  async fillDateAnswer(question: Locator, answers: string[]) {
    await allure.step(`Заполнить ответ датой: ${answers[0]}`, async () => {
      await question.locator(this.requirementDateAnswer).fill(answers[0])
    })
  }

  async fillNumberAnswer(question: Locator, answers: string[]) {
    await allure.step(`Заполнить числовой ответ: ${answers[0]}`, async () => {
      await question.locator(this.requirementNumberAnswer).fill(answers[0])
    })
  }

  async fillPositionRequirements(requirements: RequirementAnswerData[]) {
    await allure.step('Заполнить требования позиции', async () => {
      for (const requirement of requirements) {
        await this.fillRequirementAnswer(
          requirement.title,
          requirement,
          this.addictionalRequirement
        )
      }
    })
  }

  async fillAddictionRequirements(requirements: RequirementAnswerData[]) {
    await allure.step('Заполнить дополнительные требования', async () => {
      for (const requirement of requirements) {
        await this.fillRequirementAnswer(
          requirement.title,
          requirement,
          this.addictionalRequirement
        )
      }
    })
  }

  async fillPositionPrice(price: string) {
    await allure.step(`Заполнить цену позиции: ${price}`, async () => {
      await this.positionPrice.fill(price)
    })
  }

  async selectPositionCurrency(currency: string) {
    await allure.step(`Выбрать валюту позиции: ${currency}`, async () => {
      await this.positionCurrency.select(currency)
    })
  }

  async fillPositionVat(vat: string) {
    await allure.step(`Заполнить НДС позиции: ${vat}`, async () => {
      await this.positionVat.fill(vat)
    })
  }

  async fillPositionQuantity(quantity: string) {
    await allure.step(`Заполнить количество позиции: ${quantity}`, async () => {
      await this.positionQuantity.fill(quantity)
    })
  }

  async fillPositionCustomName(customName: string) {
    await allure.step(`Заполнить пользовательское наименование позиции: ${customName}`, async () => {
      await this.positionCustomName.fill(customName)
    })
  }

  async fillPosition({
    positionName,
    clearOffer,
    customName,
    quantity,
    currency,
    price,
    vat,
    positionRequirements,
    addictionRequirements
  }: PositionConfig) {
    await allure.step('Заполнить позицию заявки', async () => {
      if (positionName) {
        await this.editPosition(positionName)
      }

      if (clearOffer) {
        await this.clearOfferButton.click()
      }

      if (customName) {
        await this.fillPositionCustomName(customName)
      }

      if (quantity) {
        await this.fillPositionQuantity(quantity)
      }

      if (currency) {
        await this.selectPositionCurrency(currency)
      }

      if (price) {
        await this.fillPositionPrice(price)
      }

      if (vat) {
        await this.fillPositionVat(vat)
      }

      if (addictionRequirements) {
        await this.fillAddictionRequirements(addictionRequirements)
      }

      if (positionRequirements) {
        await this.fillPositionRequirements(positionRequirements)
      }

      await this.saveButton.click()
    })
  }
}
