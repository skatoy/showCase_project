import { CreateRebiddingParams } from '#/BusinessLogic/Rebidding/CreateRebidding'

export const defaultRebiddingData: CreateRebiddingParams = {
  rebiddingType: 'Заочная',
  baseParams: {
    suppliersAdmits: []
  },
  absenteeParams: {
    rebiddingEnd: { minutes: 2 }
  }
}
