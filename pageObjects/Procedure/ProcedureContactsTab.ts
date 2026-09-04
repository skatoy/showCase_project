import { AddContactModal } from '#/pageObjects/Modal/Modals'
import { Tabs } from '#/components/Tabs'

import { Page, Locator } from '@playwright/test'
import * as allure from 'allure-js-commons'

export type ContactsPageConfig = {
  viewOption?: string
  newContact?: {
    lastName: string
    firstName: string
    middleName?: string
    phone: string
    email: string
    other?: string
  }
}

export class ContactsTab {
  readonly page: Page
  readonly tab: Tabs
  readonly contactsTab: Locator
  readonly privateContacts: Locator
  readonly contactModal: AddContactModal

  constructor(page: Page) {
    this.page = page
    this.tab = new Tabs(page)
    this.contactModal = new AddContactModal(page)

    this.contactsTab = page.getByTestId('tab-element-customers')
    this.privateContacts = page.getByTestId('radio-buttons-isCustomerContactsHidden')
  }

  async fillContactsTab({ viewOption, newContact }: ContactsPageConfig) {
    await allure.step('Вкладка: "Контакты"', async () => {
      await this.tab.selectTab('customers')

      if (viewOption) {
        await this.choiceViewOption(viewOption)
      }

      if (newContact) {
        await this.contactModal.addNewContact()
        await this.contactModal.fillNewContactModal(
          newContact.lastName,
          newContact.firstName,
          newContact.phone,
          newContact.email,
          newContact.other,
          newContact.middleName
        )
      }
    })
  }

  async choiceViewOption(option: string) {
    await allure.step(`Выбрать параметр отображения контактов: ${option}`, async () => {
      await this.privateContacts.getByText(option, { exact: true }).click()
    })
  }
}
