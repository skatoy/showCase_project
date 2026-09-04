import { Locator, Page } from '@playwright/test'
import * as allure from 'allure-js-commons'

export class SidebarMenuItem {
  page: Page
  menuProcedures: Locator
  menuRequest: Locator
  menuBilling: Locator
  menuEmails: Locator
  menuFinance: Locator
  menuHelp: Locator
  menuOrganizations: Locator
  menuChats: Locator

  constructor(page: Page) {
    this.page = page
    this.menuProcedures = page.getByTestId('menu-navigation-purchase')
    this.menuRequest = page.getByTestId('menu-navigation-requests')
    this.menuBilling = page.getByTestId('menu-navigation-billing')
    this.menuEmails = page.getByTestId('menu-navigation-emails')
    this.menuFinance = page.getByTestId('menu-navigation-finance')
    this.menuHelp = page.getByTestId('menu-navigation-help')
    this.menuOrganizations = page.getByTestId('menu-navigation-organizations')
    this.menuChats = page.getByTestId('menu-navigation-chats')
  }

  async clickMenuProcedures() {
    await allure.step('Открыть раздел: Закупки', async () => {
      await this.menuProcedures.click()
    })
  }

  async clickMenuRequest() {
    await allure.step('Открыть раздел: Заявки', async () => {
      await this.menuRequest.click()
    })
  }

  async clickMenuBilling() {
    await allure.step('Открыть раздел: Биллинг', async () => {
      await this.menuBilling.click()
    })
  }

  async clickMenuEmails() {
    await allure.step('Открыть раздел: Журнал уведомлений', async () => {
      await this.menuEmails.click()
    })
  }

  async clickMenuFinance() {
    await allure.step('Открыть раздел: Финансы', async () => {
      await this.menuFinance.click()
    })
  }

  async clickMenuHelp() {
    await allure.step('Открыть раздел: Помощь', async () => {
      await this.menuHelp.click()
    })
  }

  async clickMenuOrganizations() {
    await allure.step('Открыть раздел: Организации', async () => {
      await this.menuOrganizations.click()
    })
  }

  async clickMenuChats() {
    await allure.step('Открыть раздел: Чаты', async () => {
      await this.menuChats.click()
    })
  }
}
