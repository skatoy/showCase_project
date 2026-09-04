import { ProcedureByApi } from '#/api/Procedure'
import { ContainerByApi } from '#/api/Container'
import { BrowserContext } from '@playwright/test'
import * as allure from 'allure-js-commons'

export type ProcedureUpdatesParam = Partial<{
  title: string
  deliveryAddress: string
  deliveryCondition: string
  deliveryDate: string
  positionControl: string
  volumeControl: string
  currency: string
  isWithoutPrice: boolean
  allowOfferHigherLotPrice: boolean
  isCustomerContactsHidden: boolean
  allowedSuppliers?: SupplierParticipant[]
  steps?: any[]
}>

export type ContainerUpdatesParam = {
  title?: string
  typeCustomName?: string
  departmentUuid?: string
  departmentRole?: 'head' | 'manager' | 'employee' | ''
  documents?: any[]
}

export type UpdateParams = {
  procedureUpdates?: ProcedureUpdatesParam
  containerUpdates?: ContainerUpdatesParam
  positions?: any[]
  stepUpdates?: {
    stepCode: string
    updates: { dateStart?: string; dateEnd?: string; name?: string }
  }
  validateForPublish?: boolean
}

export type SupplierParticipant = {
  fullName: string
  inn: string
  kpp: string
  contactEmail: string[]
  source: string
}

export async function updateProcedure(
  context: BrowserContext,
  procedureUuid: string,
  containerUuid: string,
  params: UpdateParams
) {
  await allure.step(`API: Обновить закупку ${procedureUuid || containerUuid}`, async () => {
    const {
      procedureUpdates,
      containerUpdates,
      positions: newPositions,
      stepUpdates,
      validateForPublish = true
    } = params

    const procedureApi = new ProcedureByApi(context)
    const containerApi = new ContainerByApi(context)

    if (containerUpdates && Object.keys(containerUpdates).length > 0) {
      const container = await containerApi.getContainer(containerUuid)

      const containerPayload = {
        uuid: container.uuid,
        departmentUuid: container.departmentUuid || '',
        departmentRole: container.departmentRole || '',
        type: container.type,
        typeCustomName: container.typeCustomName || '',
        title: container.containerInfo?.title || '',
        documents: container.containerInfo?.documents || [],
        documentsConfig: container.containerInfo?.documentsConfig || []
      }

      Object.assign(containerPayload, containerUpdates)
      await containerApi.saveContainer(containerPayload)
    }

    const procedure = await procedureApi.getProcedureDraft(procedureUuid)

    const positionsResponse = await procedureApi.getPositions(procedureUuid, {
      offset: 0,
      limit: 100,
      isDraft: true,
      filters: []
    })
    const positionsFromApi = positionsResponse.positions || []

    let updatedProcedureInfo = {
      ...procedure.procedureInfo,
      positions: positionsFromApi
    }

    if (procedureUpdates && Object.keys(procedureUpdates).length > 0) {
      updatedProcedureInfo = {
        ...updatedProcedureInfo,
        ...procedureUpdates
      }
    }

    if (stepUpdates) {
      const targetStep = updatedProcedureInfo.steps?.find(
        (step: any) => step.code === stepUpdates.stepCode
      )
      Object.assign(targetStep, stepUpdates.updates)
    }

    const savePayload = {
      uuid: procedure.uuid,
      type: procedure.type,
      version: procedure.version,
      containerUuid: containerUuid,
      procedureInfo: updatedProcedureInfo,
      validateForPublish: validateForPublish
    }
    await procedureApi.saveProcedure(savePayload as any)

    if (newPositions && newPositions.length > 0) {
      await procedureApi.createPosition({
        uuid: procedureUuid,
        validateForPublish: validateForPublish,
        positions: newPositions
      })
    }

    await containerApi.publishContainer(containerUuid)
  })
}

export async function updateStepSimple(
  context: BrowserContext,
  procedureUuid: string,
  containerUuid: string,
  stepCode: string,
  updates: { dateStart?: string; dateEnd?: string; name?: string }
) {
  await allure.step(`API: Обновить этап ${stepCode}`, async () => {
    await updateProcedure(context, procedureUuid, containerUuid, {
      stepUpdates: { stepCode, updates }
    })
  })
}

export async function updatePositions(
  context: BrowserContext,
  procedureUuid: string,
  positions: any[],
  validateForPublish: boolean = true
) {
  await allure.step(`API: Обновить позиции лота ${procedureUuid}`, async () => {
    await updateProcedure(context, procedureUuid, '', {
      positions,
      validateForPublish
    })
  })
}

export async function updateContainerTitle(
  context: BrowserContext,
  containerUuid: string,
  newTitle: string
) {
  await allure.step(`API: Обновить наименование контейнера: ${newTitle}`, async () => {
    await updateProcedure(context, '', containerUuid, {
      containerUpdates: { title: newTitle }
    })
  })
}
