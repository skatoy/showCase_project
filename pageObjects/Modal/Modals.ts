import { Buttons } from '#/components/Buttons'
import { DurationLikeObject } from 'luxon'

import { Locator, Page } from '@playwright/test'

import { Select } from '#/components/Select'
import { DateInput } from '#/components/DateInput'
import { TextInput } from '#/components/TextInput'
import * as allure from 'allure-js-commons'

export type ImproveDocumentOption = {
  dateEnd: DurationLikeObject
  improveDocumentProcedure?: {
    check: boolean
    reason: string
  }
  improveDocumentForAllProcedures?: { check: boolean; reason: string }
  improvePosition?: {
    positionRequirements?: boolean
    positionName?: boolean
    reason: string
  }
}

export type CustomSupplierParams = {
  supplierName: string
  residentStatus: boolean
  inn: string
  kpp: string
  email: string
}

export type RefundParams = {
  price: number
  reason: string
}
export type AcceleratedCreditsParams = {
  name: string
  phone: string
  email: string
  deposit: number
}
export type TenderSupportParams = {
  name: string
  phone: string
  email: string
}
export type CriticalChangeParams = {
  endDate: DurationLikeObject
  reason: string
}

export type ImproveRequestOption = {
  improveType: 'Корректировка цен' | 'Полная доработка'
  dateEnd: DurationLikeObject
  improveReason: string
  rebiddingAfter: boolean
}
export class Modal {
  constructor(private page: Page) {}

  modalTitle() {
    return this.page.locator('[data-cy="modal-window"] [data-cy="modal-header"]')
  }

  modalBody() {
    return this.page.locator('[data-cy="modal-window"] [data-cy="modal-body"]')
  }

  primaryActionBtn() {
    return this.page.locator('[data-cy="modal-window"] [data-cy="button-primary"]')
  }

  secondaryActionBtn() {
    return this.page.locator('[data-cy="modal-window"] [data-cy="button-outline"]')
  }

  closeModal() {
    return this.page.locator('[data-cy="modal-window"] [data-cy="icon-close"]').first()
  }
}

export class BaseModal {
  readonly page: Page
  readonly body: Locator
  readonly window: Locator
  readonly modalName: Locator
  constructor(page: Page) {
    this.page = page
    this.body = page.getByTestId('modal-body')
    this.window = page.getByTestId('modal-window')
    this.modalName = page.getByTestId('modal-header')
  }

  async waitForVisible() {
    await allure.step('Дождаться открытия модального окна', async () => {
      await this.window.waitFor({ state: 'visible' })
    })
  }
}

export class ImproveApplicationModal {
  readonly page: Page
  readonly modal: BaseModal
  readonly confirmButton: Buttons
  readonly improveRequestRadio: Locator
  readonly dateEndInput: DateInput
  readonly reasonInput: TextInput
  readonly rebiddingAfterCheckBox: Locator
  constructor(page: Page) {
    this.page = page
    this.modal = new BaseModal(page)
    this.confirmButton = new Buttons(page.getByRole('button', { name: 'Подтвердить' }))
    this.improveRequestRadio = page.getByTestId('radio-buttons-protocolForAllSuppliersVisibility')
    this.dateEndInput = new DateInput(page.getByTestId('date-picker-dateEnd').getByRole('textbox'))
    this.reasonInput = new TextInput(page.getByTestId('text-input-reason'))
    this.rebiddingAfterCheckBox = page.getByTestId('checkbox-')
  }

  async fillImproveRequest({
    improveType,
    dateEnd,
    improveReason,
    rebiddingAfter
  }: ImproveRequestOption) {
    await allure.step('Заполнить форму улучшения заявки', async () => {
      await this.choiceImproveType(improveType)
      await this.fillDateEnd(dateEnd)
      await this.fillImproveReason(improveReason)

      if (rebiddingAfter) {
        await this.clickRebiddingAfter()
      }

      await this.confirmButton.click()
    })
  }

  async fillDateEnd(dateEnd: DurationLikeObject) {
    await allure.step('Заполнить дату окончания', async () => {
      await this.dateEndInput.fill(dateEnd)
    })
  }

  async choiceImproveType(improveType: string) {
    await allure.step(`Выбрать тип улучшения: ${improveType}`, async () => {
      await this.improveRequestRadio.getByText(improveType).click()
    })
  }

