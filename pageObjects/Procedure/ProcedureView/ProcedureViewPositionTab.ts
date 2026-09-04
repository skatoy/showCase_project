import { Page, Locator } from '@playwright/test'
import * as allure from 'allure-js-commons'

export class ProcedureViewPositionTab {
  readonly page: Page
  readonly positionTable: Locator
  readonly positionRequirementsIcon: Locator
  readonly positionViewSwitch: Locator
  readonly pagePositions: Locator
  readonly positionPagination: Locator
  readonly positionTitle: Locator
  readonly positionAllInfo: Locator
  readonly positionOkpdInfo: Locator
  readonly positionDescription: Locator
  readonly positionInfo: Locator
  readonly allPositionRequriments: Locator
  readonly positionRequriments: Locator
  readonly banner: Locator
  readonly tablePositionOffers: Locator
  readonly tableAllPositionOffers: Locator

  constructor(page: Page) {
    this.page = page
    this.positionTable = page.getByTestId('table-positions')
    this.positionRequirementsIcon = page.getByTestId('position-view-switch')
    this.positionViewSwitch = page.getByTestId('switch-on')
    this.pagePositions = page.getByTestId('pagination-btns')
    this.positionPagination = page.getByTestId('select-perPage')
    this.positionTitle = page.getByTestId('position-title')
    this.positionAllInfo = page.getByTestId('position-info')
    this.positionOkpdInfo = page.getByTestId('position-okpd')
    this.positionDescription = page.getByTestId('position-expander-description')
    this.positionInfo = page.getByTestId('position-quantity-and-okei')
    this.allPositionRequriments = page.getByTestId('position-additional-requirements') //доп требования
    this.positionRequriments = page.getByTestId('position-requirements') //требования к позиции
    this.banner = page.getByTestId('applications-acceptance-not-end-warning') //баннер
    this.tablePositionOffers = page.getByTestId('position-suppliers') //предложение по позиции
    this.tableAllPositionOffers = page.getByTestId('positions-with-suppliers-offers') //таблица предложений
  }

  async swichPositionOffers() {
    await allure.step('Переключить отображение предложений по позициям', async () => {
      await this.positionViewSwitch.click()
    })
  }
}
