import { Page, Locator } from '@playwright/test'
import { DurationLikeObject } from 'luxon'
import { CompetitorViewBlock, CompetitorVisibleParams } from '#/pageObjects/Blocks/CompetitorViewBlock'
import {
  ProlongationByBestPriceParams,
  ProlongationByRequestParams,
  ProlongationBlock
} from '#/pageObjects/Blocks/ProlongationBlock'
import { DateInput } from '#/components/DateInput'
import { TextInput } from '#/components/TextInput'
import * as allure from 'allure-js-commons'

export type PriceChangeStepParams = {
  option: boolean
  stepRangeFrom: number
  stepRangeTo: number
}
export type AdmitPositionParams = {
  name: string
  admit: boolean
}[]

export type RebiddingAbsenteeParams = {
  increasedPrice?: boolean
  requestCount?: boolean
  competitorVisible?: CompetitorVisibleParams
  priceChangeStep?: PriceChangeStepParams
  prolongationByRequest?: ProlongationByRequestParams
  prolongationByBestPrice?: ProlongationByBestPriceParams
  rebiddingEnd: DurationLikeObject
  admitPositions?: AdmitPositionParams
}
export type EditRebiddingAbsenteeParams = {
  increasedPrice?: boolean
  requestCount?: boolean
  priceChangeStep?: PriceChangeStepParams
  prolongationByRequest?: ProlongationByRequestParams
  prolongationByBestPrice?: ProlongationByBestPriceParams
  rebiddingEnd: DurationLikeObject
  admitPositions?: AdmitPositionParams
}
export class CreateRebiddingAbsenteeParams {
  readonly page: Page
  readonly competitorView: CompetitorViewBlock
  readonly prolongation: ProlongationBlock

  readonly allowIncreasePrice: Locator
  readonly allowRequestCountVisible: Locator
  readonly endRebiddingDateInput: DateInput
  readonly priceStepChangeRadio: Locator
  readonly minPriceStepChangeInput: TextInput
  readonly maxPriceStepChangeInput: TextInput
  readonly allowPositionRadio: Locator

  constructor(page: Page) {
    this.page = page
    this.competitorView = new CompetitorViewBlock(page)
    this.prolongation = new ProlongationBlock(page)

    this.allowIncreasePrice = page.getByTestId('radio-buttons-allowIncreasePrice')
    this.allowRequestCountVisible = page.getByTestId('radio-buttons-isRequestCountVisible')
    this.endRebiddingDateInput = new DateInput(
      page.getByTestId('date-picker-dateEnd').getByRole('textbox')
    )
    this.priceStepChangeRadio = page.getByTestId('radio-buttons-isChangePriceRangeSpecified')
    this.minPriceStepChangeInput = new TextInput(
      page.getByTestId('change-price-range-start-input').getByRole('textbox')
    )
    this.maxPriceStepChangeInput = new TextInput(
      page.getByTestId('change-price-range-end-input').getByRole('textbox')
    )
    this.allowPositionRadio = page.getByTestId('radio-buttons-withPositionAccess')
  }

  async fillAbsenteeParam({
    increasedPrice,
    requestCount,
    competitorVisible,
    priceChangeStep,
    prolongationByRequest,
    prolongationByBestPrice,
    rebiddingEnd,
    admitPositions
  }: RebiddingAbsenteeParams) {
    await allure.step('Заполнить параметры переторжки', async () => {
      if (increasedPrice) {
        await this.allowIncreasedApplicationPrice(increasedPrice)
      }

      await this.endDateRebidding(rebiddingEnd)

      if (priceChangeStep) {
        await this.selectPriceStep(
          priceChangeStep.option,
          priceChangeStep.stepRangeFrom.toString(),
          priceChangeStep.stepRangeTo.toString()
        )
      }

      if (requestCount) {
        await this.selectRequestCountView(requestCount)
      }

      if (competitorVisible) {
        await this.selectViewCompetitorOffer(competitorVisible)
      }

      if (prolongationByRequest) {
        await this.fillProlongationByRequest(prolongationByRequest)
      }

      if (prolongationByBestPrice) {
        await this.fillProlongationByBestPrice(prolongationByBestPrice)
      }

      if (admitPositions) {
        for (const position of admitPositions)
          await this.admitSpecificPosition(position.name, position.admit)
      }
    })
  }

  async allowIncreasedApplicationPrice(option: boolean) {
    await allure.step(`Разрешить повышение цены заявки: ${option}`, async () => {
      if (option) {
        await this.allowIncreasePrice.getByText('Разрешить').click()
      } else {
        await this.allowIncreasePrice.getByText('Запретить').click()
      }
    })
  }

  async endDateRebidding(dateEnd: DurationLikeObject) {
    await allure.step('Заполнить дату окончания переторжки', async () => {
      await this.endRebiddingDateInput.fill(dateEnd)
    })
  }

  async selectViewCompetitorOffer(params: CompetitorVisibleParams) {
    await this.competitorView.selectViewCompetitorOffer(params)
  }

  async fillProlongationByRequest(params: ProlongationByRequestParams) {
    await this.prolongation.fillByRequest(params)
  }

  async fillProlongationByBestPrice(params: ProlongationByBestPriceParams) {
    await this.prolongation.fillByBestPrice(params)
  }

  async admitSpecificPosition(positionName: string, admit: boolean) {
    await allure.step(`Выбрать допуск для позиции: ${positionName}`, async () => {
      const checkbox = this.page
        .locator('tr', { has: this.page.getByText(positionName, { exact: true }) })
        .locator('[data-cy^="checkbox-select-position-"]')
      const isChecked = await checkbox.locator('[data-cy="checkbox-checked"]').isVisible()

      if (admit !== isChecked) {
        await checkbox.click()
      }
    })
  }

  async selectRequestCountView(option: boolean) {
    await allure.step(`Выбрать отображение количества заявок: ${option}`, async () => {
      if (option) {
        await this.allowRequestCountVisible.getByText('Отображать', { exact: true }).click()
      } else {
        await this.allowRequestCountVisible.getByText('Не отображать', { exact: true }).click()
      }
    })
  }

  async selectPriceStep(param: boolean, stepFrom?: string, stepTo?: string) {
    await allure.step(`Выбрать шаг изменения цены: ${param}`, async () => {
      if (param) {
        await this.priceStepChangeRadio.getByText('Да').click()
        await this.minPriceStepChangeInput.fill(stepFrom!)
        await this.maxPriceStepChangeInput.fill(stepTo!)
      } else {
        await this.priceStepChangeRadio.getByText('Нет').click()
      }
    })
  }
}
