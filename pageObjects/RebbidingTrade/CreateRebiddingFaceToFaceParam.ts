import { DateInput } from '#/components/DateInput'
import { TextInput } from '#/components/TextInput'
import { Page, Locator } from '@playwright/test'
import { DurationLikeObject } from 'luxon'
import * as allure from 'allure-js-commons'

export type ChangePriceStepParams = {
  startStep: number
  endStep: number
}
export type RebiddingFaceToFaceParams = {
  startPrice: {
    type: 'Указать свою начальную цену' | 'Лучшая цена заявки'
    price?: string
  }
  competitorVisible?: boolean
  rebiddingStart: DurationLikeObject
  firstOfferWaitTime: string
  offerWaitTime: string
  priceChangeStep: ChangePriceStepParams
}
export class CreateRebiddingFaceToFaceParams {
  readonly page: Page
  readonly startPriceType: Locator
  readonly startPriceInput: TextInput
  readonly waitFirstOffersInput: TextInput
  readonly waitOffersInput: TextInput
  readonly startRebiddingDateInput: DateInput
  readonly competitorsViewingAllowedName: Locator
  readonly startStepChangePriceInput: Locator
  readonly endStepChangePriceInput: Locator

  constructor(page: Page) {
    this.page = page
    this.startPriceType = page.getByTestId('radio-buttons-startPriceType')
    this.startPriceInput = new TextInput(page.getByTestId('initial-price'))

    this.startRebiddingDateInput = new DateInput(
      page.getByTestId('date-picker-dateStart').getByRole('textbox')
    )
    this.waitFirstOffersInput = new TextInput(
      page.getByTestId('first-offer-waiting-time').getByRole('textbox')
    )
    this.waitOffersInput = new TextInput(
      page.getByTestId('offer-waiting-time').getByRole('textbox')
    )
    this.competitorsViewingAllowedName = page.getByTestId('checkbox-VISIBLE_ONLY_OTHER_SUPPLIERS') //Наименование
    this.startStepChangePriceInput = page.getByTestId('change-price-range-start-input')
    this.endStepChangePriceInput = page.getByTestId('change-price-range-end-input')
  }

  async fillFaceToFaceParam(params: RebiddingFaceToFaceParams) {
    await allure.step('Заполнить параметры очной переторжки', async () => {
      await this.startPriceChoice(params.startPrice.type, params.startPrice.price!)
      await this.startDateRebidding(params.rebiddingStart)
      await this.fillTimeFirstOffer(params.firstOfferWaitTime)
      await this.fillTimeOffer(params.offerWaitTime)

      if (params.competitorVisible) {
        await this.checkSupplierView(params.competitorVisible)
      }

      await this.fillChangePriceStep(params.priceChangeStep)
    })
  }

  async startPriceChoice(priceType: string, price: string) {
    await allure.step(`Выбрать тип начальной цены: ${priceType}`, async () => {
      if (priceType === 'Указать свою начальную цену') {
        await this.startPriceType.getByText('Указать свою начальную цену').click()
        await this.startPriceInput.fill(price)
      }

      if (priceType === 'Лучшая цена заявки') {
        await this.startPriceType.getByText('Лучшая цена заявки').click()
      }
    })
  }

  async startDateRebidding(dateStart: DurationLikeObject) {
    await allure.step('Заполнить дату начала переторжки', async () => {
      await this.startRebiddingDateInput.fill(dateStart)
    })
  }

  async fillTimeFirstOffer(timeFirstOffers: string) {
    await allure.step(`Заполнить время ожидания первого предложения: ${timeFirstOffers}`, async () => {
      await this.waitFirstOffersInput.fill(timeFirstOffers)
    })
  }

  async fillTimeOffer(timeOffers: string) {
    await allure.step(`Заполнить время ожидания предложения: ${timeOffers}`, async () => {
      await this.waitOffersInput.fill(timeOffers)
    })
  }

  async allowViewCompetitorOffer(check: boolean) {
    await allure.step(`Разрешить просмотр наименования конкурента: ${check}`, async () => {
      if (check) {
        await this.competitorsViewingAllowedName.click()
      }
    })
  }

  async fillStartChangePrice(start: number) {
    await allure.step(`Заполнить начало шага изменения цены: ${start}`, async () => {
      await this.startStepChangePriceInput.click()
      await this.startStepChangePriceInput.pressSequentially(start.toString())
    })
  }

  async fillEndChangePrice(end: number) {
    await allure.step(`Заполнить конец шага изменения цены: ${end}`, async () => {
      await this.endStepChangePriceInput.click()
      await this.endStepChangePriceInput.pressSequentially(end.toString())
    })
  }

  async fillChangePriceStep(params: ChangePriceStepParams) {
    await allure.step('Заполнить: Шаг изменения цены', async () => {
      await this.fillStartChangePrice(params.startStep)
      await this.fillEndChangePrice(params.endStep)
    })
  }

  async checkSupplierView(option: boolean) {
    await allure.step(`Разрешить просмотр наименования конкурента: ${option}`, async () => {
      const isChecked = await this.competitorsViewingAllowedName
        .locator('[data-cy="checkbox-checked"]')
        .isVisible()

      if (option !== isChecked) {
        await this.competitorsViewingAllowedName.click()
      }
    })
  }
}
