import { Buttons } from '#/components/Buttons'
import { type Page, type Locator } from '@playwright/test'
import { CreateRebiddingFaceToFaceParams } from './CreateRebiddingFaceToFaceParam'
import { CreateRebiddingAbsenteeParams } from './CreateRebiddingAbsenteeParams'
import { DocumentsConfig, Files } from '#/utils/files'
import { TextInput } from '#/components/TextInput'
import { Select } from '#/components/Select'
import * as allure from 'allure-js-commons'

export type RebiddingDecision = 'Допущен' | 'Отклонен'
export type DocumentsParams = {
  description?: string
  documents?: DocumentsConfig
}
export type RebiddingBaseParam = {
  admitAll?: boolean
  suppliersAdmits?: {
    name: string
    decision: RebiddingDecision
  }[]
  supplierNameRequestView?: string
  supplierNameCheck?: string
  documentRequired?: boolean
  documentsBlock?: DocumentsParams
}

export type EditRebiddingBaseParam = {
  admitAll?: boolean
  suppliersAdmits?: {
    name: string
    decision: RebiddingDecision
  }[]
  documentRequired?: boolean
  documentsBlock?: DocumentsParams
}

export class CreateRebiddingBaseParamPage {
  readonly page: Page
  readonly files: Files
  readonly rebiddingTradeMode: Locator
  readonly absenteeRebiddingRadio: Locator
  readonly faceToFaceRebiddingRadio: Locator
  readonly admitAllCheckBox: Locator
  readonly applicationView: Locator
  readonly supplierCheckIcon: Locator
  readonly supplierDecisionSelect: Locator
  readonly paramRebiddingTable: Locator
  readonly rebbidingDocumentRequiredOption: Locator
  readonly rebiddingDocumentCommentInput: TextInput
  readonly confirmRebiddingButton: Buttons
  readonly moveForwardButton: Buttons
  readonly publishButton: Buttons
  constructor(page: Page) {
    this.page = page
    this.files = new Files(page)
    this.rebiddingTradeMode = page.getByTestId('radio-buttons-isTradeMode')
    this.absenteeRebiddingRadio = page.getByTestId('radio-button-0')
    this.faceToFaceRebiddingRadio = page.getByTestId('radio-button-1')
    this.admitAllCheckBox = page.getByRole('checkbox').filter({ hasText: 'Допустить всех' }) //Чек-бокс допустить всех
    this.applicationView = page.getByTestId('icon-eye-on') //Просмотр заявки поставщика
    this.supplierCheckIcon = page.getByTestId('icon-user') //Отчет по поставщику
    this.supplierDecisionSelect = page.getByTestId('select-decision') //Селектор выбора решения
    this.paramRebiddingTable = page.getByTestId('expander-content') //Таблица участников
    this.rebbidingDocumentRequiredOption = page
      .getByRole('checkbox')
      .filter({ hasText: 'Документы для подачи заявки в переторжку обязательны' }) // Обязательность документов для переторжки
    this.rebiddingDocumentCommentInput = new TextInput(page.locator('#documentComment'))
    this.confirmRebiddingButton = new Buttons(page.getByTestId('confirm-rebidding-btn'))
    this.moveForwardButton = new Buttons(page.getByRole('button', { name: 'Далее' }))
    this.publishButton = new Buttons(page.getByRole('button', { name: 'Опубликовать' }))
  }

  async clickConfirmRebidding() {
    await allure.step('Нажать: Подтвердить переторжку', async () => {
      await this.confirmRebiddingButton.click()
    })
  }

  async fillBaseParam({
    admitAll,
    suppliersAdmits,
    supplierNameRequestView,
    supplierNameCheck,
    documentRequired,
    documentsBlock
  }: RebiddingBaseParam) {
    await allure.step('Заполнить базовые параметры переторжки', async () => {
      if (admitAll) {
        await this.admitAllSuppliers(admitAll)
      }

      if (suppliersAdmits?.length) {
        for (const admits of suppliersAdmits) await this.supplierAdmit(admits.name, admits.decision)
      }

      if (supplierNameRequestView) {
        await this.supplierRequestView(supplierNameRequestView)
      }

      if (supplierNameCheck) {
        await this.supplierReportView(supplierNameCheck)
      }

      if (documentRequired === true) {
        await this.rebiddingDocumentRequired(documentRequired)
      }

      if (documentsBlock) {
        if (documentsBlock.description) {
          await this.rebiddingDocumentCommentInput.fill(documentsBlock.description)
        }

        if (documentsBlock.documents) {
          await this.files.addFiles(documentsBlock.documents)
        }
      }
    })
  }

  async choiceAbsenteeRebidding() {
    return await allure.step('Выбрать заочную переторжку', async () => {
      await this.absenteeRebiddingRadio.getByText('Заочная').click()

      return new CreateRebiddingAbsenteeParams(this.page)
    })
  }

  async choiceFaceToFaceRebidding() {
    return await allure.step('Выбрать очную переторжку', async () => {
      await this.faceToFaceRebiddingRadio.getByText('Очная').click()

      return new CreateRebiddingFaceToFaceParams(this.page)
    })
  }

  async admitAllSuppliers(admitAll: boolean) {
    await allure.step('Управлять допуском всех поставщиков', async () => {
      if (admitAll === false) {
        await this.admitAllCheckBox.click()
      }
    })
  }

  async supplierAdmit(supplier: string, admitDecision: string) {
    await allure.step(`Выбрать решение "${admitDecision}" для поставщика: ${supplier}`, async () => {
      const admitRow = this.page
        .getByRole('table')
        .locator('tr')
        .filter({ has: this.page.getByText(supplier, { exact: true }) })
      const input = admitRow.locator(this.supplierDecisionSelect)
      const select = new Select(input)
      await select.select(admitDecision)
    })
  }

  async supplierRequestView(supplierName: string) {
    await allure.step(`Открыть заявку поставщика: ${supplierName}`, async () => {
      const admitRow = this.page
        .getByRole('table')
        .locator('tr')
        .filter({ has: this.page.getByText(supplierName, { exact: true }) })
      await admitRow.locator(this.applicationView).click()
    })
  }

  async supplierReportView(supplierName: string) {
    await allure.step(`Открыть отчет по поставщику: ${supplierName}`, async () => {
      const admitRow = this.page
        .getByRole('table')
        .locator('tr')
        .filter({ has: this.page.getByText(supplierName, { exact: true }) })
      await admitRow.locator(this.supplierCheckIcon).click()
    })
  }

  async rebiddingDocumentRequired(required: boolean) {
    await allure.step('Указать обязательность документов для переторжки', async () => {
      if (required === true) {
        await this.rebbidingDocumentRequiredOption.click()
      }
    })
  }

  async procedureMoveNextStep() {
    await allure.step('Нажать: Далее', async () => {
      await this.moveForwardButton.click()
    })
  }

  async procedurePublish() {
    await allure.step('Нажать: Опубликовать', async () => {
      await this.publishButton.click()
    })
  }
}
