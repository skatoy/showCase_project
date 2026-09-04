import { Buttons } from '#/components/Buttons'
import { DocumentsConfig, Files } from '#/utils/files'
import { Tabs } from '#/components/Tabs'
import { Page } from '@playwright/test'
import * as allure from 'allure-js-commons'

export class ProtocolDocumentTab {
  readonly page: Page
  readonly files: Files
  readonly tab: Tabs
  readonly saveButton: Buttons

  constructor(page: Page) {
    this.page = page
    this.tab = new Tabs(page)
    this.files = new Files(page)
    this.saveButton = new Buttons(page.getByTestId('save-protocol-btn'))
  }

  async fillDocumentsTab(config: DocumentsConfig) {
    await allure.step('Заполнить документы протокола', async () => {
      await this.tab.selectTab('documents')
      await this.files.addFiles(config)
      await this.saveProtocol()
    })
  }

  async saveProtocol() {
    await allure.step('Сохранить документы протокола', async () => {
      await this.saveButton.click()
    })
  }
}