  async fillImproveReason(reason: string) {
    await allure.step(`Заполнить причину улучшения: ${reason}`, async () => {
      await this.reasonInput.fill(reason)
    })
  }

  async clickRebiddingAfter() {
    await allure.step('Нажать: После переторжки', async () => {
      await this.rebiddingAfterCheckBox.click()
    })
  }
}

export class ImproveDocumentationModal {
  readonly page: Page
  readonly modal: BaseModal
  readonly confirmButton: Buttons
  readonly dateEndInput: DateInput
  readonly procedureDocumentCheckBox: Locator
  readonly procedureDocumentReasonInput: TextInput
  readonly allProcedureDocumentCheckBox: Locator
  readonly allProcedureDocumentReasonInput: TextInput
  readonly requirementsPositionCheckBox: Locator
  readonly positionNameCheckBox: Locator
  readonly reasonInput: TextInput
  constructor(page: Page) {
    this.page = page
    this.modal = new BaseModal(page)
    this.confirmButton = new Buttons(page.getByRole('button', { name: 'Подтвердить' }))
    this.dateEndInput = new DateInput(page.getByTestId('date-picker-dateEnd').getByRole('textbox'))
    this.procedureDocumentCheckBox = page.getByTestId('checkbox-improve-document-1')
    this.procedureDocumentReasonInput = new TextInput(
      page.getByTestId('text-input-improve-comment-1')
    )
    this.allProcedureDocumentCheckBox = page.getByTestId('checkbox-improve-document-2')
    this.allProcedureDocumentReasonInput = new TextInput(
      page.getByTestId('text-input-improve-comment-2')
    )
    this.requirementsPositionCheckBox = page.getByTestId('checkbox-improve-requirements')
    this.positionNameCheckBox = page.getByTestId('checkbox-improve-position-name')
    this.reasonInput = new TextInput(page.getByTestId('text-input-improve-reason'))
  }

  async fillImproveDocumentation({
    dateEnd,
    improveDocumentProcedure,
    improveDocumentForAllProcedures,
    improvePosition
  }: ImproveDocumentOption) {
    await allure.step('Заполнить форму улучшения документации', async () => {
      await this.fillDateEnd(dateEnd)

      if (improveDocumentProcedure!.check) {
        await this.checkProcedureDocument(improveDocumentProcedure!.reason)
      }

      if (improveDocumentForAllProcedures!.check) {
        await this.checkAllProcedureDocument(improveDocumentForAllProcedures!.reason)
      }

      if (improvePosition) {
        if (improvePosition.positionRequirements && improvePosition.positionName) {
          await this.checkImprovePosition(improvePosition.reason)
        } else if (improvePosition.positionRequirements) {
          await this.checkRequirementsPosition(improvePosition.reason)
        } else if (improvePosition.positionName) {
          await this.checkPositionName(improvePosition.reason)
        }
      }

      await this.confirmButton.click()
    })
  }

  async fillDateEnd(dateEnd: DurationLikeObject) {
    await allure.step('Заполнить дату окончания', async () => {
      await this.dateEndInput.fill(dateEnd)
    })
  }

  async checkProcedureDocument(reason: string) {
    await allure.step(`Отметить улучшение документов процедуры: ${reason}`, async () => {
      await this.procedureDocumentCheckBox.click()
      await this.procedureDocumentReasonInput.fill(reason)
    })
  }

  async checkAllProcedureDocument(reason: string) {
    await allure.step(`Отметить улучшение документов для всех процедур: ${reason}`, async () => {
      await this.allProcedureDocumentCheckBox.click()
      await this.allProcedureDocumentReasonInput.fill(reason)
    })
  }

  async checkRequirementsPosition(reason: string) {
    await allure.step(`Отметить улучшение требований к позиции: ${reason}`, async () => {
      await this.requirementsPositionCheckBox.click()
      await this.reasonInput.fill(reason)
    })
  }

  async checkPositionName(reason: string) {
    await allure.step(`Отметить улучшение наименования позиции: ${reason}`, async () => {
      await this.positionNameCheckBox.click()
      await this.reasonInput.fill(reason)
    })
  }

  async checkImprovePosition(reason: string) {
    await allure.step(`Отметить улучшение позиции: ${reason}`, async () => {
      await this.requirementsPositionCheckBox.click()
      await this.positionNameCheckBox.click()
      await this.reasonInput.fill(reason)
    })
  }
}

