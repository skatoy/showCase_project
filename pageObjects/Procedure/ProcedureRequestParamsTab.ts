import { Tabs } from '#/components/Tabs'
import { DocumentBlock, DocumentsBlock } from '#/pageObjects/Blocks/DocumentBlock'
import {
  ProlongationByBestPriceParams,
  ProlongationByRequestParams,
  ProlongationBlock
} from '#/pageObjects/Blocks/ProlongationBlock'
import { CompetitorViewBlock } from '#/pageObjects/Blocks/CompetitorViewBlock'
import { Page, Locator } from '@playwright/test'
import * as allure from 'allure-js-commons'

export type {
  ProlongationByBestPriceParams,
  ProlongationByRequestParams
} from '#/pageObjects/Blocks/ProlongationBlock'
export type { CompetitorVisibleParams } from '#/pageObjects/Blocks/CompetitorViewBlock'
export type { DocumentsBlock } from '#/pageObjects/Blocks/DocumentBlock'

export type ProcedureRequestParams = {
  multiCurrency?: boolean
  priceVat?: string
  volumeControl?: string
  positionControl?: string
  analogs?: string
  ratingAnalog?: string
  prolongationByRequest?: ProlongationByRequestParams
  prolongationByBestPrice?: ProlongationByBestPriceParams
  documentsBlocks?: DocumentsBlock[]
  deleteDocumentBlocks?: number[]
}

export class ProcedureRequestParamsTab {
  readonly page: Page
  readonly tab: Tabs
  readonly competitorView: CompetitorViewBlock
  readonly prolongation: ProlongationBlock
  readonly documents: DocumentBlock
  readonly multiCurrency: Locator
  readonly vatAllowedRadio: Locator
  readonly volumeControlByRequest: Locator
  readonly requestPositionControl: Locator
  readonly analogAllowedRadio: Locator
  readonly ratingWithAnalogRadio: Locator
  readonly offerForRelatedPositionRequiredRadio: Locator
  readonly informationBlockBanner: Locator
  constructor(page: Page) {
    this.page = page
    this.tab = new Tabs(page)
    this.competitorView = new CompetitorViewBlock(page)
    this.prolongation = new ProlongationBlock(page)
    this.documents = new DocumentBlock(page, 'lot-editor')
    this.multiCurrency = page.getByTestId('checkbox-isMultiCurrencyAllowed')
    this.vatAllowedRadio = page.getByTestId('radio-buttons-isVatAllowed')
    this.volumeControlByRequest = page.getByTestId('radio-buttons-volumeControl')
    this.requestPositionControl = page.getByTestId('radio-buttons-positionControl')
    this.analogAllowedRadio = page.getByTestId('radio-buttons-isAnalogAllowed')
    this.ratingWithAnalogRadio = page.getByTestId('radio-buttons-isRatingWithAnalogs')
    this.offerForRelatedPositionRequiredRadio = page.getByTestId(
      'radio-buttons-isOfferForRelatedPositionRequired'
    )
    this.informationBlockBanner = page.getByTestId('banner')
  }

  async fillRequestParamPage({
    multiCurrency,
    priceVat,
    volumeControl,
    positionControl,
    analogs,
    ratingAnalog,
    prolongationByRequest,
    prolongationByBestPrice,
    documentsBlocks,
    deleteDocumentBlocks
  }: ProcedureRequestParams) {
    await allure.step('Вкладка: "Параметры заявки"', async () => {
      await this.tab.selectTab('request')

      if (multiCurrency) {
        await this.multiCurrencyByRequest()
      }

      if (priceVat) {
        await this.priceTypeVat(priceVat)
      }

      if (volumeControl) {
        await this.volumeControlType(volumeControl)
      }

      if (positionControl) {
        await this.positionControlType(positionControl)
      }

      if (analogs) {
        await this.requestWithAnalogs(analogs)
      }

      if (ratingAnalog) {
        await this.analogsWithRating(ratingAnalog)
      }

      if (prolongationByRequest) {
        await this.prolongationByRequest(prolongationByRequest)
      }

      if (prolongationByBestPrice) {
        await this.prolongationByBestPrice(prolongationByBestPrice)
      }

      await this.documents.applyDocumentBlocks(documentsBlocks, deleteDocumentBlocks)
    })
  }

  async multiCurrencyByRequest() {
    await allure.step('Включить мультивалютность', async () => {
      await this.multiCurrency.click()
    })
  }

  async priceTypeVat(vatType: string) {
    await allure.step(`Выбрать параметр НДС: ${vatType}`, async () => {
      await this.vatAllowedRadio.getByText(vatType).click()
    })
  }

  async volumeControlType(volumeControl: string) {
    await allure.step(`Выбрать контроль объема: ${volumeControl}`, async () => {
      await this.volumeControlByRequest.getByText(volumeControl).click()
    })
  }

  async positionControlType(positionControl: string) {
    await allure.step(`Выбрать контроль позиций: ${positionControl}`, async () => {
      await this.requestPositionControl.getByText(positionControl).click()
    })
  }

  async requestWithAnalogs(solution: string) {
    await allure.step(`Выбрать параметр аналогов: ${solution}`, async () => {
      await this.analogAllowedRadio.getByText(solution).click()
    })
  }

  async competitiveView(solution: string) {
    await allure.step(`Выбрать видимость предложений конкурентов: ${solution}`, async () => {
      await this.competitorView.allowViewCompetitorsOffer.getByText(solution).click()
    })
  }

  async analogsWithRating(option: string) {
    await allure.step(`Выбрать параметр оценки аналогов: ${option}`, async () => {
      await this.ratingWithAnalogRadio.getByText(option).click()
    })
  }

  async requiredRelatedPosition(option: string) {
    await allure.step(`Выбрать обязательность предложения для связанной позиции: ${option}`, async () => {
      await this.offerForRelatedPositionRequiredRadio.getByText(option).click()
    })
  }

  async prolongationByRequest(params: ProlongationByRequestParams) {
    await this.prolongation.fillByRequest(params)
  }

  async prolongationByBestPrice(params: ProlongationByBestPriceParams) {
    await this.prolongation.fillByBestPrice(params)
  }
}
