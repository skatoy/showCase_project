import { RequestSignetTextPage } from '#/pageObjects/Request/RequestSignetTextPage'
import { RequestCreateAndEditPage } from '#/pageObjects/Request/RequestCreateAndEditPage'
import { ProcedureListPage } from '#/pageObjects/Procedure/ProcedureListPage'
import { ProcedureOverviewTab } from '#/pageObjects/Procedure/ProcedureView/ProcedureOverviewTab'
import { AbsenteeRequestData } from '#/testData/AbsenteeRebiddingRequestData'
import { Page } from '@playwright/test'
import * as allure from 'allure-js-commons'

export class AbsenteeRebiddingCreateRequest {
  readonly page: Page
  readonly request: RequestCreateAndEditPage
  readonly signetText: RequestSignetTextPage
  readonly grid: ProcedureListPage
  readonly procedureView: ProcedureOverviewTab

  constructor(page: Page) {
    this.page = page
    this.request = new RequestCreateAndEditPage(page)
    this.signetText = new RequestSignetTextPage(page)
    this.grid = new ProcedureListPage(page)
    this.procedureView = new ProcedureOverviewTab(page)
  }

  async rebiddingRequest(data: AbsenteeRequestData, procedureUuid: string) {
    await allure.step('Подать предложение на заочной переторжке', async () => {
      await this.grid.goToProcedure(procedureUuid)
      await this.procedureView.submitRequest()

      if (data.positions?.length) {
        await this.request.positionTab.fillPositions(data.positions)
      }

      if (data.rebiddingDocuments) {
        await this.request.documentsTab.fillRebiddingDocumentsBlock(data.rebiddingDocuments)
      }

      await this.request.goToSignetPage()
      await this.signetText.publishRequest()
    })
  }
}
