import { ProcedureListPage } from '#/pageObjects/Procedure/ProcedureListPage'
import { ProcedureOverviewTab } from '#/pageObjects/Procedure/ProcedureView/ProcedureOverviewTab'
import { FaceToFaceTradePage } from '#/pageObjects/RebbidingTrade/FaceToFaceTradePage'
import { Page } from '@playwright/test'
import * as allure from 'allure-js-commons'

export class FaceToFaceTrade {
  readonly page: Page
  readonly grid: ProcedureListPage
  readonly procedureView: ProcedureOverviewTab
  readonly tradeRebidding: FaceToFaceTradePage
  constructor(page: Page) {
    this.page = page
    this.grid = new ProcedureListPage(page)
    this.procedureView = new ProcedureOverviewTab(page)
    this.tradeRebidding = new FaceToFaceTradePage(page)
  }

  async sendTradeOffer(offer: string, procedureUuid: string) {
    await allure.step(`Отправить ценовое предложение: ${offer}`, async () => {
      await this.grid.goToProcedure(procedureUuid)
      await this.procedureView.goToRebiddingTrade()
      await this.tradeRebidding.sendOffer(offer)
    })
  }
}
