import { ProcedureListPage } from '#/pageObjects/Procedure/ProcedureListPage'
import { ProcedureOverviewTab } from '#/pageObjects/Procedure/ProcedureView/ProcedureOverviewTab'
import { RequestParticipantsViewTab } from '#/pageObjects/Procedure/ProcedureView/RequestParticipantsViewTab'
import { RequestReviewPage } from '#/pageObjects/Request/RequestReviewPage'
import {
  ImproveApplicationModal,
  ImproveDocumentationModal,
  ImproveDocumentOption,
  ImproveRequestOption
} from '#/pageObjects/Modal/Modals'
import { Page } from '@playwright/test'
import * as allure from 'allure-js-commons'

export class ImproveRequest {
  readonly page: Page
  grid: ProcedureListPage
  procedureView: ProcedureOverviewTab
  participantsTab: RequestParticipantsViewTab
  requestPage: RequestReviewPage
  improveDocuments: ImproveDocumentationModal
  improveRequest: ImproveApplicationModal

  constructor(page: Page) {
    this.page = page
    this.grid = new ProcedureListPage(page)
    this.procedureView = new ProcedureOverviewTab(page)
    this.participantsTab = new RequestParticipantsViewTab(page)
    this.requestPage = new RequestReviewPage(page)
    this.improveDocuments = new ImproveDocumentationModal(page)
    this.improveRequest = new ImproveApplicationModal(page)
  }

  async sendImproveDocumentRequest(
    procedureUuid: string,
    supplierShortName: string,
    improveData: ImproveDocumentOption
  ) {
    await allure.step(`Доработка документации поставщика ${supplierShortName}`, async () => {
      await this.grid.goToProcedure(procedureUuid)
      await this.procedureView.waitCountDownTimer()
      await this.participantsTab.openRequestList()
      await this.participantsTab.viewSupplierRequest(supplierShortName)
      await this.requestPage.improveDocumentsRequest()
      await this.improveDocuments.fillImproveDocumentation(improveData)
    })
  }

  async sendImproveRequest(
    procedureUuid: string,
    supplierShortName: string,
    improveData: ImproveRequestOption
  ) {
    await allure.step(`Доработка заявки поставщика ${supplierShortName}`, async () => {
      await this.grid.goToProcedure(procedureUuid)
      await this.procedureView.waitCountDownTimer()
      await this.participantsTab.openRequestList()
      await this.participantsTab.viewSupplierRequest(supplierShortName)
      await this.requestPage.improveRequest()
      await this.improveRequest.fillImproveRequest(improveData)
    })
  }
}
