import { ApplicationReviewPayload } from '#/api/Protocol'

export const defaultApiApplicationReviewData: Omit<
  ApplicationReviewPayload,
  'uuid' | 'procedureUuid'
> = {
  visibilityInfo: {
    protocolForAllSuppliersVisibility: true,
    supplierNameVisibility: true,
    winnersPriceVisibility: true
  },
  data: {
    requestDecisions: {},
    documents: []
  }
}
