import { ProtocolParams } from '#/pageObjects/Procedure/SummingUp/ProtocolPage'

export const defaultProtocolData: ProtocolParams = {
  decision: {
    decision: 'Закупка по лоту признана состоявшейся',
    winnerType: 'Без распределения объема',
    reason: undefined
  },
  status: {
    autoWinner: undefined,
    supplierDecisions: [{ name: '', decision: 'Победитель' }]
  }
}
