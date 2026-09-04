import { Buttons } from '#/components/Buttons'
import { Page, Locator } from '@playwright/test'
import { DurationLikeObject } from 'luxon'
import { DocumentsConfig } from '#/utils/files'
import {
  AddSupplierModal,
  CustomSupplierParams,
  FindSupplierModal
} from '#/pageObjects/Modal/Modals'
import { Tabs } from '#/components/Tabs'
import { DateInput } from '#/components/DateInput'
import { Select } from '#/components/Select'
import { TextInput } from '#/components/TextInput'
import * as allure from 'allure-js-commons'

export type PrivateParams = {
  private: boolean
  supplier?: {
    inn: string
    email: string
  }
  customSupplier?: CustomSupplierParams
}

export type DateParams = {
  step: string
  dateStart?: DurationLikeObject
  dateFinish?: DurationLikeObject
}
export type EditingProcedureParamsData = {
  procedureTitle?: string
  procedureDate?: DateParams
  addFileName?: DocumentsConfig
}
export type CreateProcedureParamsData = {
  procedureUuid?: string
  procedureTitle: string
  internalNumber?: string
  currency?: string
  privateProcedure?: PrivateParams
  procedureDate: DateParams
  addFileName?: DocumentsConfig
}

export class ProcedureParamsTab {
  readonly page: Page
  readonly saveProcedureButton: Buttons
  readonly tab: Tabs
  readonly findSupplierModal: FindSupplierModal
  readonly customSupplierModal: AddSupplierModal
  readonly lotTitleNameInput: TextInput
  readonly internalNumberLotInput: TextInput
  readonly currencySelect: Select
  readonly openOrClosedProcedureRadio: Locator
  readonly addSupplierButton: Buttons
  readonly procedureDate: Locator
  readonly documentsDropzone: Locator
  readonly editStepNameButton: Locator

  constructor(page: Page) {
    this.page = page
    this.saveProcedureButton = new Buttons(page.getByRole('button', { name: 'Сохранить лот' }))
    this.tab = new Tabs(page)
    this.findSupplierModal = new FindSupplierModal(page)
    this.customSupplierModal = new AddSupplierModal(page)
    this.lotTitleNameInput = new TextInput(
      page.getByRole('textbox', { name: 'Введите наименование лота' })
    )
    this.internalNumberLotInput = new TextInput(page.getByPlaceholder('Введите внутренний номер'))
    this.currencySelect = new Select(page.getByTestId('select-currency'), 'валюту')
    this.openOrClosedProcedureRadio = page.getByTestId('radio-buttons-isPrivate')
    this.addSupplierButton = new Buttons(
      page.getByTestId('add-allowed-supplier'),
      'Добавить поставщика'
    )
    this.procedureDate = page.getByTestId('date-picker-').getByRole('textbox')
    this.editStepNameButton = page.getByTestId('icon-edit')
    this.documentsDropzone = page.getByTestId('dropzone')
  }

  async editProcedureParam(editParams: EditingProcedureParamsData) {
    await allure.step('Редактировать параметры закупки', async () => {
      await this.tab.selectTab('params')

      if (editParams.procedureTitle) {
        await this.lotTitleNameInput.clear()
        await this.fillProcedureTitle(editParams.procedureTitle)
      }

      if (editParams.procedureDate) {
        await this.correctDateEnd(
          editParams.procedureDate.step,
          editParams.procedureDate.dateFinish!
        )
      }

      if (editParams.addFileName) {
        await this.AddFiles(editParams.addFileName)
      }
    })
  }

