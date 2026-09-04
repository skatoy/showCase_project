import { ProcedureListPage } from '#/pageObjects/Procedure/ProcedureListPage'
import {
  CommercialOfferPage,
  EditCommercialOfferParams
} from '#/pageObjects/Procedure/CommercialOffer/CommercialOfferPage'
import { ProcedureOverviewTab } from '#/pageObjects/Procedure/ProcedureView/ProcedureOverviewTab'
import { Page } from '@playwright/test'
import { Tabs } from '#/components/Tabs'
import * as allure from 'allure-js-commons'

export class EditCommercialOffer {
  readonly page: Page
  readonly tab: Tabs
  grid: ProcedureListPage
  procedureView: ProcedureOverviewTab
  commercialOffer: CommercialOfferPage

  constructor(page: Page) {
    this.page = page
    this.tab = new Tabs(page)
    this.grid = new ProcedureListPage(page)
    this.procedureView = new ProcedureOverviewTab(page)
    this.commercialOffer = new CommercialOfferPage(page)
  }

  async editCommercialOffer(data: EditCommercialOfferParams, procedureUuid: string) {
    await allure.step('Редактирование этапа коммерческих предложений', async () => {
      await this.grid.goToProcedure(procedureUuid)
      await this.procedureView.editProcedure()
      await this.tab.selectTab('step_commercial_offers')
      await this.commercialOffer.editCommercialOfferPage(data)
      await this.commercialOffer.procedureMoveNextStep()
      await this.commercialOffer.procedurePublish()
    })
  }
}
