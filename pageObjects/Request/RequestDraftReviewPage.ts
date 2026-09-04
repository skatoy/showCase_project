import { Locator, Page } from '@playwright/test'

export class PositionOffer {
  readonly page: Page

  readonly viewExchangePrice: Locator
  readonly positionsCurrencyType: Locator
  readonly currencySelect: Locator

  constructor(page: Page) {
    this.page = page
    this.viewExchangePrice = page.getByTestId('checkbox-currency')
    this.positionsCurrencyType = page.getByTestId('radio-buttons-isCurrencyByPosition')
    this.currencySelect = page.getByTestId('select-currency') // Выбор валюты
  }
}
export class CompetitorsOffer {
  readonly page: Page
  readonly viewExchangePrice: Locator
  readonly positionsTable: Locator

  constructor(page: Page) {
    this.page = page
    this.viewExchangePrice = page.getByTestId('checkbox-currency')
    this.positionsTable = page.getByTestId('table-loaded')
  }
}
export class OfferDocuments {
  readonly page: Page
  readonly documentAttachInput: Locator

  constructor(page: Page) {
    this.page = page
    this.documentAttachInput = page.getByTestId('dropzone')
  }
}
export class AnswersToQuestionnaire {
  readonly page: Page
  readonly questionaryView: Locator

  constructor(page: Page) {
    this.page = page
    this.questionaryView = page.getByTestId('questionary-view')
  }
}
export class LotInfo {
  readonly page: Page
  readonly procedureInfoTable: Locator

  constructor(page: Page) {
    this.page = page
    this.procedureInfoTable = page.getByTestId('procedure-info')
  }
}
