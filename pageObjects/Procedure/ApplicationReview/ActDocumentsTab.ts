import { DocumentsConfig, Files } from '#/utils/files'
import { Tabs } from '#/components/Tabs'
import { Page } from '@playwright/test'
import * as allure from 'allure-js-commons'

export class ActDocumentTab {
  readonly page: Page
  readonly files: Files
  readonly tab: Tabs
  constructor(page: Page) {
    this.page = page
    this.files = new Files(page)
    this.tab = new Tabs(page)
  }

  async fillDocumentsRequest(config: DocumentsConfig) {
    await allure.step('Заполнить документы акта', async () => {
      await this.tab.selectTab('documents')
      await this.files.addFiles(config)
    })
  }
}
