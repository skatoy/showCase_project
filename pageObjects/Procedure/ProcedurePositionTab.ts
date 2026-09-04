import { Buttons } from '#/components/Buttons'
import { DeliveryBlock } from '#/pageObjects/Blocks/DeliveryBlock'
import { DocumentsConfig, Files } from '#/utils/files'
import { Tabs } from '#/components/Tabs'
import { Page, Locator } from '@playwright/test'
import * as allure from 'allure-js-commons'
import { AnswerData } from './ProcedureQuestionnaireTab'
import { TextInput } from '#/components/TextInput'
import { Select } from '#/components/Select'

export type PositionOption = 'Редактировать' | 'Копировать' | 'Подробности' | 'Удалить'
export type PositionParamsData = {
  procedurePrice?: string
  withoutPrice?: boolean
  okpdParam?: string
  okpd?: string
  deliveryParam: string
  conditional: string
  address: string
  date: string
  requirements?: RequirementData[]
  position: PositionData[]
}
export type PositionData = {
  positionTitle: string
  quantity?: string
  okpd?: string
  okei?: string
  price?: string
  description?: string
  conditional?: string
  address?: string
  date?: string
  relation?: string
  requirements?: RequirementData[]
}

export type EditingPositionData = {
  positionTitle: string
  positionData: PositionData
}

export type RequirementData = {
  title: string
  documents: DocumentsConfig
  needAnswer: boolean
  type?:
    'Один ответ' | 'Множественный выбор' | 'Ответ текстом' | 'Загрузка файлов' | 'Дата' | 'Число'
  answers?: AnswerData[]
  customAnswer?: boolean
  forMainOffer: boolean
  forAnalogOffer: boolean
}

export class ProcedurePositionsTab {
  readonly page: Page
  readonly saveButton: Buttons
  readonly deleteButton: Buttons
  readonly closeButton: Buttons
  readonly addPositionButton: Buttons
  readonly deleteAllPositionButton: Buttons
  readonly importTemplateButton: Buttons
  readonly downloadTemplateButton: Buttons
  readonly addGeneralRequirementButton: Buttons
  readonly addAnswerButton: Buttons
  readonly tab: Tabs
  readonly modal: Locator
  readonly files: Files

  readonly procedurePrice: TextInput
  readonly procedureWithoutPrice: Locator
  readonly okpdIsProcedure: Locator
  readonly okpdList: Select
  readonly delivery: DeliveryBlock
  readonly deliveryPosition: Locator
  readonly bannerRequirement: Locator

  readonly positionOption: Locator
  readonly positionOptionMenu: Locator

  readonly addQuestionRequirement: Locator
  readonly requirementCard: Locator
  readonly requirementTitle: TextInput
  readonly requirementType: Locator

  readonly needRequirementAnswer: Locator
  readonly answerName: TextInput
  readonly wightAnswer: TextInput
  readonly deleteAnswer: Locator
  readonly commentRequired: Locator
  readonly customAnswer: Locator
  readonly forMainOffer: Locator
  readonly forAnalogOffer: Locator
  readonly tabRequirement: Locator
  readonly getForPriceList: Locator
  readonly positionTitle: TextInput

  readonly okpdByPosition: Select
  readonly positionQuantity: TextInput
  readonly positionOkei: Select
  readonly positionPrice: TextInput
  readonly positionDescription: TextInput
  readonly relationInput: Select
  readonly mainPositionTab: Locator
  readonly positionRequirementTab: Locator

