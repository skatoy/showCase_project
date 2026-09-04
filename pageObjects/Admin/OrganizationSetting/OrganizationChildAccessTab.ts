import { BaseModal } from '#/pageObjects/Modal/Modals'
import { Tabs } from '#/components/Tabs'
import { Buttons } from '#/components/Buttons'
import { Locator, Page } from '@playwright/test'
import * as allure from 'allure-js-commons'

export class OrganizationChildAccessTab {
  readonly page: Page
  readonly addButton: Buttons
  readonly tab: Tabs
  readonly modal: BaseModal
  readonly addAccessButton: Locator
  readonly usersTable: Locator
  readonly accessUsersTable: Locator
  readonly deleteIcon: Locator

  constructor(page: Page) {
    this.page = page
    this.addButton = new Buttons(page.getByRole('button', { name: 'Добавить', exact: true }))
    this.tab = new Tabs(page)
    this.modal = new BaseModal(page)
    this.addAccessButton = page.getByTestId('button-text')
    this.usersTable = this.modal.window.getByTestId('table-loaded')
    this.accessUsersTable = this.page.getByTestId('table-loaded')
    this.deleteIcon = this.page.getByTestId('icon-delete')
  }

  async goToChildAccessTab() {
    await allure.step('Вкладка: Дочерние организации', async () => {
      await this.tab.selectTab('/organizations/[organization_uuid]//child_organizations')
    })
  }

  async clickAddAccess() {
    await allure.step('Нажать: Добавить', async () => {
      await this.addAccessButton.click()
    })
  }

  async editUserAccess(fullName: string) {
    await allure.step('Изменить доступ', async () => {
      await this.clickAddAccess()
      await this.selectUser(fullName)
      await this.addButton.click()
    })
  }

  async selectUser(fullName: string) {
    await allure.step('Выбрать пользователя', async () => {
      const row = this.usersTable.locator('tbody tr').filter({
        has: this.page.locator(`td[data-cy="table-col-fullName"]:has-text("${fullName}")`)
      })
      const checkbox = row.locator('[data-cy="select-supplier-"]')
      await checkbox.click()
    })
  }

  async deleteUserAccess(fullName: string) {
    await allure.step('Удалить доступ', async () => {
      const user = this.page
        .getByRole('table')
        .locator('tr')
        .filter({ has: this.page.getByText(fullName, { exact: true }) })
      await user.locator(this.deleteIcon).click()
    })
  }
}
