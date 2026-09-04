import { ApiInstance } from './ApiInstance'
import { ProcedureType } from './Container'
import * as allure from 'allure-js-commons'

export type Step = {
  number?: number
  dateStart?: string | null
  dateEnd?: string | null
  code: string
  name: string
  additionalData?: any
  disabled?: boolean
}

export type ProcedureInfo = {
  title: string
  steps?: Step[]
  positionControl?: string
  volumeControl?: string
  isWithoutPrice?: boolean
  allowOfferHigherLotPrice?: boolean
  contacts?: any[]
  isCustomerContactsHidden?: boolean
  organizer?: any
  customers?: any[]
  documentsConfig?: any[]
  currency?: string
}

export type SaveProcedureFormPayload = {
  type: ProcedureType
  containerUuid: string
  procedureInfo: ProcedureInfo
}

export type SaveProcedureResponse = {
  success: boolean
  uuid: string
}

export type MinimalPosition = {
  title: string
  isForPriceList?: boolean
  quantity?: string
  price?: string
  deliveryCondition?: string
  deliveryAddress?: string
  deliveryDate?: string
  description?: string
  okpd?: string
  okpdName?: string
  requirementSettings?: { isEnabled: boolean; requirementList: any[] }
  okei?: string
  okeiName?: string
  okeiShortName?: string
  type?: string
  relatedPositionUuids?: string[]
}

export type SavePositionRequest = {
  uuid: string
  validateForPublish?: boolean
  positions: MinimalPosition[]
}

export type SavePositionResponse = {
  result: boolean
  message: string
  errors: any[]
  uuid: string
  messageEng: string
}

export type GetProcedureResponse = {
  uuid: string
  type: SaveProcedureFormPayload['type']
  procedureInfo: any
}

export type GetPositionsParams = {
  offset?: number
  limit?: number
  isDraft?: boolean
  filters?: any[]
}

export type GetPositionsResponse = {
  procedureUuid: string
  positions: any[]
  pagination: {
    offset: number
    limit: number
    totalCount: number
  }
  totalPrice: string
  totalCountWithoutFilters: number
  hasPositionsWithPriceList: boolean
}

export class ProcedureByApi extends ApiInstance {
  async createProcedure(payload: SaveProcedureFormPayload) {
    return await allure.step(`API: Создать лот "${payload.procedureInfo.title}"`, async () => {
      const response = await this.post('/api/public/gate/grpc/v1/procedure/save', payload)

      return await response.json()
    })
  }

  async saveProcedure(payload: SaveProcedureFormPayload) {
    return await allure.step(`API: Сохранить лот "${payload.procedureInfo.title}"`, async () => {
      const response = await this.post('/api/public/gate/grpc/v1/procedure/save', payload)

      return await response.json()
    })
  }

  async createPosition(payload: SavePositionRequest) {
    return await allure.step(`API: Сохранить позиции лота ${payload.uuid}`, async () => {
      const response = await this.post('/api/public/gate/grpc/v1/procedure/positions/save', {
        uuid: payload.uuid,
        validateForPublish: payload.validateForPublish,
        positions: payload.positions
      })

      return await response.json()
    })
  }

  async getProcedureDraft(procedureUuid: string) {
    return await allure.step(`API: Получить черновик лота ${procedureUuid}`, async () => {
      const response = await this.get(
        `/api/public/gate/grpc/v1/procedure/getdraft/${procedureUuid}`,
        {}
      )

      return await response.json()
    })
  }

  async getProcedure(procedureUuid: string) {
    return await allure.step(`API: Получить лот ${procedureUuid}`, async () => {
      const response = await this.get(`/api/public/gate/grpc/v1/procedure/get/${procedureUuid}`, {})

      return await response.json()
    })
  }

  async getProcedureTrade(procedureUuid: string) {
    return await allure.step(`API: Получить торги лота ${procedureUuid}`, async () => {
      const response = await this.get(
        `/api/public/gate/grpc/v1/trade/procedure/get/${procedureUuid}`,
        {}
      )

      return await response.json()
    })
  }

  async getPositions(procedureUuid: string, params: GetPositionsParams = {}) {
    return await allure.step(`API: Получить позиции лота ${procedureUuid}`, async () => {
      const { offset = 0, limit = 100, isDraft = true, filters = [] } = params
      const response = await this.post(
        `/api/public/gate/grpc/v1/procedure/positions/get/${procedureUuid}`,
        {
          offset,
          limit,
          isDraft,
          filters
        }
      )

      return await response.json()
    })
  }
}
