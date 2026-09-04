import { PositionConfig } from '#/pageObjects/Request/RequestPositionTab'
import { QuestionAnswerData } from '#/pageObjects/Request/RequestQuestionnaireTab'
import { DocumentsConfig } from '#/utils/files'

export type RequestData = {
  requestUuid?: string
  positions: PositionConfig[]
  containerDocuments?: DocumentsConfig
  procedureDocuments?: DocumentsConfig
  questionary?: QuestionAnswerData[]
}

export const defaultRequestData: RequestData = {
  requestUuid: '',
  positions: [
    {
      clearOffer: false,
      positionName: 'Позиция 1',
      price: '100',
      vat: '22',
      positionRequirements: [],
      addictionRequirements: []
    }
  ],
  questionary: undefined,
  containerDocuments: undefined,
  procedureDocuments: undefined
}
