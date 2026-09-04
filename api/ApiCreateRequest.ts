import { RequestByApi, SaveRequestBody, SaveRequestPositionBody } from '#/api/Request'
import { RetryOptions, retryPublish } from '#/utils/retryPublish'
import { BrowserContext } from '@playwright/test'
import * as allure from 'allure-js-commons'

export type ApiRequestParams = {
  procedureUuid: string
  supplierUuid: string
  saveRequest: Omit<SaveRequestBody, 'procedureUuid' | 'supplierUuid'>
  positions?: SaveRequestPositionBody[]
  autoPublish?: boolean
}

export type CreateRequestOptions = {
  retry?: RetryOptions & { enabled?: boolean }
}

export class ApiCreateRequest {
  private requestApi: RequestByApi

  constructor(context: BrowserContext) {
    this.requestApi = new RequestByApi(context)
  }

  async createRequest(data: ApiRequestParams, options: CreateRequestOptions = {}) {
    const { procedureUuid, supplierUuid, saveRequest, positions = [], autoPublish = true } = data
    const { retry } = options
    const draftPayload: SaveRequestBody = {
      procedureUuid,
      supplierUuid,
      ...saveRequest
    }
    const draftResponse = await this.requestApi.createDraftRequest('', draftPayload)
    const requestUuid = draftResponse.uuid
    const positionsResponse = await this.requestApi.getRequestPosition(requestUuid, {
      filters: [],
      isDraft: true,
      limit: 100,
      offset: 0
    })
    const requestPositions = positionsResponse.positions || []

    for (let i = 0; i < requestPositions.length && i < positions.length; i++) {
      const position = requestPositions[i]
      const positionData = positions[i]
      await this.requestApi.savePosition(position.uuid, {
        ...positionData,
        request_uuid: requestUuid
      })
    }

    if (autoPublish) {
      const publishAction = async () => {
        return await allure.step('API: Action', async () => {
          return await this.requestApi.publishRequest(requestUuid)
        })
      }

      if (retry?.enabled) {
        const retryOpts = {
          maxAttempts: retry.maxAttempts ?? 3,
          retryDelay: retry.retryDelay ?? 3000
        }
        await retryPublish(publishAction, retryOpts)
      } else {
        await publishAction()
      }
    }

    return { requestUuid, positions: requestPositions }
  }
}