export class AddContactModal {
  readonly page: Page
  readonly modal: BaseModal
  readonly saveButton: Buttons
  readonly addContactsButton: Buttons
  readonly modalLastNameContact: TextInput
  readonly modalFirstNameContact: TextInput
  readonly modalMiddleNameContact: TextInput
  readonly modalPhoneContact: TextInput
  readonly modalEmailContact: TextInput
  readonly modalOtherInformationContact: TextInput
  constructor(page: Page) {
    this.page = page
    this.modal = new BaseModal(page)
    this.saveButton = new Buttons(page.getByRole('button', { name: 'Сохранить', exact: true }))
    this.addContactsButton = new Buttons(page.getByRole('button', { name: 'Добавить контакт' }))
    this.modalLastNameContact = new TextInput(page.locator('#lastName')) //Фамилия
    this.modalFirstNameContact = new TextInput(page.locator('#firstName')) // Имя
    this.modalMiddleNameContact = new TextInput(page.locator('#middleName')) //Отчество
    this.modalPhoneContact = new TextInput(page.locator('#phone')) //Телефон
    this.modalEmailContact = new TextInput(page.locator('#email')) //Email
    this.modalOtherInformationContact = new TextInput(page.locator('#additionalInfo')) //Дополнительная информация
  }

  async addNewContact() {
    await allure.step('Нажать: Добавить контакт', async () => {
      await this.addContactsButton.click()
    })
  }

  async fillNewContactModal(
    lastName: string,
    firstName: string,
    phone: string,
    email: string,
    other?: string,
    middleName?: string
  ) {
    await allure.step('Заполнить данные нового контакта', async () => {
      await this.fillLastName(lastName)
      await this.fillFirstName(firstName)

      if (middleName) {
        await this.fillMiddleName(middleName)
      }

      await this.fillPhoneNumber(phone)
      await this.fillEmailAddres(email)

      if (other) {
        await this.fillOtherInformation(other)
      }

      await this.saveButton.click()
    })
  }

  async fillLastName(lastName: string) {
    await allure.step(`Заполнить фамилию: ${lastName}`, async () => {
      await this.modalLastNameContact.fill(lastName)
    })
  }

  async fillFirstName(firstName: string) {
    await allure.step(`Заполнить имя: ${firstName}`, async () => {
      await this.modalFirstNameContact.fill(firstName)
    })
  }

  async fillMiddleName(middleName: string) {
    await allure.step(`Заполнить отчество: ${middleName}`, async () => {
      await this.modalMiddleNameContact.fill(middleName)
    })
  }

  async fillPhoneNumber(phone: string) {
    await allure.step(`Заполнить телефон: ${phone}`, async () => {
      await this.modalPhoneContact.fill(phone)
    })
  }

  async fillEmailAddres(email: string) {
    await allure.step(`Заполнить email: ${email}`, async () => {
      await this.modalEmailContact.fill(email)
    })
  }

  async fillOtherInformation(information: string) {
    await allure.step(`Заполнить дополнительную информацию: ${information}`, async () => {
      await this.modalOtherInformationContact.fill(information)
    })
  }
}
export class CancelPurchaiceModal {
  readonly page: Page
  readonly modal: BaseModal
  readonly lotCancelCheckBox: Locator
  readonly cancelReasonInput: TextInput
  constructor(page: Page) {
    this.page = page
    this.modal = new BaseModal(page)
    this.lotCancelCheckBox = page.getByRole('checkbox')
    this.cancelReasonInput = new TextInput(page.locator('#cancelReason'))
  }

  async fillCancelPurchaiceReason(cancelPurchaiceReason: string) {
    await allure.step(`Заполнить причину отмены закупки: ${cancelPurchaiceReason}`, async () => {
      await this.cancelReasonInput.fill(cancelPurchaiceReason)
    })
  }
}

export class CancelLotModal {
  readonly page: Page
  readonly modal: BaseModal
  readonly banner: Locator
  readonly cancelReasonInput: TextInput
  constructor(page: Page) {
    this.page = page
    this.modal = new BaseModal(page)
    this.banner = page.getByTestId('banner')
    this.cancelReasonInput = new TextInput(page.locator('#cancelReason'))
  }

