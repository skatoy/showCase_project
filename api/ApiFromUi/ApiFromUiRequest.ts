import { Page } from '@playwright/test'
import * as allure from 'allure-js-commons'

export class ApiFromUiRequest {
  readonly page: Page

  constructor(page: Page) {
    this.page = page
  }

  async requestData() {
    return await allure.step('Получение данных заявки', async () => {
      const response = await this.page.waitForResponse(
        '**/api/public/gate/grpc/v1/request/publish/**'
      )
      const responseBody = await response.json()
      const status = await response.status()
      const requestUuid = responseBody.uuid

      return {
        requestUuid,
        status,
        response
      }
    })
  }
}
