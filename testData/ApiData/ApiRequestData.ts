import { ApiRequestParams } from '#/api/ApiCreateRequest'

export const defaultApiRequestData: ApiRequestParams = {
  procedureUuid: '',
  supplierUuid: '',
  saveRequest: {
    documentList: [],
    containerDocumentList: [],
    commercialOffersDocuments: [],
    rebiddingOffersDocuments: [],
    questionList: [],
    currency: 'RUB',
    isCurrencyByPosition: false
  },
  positions: [
    {
      customTitle: '',
      price: '100',
      quantity: '10',
      analogs: [],
      vatPercent: '22',
      requirementList: [],
      currency: 'RUB'
    }
  ]
}
