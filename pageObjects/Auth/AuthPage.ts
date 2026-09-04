import { expect, Locator, type Page } from '@playwright/test'
import { pageUtils } from '#/utils/pageUtils'
import { Buttons } from '#/components/Buttons'
import { BASE_URL } from '#/playwright.config'
import * as allure from 'allure-js-commons'

const ROLE_LABELS: Record<string, string> = {
  customer: 'Заказчик',
  curator: 'Куратор',
  supplier: 'Поставщик',
  admin_for_users: 'Администратор организации'
}

export class AuthPage {
  readonly page: Page
  readonly enterPlatformButton: Buttons
  readonly roleRadio: Locator
  readonly header: Locator

  constructor(page: Page) {
    this.page = page
    this.enterPlatformButton = new Buttons(page.getByRole('button', { name: 'Войти', exact: true }))
    this.roleRadio = page.getByTestId('radio-buttons-role')
    this.header = page.getByTestId('header')
  }

  cookieWarningCloser = () => this.page.locator('[data-cy="cookie-banner"] [data-cy="icon-close"]')
  buttonEnter = () => this.page.locator('[data-cy="button-primary"]')
  buttonExit = () => this.page.locator('[data-cy="header"] [data-cy="icon-log-out"]')
  headerUser = () => this.page.locator('[data-cy="header"] [data-cy="header-user-role"]')
  headerUserDropdown = () => this.page.locator('[data-cy="header"] [data-cy="icon-caret_down"]')
  headerChangeRoles = () => this.page.locator('[data-cy="header"] [data-cy="change-roles"]')
  authPageWrapper = () => this.page.locator('[data-cy="auth-page"]')

  async checkIsAuthPage() {
    await allure.step('Проверить страницу авторизации', async () => {
      await this.authPageWrapper().waitFor({ state: 'visible' })
    })
  }

  async navigate(url: string = BASE_URL) {
    await allure.step('Перейти на страницу авторизации', async () => {
      await pageUtils.goto(this.page, url)
    })
  }

  async logout() {
    await allure.step('Выйти из системы', async () => {
      await this.headerUserDropdown().click()
      await this.buttonExit().click()
    })
  }

  async userAuth(role: string) {
    const roleLabel = ROLE_LABELS[role] ?? role
    await allure.step(`Авторизуемся: ${roleLabel}`, async () => {
      await allure.step(`Выбрать роль: ${roleLabel}`, async () => {
        await this.roleRadio.getByText(roleLabel).click()
      })

      await this.enterPlatformButton.click()
      await this.header.waitFor({ state: 'visible' })

      if (await this.cookieWarningCloser().isVisible()) {
        await allure.step('Закрыть уведомление о куки', async () => {
          await this.cookieWarningCloser().click()
        })
      }
    })
  }

  async changeRole() {
    await allure.step('Перейти к смене роли', async () => {
      await this.headerUserDropdown().click()
      await this.headerChangeRoles().click()
      await expect(this.page.url()).toContain('/auth')
    })
  }
}
