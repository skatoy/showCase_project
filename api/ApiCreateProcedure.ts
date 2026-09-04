import { BrowserContext } from '@playwright/test'
import { ContainerByApi, PayloadContainerSave } from '#/api/Container'
import { ProcedureByApi, Step } from '#/api/Procedure'
import * as allure from 'allure-js-commons'

export type LotParams = {
  procedureInfo: {
    title: string
    steps: Step[]
  }
  positions: any[]
}

export type ContainerParams = LotParams & {
  container: PayloadContainerSave
  validateForPublish?: boolean
  additionalLots?: LotParams[]
}

export type ProcedureConfigs = {
  procedureConfig: any
  containerConfig: any
}

export type CreateProcedureResult = {
  containerUuid: string
  procedureUuid: string
  procedureUuids: string[]
  containerData: any
  containerTitle: string
  procedureTitle: string
  configs: ProcedureConfigs
}

export class ApiCreateProcedure {
  private containerApi: ContainerByApi
  private procedureApi: ProcedureByApi

  constructor(context: BrowserContext) {
    this.containerApi = new ContainerByApi(context)
    this.procedureApi = new ProcedureByApi(context)
  }

  async createProcedure(data: ContainerParams): Promise<CreateProcedureResult> {
    return await allure.step(`API: Создать закупку: ${data.procedureInfo.title}`, async () => {
      const container = await this.containerApi.createContainer(data.container)
      const containerUuid = container.uuid

      const procedurePayload = {
        type: data.container.type,
        containerUuid,
        procedureInfo: {
          ...data.procedureInfo,
          title: data.procedureInfo.title,
          steps: data.procedureInfo.steps
        }
      }
      const procedure = await this.procedureApi.createProcedure(procedurePayload)
      const procedureUuid = procedure.uuid
      const procedureUuids = [procedureUuid]

      await this.saveLotPositions(procedureUuid, data.positions, data.validateForPublish)

      for (const lot of data.additionalLots ?? []) {
        const extraLot = await this.procedureApi.createProcedure({
          type: data.container.type,
          containerUuid,
          procedureInfo: {
            ...lot.procedureInfo,
            title: lot.procedureInfo.title,
            steps: lot.procedureInfo.steps
          }
        })
        procedureUuids.push(extraLot.uuid)
        await this.saveLotPositions(extraLot.uuid, lot.positions, data.validateForPublish)
      }

      await this.containerApi.publishContainer(containerUuid)

      const containerData = await this.containerApi.getContainer(containerUuid)
      const procedureData = await this.procedureApi.getProcedure(procedureUuid)

      const procedureConfig = procedureData.procedureInfo.documentsConfig?.find(
        (procedureConfig: any) => procedureConfig.name === 'Документы лота'
      )
      const containerConfig = containerData.containerInfo.documentsConfig?.find(
        (containerConfig: any) =>
          containerConfig.name === 'Документы для подачи заявки на каждый лот'
      )

      return {
        containerUuid,
        procedureUuid,
        procedureUuids,
        containerData,
        containerTitle: data.container.title,
        procedureTitle: data.procedureInfo.title,
        configs: {
          procedureConfig,
          containerConfig
        }
      }
    })
  }

  private async saveLotPositions(
    procedureUuid: string,
    positions: any[] | undefined,
    validateForPublish?: boolean
  ) {
    await allure.step('API: Lot Positions', async () => {
      if (!positions?.length) {
        return
      }

      for (const position of positions) {
        await this.procedureApi.createPosition({
          uuid: procedureUuid,
          positions: [position],
          validateForPublish: validateForPublish ?? false
        })
      }
    })
  }
}
