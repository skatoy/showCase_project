import { RequestSignetTextPage } from '#/pageObjects/Request/RequestSignetTextPage'
import { RequestCreateAndEditPage } from '#/pageObjects/Request/RequestCreateAndEditPage'
import { RequestData } from '#/testData/RequestData'
import { ProcedureListPage } from '#/pageObjects/Procedure/ProcedureListPage'
import { ProcedureOverviewTab } from '#/pageObjects/Procedure/ProcedureView/ProcedureOverviewTab'
import { RequestReviewPage } from '#/pageObjects/Request/RequestReviewPage'
import { Page } from '@playwright/test'
import * as allure from 'allure-js-commons'

export class EditRequest {
  readonly page: Page
  readonly request: RequestCreateAndEditPage
  readonly signetText: RequestSignetTextPage
  readonly grid: ProcedureListPage
  readonly procedureView: ProcedureOverviewTab
  readonly requestView: RequestReviewPage

  constructor(page: Page) {
    this.page = page
    this.request = new RequestCreateAndEditPage(page)
    this.signetText = new RequestSignetTextPage(page)
    this.grid = new ProcedureListPage(page)
    this.procedureView = new ProcedureOverviewTab(page)
    this.requestView = new RequestReviewPage(page)
  }

  async editRequest(data: RequestData, procedureUuid: string, requestUuid?: string) {
    await allure.step('Редактировать заявку', async () => {
      if (requestUuid) {
        await this.requestView.goToEditRequestLink(procedureUuid, requestUuid)
      } else {
        await this.grid.goToProcedure(procedureUuid)
        await this.procedureView.goViewRequest()
        await this.requestView.goToEditRequest()
      }

      await this.request.fillRequestData(data)
      await this.request.goToSignetPage()
      await this.signetText.publishRequest()
    })
  }
}