  async fillCancelLotReason(cancelLotReason: string) {
    await allure.step(`Заполнить причину отмены лота: ${cancelLotReason}`, async () => {
      await this.cancelReasonInput.fill(cancelLotReason)
    })
  }
}
export class RefundCreditModal {
  readonly page: Page
  readonly conclusionMeansButton: Buttons
  readonly modal: BaseModal
  readonly refundCreditInput: TextInput
  readonly reasonInput: TextInput
  readonly conclusionCreditButton: Buttons
  constructor(page: Page) {
    this.page = page
    this.conclusionMeansButton = new Buttons(page.getByTestId('funds-withdrawal-btn'))
    this.modal = new BaseModal(page)
    this.refundCreditInput = new TextInput(page.locator('#price'))
    this.reasonInput = new TextInput(page.locator('#reason'))
    this.conclusionCreditButton = new Buttons(
      this.page.getByRole('button', { name: 'Запросить возврат средств' })
    )
  }

  async requestRefundCredit(params: RefundParams) {
    await allure.step('Заполнить форму возврата средств', async () => {
      await this.conclusionMeansButton.click()
      await this.fillAmountCredit(params.price.toString())
      await this.fillReason(params.reason)
    })
  }

  async fillAmountCredit(amountCredit: string) {
    await allure.step(`Заполнить сумму возврата: ${amountCredit}`, async () => {
      await this.refundCreditInput.fill(amountCredit)
    })
  }

  async fillReason(reason: string) {
    await allure.step(`Заполнить причину: ${reason}`, async () => {
      await this.reasonInput.fill(reason)
    })
  }

  async clickModalConclusionCredit() {
    await allure.step('Нажать: Запросить возврат средств', async () => {
      await this.conclusionCreditButton.click()
    })
  }
}

export class TenderSupportModal {
  readonly page: Page
  readonly modal: BaseModal
  readonly fioInput: TextInput
  readonly phoneInput: TextInput
  readonly emailInput: TextInput
  readonly buttonTenderSupport: Locator
  readonly requestSupportButton: Locator
  readonly cancelButton: Locator
  constructor(page: Page) {
    this.page = page
    this.modal = new BaseModal(page)
    this.fioInput = new TextInput(page.locator('#fio'))
    this.phoneInput = new TextInput(page.locator('#phone'))
    this.emailInput = new TextInput(page.locator('#email'))
    this.buttonTenderSupport = page.getByTestId('open-tender-support-modal-btn')
    this.requestSupportButton = this.modal.window.getByTestId('button-primary')
    this.cancelButton = this.modal.window.getByTestId('button-outline')
  }

  async fillNameSupplier(name: string) {
    await allure.step(`Заполнить ФИО поставщика: ${name}`, async () => {
      await this.fioInput.fill(name)
    })
  }

  async fillPhoneSupplier(phone: string) {
    await allure.step(`Заполнить телефон поставщика: ${phone}`, async () => {
      const digits = phone
        .split('')
        .filter(char => char >= '0' && char <= '9')
        .join('')
      await this.phoneInput.typeText(digits.slice(-10))
    })
  }

  async fillEmailSupplier(email: string) {
    await allure.step(`Заполнить email поставщика: ${email}`, async () => {
      await this.emailInput.fill(email)
    })
  }

  async fillTenderSupportModal(params: TenderSupportParams) {
    await allure.step('Заполнить форму тендерного сопровождения', async () => {
      await this.buttonTenderSupport.click()
      await this.modal.waitForVisible()
      await this.fillNameSupplier(params.name)
      await this.fillPhoneSupplier(params.phone)
      await this.fillEmailSupplier(params.email)
      await this.requestSupportButton.click()
    })
  }
}

export class AccelerateCreditingModal {
  readonly page: Page
  readonly modal: BaseModal
  readonly accelerateCreditButton: Buttons
  readonly requestCreditButton: Buttons
  readonly accelerateFioInput: TextInput
  readonly acceleratePhoneInput: TextInput
  readonly accelerateEmailInput: TextInput
  readonly accelerateDepositInput: TextInput
  constructor(page: Page) {
    this.page = page
    this.modal = new BaseModal(page)
    this.accelerateCreditButton = new Buttons(
      page.getByRole('button', { name: 'Ускоренное зачисление' })
    )
    this.requestCreditButton = new Buttons(page.getByRole('button', { name: 'Запросить' }))
    this.accelerateFioInput = new TextInput(page.locator('#fio'))
    this.acceleratePhoneInput = new TextInput(
      this.modal.window.getByRole('textbox', { name: '+7 (___) ___-__-__' })
    )
    this.accelerateEmailInput = new TextInput(page.locator('#email'))
    this.accelerateDepositInput = new TextInput(page.locator('#deposit'))
  }

