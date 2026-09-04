import { FileApi, ServiceType } from '#/api/FileService'
import { BrowserContext } from '@playwright/test'
import * as allure from 'allure-js-commons'

export type UploadedFileInfo = {
  uuid: string
  name: string
  size: number
  type: string
}

export type DocumentGroup = {
  procedureConfig?: any
  procedureContainerConfig?: any
  documents: any[]
}

export class FileUploader {
  private fileApi: FileApi
  private serviceType: ServiceType

  private static readonly defaultDocumentData = {
    uuid: '',
    name: '',
    size: 0,
    type: '',
    externalUrl: '',
    isPublished: false,
    _isNotLinked: true,
    service: '' as ServiceType
  }

  constructor(context: BrowserContext, serviceType: ServiceType) {
    this.fileApi = new FileApi(context)
    this.serviceType = serviceType
  }

  async uploadFilesByNames(fileNames: string[]): Promise<UploadedFileInfo[]> {
    return await allure.step(`API: Загрузить файлы: ${fileNames.join(', ')}`, async () => {
      const results: UploadedFileInfo[] = []

      for (const fileName of fileNames) {
        const response = await this.fileApi.uploadFileByName(fileName, this.serviceType)
        const data = response.data
        results.push({
          uuid: data.FileUuid,
          name: data.FileName,
          size: data.FileSize,
          type: data.FileType
        })
      }

      return results
    })
  }

  getDocuments(files: UploadedFileInfo[]): (typeof FileUploader.defaultDocumentData)[] {
    return files.map(file => ({
      ...FileUploader.defaultDocumentData,
      uuid: file.uuid,
      name: file.name,
      size: file.size,
      type: file.type,
      externalUrl: `api/public/gate/grpc/v1/${this.serviceType}/getFile?uuid=${file.uuid}`,
      service: this.serviceType
    }))
  }

  createProcedureGroup(procedureConfig: any, files: UploadedFileInfo[]): DocumentGroup {
    return {
      procedureConfig,
      documents: this.getDocuments(files)
    }
  }

  createContainerGroup(containerConfig: any, files: UploadedFileInfo[]): DocumentGroup {
    return {
      procedureContainerConfig: containerConfig,
      documents: this.getDocuments(files)
    }
  }

  createDocumentArray(files: UploadedFileInfo[]): any[] {
    return this.getDocuments(files)
  }
}
