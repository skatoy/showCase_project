import { Locator, Page } from '@playwright/test'
import { DocumentsConfig, Files } from '#/utils/files'
import { Tabs } from '#/components/Tabs'
import * as allure from 'allure-js-commons'

export class RequestDocumentsTab {
  readonly page: Page
  readonly files: Files
  readonly tab: Tabs
  readonly containerDocumentsBlock: Locator
  readonly procedureDocumentsBlock: Locator
  readonly rebiddingDocumentsBlock: Locator
  constructor(page: Page) {
    this.page = page
    this.tab = new Tabs(page)
    this.files = new Files(page)
    this.containerDocumentsBlock = page.getByTestId('container-documents-block')
    this.procedureDocumentsBlock = page.getByTestId('procedure-documents-block')
    this.rebiddingDocumentsBlock = page.getByTestId('rebidding-documents-block')
  }

  async fillDocumentsRequest(config: DocumentsConfig) {
    await allure.step('Заполнить документы заявки', async () => {
      await this.tab.selectTab('documents')
      await this.files.addFiles(config)
    })
  }

  async fillContainerDocumentsBlock(config: DocumentsConfig) {
    await allure.step('Заполнить документы контейнера', async () => {
      await this.tab.selectTab('documents')
      await this.files.addFiles(config, this.containerDocumentsBlock)
    })
  }

  async fillProcedureDocumentsBlock(config: DocumentsConfig) {
    await allure.step('Заполнить документы лота', async () => {
      await this.tab.selectTab('documents')
      await this.files.addFiles(config, this.procedureDocumentsBlock)
    })
  }

  async fillRebiddingDocumentsBlock(config: DocumentsConfig) {
    await allure.step('Заполнить документы переторжки', async () => {
      await this.tab.selectTab('documents')
      await this.files.addFiles(config, this.rebiddingDocumentsBlock)
    })
  }
}
