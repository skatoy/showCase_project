import { BrowserContext } from '@playwright/test'
import { ContainerByApi } from '#/api/Container'
import * as allure from 'allure-js-commons'

export type CancelLotsParams = {
  containerUuid: string
  procedureUuids: string[]
  reason?: string
}

export async function cancelLots(context: BrowserContext, params: CancelLotsParams) {
  return await allure.step(`API: Отменить лоты ${params.containerUuid}`, async () => {
    const { containerUuid, procedureUuids, reason = 'Отмена по требованию' } = params
    const containerApi = new ContainerByApi(context)

    return await containerApi.cancelLots(containerUuid, procedureUuids, reason)
  })
}
