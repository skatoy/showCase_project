import { Buttons } from '#/components/Buttons'
import { Tabs } from '#/components/Tabs'
import { Locator, Page } from '@playwright/test'
import * as allure from 'allure-js-commons'

export type BalanceData = {
  allCredit?: number
  freeCredit?: number
  blockedCredit?: number
  blockedReturnCredit?: number
}
export class FinanceBalanceTab {
  readonly page: Page
  readonly tab: Tabs
  readonly accountNumber: Locator
  readonly totalAmountValue: Locator
  readonly blockedAmountValue: Locator
  readonly notBlockedAmountValue: Locator
  readonly refundAmountValue: Locator
  readonly fundsWithdrawalButton: Buttons

  constructor(page: Page) {
    this.page = page
    this.tab = new Tabs(page)
    this.accountNumber = this.page.getByTestId('account-number')
    this.totalAmountValue = this.page.getByTestId('total-amount')
    this.blockedAmountValue = this.page.getByTestId('blocked-amount')
    this.notBlockedAmountValue = this.page.getByTestId('not-blocked-amount')
    this.refundAmountValue = this.page.getByTestId('reserved-to-unlock-amount')
    this.fundsWithdrawalButton = new Buttons(
      page.getByTestId('funds-withdrawal-btn'),
      'Вывести средства'
    )
  }

  async goToBalanceTab() {
    await allure.step('Перейти на вкладку баланса', async () => {
      await this.tab.selectTab('/finance/')
    })
  }

  private async extractPrice(container: Locator) {
    return await allure.step('Получить значение суммы', async () => {
      const priceInt = await container.locator('[data-cy="price-int"]').innerText()
      const priceFloat = await container.locator('[data-cy="price-float"]').innerText()
      const numericString = priceInt.replaceAll(' ', '') + priceFloat

      return parseFloat(numericString)
    })
  }

  async getNotBlockedAmount() {
    return allure.step('Получить значение строки: Свободно средств', async () => {
      return this.extractPrice(this.notBlockedAmountValue)
    })
  }

  async getBlockedAmount() {
    return allure.step('Получить значение строки: Заблокировано средств', async () => {
      return this.extractPrice(this.blockedAmountValue)
    })
  }

  async getTotalAmount() {
    return allure.step('Получить значение строки: Всего средств', async () => {
      return this.extractPrice(this.totalAmountValue)
    })
  }

  async getRefundAmount() {
    return allure.step('Получить значение строки: Заблокировано средств на возврат', async () => {
      return this.extractPrice(this.refundAmountValue)
    })
  }
}