  constructor(page: Page) {
    this.page = page
    this.saveButton = new Buttons(page.getByRole('button', { name: 'Сохранить', exact: true }))
    this.deleteButton = new Buttons(page.getByRole('button', { name: 'Удалить', exact: true }))
    this.closeButton = new Buttons(page.getByRole('button', { name: 'Закрыть' }))
    this.addPositionButton = new Buttons(page.getByRole('button', { name: 'Добавить позицию' }))
    this.deleteAllPositionButton = new Buttons(page.getByRole('button', { name: 'Удалить все' }))
    this.importTemplateButton = new Buttons(page.getByRole('button', { name: 'Импорт' }))
    this.downloadTemplateButton = new Buttons(page.getByRole('button', { name: 'Скачать шаблон' }))
    this.addGeneralRequirementButton = new Buttons(
      page.getByRole('button', { name: 'Добавить требование' })
    )
    this.addAnswerButton = new Buttons(page.getByRole('button', { name: 'Добавить ответ' }))
    this.modal = page.getByTestId('modal-window')
    this.tab = new Tabs(page)
    this.files = new Files(page)
    this.procedurePrice = new TextInput(page.locator('#price'), 'цену закупки')
    this.procedureWithoutPrice = page.getByRole('checkbox', { name: 'Лот без начальной цены' })
    this.okpdIsProcedure = page.getByTestId('radio-buttons-isOkpdByProcedure')
    this.okpdList = new Select(page.getByTestId('select-okpdList'))
    this.delivery = new DeliveryBlock(page)
    this.deliveryPosition = page.getByTestId('radio-buttons-isDeliveryByPosition')
    this.bannerRequirement = page.getByText('Требования ко всем позициям')

    this.positionOption = page.getByTestId('icon-more')
    this.positionOptionMenu = page.getByTestId('dropdown-menu')
    this.tabRequirement = page.getByTestId('tab-element-requirements')
    this.getForPriceList = page.getByTestId('checkbox-isForPriceList')
    this.positionTitle = new TextInput(page.getByRole('textbox', { name: 'Наименование позиции*' }))
    this.okpdByPosition = new Select(page.getByTestId('select-okpd'), 'ОКПД позиции')
    this.positionQuantity = new TextInput(page.locator('#quantity'), 'количество')
    this.positionOkei = new Select(page.getByTestId('select-okei'), 'единицу измерения')
    this.positionPrice = new TextInput(page.getByPlaceholder('Введите цену'))
    this.positionDescription = new TextInput(page.getByLabel('Описание позиции'))
    this.relationInput = new Select(
      page.getByRole('textbox', {
        name: 'Поиск по номеру или по наименованию позиции'
      })
    )
    this.mainPositionTab = page.getByTestId('tab-element-requirements')
    this.positionRequirementTab = page.getByTestId('tab-element-requirements')
    this.addQuestionRequirement = page.getByTestId('add-question-btn')
    this.requirementCard = page.getByTestId('question-editor')
    this.requirementTitle = new TextInput(
      this.requirementCard.locator(page.getByTestId('text-input-title'))
    )
    this.requirementType = page.getByTestId('radio-buttons-answerType')

    this.needRequirementAnswer = page.getByTestId('checkbox-')
    this.answerName = new TextInput(page.getByTestId('answer-name-questionary'))
    this.wightAnswer = new TextInput(page.getByPlaceholder('Вес'))
    this.deleteAnswer = page.getByTestId('delete-answer')
    this.commentRequired = page.getByTestId('checkbox-is-comment-required')
    this.customAnswer = page.getByTestId('checkbox-is-custom-answer-allowed')
    this.forMainOffer = page.getByTestId('checkbox-').getByText('Для основного предложения')
    this.forAnalogOffer = page.getByTestId('checkbox-').getByText('Для аналога')
  }

  async fillPositionTab({
    procedurePrice,
    withoutPrice,
    okpdParam,
    okpd,
    deliveryParam,
    conditional,
    address,
    date,
    position,
    requirements
  }: PositionParamsData) {
    await allure.step('Вкладка: "Позиции"', async () => {
      await this.tab.selectTab('positions')

      if (procedurePrice) {
        await this.fillProcedurePrice(procedurePrice)
      }

      if (withoutPrice) {
        await this.positionsWithPrice()
      }

      if (okpdParam === 'По всем позициям' && okpd) {
        await this.okpdProcedureType(okpdParam)
        await this.fillOkpdAllPosition(okpd)
      }

      if (deliveryParam === 'По отдельным позициям') {
        await this.deliveryPositionsType(deliveryParam)
      } else {
        await this.fillDelivery(conditional, address, date)
      }

      if (requirements) {
        await this.addGeneralRequirementButton.click()
        await this.addRequirements(requirements)
        await this.saveButton.click()
      }

      await this.addNewPositions(position)
    })
  }

  async positionsWithPrice() {
    await allure.step('Указать закупку без начальной цены', async () => {
      await this.procedureWithoutPrice.click()
    })
  }

  async fillProcedurePrice(price: string) {
    await allure.step(`Заполнить цену закупки: ${price}`, async () => {
      await this.procedurePrice.fill(price)
    })
  }

  async okpdProcedureType(okpdProcedure: string) {
    await allure.step(`Выбрать способ указания ОКПД: ${okpdProcedure}`, async () => {
      await this.okpdIsProcedure.getByText(okpdProcedure).click()
    })
  }