  async fillAccelerateCreditModal(params: AcceleratedCreditsParams) {
    await allure.step('Заполнить форму ускоренного зачисления', async () => {
      await this.accelerateCreditButton.click()
      await this.modal.waitForVisible()
      await this.fillNameSupplier(params.name)
      await this.fillPhoneSupplier(params.phone)
      await this.fillEmailSupplier(params.email)
      await this.fillAccelerateDepositSupplier(params.deposit.toString())
      await this.requestCreditButton.click()
    })
  }

  async fillNameSupplier(name: string) {
    await allure.step(`Заполнить ФИО поставщика: ${name}`, async () => {
      await this.accelerateFioInput.fill(name)
    })
  }

  async fillPhoneSupplier(phone: string) {
    await allure.step(`Заполнить телефон поставщика: ${phone}`, async () => {
      const digits = phone
        .split('')
        .filter(char => char >= '0' && char <= '9')
        .join('')
      await this.acceleratePhoneInput.typeText(digits.slice(-10))
    })
  }

  async fillEmailSupplier(email: string) {
    await allure.step(`Заполнить email поставщика: ${email}`, async () => {
      await this.accelerateEmailInput.fill(email)
    })
  }

  async fillAccelerateDepositSupplier(deposit: string) {
    await allure.step(`Заполнить сумму зачисления: ${deposit}`, async () => {
      await this.accelerateDepositInput.fill(deposit)
    })
  }
}
export class CorrectionRequestModal {
  readonly page: Page
  readonly modal: BaseModal
  readonly confirmButton: Buttons
  readonly dateEnd: DateInput
  constructor(page: Page) {
    this.page = page
    this.confirmButton = new Buttons(page.getByRole('button', { name: 'Подтвердить' }))
    this.modal = new BaseModal(page)
    this.dateEnd = new DateInput(page.getByTestId('date-picker-dateEnd').getByRole('textbox'))
  }

  async fillDateEnd(endDate: DurationLikeObject) {
    await allure.step('Заполнить дату окончания', async () => {
      await this.dateEnd.fill(endDate)
    })
  }

  async confirmCorrectionDateEnd(endDate: DurationLikeObject) {
    await allure.step('Подтвердить дату окончания корректировки', async () => {
      await this.fillDateEnd(endDate)
      await this.confirmButton.click()
    })
  }
}
export class AcceptCritChangeModal {
  readonly page: Page
  readonly modal: BaseModal
  readonly correctionDateInput: DateInput
  readonly correctionReasonInput: TextInput
  constructor(page: Page) {
    this.page = page
    this.modal = new BaseModal(page)
    this.correctionDateInput = new DateInput(
      page.getByTestId('date-picker-dateCorrectionEnd_1').getByRole('textbox')
    )
    this.correctionReasonInput = new TextInput(page.getByPlaceholder('Введите комментарий'))
  }

  async acceptCriticalChange() {
    await allure.step('Подтвердить критические изменения', async () => {
      await this.modal.waitForVisible()
      await this.modal.window.getByTestId('button-primary').click()
    })
  }

  async backwardProcedure(params: CriticalChangeParams) {
    await allure.step('Вернуть закупку на предыдущий этап', async () => {
      await this.fillCorrectionEndDate(params.endDate)
      await this.fillCorrectionReason(params.reason)
      await this.page.getByTestId('button-primary').click()
    })
  }

  async fillCorrectionEndDate(endDate: DurationLikeObject) {
    await allure.step('Заполнить дату окончания корректировки', async () => {
      await this.correctionDateInput.fill(endDate)
    })
  }

  async fillCorrectionReason(correctionReason: string) {
    await allure.step(`Заполнить причину корректировки: ${correctionReason}`, async () => {
      await this.correctionReasonInput.fill(correctionReason)
    })
  }
}

export class ReturnPreviousStepModal {
  readonly page: Page
  readonly modal: BaseModal
  readonly backforwardStepSelect: Select
  readonly dateEndStepInput: DateInput
  constructor(page: Page) {
    this.page = page
    this.modal = new BaseModal(page)
    this.backforwardStepSelect = new Select(page.getByTestId('select-step'))
    this.dateEndStepInput = new DateInput(page.getByTestId('date-picker-dateEnd'))
  }

