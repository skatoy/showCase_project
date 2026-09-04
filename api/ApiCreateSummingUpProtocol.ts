import {
  ProtocolByApi,
  ProtocolSavePayload,
  ProtocolVisibilityInfo,
  RequestDecision,
  ProtocolDraftResponse,
  RequestDecisionType,
  ProcedureDecisionType
} from '#/api/Protocol'
import * as allure from 'allure-js-commons'

export class ApiProtocol {
  private api: ProtocolByApi

  constructor(context: any) {
    this.api = new ProtocolByApi(context)
  }

  private applyDecisions(
    draft: ProtocolDraftResponse,
    decisions: Record<string, { decision: RequestDecisionType; markedPrice?: string }>
  ): void {
    const winnerUuids: string[] = []
    const revokedUuids: string[] = []

    for (const [reqUuid, update] of Object.entries(decisions)) {
      const reqData = draft.data.requestDecisions[reqUuid]

      if (!reqData) continue

      reqData.decision = update.decision

      if (update.markedPrice !== undefined) {
        reqData.markedPrice = update.markedPrice
      }

      if (update.decision === 'REQUEST_DECISION_WINNER') {
        winnerUuids.push(reqUuid)
        reqData.markedPositionCount = 1
      } else if (update.decision === 'REQUEST_DECISION_DECLINED') {
        revokedUuids.push(reqUuid)
      }
    }

    if (winnerUuids.length > 0) {
      draft.data.winners = winnerUuids.map((reqUuid, index) => {
        const reqData = draft.data.requestDecisions[reqUuid]

        return {
          place: index + 1,
          requestUuid: reqUuid,
          supplierName: reqData.supplierName,
          contractPrice: reqData.requestPrice,
          contractPriceWithVat: '',
          requestPrice: reqData.requestPrice,
          markedPositionCount: 1,
          requestSubmittedPositionCount: reqData.requestSubmittedPositionCount,
          requestPositionCount: reqData.requestPositionCount,
          currency: reqData.currency
        }
      })
    } else {
      draft.data.winners = []
    }

    if (!draft.operation) {
      draft.operation = { applyAllRequestUuid: [], revokeAllRequestUuid: [] }
    }

    draft.operation.applyAllRequestUuid = winnerUuids
    draft.operation.revokeAllRequestUuid = revokedUuids
  }

  async publishProtocol(
    procedureUuid: string,
    protocolPayload: Omit<ProtocolSavePayload, 'uuid' | 'procedureUuid'>,
    decisionsByName?: {
      supplierName: string
      decision: RequestDecisionType
      markedPrice?: string
    }[],
    visibility?: Partial<ProtocolVisibilityInfo>,
    procedureDecision?: ProcedureDecisionType
  ) {
    return await allure.step(
      `API: Опубликовать протокол подведения итогов ${procedureUuid}`,
      async () => {
        const { operation, ...payloadWithoutOperation } = protocolPayload
        await this.api.save({
          ...payloadWithoutOperation,
          uuid: '',
          procedureUuid
        })

        const draft = await this.api.getDraft(procedureUuid)

        let decisions:
          Record<string, { decision: RequestDecisionType; markedPrice?: string }> | undefined

        if (decisionsByName) {
          decisions = {}
          const entries = Object.entries(draft.data.requestDecisions) as [string, RequestDecision][]

          for (const { supplierName, decision, markedPrice } of decisionsByName) {
            const found = entries.find(([, reqData]) => reqData.supplierName === supplierName)

            if (found) {
              const [reqUuid] = found
              decisions[reqUuid] = { decision, markedPrice }
            }
          }
        }

        if (decisions) {
          this.applyDecisions(draft, decisions)
        }

        if (visibility) {
          draft.visibilityInfo = {
            ...draft.visibilityInfo,
            ...visibility
          } as ProtocolVisibilityInfo
        }

        draft.data.procedureDecision.decision =
          procedureDecision || ('PROCEDURE_DECISION_HAPPENED' as ProcedureDecisionType)
        draft.data.procedureDecision.text = ''

        if (draft.data.procedureDecision.decision === 'PROCEDURE_DECISION_CANCELLED') {
          draft.data.winners = []

          if (draft.operation) {
            draft.operation.applyAllRequestUuid = []
          }
        }

        const saveResponse = await this.api.save(draft)
        draft.uuid = saveResponse.uuid

        const published = await this.api.publish(draft.uuid)

        return { saved: draft, published }
      }
    )
  }
}
