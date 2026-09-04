import { ApplicationReviewParams } from '#/pageObjects/Procedure/ApplicationReview/ApplicationReviewAct'

export const defaultApplicationReviewData: ApplicationReviewParams = {
  create: {
    admitAll: false,
    supplierDecisions: [
      {
        name: '',
        decision: 'Допущен'
      }
    ]
  },
  view: {
    protocolView: undefined,
    supplierNameView: undefined,
    priceWinnerView: undefined
  },
  documents: {
    filesNames: [],
    fileBuffer: undefined,
    dropzoneIndex: undefined
  }
}
