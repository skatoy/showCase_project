import { ApiInstance } from './ApiInstance'
import * as allure from 'allure-js-commons'

export type SaveRequestBody = {
  procedureUuid: string
  supplierUuid: string
  isCurrencyByPosition?: boolean
  questionList?: any[]
  documentList?: any[]
  containerDocumentList?: any[]
  commercialOffersDocuments?: unknown[]
  rebiddingOffersDocuments?: unknown[]
  currency?: string
  [key: string]: unknown
}

export type SaveRequestResponse = {
  result: boolean
  uuid: string
  message?: string
}

export type GetRequestPositionsParams = {
  filters?: unknown[]
  isDraft?: boolean
  limit?: number
  offset?: number
}

export type RequestPosition = {
  uuid: string
  [key: string]: unknown
}

export type GetRequestPositionsResponse = {
  positions: RequestPosition[]
  total?: number
}

export type SuccessResponse = {
  result: boolean
  message?: string
}

export type Request = {
  uuid: string
  procedureUuid: string
  supplierUuid: string
}

export type SaveRequestPositionBody = {
  request_Uuid?: string
  customTitle?: string
  quantity?: string
  price?: string
  currency?: string
  vatPercent?: string
  requirementList?: unknown[]
  analogs?: unknown[]
  [key: string]: unknown
}

export class RequestByApi extends ApiInstance {
  async createDraftRequest(requestUuid: string, payload: SaveRequestBody) {
    return await allure.step('API: Сохранить черновик заявки', async () => {
      const response = await this.post(
        `/api/public/gate/grpc/v1/request/save/${requestUuid}`,
        payload
      )

      return response.json()
    })
  }

  async getRequestPosition(requestUuid: string, params: GetRequestPositionsParams) {
    return await allure.step(`API: Получить позиции заявки ${requestUuid}`, async () => {
      const response = await this.post(
        `/api/public/gate/grpc/v1/request/positions/get/${requestUuid}`,
        params
      )

      return response.json()
    })
  }

  async getPositionsWithOffers(requestUuid: string, params: GetRequestPositionsParams) {
    return await allure.step(
      `API: Получить позиции заявки с предложениями ${requestUuid}`,
      async () => {
        const response = await this.post(
          `/api/public/gate/grpc/v1/request/positions/getwithoffers/${requestUuid}`,
          params
        )

        return response.json()
      }
    )
  }

  async savePosition(requestPositionUuid: string, payload: SaveRequestPositionBody) {
    return await allure.step(`API: Сохранить позицию заявки ${requestPositionUuid}`, async () => {
      const response = await this.post(
        `/api/public/gate/grpc/v1/request/position/save/${requestPositionUuid}`,
        payload
      )

      return response.json()
    })
  }

  async publishRequest(requestUuid: string, orderUuid?: string) {
    return await allure.step(`API: Опубликовать заявку ${requestUuid}`, async () => {
      const response = await this.post(`/api/public/gate/grpc/v1/request/publish/${requestUuid}`, {
        ...(orderUuid ? { orderUuid } : {})
      })
      const data = await response.json()

      return {
        status: response.status(),
        data: data
      }
    })
  }

  async getRequest(requestUuid: string) {
    return await allure.step(`API: Получить заявку ${requestUuid}`, async () => {
      const response = await this.get(`/api/public/gate/grpc/v1/request/get/${requestUuid}`)

      return response.json()
    })
  }

  async cancelRequest(requestUuid: string): Promise<any> {
    return await allure.step(`API: Отозвать заявку ${requestUuid}`, async () => {
      const response = await this.post(`/api/public/gate/grpc/v1/request/cancel/${requestUuid}`)

      return response.json()
    })
  }
}
