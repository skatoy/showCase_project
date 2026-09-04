import { ProcedureData } from '#/testData/ProcedureData'
import { expect, Page } from '@playwright/test'
import * as allure from 'allure-js-commons'

export class ApiFromUiProcedure {
  readonly page: Page

  constructor(page: Page) {
    this.page = page
  }

  async procedureData(data: ProcedureData) {
    return await allure.step('API: Заполнение данных процедуры', async () => {
      const response = await this.page.waitForResponse(
        '**/api/public/gate/grpc/v1/container/get/**'
      )
      const responseBody = await response.json()
      const containerUuid = responseBody.uuid
      const registryNumber = responseBody.registryNumber
      const expectedTitle = data.procedure.procedureTitle
      const targetLot = responseBody.lots.find(
        (lot: { title: string; uuid: string }) => lot.title === expectedTitle
      )
      const procedureUuid = targetLot.uuid

      return {
        containerUuid,
        registryNumber,
        procedureUuid
      }
    })
  }

  async checkTradeStatus(procedureUuid: string) {
    await allure.step('Проверить статус торгов очной переторжки', async () => {
      await expect(async () => {
        await this.page.reload()
        const response = await this.page.waitForResponse(
          `**/api/public/gate/grpc/v1/trade/procedure/get/${procedureUuid}`,
          { timeout: 5000 }
        )
        const data = await response.json()
        const status = data.items?.[0]?.tradeStatus
        expect(status).toBe('TRADE_STATUS_FINISHED')
      }).toPass({ timeout: 75000, intervals: [3000] })
    })
  }
}
