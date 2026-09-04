import { ProtocolSavePayload } from '#/api/Protocol'

export const defaultApiSummingUpData: Omit<
  ProtocolSavePayload,
  'uuid' | 'procedureUuid' | 'version' | 'registryNumber'
> = {
  status: 'draft',
  type: 'pt_summing_up',
  publishedAt: null,
  visibilityInfo: {
    protocolForAllSuppliersVisibility: true,
    supplierNameVisibility: true,
    winnersPriceVisibility: true
  },
  data: {
    tableType: 'PROTOCOL_TABLE_TYPE_SHORT',
    procedureDecision: {
      decision: 'PROCEDURE_DECISION_HAPPENED',
      text: ''
    },
    requestDecisions: {},
    protocolPositions: {},
    documents: [],
    winners: []
  },
  operation: {
    applyAllRequestUuid: [],
    revokeAllRequestUuid: []
  }
}
