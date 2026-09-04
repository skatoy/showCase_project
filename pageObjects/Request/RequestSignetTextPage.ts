import { Buttons } from '#/components/Buttons'
import { Locator, Page } from '@playwright/test'
import * as allure from 'allure-js-commons'

export class RequestSignetTextPage {
  readonly page: Page
  readonly publishRequestButtonControl: Buttons
  readonly choiceTariffButtonControl: Buttons
  readonly buyTariffButton: Buttons
  readonly requestPriceInfo: Locator
  readonly tariffsModal: Locator
  readonly tariffsModalBody: Locator
  readonly tariffsHeader: Locator
  readonly tariffCard: Locator
  readonly tariffName: Locator
  readonly tariffPrice: Locator

  constructor(page: Page) {
    this.page = page
    this.publishRequestButtonControl = new Buttons(
      page.getByTestId('publish-request-btn'),
      'Опубликовать заявку'
    )
    this.choiceTariffButtonControl = new Buttons(
      page.getByRole('button', { name: 'Выбрать тариф', exact: true })
    )
    this.buyTariffButton = new Buttons(page.getByTestId('tariff-buy-button'), 'Купить тариф')
    this.requestPriceInfo = this.page.getByTestId('request-price')
    this.tariffsModal = this.page.getByTestId('modal-window')
    this.tariffsModalBody = this.page.getByTestId('modal-body')
    this.tariffsHeader = this.page.getByTestId('modal-header')
    this.tariffCard = this.page.getByTestId('tariff-subscription-card')
    this.tariffName = this.page.getByTestId('tariff-name')
    this.tariffPrice = this.page.getByTestId('tariff-price')
  }

  get publishRequestButton() {
    return this.publishRequestButtonControl.locator
  }

  get choiceTariffButton() {
    return this.choiceTariffButtonControl.locator
  }

  async publishRequest() {
    await allure.step('Опубликовать заявку', async () => {
      await this.publishRequestButtonControl.click()
    })
  }

  async openTariffsWindow() {
    await allure.step('Открыть: Выбор тарифа', async () => {
      await this.choiceTariffButtonControl.click()
    })
  }

  async clickBuyTariff(tariffName: string) {
    await allure.step(`Купить тариф: ${tariffName}`, async () => {
      const targetCard = this.tariffCard.filter({
        has: this.tariffName.getByText(tariffName, { exact: true })
      })

      await targetCard.locator(this.buyTariffButton.locator).click()
    })
  }
}
