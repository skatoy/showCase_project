import { DateInput } from '#/components/DateInput'
import { Select } from '#/components/Select'
import { TextInput } from '#/components/TextInput'
import { Buttons } from '#/components/Buttons'
import { BaseModal } from '#/pageObjects/Modal/Modals'
import { Locator, Page } from '@playwright/test'
import { DurationLikeObject } from 'luxon'
import * as allure from 'allure-js-commons'

export type EmailBodyFormat = 'html' | 'raw'
export class NotificationLogPage {
  readonly page: Page
  readonly modal: BaseModal
  readonly count: Locator
  readonly filtersIcon: Locator
  readonly emailLogTable: Locator
  readonly applyButton: Buttons
  readonly emailLogBodyHtml: Locator
  readonly emailLogBodyRaw: Locator
  readonly tableColDate: Locator
  readonly tableColRecipientName: Locator
  readonly tableColRecipientEmail: Locator
  readonly tableColMessageTheme: Locator
  readonly tableColProcedureNumber: Locator
  readonly tableColMessageStatus: Locator
  readonly filterRegistryNumberInput: TextInput
  readonly filterDateFromInput: DateInput
  readonly filterDateToInput: DateInput
  readonly filterReceiverEmailInput: TextInput
  readonly filterEmailThemeInput: TextInput
  readonly filterEmailBodyInput: TextInput
  readonly filterRecipientInput: TextInput
  readonly filterEmailStatusDropdown: Select

  constructor(page: Page) {
    this.page = page
    this.modal = new BaseModal(page)
    this.count = page.getByTestId('total-count-title')
    this.filtersIcon = page.getByTestId('filters')
    this.applyButton = new Buttons(page.getByRole('button', { name: 'Применить' }))
    this.emailLogTable = page.getByTestId('emails-table')
    this.emailLogBodyHtml = page.getByTestId('email-body-html')
    this.emailLogBodyRaw = page.getByTestId('email-body-raw')
    this.tableColDate = page.getByTestId('table-col-sentAt')
    this.tableColRecipientName = page.getByTestId('table-col-recipient')
    this.tableColRecipientEmail = page.getByTestId('table-col-receiverEmail')
    this.tableColMessageTheme = page.getByTestId('table-col-subject')
    this.tableColProcedureNumber = page.getByTestId('table-col-registryNumber')
    this.tableColMessageStatus = page.getByTestId('table-col-status')
    this.filterRegistryNumberInput = new TextInput(
      page.getByTestId('registry-number-input').getByRole('textbox'),
      'номер закупки'
    )
    this.filterDateFromInput = new DateInput(page.getByTestId('date-picker--from'), 'даты от')
    this.filterDateToInput = new DateInput(page.getByTestId('date-picker--to'), 'даты до')
    this.filterReceiverEmailInput = new TextInput(
      page.getByTestId('receiver-email-input').getByRole('textbox'),
      'email получателя'
    )
    this.filterEmailThemeInput = new TextInput(
      page.getByTestId('subject-input').getByRole('textbox'),
      'тему письма'
    )
    this.filterEmailBodyInput = new TextInput(
      page.getByTestId('body-input').getByRole('textbox'),
      'текст письма'
    )
    this.filterRecipientInput = new TextInput(
      page.getByTestId('recipient-input').getByRole('textbox'),
      'получателя'
    )
    this.filterEmailStatusDropdown = new Select(page.getByTestId('select-status'), 'статус письма')
  }

  async waitForLoaded() {
    await allure.step('Дождаться загрузки', async () => {
      await this.emailLogTable.waitFor({ state: 'visible' })
      await this.count.waitFor({ state: 'visible' })
    })
  }

  async openFilter() {
    await allure.step('Открыть фильтр журнала уведомлений', async () => {
      await this.waitForLoaded()
      await this.filtersIcon.click()
      await this.modal.waitForVisible()
    })
  }

  async clickApply() {
    await allure.step('Нажать: Подтвердить', async () => {
      await this.applyButton.click()
    })
  }

  async fillFilterProcedureNumber(procedureNumber: string) {
    await allure.step('Заполнить поле: Номер процедуры', async () => {
      await this.filterRegistryNumberInput.fill(procedureNumber)
    })
  }

  async fillFilterDateSetFrom(dateFrom: DurationLikeObject) {
    await allure.step('Заполнить поле: Дата начала отправки', async () => {
      await this.filterDateFromInput.fill(dateFrom)
    })
  }

  async fillFilterDateTo(dateTo: DurationLikeObject) {
    await allure.step('Заполнить поле: Дата окончания отправки', async () => {
      await this.filterDateToInput.fill(dateTo)
    })
  }

  async fillFilterEmail(email: string) {
    await allure.step('Заполнить поле: Электронная почта получателя', async () => {
      await this.filterReceiverEmailInput.fill(email)
    })
  }

  async fillFilterNotificationTheme(theme: string) {
    await allure.step('Заполнить поле: Тема сообщения', async () => {
      await this.filterEmailThemeInput.fill(theme)
    })
  }

  async fillFilterNotificationBody(body: string) {
    await allure.step('Заполнить поле: Текст сообщения', async () => {
      await this.filterEmailBodyInput.fill(body)
    })
  }

  async fillFilterNotificationRecipient(recipient: string) {
    await allure.step('Заполнить поле: Получатель', async () => {
      await this.filterRecipientInput.fill(recipient)
    })
  }

  async selectFilterNotificationStatus(status: string) {
    await allure.step('Выбрать статус отправки', async () => {
      await this.filterEmailStatusDropdown.select(status)
    })
  }

  async getEmailBody(bodyType: EmailBodyFormat, rowNumber: number = 0) {
    return await allure.step('Получить текст письма', async () => {
      await this.page
        .getByTestId(`table-row-${rowNumber.toString()}`)
        .getByTestId('icon-down')
        .click()

      switch (bodyType) {
        case 'html':
          return this.page
            .getByTestId(`table-row-expanded-${rowNumber}`)
            .getByTestId(`email-body-${bodyType}`)
            .innerText()

        case 'raw':
          await this.page
            .getByTestId(`table-row-expanded-${rowNumber}`)
            .getByRole('button', { name: 'RAW' })
            .click()

          return this.page
            .getByTestId(`table-row-expanded-${rowNumber}`)
            .locator(this.emailLogBodyRaw)
            .innerText()
      }
    })
  }
}
