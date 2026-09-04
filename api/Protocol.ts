import { ApiInstance } from './ApiInstance'
import * as allure from 'allure-js-commons'

export type ProtocolType = 'pt_summing_up' | 'pt_applications_acceptance' | string
export type ProtocolStatus = 'draft' | 'published' | string
export type ProcedureDecisionType =
  | 'PROCEDURE_DECISION_HAPPENED'
  | 'PROCEDURE_DECISION_NOT_HAPPENED'
  | 'PROCEDURE_DECISION_CANCELLED'
  | 'PROCEDURE_DECISION_UNDEFINED'
export type RequestDecisionType =
  | 'REQUEST_DECISION_PROCESSED'
  | 'REQUEST_DECISION_WINNER'
  | 'REQUEST_DECISION_DECLINED'
  | 'REQUEST_DECISION_UNDEFINED'
export type ProtocolTableType =
  'PROTOCOL_TABLE_TYPE_SHORT' | 'PROTOCOL_TABLE_TYPE_FULL' | 'PROTOCOL_TABLE_TYPE_UNDEFINED'

export type ProtocolVisibilityInfo = {
  protocolForAllSuppliersVisibility: boolean
  supplierNameVisibility: boolean
  winnersPriceVisibility: boolean
}

export type ProtocolDecision = {
  decision: ProcedureDecisionType
  text: string
}

export type RequestDecision = {
  requestUuid: string
  decision: RequestDecisionType
  supplierUuid: string
  supplierName: string
  publishedAt: string
  stepCode: string
  requestPrice: string
  requestSubmittedPositionCount: number
  requestPositionCount: number
  markedPositionCount: number
  markedPrice: string | null
  previousDecision: RequestDecisionType
  currency: string
  supplierInn: string
  supplierKpp: string
  requestStatus: string
  tin: string
  grn: string
  requestPriceWithVat: string
  markedPriceWithVat?: string
}

export type ProtocolData = {
  tableType: ProtocolTableType
  procedureDecision: ProtocolDecision
  requestDecisions: Record<string, RequestDecision>
  protocolPositions: Record<string, any>
  documents: any[]
  winners: any[]
}

export type ProtocolOperation = {
  applyAllRequestUuid?: string[]
  revokeAllRequestUuid?: string[]
}

export type ProtocolSavePayload = {
  uuid: string
  procedureUuid: string
  data: ProtocolData
  operation?: ProtocolOperation
  visibilityInfo: ProtocolVisibilityInfo
  status: ProtocolStatus
  type: ProtocolType
  publishedAt: string | null
  version: number
  registryNumber: string
}

export type ProtocolDraftResponse = ProtocolSavePayload & {}
export type ProtocolSaveResponse = { uuid: string; result: boolean; systemStatus: string }
export type ProtocolPublishResponse = { uuid: string; result: boolean; systemStatus: string }
export type ApplicationReviewDecision = {
  requestUuid: string
  decision: RequestDecisionType
  supplierUuid: string
  supplierName: string
  publishedAt: string
  stepCode: string
  requestPrice: string
  requestSubmittedPositionCount: number
  requestPositionCount: number
  markedPositionCount: number
  markedPrice: string | null
  previousDecision: RequestDecisionType
  currency: string
  supplierInn: string
  supplierKpp: string
  requestStatus: string
  tin: string
  grn: string
  requestPriceWithVat: string
  markedPriceWithVat?: string
}

export type ApplicationReviewData = {
  requestDecisions: Record<string, ApplicationReviewDecision>
  documents: any[]
}

export type ApplicationReviewPayload = {
  uuid: string
  procedureUuid: string
  data: ApplicationReviewData
  visibilityInfo: ProtocolVisibilityInfo
  operation?: {
    applyAllRequestUuid?: string[]
    revokeAllRequestUuid?: string[]
  }
}

export type ApplicationReviewSaveResponse = {
  uuid: string
  result: boolean
  systemStatus: string
}

export class ProtocolByApi extends ApiInstance {
  async getDraft(procedureUuid: string) {
    return await allure.step(`API: Получить черновик протокола ${procedureUuid}`, async () => {
      const response = await this.get(`/api/public/gate/grpc/v1/protocol/getdraft/${procedureUuid}`)

      return response.json()
    })
  }

  async save(payload: ProtocolSavePayload) {
    return await allure.step('API: Сохранить протокол', async () => {
      const response = await this.post('/api/public/gate/grpc/v1/protocol/save', payload)

      return response.json()
    })
  }

  async publish(uuid: string) {
    return await allure.step(`API: Опубликовать протокол ${uuid}`, async () => {
      const response = await this.post('/api/public/gate/grpc/v1/protocol/publish', { uuid })

      return response.json()
    })
  }

  async updateVisibility(uuid: string, visibilityInfo: ProtocolVisibilityInfo) {
    return await allure.step(`API: Обновить видимость протокола ${uuid}`, async () => {
      const response = await this.post(`/api/public/gate/grpc/v1/protocol/visibility/${uuid}`, {
        visibilityInfo
      })

      return response.json()
    })
  }

  async getReviewDraft(procedureUuid: string) {
    return await allure.step(`API: Получить черновик акта ${procedureUuid}`, async () => {
      const response = await this.get(
        `/api/public/gate/grpc/v1/protocol/getreviewdraft/${procedureUuid}`
      )

      return response.json()
    })
  }

  async saveReview(payload: ApplicationReviewPayload) {
    return await allure.step('API: Сохранить акт рассмотрения', async () => {
      const response = await this.post('/api/public/gate/grpc/v1/protocol/savereview', payload)

      return response.json()
    })
  }

  async updateRequestDecision(
    draft: ProtocolDraftResponse,
    requestUuid: string,
    decision: RequestDecisionType,
    markedPrice?: string
  ): Promise<ProtocolDraftResponse> {
    return await allure.step(`API: Обновить решение по заявке ${requestUuid}`, async () => {
      draft.data.requestDecisions[requestUuid].decision = decision

      if (markedPrice !== undefined) {
        draft.data.requestDecisions[requestUuid].markedPrice = markedPrice
      }

      await this.save(draft)

      return draft
    })
  }
}
