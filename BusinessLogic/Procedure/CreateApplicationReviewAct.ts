import { ProcedureListPage } from '#/pageObjects/Procedure/ProcedureListPage'
import {
  ApplicationReviewAct,
  ApplicationReviewParams
} from '#/pageObjects/Procedure/ApplicationReview/ApplicationReviewAct'
import { ProcedureOverviewTab } from '#/pageObjects/Procedure/ProcedureView/ProcedureOverviewTab'
import { ActSignetTextPage } from '#/pageObjects/SignetText/ActSignetTextPage'
import { Page } from '@playwright/test'
import * as allure from 'allure-js-commons'

export class CreateApplicationReviewAct {
  readonly page: Page
  readonly grid: ProcedureListPage
  readonly procedureView: ProcedureOverviewTab
  readonly createPage: ApplicationReviewAct
  readonly signetText: ActSignetTextPage

  constructor(page: Page) {
    this.page = page
    this.grid = new ProcedureListPage(page)
    this.procedureView = new ProcedureOverviewTab(page)
    this.signetText = new ActSignetTextPage(page)
    this.createPage = new ApplicationReviewAct(page)
  }

  async createReviewAct(procedureUuid: string, params?: ApplicationReviewParams) {
    await allure.step('Создать акт рассмотрения заявок', async () => {
      await this.grid.goToProcedure(procedureUuid)
      await this.procedureView.waitCountDownTimer()
      await this.procedureView.goToApplicationReview()

      if (params) {
        await this.createPage.fillApplicationReviewPage(params!)
        await this.createPage.save()
      }

      await this.createPage.goToSignedText()
      await this.signetText.publishAct()
    })
  }
}