  async fillOkpdAllPosition(okpd: string) {
    await allure.step(`Выбрать ОКПД для всех позиций: ${okpd}`, async () => {
      await this.okpdList.searchAndSelect(okpd)
    })
  }

  async deliveryPositionsType(deliveryType: string) {
    await allure.step(`Выбрать способ указания поставки: ${deliveryType}`, async () => {
      await this.deliveryPosition.getByText(deliveryType).click()
    })
  }

  async fillDeliveryConditional(conditional: string) {
    await this.delivery.fillDeliveryConditional(conditional)
  }

  async fillDeliveryAddress(address: string) {
    await this.delivery.fillDeliveryAddress(address)
  }

  async fillDeliveryDate(date: string) {
    await this.delivery.fillDeliveryDate(date)
  }

  async fillDelivery(conditional: string, address: string, date: string) {
    await this.delivery.fill({ conditional, address, date })
  }

  async fillPositionTitle(title: string) {
    await allure.step(`Заполнить наименование позиции: ${title}`, async () => {
      await this.positionTitle.fill(title)
    })
  }

  async fillPositionQuantity(quantity: string) {
    await allure.step(`Заполнить количество позиции: ${quantity}`, async () => {
      await this.positionQuantity.fill(quantity)
    })
  }

  async fillPositionPrice(price: string) {
    await allure.step(`Заполнить цену позиции: ${price}`, async () => {
      await this.positionPrice.fill(price)
    })
  }

  async fillPositionDescription(description: string) {
    await allure.step(`Заполнить описание позиции: ${description}`, async () => {
      await this.positionDescription.fill(description)
    })
  }

  async selectOkpdPosition(okpd: string) {
    await allure.step(`Выбрать ОКПД позиции: ${okpd}`, async () => {
      await this.okpdByPosition.searchAndSelect(okpd)
    })
  }

  async selectOkeiPosition(okei: string) {
    await allure.step(`Выбрать единицу измерения позиции: ${okei}`, async () => {
      await this.positionOkei.searchAndSelect(okei)
    })
  }

  async fillPosition({
    positionTitle,
    quantity,
    okpd,
    okei,
    price,
    description,
    conditional,
    address,
    date,
    relation,
    requirements
  }: PositionData) {
    await allure.step(`Заполнить позицию: ${positionTitle}`, async () => {
      await this.tab.selectTab('main')
      await this.fillPositionTitle(positionTitle)
      await this.fillPositionQuantity(quantity!)
      await this.selectOkpdPosition(okpd!)
      await this.selectOkeiPosition(okei!)

      if (price) {
        await this.fillPositionPrice(price)
      }

      if (description) {
        await this.fillPositionDescription(description)
      }

      if (conditional && address && date) {
        await this.fillDelivery(conditional, address, date)
      }

      if (relation) {
        await this.relationInput.searchAndSelect(relation)
      }

      if (requirements) {
        await this.tab.selectTab('requirements')
        await this.addRequirements(requirements)
      }

      await this.saveButton.click()
    })
  }

  async clearPosition() {
    await allure.step('Очистить данные позиции', async () => {
      await this.positionTitle.clear()
      await this.positionQuantity.clear()
      await this.okpdByPosition.clear()
      await this.positionOkei.clear()

      if (await this.positionPrice.locator.isVisible()) {
        await this.positionPrice.clear()
      }

      await this.positionDescription.clear()
      const isVisibleDeliveryConditional = await this.modal
        .locator(this.delivery.deliveryConditional.locator)
        .isVisible()
      const isVisibleDeliveryAddress = await this.modal
        .locator(this.delivery.deliveryAddress.locator)
        .isVisible()
      const isVisibleDeliveryDate = await this.modal
        .locator(this.delivery.deliveryDate.locator)
        .isVisible()

      if (isVisibleDeliveryConditional || isVisibleDeliveryAddress || isVisibleDeliveryDate) {
        await this.delivery.clear()
      }
    })
  }

  async fillRequirementTitle(title: string) {
    await allure.step(`Заполнить название требования: ${title}`, async () => {
      await this.requirementTitle.fill(title)
    })
  }

  async fillAnswerName(answerIndex: number, name: string) {
    await allure.step(`Заполнить вариант ответа: ${answerIndex + 1}`, async () => {
      await this.answerName.locator.nth(answerIndex).fill(name)
    })
  }

  async fillAnswerWeight(answerIndex: number, weight: number) {
    await allure.step(`Заполнить вес ответа: ${answerIndex + 1}`, async () => {
      await this.wightAnswer.locator.nth(answerIndex).fill(weight.toString())
      await this.page.keyboard.press('ArrowDown')
      await this.page.keyboard.press('Enter')
    })
  }

