import { Select } from '#/components/Select'
import { TextInput } from '#/components/TextInput'

import { Locator, Page } from '@playwright/test'
import * as allure from 'allure-js-commons'

type FeedbackData = {
  theme: string
  organizationType: string
  userType: string
  organizationName?: string
  organizationInn: string
  organizationGrn?: string
  organizationKpp?: string
  purchaseNumber?: string
  contactPerson: string
  contactEmail: string
  contactPhone: string
  consentToProcessing?: boolean
  description: string
  fileName?: string
}

export class FeedBackWindow {
  readonly page: Page
  readonly feedbackIcon: Locator
  readonly modalBody: Locator

  readonly feedbackThemeSelect: Select
  readonly organizationTypeSelect: Select
  readonly userTypeSelect: Select
  readonly organizationNameInput: TextInput
  readonly organizationInnInput: TextInput
  readonly noresidentGrnInput: TextInput
  readonly organizationKppInput: TextInput
  readonly purchaseNumberInput: TextInput
  readonly contactPersonInput: TextInput
  readonly contactEmailInput: TextInput
  readonly contactPhoneInput: TextInput
  readonly descriptionInput: TextInput

  readonly consentToProcessingCheckbox: Locator
  readonly fileDropZone: Locator

  constructor(page: Page) {
    this.page = page
    this.feedbackIcon = page.getByTestId('icon-appeal')
    this.modalBody = page.getByTestId('modal-window')

    this.feedbackThemeSelect = new Select(this.modalBody.getByTestId('select-theme_id'))
    this.organizationTypeSelect = new Select(this.modalBody.getByTestId('select-organizationType'))
    this.userTypeSelect = new Select(this.modalBody.getByTestId('select-req_preset'))
    this.organizationNameInput = new TextInput(
      this.modalBody.getByTestId('organization-name').getByRole('textbox')
    )
    this.organizationInnInput = new TextInput(
      this.modalBody.getByTestId('organization-inn').getByRole('textbox')
    )
    this.noresidentGrnInput = new TextInput(
      this.modalBody.getByTestId('noresident-gun').getByRole('textbox')
    )
    this.organizationKppInput = new TextInput(
      this.modalBody.getByTestId('organization-kpp').getByRole('textbox')
    )
    this.purchaseNumberInput = new TextInput(
      this.modalBody.getByTestId('procedure-number').getByRole('textbox')
    )
    this.contactPersonInput = new TextInput(
      this.modalBody.getByTestId('contact-person').getByRole('textbox')
    )
    this.contactEmailInput = new TextInput(
      this.modalBody.getByTestId('contact-email').getByRole('textbox')
    )
    this.contactPhoneInput = new TextInput(
      this.modalBody.getByTestId('contact-phone').getByRole('textbox')
    )
    this.descriptionInput = new TextInput(
      this.modalBody.getByTestId('message').getByRole('textbox')
    )

    this.consentToProcessingCheckbox = this.modalBody.getByTestId('checkbox-')
    this.fileDropZone = this.modalBody.getByTestId('dropzone')
  }

  async fillFeedbackForm(data: FeedbackData) {
    await allure.step('Заполнить форму обратной связи', async () => {
      await this.openFeedbackForm()
      await this.fillFeedbackTheme(data.theme)
      await this.fillOrganizationType(data.organizationType)
      await this.fillUserType(data.userType)

      if (data.organizationName) {
        await this.fillOrganizationName(data.organizationName)
      }

      await this.fillOrganizationInn(data.organizationInn)

      if (data.userType === 'Нерезидент' && data.organizationGrn) {
        await this.fillNoresidentGrn(data.organizationGrn)
      }

      if (data.userType === 'Организация' && data.organizationKpp) {
        await this.fillOrganizationKpp(data.organizationKpp)
      }

      if (data.purchaseNumber) {
        await this.fillPurchaiceNumber(data.purchaseNumber)
      }

      await this.fillContactPerson(data.contactPerson)
      await this.fillContactEmail(data.contactEmail)
      await this.fillContactPhone(data.contactPhone)

      if (data.consentToProcessing) {
        await this.checkConsentToProcessing()
      }

      await this.fillProblemDescription(data.description)

      if (data.fileName) {
        await this.addFile(data.fileName)
      }
    })
  }

  async openFeedbackForm() {
    await allure.step('Открыть: форму обратной связи', async () => {
      await this.feedbackIcon.click()
    })
  }

  async fillFeedbackTheme(theme: string) {
    await allure.step(`Заполнить поле Тема значением: ${theme}`, async () => {
      await this.feedbackThemeSelect.searchAndSelect(theme)
    })
  }

  async fillOrganizationType(organizationType: string) {
    await allure.step(`Выбрать тип организации: ${organizationType}`, async () => {
      await this.organizationTypeSelect.select(organizationType)
    })
  }

  async fillUserType(userType: string) {
    await allure.step(`Выбрать тип пользователя: ${userType}`, async () => {
      await this.userTypeSelect.select(userType)
    })
  }

  async fillOrganizationName(organizationName: string) {
    await allure.step(`Заполнить название организации: ${organizationName}`, async () => {
      await this.organizationNameInput.fill(organizationName)
    })
  }

  async fillOrganizationInn(organizationInn: string) {
    await allure.step(`Заполнить ИНН организации: ${organizationInn}`, async () => {
      await this.organizationInnInput.fill(organizationInn)
    })
  }

  async fillNoresidentGrn(organizationGrn: string) {
    await allure.step(`Заполнить ГРН организации: ${organizationGrn}`, async () => {
      await this.noresidentGrnInput.fill(organizationGrn)
    })
  }

  async fillOrganizationKpp(organizationKpp: string) {
    await allure.step(`Заполнить КПП организации: ${organizationKpp}`, async () => {
      await this.organizationKppInput.fill(organizationKpp)
    })
  }

  async fillPurchaiceNumber(procedureNumber: string) {
    await allure.step(`Заполнить номер закупки: ${procedureNumber}`, async () => {
      await this.purchaseNumberInput.fill(procedureNumber)
    })
  }

  async fillContactPerson(person: string) {
    await allure.step(`Заполнить контакт: ${person}`, async () => {
      await this.contactPersonInput.fill(person)
    })
  }

  async fillContactEmail(email: string) {
    await allure.step(`Заполнить email: ${email}`, async () => {
      await this.contactEmailInput.fill(email)
    })
  }

  async fillContactPhone(phone: string) {
    await allure.step(`Заполнить контактный телефон: ${phone}`, async () => {
      await this.contactPhoneInput.fill(phone)
    })
  }

  async checkConsentToProcessing() {
    await allure.step('Заполнить чек-бокс: Даю согласие на обработку моих персональных данных', async () => {
      await this.consentToProcessingCheckbox.click()
    })
  }

  async fillProblemDescription(description: string) {
    await allure.step(`Заполнить описание: ${description}`, async () => {
      await this.descriptionInput.fill(description)
    })
  }

  async addFile(fileName: string) {
    await allure.step(`Добавить файл: ${fileName}`, async () => {
      const path = `./fixtures/${fileName}`
      await this.fileDropZone.click()
      await this.fileDropZone.setInputFiles(path)
    })
  }
}
