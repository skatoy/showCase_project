import { ApiInstance } from './ApiInstance'
import fs from 'fs/promises'
import * as allure from 'allure-js-commons'

export type ServiceType = 'request' | 'procedure' | 'protocol'

export type SaveFileResponse = {
  is_success: boolean
  data: {
    FileUuid: string
    Bucket: string
    FileName: string
    FileType: string
    FileSize: number
    Published: boolean
    Owner: string
    Organization: string
    EntityUuid: string
    EntityType: string
    EntityOwner: string
    LinkedVersions: any
    VirusScanID: string
    VirusScanStatus: number
    VirusScanAttempt: number
    VirusScanDescription: string
    UpdateAt: string
  }
}

export class FileApi extends ApiInstance {
  private prepareFormData(file: File | Blob | Buffer, fileName?: string): FormData {
    const formData = new FormData()
    let blob: Blob
    let finalName: string

    if (Buffer.isBuffer(file)) {
      blob = new Blob([new Uint8Array(file)], { type: 'application/octet-stream' })
      finalName = fileName || 'file'
    } else if (file instanceof File) {
      blob = file
      finalName = fileName || file.name
    } else {
      blob = file
      finalName = fileName || 'file'
    }

    formData.append('file', blob, finalName)

    return formData
  }

  private async uploadFile(url: string, file: File | Blob | Buffer, fileName?: string) {
    return await allure.step('API: File', async () => {
      const formData = this.prepareFormData(file, fileName)
      const response = await this.postMultipart(url, formData)

      return response.json()
    })
  }

  async uploadFileByService(
    serviceType: ServiceType,
    file: File | Blob | Buffer,
    fileName?: string
  ) {
    return await allure.step(`API: Загрузить файл в ${serviceType}`, async () => {
      const url = `/api/public/gate/grpc/v1/${serviceType}/saveFile`

      return this.uploadFile(url, file, fileName)
    })
  }

  async uploadFileByName(fileName: string, serviceType: ServiceType) {
    return await allure.step(`API: Загрузить файл ${fileName}`, async () => {
      const filePath = `./files/${fileName}`
      const buffer = await fs.readFile(filePath)

      return this.uploadFileByService(serviceType, buffer, fileName)
    })
  }

  private async removeFile(url: string, uuid: string) {
    return await allure.step('Удалить файл', async () => {
      const response = await this.delete(url, { uuid })

      return response.json()
    })
  }

  async removeFileByUuid(uuid: string, serviceType: ServiceType) {
    return await allure.step(`API: Удалить файл ${uuid}`, async () => {
      const url = `/api/public/gate/grpc/v1/${serviceType}/removeFile`

      return this.removeFile(url, uuid)
    })
  }
}
