import { Buttons } from '#/components/Buttons'
import { type Page, type Locator } from '@playwright/test'
import * as allure from 'allure-js-commons'

export class FaceToFaceTradePage {
  readonly page: Page
  readonly pageTitle: Locator
  readonly banner: Locator
  readonly tradeTime: Locator
  readonly startPrice: Locator
  readonly endTime: Locator
  readonly timeLeft: Locator
  readonly stepRange: Locator
  readonly priceType: Locator
  readonly bestRequestOffer: Locator
  readonly offersTable: Locator
  readonly emptyOffersTable: Locator
  readonly offerRow: Locator
  readonly number: Locator //порядковый номер в таблице
  readonly supplierName: Locator
  readonly price: Locator
  readonly submissionDate: Locator //дата и время подачи ставки
  readonly bidInput: Locator
  readonly biddingSchedule: Locator //график ставок
  readonly currentRating: Locator
  readonly offerRange: Locator
  readonly cancelButton: Buttons
  readonly sendOfferButton: Buttons
  readonly downloadDocument: Locator

  constructor(page: Page) {
    this.page = page
    this.pageTitle = page.getByTestId('page-title')
    this.banner = page.getByTestId('banner')
    this.tradeTime = page.getByTestId('trade-time')
    this.endTime = page.getByTestId('end-time')
    this.timeLeft = page.getByTestId('time-left')
    this.startPrice = page.getByTestId('startPrice')
    this.stepRange = page.getByTestId('step-range')
    this.priceType = page.getByTestId('price-type')
    this.bestRequestOffer = page.getByTestId('best-request-offer')
    this.offersTable = page.getByTestId('offers-table')
    this.emptyOffersTable = page.getByTestId('table-no-data')
    this.offerRow = page.getByTestId('table-row')
    this.number = page.getByTestId('supplier-number')
    this.supplierName = page.getByTestId('supplier-name')
    this.price = page.getByTestId('price-cell')
    this.submissionDate = page.getByTestId('date-published')
    this.bidInput = page.getByPlaceholder('Введите цену')
    this.biddingSchedule = page.getByTestId('rebidding-trade-line-chart')
    this.currentRating = page.getByTestId('current-rating')
    this.offerRange = page.getByTestId('offer-range')
    this.cancelButton = new Buttons(page.getByTestId('button-primary'))
    this.sendOfferButton = new Buttons(page.getByTestId('send-offer-btn'))
    this.downloadDocument = page.getByTestId('icon-download')
  }

  async cancelRebidding() {
    await allure.step('Отменить переторжку', async () => {
      await this.cancelButton.click()
    })
  }

  async sendOffer(price: string) {
    await allure.step(`Отправить предложение с ценой: ${price}`, async () => {
      await this.bidInput.waitFor({ state: 'visible' })
      await this.bidInput.fill(price)
      await this.sendOfferButton.click()
    })
  }
}
