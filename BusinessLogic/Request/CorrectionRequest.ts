import { ApiFromUiRequest } from '#/api/ApiFromUi/ApiFromUiRequest'
import { ProcedureListPage } from '#/pageObjects/Procedure/ProcedureListPage'
import { RequestSignetTextPage } from '#/pageObjects/Request/RequestSignetTextPage'
import { RequestCreateAndEditPage } from '#/pageObjects/Request/RequestCreateAndEditPage'
import { ProcedureOverviewTab } from '#/pageObjects/Procedure/ProcedureView/ProcedureOverviewTab'
import { RequestData } from '#/testData/RequestData'
import { Page } from '@playwright/test'
import * as allure from 'allure-js-commons'

export class CorrectionRequest {
  readonly page: Page
  readonly procedureView: ProcedureOverviewTab
  readonly request: RequestCreateAndEditPage
  readonly signetText: RequestSignetTextPage
  readonly grid: ProcedureListPage
  readonly apiFromUi: ApiFromUiRequest

  constructor(page: Page) {
    this.page = page
    this.procedureView = new ProcedureOverviewTab(page)
    this.request = new RequestCreateAndEditPage(page)
    this.signetText = new RequestSignetTextPage(page)
    this.grid = new ProcedureListPage(page)
    this.apiFromUi = new ApiFromUiRequest(page)
  }

  async correctRequest(data: RequestData, procedureUuid: string) {
    await allure.step('Корректировка заявки', async () => {
      await this.grid.goToProcedure(procedureUuid)
      await this.procedureView.submitRequest()
      await this.request.fillRequestData(data)
      await this.request.goToSignetPage()
      await this.signetText.publishRequest()
      const requestCreateData = await this.apiFromUi.requestData()
      data.requestUuid = requestCreateData.requestUuid
    })
  }
}
