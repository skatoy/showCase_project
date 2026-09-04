import { RebiddingPositionConfig } from '#/pageObjects/Request/RequestPositionTab'
import { DocumentsConfig } from '#/utils/files'

export type AbsenteeRequestData = {
  positions: RebiddingPositionConfig[]
  rebiddingDocuments?: DocumentsConfig
}

export const defaultAbsenteeRequestData: AbsenteeRequestData = {
  positions: [
    {
      positionName: 'Позиция 1',
      price: '99'
    }
  ]
}
