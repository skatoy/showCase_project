import { ProcedureListPage } from '#/pageObjects/Procedure/ProcedureListPage'
import { ProcedureOverviewTab } from '#/pageObjects/Procedure/ProcedureView/ProcedureOverviewTab'
import { RequestSignetTextPage } from '#/pageObjects/Request/RequestSignetTextPage'
import { RequestCreateAndEditPage } from '#/pageObjects/Request/RequestCreateAndEditPage'
import { PositionConfig } from '#/pageObjects/Request/RequestPositionTab'
import { DocumentsConfig } from '#/utils/files'
import { Page } from '@playwright/test'
import * as allure from 'allure-js-commons'

export type TradeCorrectionRequestParams = {
  autoCorrection?: boolean
  positions?: PositionConfig[]
  documents?: DocumentsConfig
}
export class TradeCorrectionRequest {
  readonly page: Page
  readonly grid: ProcedureListPage
  readonly procedureView: ProcedureOverviewTab
  readonly request: RequestCreateAndEditPage
  readonly signetText: RequestSignetTextPage

  constructor(page: Page) {
    this.page = page
    this.grid = new ProcedureListPage(page)
    this.procedureView = new ProcedureOverviewTab(page)
    this.request = new RequestCreateAndEditPage(page)
    this.signetText = new RequestSignetTextPage(page)
  }

  async correctRequest(params: TradeCorrectionRequestParams, procedureUuid: string) {
    await allure.step('Корректировка заявки после очной переторжки', async () => {
      await this.grid.goToProcedure(procedureUuid)
      await this.procedureView.goToCorrectionRequest()

      if (params.autoCorrection) {
        await this.request.positionTab.clickAutoUpdate()
      }

      if (params.positions) {
        await this.request.positionTab.fillPositions(params.positions)
      }

      if (params.documents) {
        await this.request.documentsTab.fillDocumentsRequest(params.documents)
      }

      await this.request.goToSignetPage()
      await this.signetText.publishRequest()
    })
  }
}
