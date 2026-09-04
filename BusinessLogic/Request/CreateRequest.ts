import { ApiFromUiRequest } from '#/api/ApiFromUi/ApiFromUiRequest'
import { ProcedureListPage } from '#/pageObjects/Procedure/ProcedureListPage'
import { RequestSignetTextPage } from '#/pageObjects/Request/RequestSignetTextPage'
import { RequestCreateAndEditPage } from '#/pageObjects/Request/RequestCreateAndEditPage'
import { ProcedureOverviewTab } from '#/pageObjects/Procedure/ProcedureView/ProcedureOverviewTab'
import { RequestData } from '#/testData/RequestData'
import { RetryOptions, retryPublish } from '#/utils/retryPublish'
import { Page } from '@playwright/test'
import * as allure from 'allure-js-commons'

export type RequestCreateOptions = {
  beforeSignetPage?: () => Promise<void>
  beforePublish?: () => Promise<void>
  retry?: RetryOptions & { enabled?: boolean }
  skipPublish?: boolean
}

export class CreateRequest {
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

  async requestCreate(data: RequestData, procedureUuid: string, options?: RequestCreateOptions) {
    await this.grid.goToProcedure(procedureUuid)
    await this.procedureView.submitRequest()
    await this.request.fillRequestData(data)
    await this.request.goToSignetPage(options?.beforeSignetPage)

    if (!options?.skipPublish) {
      const publishAction = async () => {
        return await allure.step('Опубликовать заявку', async () => {
          if (options?.beforePublish) {
            await options.beforePublish()
          }

          await this.signetText.publishRequest()

          return await this.apiFromUi.requestData()
        })
      }

      let result

      if (options?.retry?.enabled) {
        const retryOptions = {
          maxAttempts: options.retry.maxAttempts ?? 3,
          retryDelay: options.retry.retryDelay ?? 3000
        }
        result = await retryPublish(publishAction, retryOptions)
      } else {
        result = await publishAction()
      }

      data.requestUuid = result?.requestUuid
    }
  }
}
