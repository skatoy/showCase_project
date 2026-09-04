import { Tabs } from '#/components/Tabs'
import { Buttons } from '#/components/Buttons'
import { Locator, Page } from '@playwright/test'
import * as allure from 'allure-js-commons'

export class OrganizationFeatureSettingTab {
  readonly page: Page
  readonly tab: Tabs
  readonly saveOrganizationSettingButton: Buttons
  readonly disabledRebiddingAllowedSuppliersCheckbox: Locator
  constructor(page: Page) {
    this.page = page
    this.tab = new Tabs(page)
    this.saveOrganizationSettingButton = new Buttons(
      page.getByTestId('organization-settings-save-btn')
    )
    this.disabledRebiddingAllowedSuppliersCheckbox = page.getByTestId(
      'rebidding-allowed-suppliers-disabled-checkbox'
    )
  }

  async goToFeatureSettingTab() {
    await allure.step('Вкладка: Настройки функционала', async () => {
      await this.tab.selectTab('/organizations/[organization_uuid]//feature_settings')
    })
  }

  async selectDisabledRebiddingAllowedSuppliers() {
    await allure.step('Выбрать: Отключить заказчику возможность редактировать допуск поставщиков, участвующих в переторжке', async () => {
      await this.disabledRebiddingAllowedSuppliersCheckbox.click()
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
}
