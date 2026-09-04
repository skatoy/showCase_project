import { ProcedureListPage } from '#/pageObjects/Procedure/ProcedureListPage'
import {
  AnnounceCommercialOfferParams,
  CommercialOfferPage
} from '#/pageObjects/Procedure/CommercialOffer/CommercialOfferPage'
import { ProcedureOverviewTab } from '#/pageObjects/Procedure/ProcedureView/ProcedureOverviewTab'
import { Page } from '@playwright/test'
import * as allure from 'allure-js-commons'

export class AnnounceCommercialOffer {
  readonly page: Page
  grid: ProcedureListPage
  procedureView: ProcedureOverviewTab
  commercialOffer: CommercialOfferPage

  constructor(page: Page) {
    this.page = page
    this.grid = new ProcedureListPage(page)
    this.procedureView = new ProcedureOverviewTab(page)
    this.commercialOffer = new CommercialOfferPage(page)
  }

  async announceCommercialOffer(data: AnnounceCommercialOfferParams, procedureUuid: string) {
    await allure.step('Объявить этап коммерческих предложений', async () => {
      await this.grid.goToProcedure(procedureUuid)
      await this.procedureView.goToCommertialOffer()
      await this.commercialOffer.announceCommercialOfferPage(data)
      await this.commercialOffer.procedureMoveNextStep()
      await this.commercialOffer.procedurePublish()
      await this.page.getByTestId('global-loader').waitFor({ state: 'hidden' })
    })
  }
}
