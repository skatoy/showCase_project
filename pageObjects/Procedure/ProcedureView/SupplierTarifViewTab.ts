import { Buttons } from '#/components/Buttons'
import { Page, Locator } from '@playwright/test'
import * as allure from 'allure-js-commons'

export class SupplierTariffViewTab {
  readonly page: Page
  readonly tariffPage: Locator
  readonly tariffCard: Locator
  readonly tariffPageAction: Locator
  readonly accelerateCreditButton: Buttons
  readonly tenderSupportButton: Buttons

  constructor(page: Page) {
    this.page = page
    this.tariffPage = page.getByTestId('tariffs')
    this.tariffCard = page.getByTestId('tariff-card')
    this.tariffPageAction = page.getByTestId('tariff-additional-services')
    this.accelerateCreditButton = new Buttons(
      this.tariffPageAction.getByRole('button', { name: 'Ускоренное зачисление' })
    )
    this.tenderSupportButton = new Buttons(
      this.tariffPageAction.getByRole('button', { name: 'Тендерное сопровождение' })
    )
  }

  async tariffCardContent(cardNumber: number) {
    return await allure.step(`Получить содержимое тарифной карточки: ${cardNumber + 1}`, async () => {
      return this.tariffCard.nth(cardNumber).textContent()
    })
  }

  async accelerateCreditinAction() {
    await allure.step('Нажать: Ускоренное зачисление', async () => {
      await this.accelerateCreditButton.click()
    })
  }

  async tenderSupportAction() {
    await allure.step('Нажать: Тендерное сопровождение', async () => {
      await this.tenderSupportButton.click()
    })
  }
}
