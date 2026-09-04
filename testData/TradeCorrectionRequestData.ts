import { TradeCorrectionRequestParams } from '#/BusinessLogic/Request/TradeCorrectionRequest'

export const defaultTradeCorrectionRequestData: TradeCorrectionRequestParams = {
  autoCorrection: false,
  positions: [{ positionName: 'Позиция 1', price: '93.69' }]
}
