import { ApiInstance } from './ApiInstance'
import * as allure from 'allure-js-commons'

export type ProcedureType =
  | 'POSITIONS_TENDER'
  | 'QUOTATION_REQUEST'
  | 'POSITIONS_TENDER_TECH_OFFERS'
  | 'SINGLE_PRICES_PURCHASE'

export type PayloadContainerSave = {
  uuid?: string
  departmentUuid?: string
  departmentRole?: 'head' | 'manager' | 'employee' | ''
  type: ProcedureType
  title: string
  typeCustomName?: string
  documents?: any[]
  documentsConfig?: any[]
}

export type SaveContainerResponse = {
  success: true
  uuid: string
}

export type CancelLotsRequest = {
  procedureUuids: string[]
  cancelReason: string
}

export class ContainerByApi extends ApiInstance {
  async createContainer({
    uuid = '',
    departmentUuid = '',
    departmentRole = '',
    type,
    typeCustomName = '',
    title,
    documents = [],
    documentsConfig = []
  }: PayloadContainerSave) {
    return await allure.step(`API: Создать контейнер "${title}"`, async () => {
      const response = await this.post('/api/public/gate/grpc/v1/container/save', {
        uuid,
        departmentUuid,
        departmentRole,
        type,
        typeCustomName,
        title,
        documents,
        documentsConfig
      })

      return response.json()
    })
  }

  async saveContainer(payload: PayloadContainerSave) {
    return await allure.step(`API: Сохранить контейнер "${payload.title}"`, async () => {
      const response = await this.post('/api/public/gate/grpc/v1/container/save', payload)

      return response.json()
    })
  }

  async publishContainer(containerUuid: string) {
    return await allure.step(`API: Опубликовать контейнер ${containerUuid}`, async () => {
      const response = await this.post(
        `/api/public/gate/grpc/v1/container/publish/${containerUuid}`,
        {}
      )

      return response.json()
    })
  }

  async getContainer(containerUuid: string) {
    return await allure.step(`API: Получить контейнер ${containerUuid}`, async () => {
      const response = await this.get(`/api/public/gate/grpc/v1/container/get/${containerUuid}`, {})

      return await response.json()
    })
  }

  async getContainerDraft(containerUuid: string) {
    return await allure.step(`API: Получить черновик контейнера ${containerUuid}`, async () => {
      const response = await this.get(
        `/api/public/gate/grpc/v1/container/getdraft/${containerUuid}`,
        {}
      )

      return await response.json()
    })
  }

  async cancelLots(containerUuid: string, procedureUuids: string[], cancelReason: string) {
    return await allure.step(`API: Отменить лоты контейнера ${containerUuid}`, async () => {
      const response = await this.post(
        `/api/public/gate/grpc/v1/container/cancel/${containerUuid}`,
        {
          procedureUuids,
          cancelReason
        }
      )

      return response.json()
    })
  }
}
