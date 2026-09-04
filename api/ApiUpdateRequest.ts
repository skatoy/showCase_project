import { RequestByApi, SaveRequestBody } from '#/api/Request'
import { FileUploader } from '#/api/ApiUploadFile'
import { BrowserContext } from '@playwright/test'
import * as allure from 'allure-js-commons'

export type RequestUpdatesParam = Partial<{
  currency: string
  isCurrencyByPosition: boolean
  documentList: any[]
  containerDocumentList: any[]
  commercialOffersDocuments: any[]
  rebiddingOffersDocuments: any[]
  questionList: any[]
}>

export type RequestPositionUpdateParam = {
  uuid?: string
  customTitle?: string
  quantity?: string
  price?: string
  currency?: string
  vatPercent?: string
  requirementList?: any[]
  analogs?: any[]
}

export type FileUpdateParam = {
  field:
    | 'documentList'
    | 'containerDocumentList'
    | 'commercialOffersDocuments'
    | 'rebiddingOffersDocuments'
  fileNames: string[]
  config?: any
}

export type UpdateRequestParams = {
  requestUuid: string
  requestUpdates?: RequestUpdatesParam
  positions?: RequestPositionUpdateParam[]
  files?: FileUpdateParam[]
  autoPublish?: boolean
}

export async function updateRequestData(
  context: BrowserContext,
  requestUuid: string,
  updates: RequestUpdatesParam
) {
  await allure.step(`API: Обновить данные заявки ${requestUuid}`, async () => {
    const requestApi = new RequestByApi(context)
    const currentRequest = await requestApi.getRequest(requestUuid)

    const updatedData: SaveRequestBody = {
      ...currentRequest,
      ...updates
    }

    await requestApi.createDraftRequest(requestUuid, updatedData)
  })
}
export async function updateRequestPositions(
  context: BrowserContext,
  requestUuid: string,
  positions: RequestPositionUpdateParam[]
) {
  await allure.step(`API: Обновить позиции заявки ${requestUuid}`, async () => {
    const requestApi = new RequestByApi(context)

    const positionsResponse = await requestApi.getRequestPosition(requestUuid, {
      filters: [],
      isDraft: true,
      limit: 100,
      offset: 0
    })

    const existingPositions = positionsResponse.positions || []

    for (let i = 0; i < existingPositions.length && i < positions.length; i++) {
      const position = existingPositions[i]
      const positionData = positions[i]
      await requestApi.savePosition(position.uuid, {
        ...positionData,
        request_uuid: requestUuid
      })
    }
  })
}

export async function uploadAndAttachFiles(
  context: BrowserContext,
  requestUuid: string,
  files: FileUpdateParam[]
) {
  await allure.step('API: And Attach Files', async () => {
    const requestApi = new RequestByApi(context)
    const uploader = new FileUploader(context, 'request')
    const currentRequest = await requestApi.getRequest(requestUuid)
    const updates: any = {}

    for (const fileConfig of files) {
      const uploadedFiles = await uploader.uploadFilesByNames(fileConfig.fileNames)
      const documents = uploader.getDocuments(uploadedFiles)

      if (fileConfig.field === 'documentList' || fileConfig.field === 'containerDocumentList') {
        const group =
          fileConfig.field === 'documentList'
            ? uploader.createProcedureGroup(fileConfig.config, uploadedFiles)
            : uploader.createContainerGroup(fileConfig.config, uploadedFiles)
        updates[fileConfig.field] = [group]
      } else {
        updates[fileConfig.field] = documents
      }
    }

    const updatedData: SaveRequestBody = {
      ...currentRequest,
      ...updates
    }
    await requestApi.createDraftRequest(requestUuid, updatedData)
  })
}

export async function updateRequest(context: BrowserContext, params: UpdateRequestParams) {
  await allure.step('API: Request', async () => {
    const { requestUuid, requestUpdates, positions, files, autoPublish = false } = params
    const requestApi = new RequestByApi(context)

    if (files && files.length > 0) {
      await uploadAndAttachFiles(context, requestUuid, files)
    }

    if (requestUpdates && Object.keys(requestUpdates).length > 0) {
      await updateRequestData(context, requestUuid, requestUpdates)
    }

    if (positions && positions.length > 0) {
      await updateRequestPositions(context, requestUuid, positions)
    }

    if (autoPublish) {
      await requestApi.publishRequest(requestUuid)
    }
  })
}
