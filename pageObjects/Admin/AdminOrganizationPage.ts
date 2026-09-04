import { TextInput } from '#/components/TextInput'
import { Buttons } from '#/components/Buttons'
import { Locator, Page } from '@playwright/test'
import * as allure from 'allure-js-commons'

export class OrganizationPage {
  readonly page: Page
  readonly searchButton: Buttons
  readonly addButton: Buttons
  readonly organizationSearchIcon: Locator
  readonly organizationSearchInput: TextInput
  readonly addOrganizationButton: Locator
  readonly addOrganizationModalBody: Locator
  readonly addOrganizationModalInput: Locator
  readonly addOrganizationModalTable: Locator
  readonly ModalTableNoData: Locator
  readonly organizationListTable: Locator
  readonly organizationNameColTable: Locator
  readonly organizationInnColTable: Locator
  readonly organizationKppColTable: Locator
  readonly organizationViewIcon: Locator
  readonly organizationSettingIcon: Locator

  constructor(page: Page) {
    this.page = page
    this.searchButton = new Buttons(page.getByRole('button', { name: 'Найти' }))
    this.addButton = new Buttons(page.getByRole('button', { name: 'Добавить', exact: true }))
    this.organizationSearchIcon = page.getByTestId('icon-search')
    this.organizationSearchInput = new TextInput(
      page.getByTestId('organizations-search-input').getByRole('textbox')
    )
    this.addOrganizationButton = page.getByTestId('organizations-add-btn')
    this.addOrganizationModalBody = page.getByTestId('modal-window')
    this.addOrganizationModalInput = this.addOrganizationModalBody.getByTestId(
      'organizations-modal-search-input'
    )
    this.addOrganizationModalTable = this.addOrganizationModalBody.getByTestId('table-loaded')
    this.ModalTableNoData = this.addOrganizationModalBody.getByTestId('table-no-data')
    this.organizationListTable = page.getByTestId('organizations-modal-table')
    this.organizationNameColTable = page.getByTestId('table-col-fullName')
    this.organizationInnColTable = page.getByTestId('table-col-inn')
    this.organizationKppColTable = page.getByTestId('table-col-kpp')
    this.organizationViewIcon = page.getByTestId('icon-eye-on')
    this.organizationSettingIcon = page.getByTestId('icon-settings')
  }

  async fillSearchField(organization: string) {
    await allure.step('Заполнить поле поиска', async () => {
      await this.organizationSearchInput.fill(organization)
    })
  }

  async searchOrganization(organization: string) {
    await allure.step('Найти организацию', async () => {
      await this.fillSearchField(organization)
      await this.organizationSearchInput.locator.press('Enter')
    })
  }

  async addNewOrganization(newOrganization: string) {
    await allure.step('Добавить новую организацию', async () => {
      const tableData = await this.addOrganizationTableData()
      await this.addOrganizationButton.click()
      await this.addOrganizationModalInput.click()
      await this.addOrganizationModalInput.fill(newOrganization)
      await this.searchButton.click()

      if (tableData?.includes(newOrganization)) {
        await this.addButton.click()
      }
    })
  }

  async addOrganizationTableData() {
    return await allure.step('Окно добавления новой организации', async () => {
      return this.addOrganizationModalTable.textContent()
    })
  }

  async organizationTableData() {
    return await allure.step('Список организаций', async () => {
      return this.organizationListTable.textContent()
    })
  }

  async editOrganizationSetting(organizationName: string) {
    await allure.step('Изменить параметры организации', async () => {
      const organization = this.page
        .getByRole('table')
        .locator('tr')
        .filter({ has: this.page.getByText(organizationName, { exact: true }) })
      await organization.locator(this.organizationSettingIcon).click()
    })
  }
}
