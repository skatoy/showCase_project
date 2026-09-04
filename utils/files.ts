import { Locator, Page, expect } from '@playwright/test'
import { DateTime } from 'luxon'
import * as allure from 'allure-js-commons'

export type FileBufferForUpload = {
  buffer: Buffer
  mimeType: string
  name: string
}

export type DocumentsConfig = {
  filesNames: string[]
  fileBuffer?: FileBufferForUpload
  dropzoneIndex?: number
}

export const checkArchiveDownload = async (
  page: Page,
  downloadBtn: Locator,
  getFileName: () => string
) => {
  await allure.step('Проверить скачивание архива', async () => {
    const downloadPromise = page.waitForEvent('download')
    await downloadBtn.click()
    const download = await downloadPromise
    const savedFileName = download.suggestedFilename()
    await expect(savedFileName).toContain(getFileName())
  })
}

export class Files {
  readonly page: Page
  readonly documentsDropzone: Locator
  constructor(
    page: Page,
    private element?: Locator
  ) {
    this.page = page
    this.documentsDropzone = page.getByTestId('dropzone')
  }

  locator(selector: string) {
    return this.element ? this.element.locator(selector) : this.page.locator(selector)
  }

  buttonDownloadFile() {
    return this.locator('[data-cy="file-model-uploaded"] [data-cy="icon-download"]')
  }

  addedFileBlock() {
    return this.locator('[data-cy="file-model-uploaded"]')
  }

  async checkArchiveDownload(organizationShortName: string, registryAndLotNumber: string) {
    await allure.step('Проверить скачивание архива документов', async () => {
      const checkArchiveDownloadFile = checkArchiveDownload
      await checkArchiveDownloadFile(
        this.page,
        this.downloadArchiveBtn(),
        // без минут т.к. точно не известно когда сформируется архив
        () =>
          `${registryAndLotNumber}_${organizationShortName
            .slice(0, 49)
            .replace(
              /[^a-zA-Zа-яёА-ЯЁ\-0-9\s]/g,
              '_'
            )} Документы для участия в ${DateTime.now().toFormat('dd-MM-yyyy HH-')}`
      )
    })
  }

  async clickDownload(fileIndex = 0) {
    await allure.step('Нажать: Скачать', async () => {
      await this.addedFileBlock().nth(fileIndex).hover()
      await this.buttonDownloadFile().nth(fileIndex).isVisible()
      await this.buttonDownloadFile().nth(fileIndex).click()
    })
  }

  async addFiles(config: DocumentsConfig, block?: Locator) {
    const { filesNames, fileBuffer, dropzoneIndex = 0 } = config
    const attached = fileBuffer?.name ?? filesNames.join(', ')
    await allure.step(`Прикрепить файл: ${attached}`, async () => {
      const elementContext = block || this.page
      const uploadFileName = this.page.getByTestId('file-name')
      const dropzone = elementContext.getByTestId('dropzone').nth(dropzoneIndex)
      const fileInput = dropzone.locator('input[type="file"]')

      if (fileBuffer) {
        await fileInput.setInputFiles(fileBuffer)

        if (fileBuffer.name) {
          await uploadFileName.filter({ hasText: fileBuffer.name }).waitFor({ state: 'visible' })
        }
      } else {
        const filePaths = filesNames.map(fileName => `./files/${fileName}`)
        await fileInput.setInputFiles(filePaths)

        for (const fileName of filesNames) {
          await uploadFileName.filter({ hasText: fileName }).waitFor({ state: 'visible' })
        }
      }
    })
  }

  async addFilesToAllDropzones(config: DocumentsConfig, block?: Locator) {
    await allure.step('Прикрепить файлы во все зоны загрузки', async () => {
      const context = block || this.page
      const dropzones = context.getByTestId('dropzone')
      const count = await dropzones.count()

      for (let i = 0; i < count; i++) {
        await this.addFiles({ ...config, dropzoneIndex: i }, block)
      }
    })
  }

  async checkFileSuccessDownloaded(initDownloadCb: () => Promise<void>, getFileName: () => string) {
    await allure.step('Проверить успешное скачивание файла', async () => {
      const downloadPromise = this.page.waitForEvent('download')
      await initDownloadCb()
      const fileName = getFileName()
      const download = await downloadPromise
      await download.saveAs(`e2e/downloads/${fileName}`)
      const savedFileName = download.suggestedFilename()
      await expect(savedFileName).toContain(fileName)
    })
  }

  downloadArchiveBtn() {
    return this.page.locator('[data-cy="download-archive-btn"]')
  }
}
