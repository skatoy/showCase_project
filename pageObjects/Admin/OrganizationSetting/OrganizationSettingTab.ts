import { Select } from '#/components/Select'
import { Tabs } from '#/components/Tabs'
import { Buttons } from '#/components/Buttons'
import { Locator, Page } from '@playwright/test'
import * as allure from 'allure-js-commons'

export const DepartmentRole = {
  'Руководитель организации': 'head',
  'Руководитель отдела': 'manager',
  'Сотрудник': 'employee',
  'Сотрудник без отдела и роли': 'noDepartment'
}
type RoleType = keyof typeof DepartmentRole

export class OrganizationSettingTab {
  readonly page: Page
  readonly tab: Tabs
  readonly saveOrganizationSettingButton: Buttons
  readonly organizationVerificationSelect: Select
  readonly organizationSettingContactView: Locator
  readonly settingViewOptionRadio: Locator

  constructor(page: Page) {
    this.page = page
    this.tab = new Tabs(page)
    this.saveOrganizationSettingButton = new Buttons(
      page.getByTestId('organization-settings-save-btn')
    )
    this.organizationVerificationSelect = new Select(page.getByTestId('select-verification'))
    this.organizationSettingContactView = page.getByTestId(
      'organization-settings-event-log-checkbox'
    )
    this.settingViewOptionRadio = page.getByTestId('radioRequestViewSetting')
  }

  async goToSettingTab() {
    await allure.step('Вкладка: Настройки', async () => {
      await this.tab.selectTab('/organizations/[organization_uuid]//settings')
    })
  }

  async selectVerificationForOorganization(status: string) {
    await allure.step('Выбрать статус верификации', async () => {
      await this.organizationVerificationSelect.select(status)
    })
  }

  async verificateOrganization(status: string) {
    await allure.step('Произвести верификацию', async () => {
      await this.selectVerificationForOorganization(status)
      await this.signSetting()
    })
  }

  async clickSave() {
    await allure.step('Нажать: Сохранить', async () => {
      await this.saveOrganizationSettingButton.click()
    })
  }

  async signSetting() {
    await allure.step('Нажать: Подписать', async () => {
      await this.clickSave()
      const buttonText = await this.saveOrganizationSettingButton.textContent()

      if (buttonText?.includes('Подписать')) {
        await this.clickSave()
      }
    })
  }

  async viewParamRoleDepartment(roleType: RoleType, option?: string) {
    await allure.step('Настройки видимости сотрудника отдела', async () => {
      const role = DepartmentRole[roleType]
      await this.page.getByTestId(`organization-settings-view-${role}-checkbox`).click()

      if (option) {
        await this.settingViewOptionRadio.getByText(option).click()
      }
    })
  }
}