  async fillProcedureParamPage({
    procedureTitle,
    internalNumber,
    currency,
    privateProcedure,
    procedureDate,
    addFileName
  }: CreateProcedureParamsData) {
    await allure.step('Вкладка: "Параметры"', async () => {
      await this.tab.selectTab('params')
      await this.fillProcedureTitle(procedureTitle)

      if (internalNumber) {
        await this.fillInternalNumber(internalNumber)
      }

      if (currency) {
        await this.selectCurrencyType(currency)
      }

      if (privateProcedure?.private) {
        await this.choicePrivateProcedure(privateProcedure.private)
        await this.addAllowSupplier()

        if (privateProcedure.supplier) {
          await this.findSupplierModal.findSupplierForInn(privateProcedure.supplier.inn)
          await this.findSupplierModal.clickFindSupplier()
          await this.findSupplierModal.selectAllowSupplier(privateProcedure.supplier.inn)
          await this.findSupplierModal.clickAddSupplier()
          await this.customSupplierModal.fillContactEmailSupplier(privateProcedure.supplier.email)
          await this.customSupplierModal.addCustomSupplier()
        }

        if (privateProcedure.customSupplier) {
          await this.findSupplierModal.clickAddCustomSupplier()
          await this.customSupplierModal.fillSupplierInfo(privateProcedure.customSupplier)
          await this.customSupplierModal.addCustomSupplier()
        }
      }

      if (procedureDate) {
        await this.dateFill(procedureDate)
      }

      if (addFileName) {
        await this.AddFiles(addFileName)
      }

      await this.saveProcedureButton.click()
    })
  }

  async fillProcedureTitle(procedureTitle: string) {
    await allure.step(`Заполнить наименование лота: ${procedureTitle}`, async () => {
      await this.lotTitleNameInput.fill(procedureTitle)
    })
  }

  async fillInternalNumber(internalNumber: string) {
    await allure.step(`Заполнить внутренний номер: ${internalNumber}`, async () => {
      await this.internalNumberLotInput.fill(internalNumber)
    })
  }

  async selectCurrencyType(currencyType: string) {
    await allure.step(`Выбрать валюту: ${currencyType}`, async () => {
      if (await this.currencySelect.input.isDisabled()) {
        return
      }

      await this.currencySelect.select(currencyType)
    })
  }

  async choicePrivateProcedure(privateType: boolean) {
    const procedureType = privateType ? 'Закрытая' : 'Открытая'
    await allure.step(`Выбрать тип закупки: ${procedureType}`, async () => {
      await this.openOrClosedProcedureRadio.getByText(procedureType).click()
    })
  }

  async addAllowSupplier() {
    await allure.step('Нажать: Добавить поставщика', async () => {
      await this.addSupplierButton.click()
    })
  }

  async correctDateEnd(step: string, dateFinish: DurationLikeObject) {
    await allure.step(`Скорректировать дату окончания этапа: ${step}`, async () => {
      const stepRow = this.page
        .getByRole('table')
        .locator('tr')
        .filter({ has: this.page.getByText(step, { exact: true }) })
      const finishDateInput = new DateInput(
        stepRow.getByRole('textbox').nth(1),
        `окончания этапа "${step}"`
      )
      await finishDateInput.fill(dateFinish)
    })
  }

  async dateFill(params: DateParams) {
    await allure.step(`Заполнить даты этапа: ${params.step}`, async () => {
      const stepRow = this.page
        .getByRole('table')
        .locator('tr')
        .filter({ has: this.page.getByText(params.step, { exact: true }) })

      if (params.dateStart) {
        const startDateInput = new DateInput(
          stepRow.getByRole('textbox').nth(0),
          `начала этапа "${params.step}"`
        )
        await startDateInput.fill(params.dateStart)
      }

      if (params.dateFinish) {
        const finishDateInput = new DateInput(
          stepRow.getByRole('textbox').nth(1),
          `окончания этапа "${params.step}"`
        )
        await finishDateInput.fill(params.dateFinish)
      }
    })
  }

  async AddFiles(config: DocumentsConfig) {
    const { filesNames, dropzoneIndex = 0 } = config
    const attached = config.fileBuffer?.name ?? filesNames.join(', ')
    await allure.step(`Прикрепить файл к лоту: ${attached}`, async () => {
      const dropzone = this.documentsDropzone.nth(dropzoneIndex)
      const fileInput = dropzone.locator('input[type="file"]')

      if (config.fileBuffer) {
        await fileInput.setInputFiles(config.fileBuffer)
      } else {
        await fileInput.setInputFiles(filesNames.map(fileName => `./fixtures/${fileName}`))
      }
    })
  }
}