  async fillEndDateStep(endDate: DurationLikeObject) {
    await allure.step('Заполнить дату окончания этапа', async () => {
      await this.dateEndStepInput.fill(endDate)
    })
  }

  async choiceBackwardStep(step: string) {
    await allure.step(`Выбрать этап возврата: ${step}`, async () => {
      await this.backforwardStepSelect.select(step)
    })
  }
}

export class FindSupplierModal {
  readonly page: Page
  readonly modal: BaseModal
  readonly searchButton: Buttons
  readonly innSupplierSearchInput: TextInput
  readonly allowedSupplierTable: Locator
  readonly findSupplierButton: Locator
  readonly addSupplierButton: Locator
  readonly closeModal: Locator
  readonly addCustomSupplier: Locator
  readonly selectSupplierRadio: Locator
  constructor(page: Page) {
    this.page = page
    this.searchButton = new Buttons(page.getByRole('button', { name: 'Найти' }))
    this.modal = new BaseModal(page)
    this.innSupplierSearchInput = new TextInput(
      page.getByTestId('search-suppliers').getByRole('textbox')
    )
    this.allowedSupplierTable = page.getByTestId('allowed-suppliers-by-search')
    this.findSupplierButton = this.modal.window.getByTestId('find-suppliers')
    this.addSupplierButton = this.modal.window.getByRole('button', { name: 'Добавить' })
    this.closeModal = this.modal.window.getByRole('button', { name: 'Отменить' })
    this.addCustomSupplier = this.modal.window.getByTestId('add-custom-supplier')
    this.selectSupplierRadio = this.modal.window.getByTestId('select-supplier-radio')
  }

  async findSupplierForInn(inn: string) {
    await allure.step(`Найти поставщика по ИНН: ${inn}`, async () => {
      await this.innSupplierSearchInput.fill(inn)
      await this.searchButton.click()
    })
  }

  async selectAllowSupplier(inn: string) {
    await allure.step(`Выбрать найденного поставщика по ИНН: ${inn}`, async () => {
      const row = this.allowedSupplierTable.locator('tbody tr').filter({
        has: this.page.locator(`td[data-cy="table-col-inn"]:has-text("${inn}")`)
      })
      await row.waitFor({ state: 'visible' })
      const radio = row.locator('[data-cy="select-supplier-radio"]')
      await radio.click()
    })
  }

  async clickAddSupplier() {
    await allure.step('Нажать: Добавить поставщика', async () => {
      await this.addSupplierButton.click()
    })
  }

  async clickAddCustomSupplier() {
    await allure.step('Нажать: Добавить нового поставщика', async () => {
      await this.addCustomSupplier.click()
    })
  }

  async clickFindSupplier() {
    await allure.step('Нажать: Найти поставщика', async () => {
      await this.findSupplierButton.click()
    })
  }
}

export class AddSupplierModal {
  readonly page: Page
  readonly modal: BaseModal
  readonly fullNameInput: TextInput
  readonly innSupplierInput: TextInput
  readonly kppSupplierInput: TextInput
  readonly contactEmailInput: TextInput
  readonly residentStatusRadio: Locator
  readonly addSupplierButton: Locator
  readonly closeModal: Locator
  constructor(page: Page) {
    this.page = page
    this.modal = new BaseModal(page)
    this.fullNameInput = new TextInput(page.getByTestId('supplier-full-name').getByRole('textbox'))
    this.innSupplierInput = new TextInput(page.getByTestId('inn').getByRole('textbox'))
    this.kppSupplierInput = new TextInput(page.getByTestId('kpp').getByRole('textbox'))
    this.contactEmailInput = new TextInput(page.getByTestId('contact-email').getByRole('textbox'))
    this.residentStatusRadio = this.modal.body.getByTestId('radio-buttons-residencyType')
    this.addSupplierButton = this.modal.window.getByRole('button', {
      name: 'Добавить',
      exact: true
    })
    this.closeModal = this.modal.window.getByRole('button', { name: 'Отменить' })
  }

  async fillFullNameSupplier(supplierName: string) {
    await allure.step(`Заполнить наименование поставщика: ${supplierName}`, async () => {
      await this.fullNameInput.fill(supplierName)
    })
  }