  async setAnswerCommentRequired(checkboxIndex: number) {
    await allure.step(`Отметить обязательность комментария: ${checkboxIndex + 1}`, async () => {
      await this.commentRequired.nth(checkboxIndex).click()
    })
  }

  async setCustomAnswerAllowed() {
    await allure.step('Разрешить свой вариант ответа', async () => {
      await this.customAnswer.click()
    })
  }

  async choiceRequirementAnswerType(answerType: string) {
    await allure.step(`Выбрать тип ответа требования: ${answerType}`, async () => {
      await this.requirementType.getByText(answerType).click()
    })
  }

  async addRequirements(requirements: RequirementData[]) {
    await allure.step('Добавить требования', async () => {
      for (const requirement of requirements) {
        await this.addQuestionRequirement.click()
        await this.fillRequirementTitle(requirement.title)

        if (requirement.documents) {
          await this.files.addFiles(requirement.documents)
        }

        if (requirement.needAnswer) {
          await this.choiceRequirementAnswerType(requirement.type!)

          if (requirement.answers) {
            await this.fillAnswers(requirement.answers)
          }

          if (requirement.customAnswer) {
            await this.setCustomAnswerAllowed()
          }

          if (requirement.forMainOffer) {
            await this.forMainOffer.click()
          }

          if (requirement.forAnalogOffer) {
            await this.forAnalogOffer.click()
          }
        }

        await this.requirementCard.getByRole('button', { name: 'Сохранить' }).click()
      }
    })
  }

  async fillAnswers(answers: AnswerData[]) {
    await allure.step('Заполнить варианты ответов', async () => {
      for (const [index, answer] of answers.entries()) {
        if (index >= 2) {
          await this.addAnswerButton.click()
        }

        await this.fillAnswerName(index, answer.text)

        if (answer.weight) {
          await this.fillAnswerWeight(index, answer.weight)
        }

        if (answer.isCommentRequired) {
          await this.setAnswerCommentRequired(index)
        }
      }
    })
  }

  async addNewPositions(positionsData: PositionData[]) {
    await allure.step('Добавить позиции', async () => {
      await this.tab.selectTab('positions')

      if (positionsData && positionsData.length) {
        for (const positionContent of positionsData) {
          await this.addPositionButton.click()
          await this.fillPosition(positionContent)
        }
      }
    })
  }

  async updatePositions(updateData: PositionData[]) {
    await allure.step('Обновить позиции', async () => {
      for (const positionContent of updateData) {
        await this.fillPosition(positionContent)
      }
    })
  }

  async clickPositionOption(positionTitle: string) {
    await allure.step('Нажать: Действия позиции', async () => {
      const position = this.page
        .getByRole('table')
        .locator('tr')
        .filter({ has: this.page.getByText(positionTitle, { exact: true }) })
      await position.locator(this.positionOption).click()
    })
  }

  async selectPositionOption(option: string) {
    await allure.step(`Выбрать действие для позиции: ${option}`, async () => {
      await this.positionOptionMenu.getByText(option).click()
    })
  }

  async editPosition({ positionTitle, positionData }: EditingPositionData) {
    await allure.step(`Редактировать позицию: ${positionTitle}`, async () => {
      await this.tab.selectTab('positions')
      await this.clickPositionOption(positionTitle)
      await this.selectPositionOption('Редактировать')
      await this.clearPosition()
      await this.updatePositions([positionData])
    })
  }

  async deletePosition(positionTitle: string) {
    await allure.step(`Удалить позицию: ${positionTitle}`, async () => {
      await this.tab.selectTab('positions')
      await this.clickPositionOption(positionTitle)
      await this.selectPositionOption('Удалить')
      await this.deleteButton.click()
    })
  }

  async copyPosition(positionTitle: string) {
    await allure.step(`Копировать позицию: ${positionTitle}`, async () => {
      await this.tab.selectTab('positions')
      await this.clickPositionOption(positionTitle)
      await this.selectPositionOption('Копировать')
      await this.saveButton.click()
    })
  }

  async viewPosition(positionTitle: string) {
    await allure.step(`Просмотреть позицию: ${positionTitle}`, async () => {
      await this.tab.selectTab('positions')
      await this.clickPositionOption(positionTitle)
      await this.selectPositionOption('Подробности')
      await this.closeButton.click()
    })
  }
}
