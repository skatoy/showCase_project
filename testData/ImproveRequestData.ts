import { ImproveDocumentOption, ImproveRequestOption } from '#/pageObjects/Modal/Modals'

export const defaultImproveDocumentData: ImproveDocumentOption = {
  dateEnd: { day: 1 },
  improveDocumentProcedure: {
    check: true,
    reason: 'Объективная причина'
  },
  improveDocumentForAllProcedures: {
    check: false,
    reason: ''
  },
  improvePosition: {
    positionRequirements: false,
    positionName: false,
    reason: ''
  }
}

export const defaultImproveRequestData: ImproveRequestOption = {
  improveType: 'Корректировка цен',
  dateEnd: { day: 1 },
  improveReason: 'Объективная причина',
  rebiddingAfter: false
}