  async fillInnSupplier(inn: string) {
    await allure.step(`Заполнить ИНН поставщика: ${inn}`, async () => {
      await this.innSupplierInput.fill(inn)
    })
  }

  async fillKppSupplier(kpp: string) {
    await allure.step(`Заполнить КПП поставщика: ${kpp}`, async () => {
      await this.kppSupplierInput.fill(kpp)
    })
  }

  async fillContactEmailSupplier(email: string) {
    await allure.step(`Заполнить контактный email поставщика: ${email}`, async () => {
      await this.contactEmailInput.fill(email)
    })
  }

  async selectResidentStatus(status: boolean) {
    await allure.step('Выбрать статус резидентства', async () => {
      if (status) {
        await this.residentStatusRadio.getByText('Резидент').click()
      } else {
        await this.residentStatusRadio.getByText('Не резидент').click()
      }
    })
  }

  async addCustomSupplier() {
    await allure.step('Добавить поставщика', async () => {
      await this.addSupplierButton.click()
    })
  }

  async fillSupplierInfo(params: CustomSupplierParams) {
    await allure.step('Заполнить данные поставщика', async () => {
      await this.fillFullNameSupplier(params.supplierName)
      await this.selectResidentStatus(params.residentStatus)
      await this.fillInnSupplier(params.inn)
      await this.fillKppSupplier(params.kpp)
      await this.fillContactEmailSupplier(params.email)
    })
  }
}

export class NotificationsModal {
  readonly page: Page
  readonly modal: BaseModal
  readonly importTemplateButton: Locator
  readonly downloadTemplateButton: Locator
  readonly emailInput: TextInput
  readonly clearEmail: Locator
  readonly acceptEmail: Locator
  readonly deleteAllEmail: Locator
  readonly emailTable: Locator
  readonly editEmailIcon: Locator
  readonly deleteEmailIcon: Locator
  readonly templateText: Locator
  readonly editEmailThemeIcon: Locator
  readonly emailThemeInput: TextInput
  readonly commentInput: TextInput
  readonly sendNotification: Locator

  constructor(page: Page) {
    this.page = page
    this.modal = new BaseModal(page)
    this.importTemplateButton = page.getByRole('button', { name: 'Импорт', exact: true })
    this.downloadTemplateButton = page.getByRole('button', { name: 'Скачать шаблон', exact: true })
    this.emailInput = new TextInput(page.getByTestId('notification-email-input'))
    this.clearEmail = this.modal.window.getByTestId('icon-close')
    this.acceptEmail = this.modal.window.getByTestId('icon-check')
    this.deleteAllEmail = page.getByRole('button', { name: 'Удалить все' })
    this.emailTable = page.getByTestId('notification-emails-table')
    this.editEmailIcon = this.emailTable.getByTestId('icon-edit')
    this.deleteEmailIcon = this.emailTable.getByTestId('icon-delete')
    this.templateText = this.emailTable.getByTestId('text-template-notification')
    this.editEmailThemeIcon = this.page.getByLabel('Тема').getByTestId('icon-edit')
    this.emailThemeInput = new TextInput(page.getByTestId('notification-subject-input'))
    this.commentInput = new TextInput(page.getByTestId('notification-comment-input'))
    this.sendNotification = page.getByRole('button', { name: 'Отправить уведомление' })
  }

  async addEmail(email: string) {
    await allure.step(`Заполнить email для уведомления: ${email}`, async () => {
      await this.emailInput.fill(email)
    })
  }

  async confirmEmail() {
    await allure.step('Подтвердить электронную почту', async () => {
      await this.acceptEmail.click()
    })
  }

  async clearEmailInput() {
    await allure.step('Очистить электронную почту', async () => {
      await this.clearEmail.click()
    })
  }

  async downloadTemplate() {
    await allure.step('Скачать шаблон', async () => {
      await this.downloadTemplateButton.click()
    })
  }

  async editEmailTheme(theme: string) {
    await allure.step(`Изменить тему письма: ${theme}`, async () => {
      await this.editEmailThemeIcon.click()
      await this.emailThemeInput.fill(theme)
    })
  }

  async addEmailComment(comment: string) {
    await allure.step('Заполнить комментарий к уведомлению', async () => {
      await this.commentInput.fill(comment)
    })
  }

  async sendEmailMotification() {
    await allure.step('Отправить уведомление', async () => {
      await this.sendNotification.click()
    })
  }
}
