import { TextInput } from '#/components/TextInput'
import { Locator, Page } from '@playwright/test'
import * as allure from 'allure-js-commons'

export type ProlongationByRequestParams = {
  active: boolean
  requestCount: number
  prolongationTimer: number
  prolongationQuantity: number
}

export type ProlongationByBestPriceParams = {
  active: boolean
  timeout: number
  prolongationTimer: number
  prolongationQuantity: number
}

export class ProlongationBlock {
  readonly page: Page
  readonly prolongationByRequestAllowedRadio: Locator
  readonly prolongationRequestCount: TextInput
  readonly countProlongationTime: TextInput
  readonly requestCountProlongation: TextInput
  readonly prolongationByBestPriceAllowedRadio: Locator
  readonly prolongationTimeBeforeEnd: TextInput
  readonly bestOfferProlongationTime: TextInput
  readonly bestOfferProlongationMaxCount: TextInput

  constructor(page: Page) {
    this.page = page
    this.prolongationByRequestAllowedRadio = page.getByTestId(
      'radio-buttons-isProlongateByRequestCount'
    )
    this.prolongationRequestCount = new TextInput(page.locator('#prolongationRequestCount'))
    this.countProlongationTime = new TextInput(page.locator('#requestCountProlongationTime'))
    this.requestCountProlongation = new TextInput(page.locator('#requestCountProlongationMaxCount'))
    this.prolongationByBestPriceAllowedRadio = page.getByTestId(
      'radio-buttons-isProlongateByBestOffer'
    )
    this.prolongationTimeBeforeEnd = new TextInput(
      page.locator('#prolongationPossibleTimeBeforeEnd')
    )
    this.bestOfferProlongationTime = new TextInput(page.locator('#bestOfferProlongationTime'))
    this.bestOfferProlongationMaxCount = new TextInput(page.locator('#bestOfferProlongationMaxCount'))
  }

  async fillByRequest(params: ProlongationByRequestParams) {
    await allure.step('Настроить продление по количеству заявок', async () => {
      if (params.active) {
        await this.prolongationByRequestAllowedRadio.getByText('Да').click()
        await this.prolongationRequestCount.fill(params.requestCount.toString())
        await this.countProlongationTime.fill(params.prolongationTimer.toString())
        await this.requestCountProlongation.fill(params.prolongationQuantity.toString())
      }
    })
  }

  async fillByBestPrice(params: ProlongationByBestPriceParams) {
    await allure.step('Настроить продление по лучшей цене', async () => {
      if (params.active) {
        await this.prolongationByBestPriceAllowedRadio.getByText('Да').click()
        await this.prolongationTimeBeforeEnd.fill(params.timeout.toString())
        await this.bestOfferProlongationTime.fill(params.prolongationTimer.toString())
        await this.bestOfferProlongationMaxCount.fill(params.prolongationQuantity.toString())
      }
    })
  }
}
