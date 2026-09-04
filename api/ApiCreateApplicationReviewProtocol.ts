import {
  ProtocolByApi,
  ProtocolVisibilityInfo,
  RequestDecisionType,
  ApplicationReviewDecision
} from '#/api/Protocol'
import * as allure from 'allure-js-commons'

export class ApiApplicationReviewProtocol {
  private api: ProtocolByApi

  constructor(context: any) {
    this.api = new ProtocolByApi(context)
  }

  async publishReview(
    procedureUuid: string,
    decisionsByName?: { supplierName: string; decision: RequestDecisionType }[],
    visibility?: Partial<ProtocolVisibilityInfo>
  ) {
    return await allure.step(`API: Опубликовать акт рассмотрения ${procedureUuid}`, async () => {
      const draft = await this.api.getReviewDraft(procedureUuid)

      if (decisionsByName) {
        const requestEntries = Object.entries(draft.data.requestDecisions) as [
          string,
          ApplicationReviewDecision
        ][]

        for (const { supplierName, decision } of decisionsByName) {
          const foundEntry = requestEntries.find(entry => entry[1].supplierName === supplierName)

          if (foundEntry) {
            const requestUuid = foundEntry[0]
            draft.data.requestDecisions[requestUuid].decision = decision
          }
        }
      }

      if (visibility) {
        draft.visibilityInfo = { ...draft.visibilityInfo, ...visibility } as ProtocolVisibilityInfo
      }

      const saveResponse = await this.api.saveReview(draft)
      draft.uuid = saveResponse.uuid
      const published = await this.api.publish(draft.uuid)

      return { published }
    })
  }
}
