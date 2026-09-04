import { Buttons } from '#/components/Buttons'
import { Page } from '@playwright/test'
import { ActDocumentTab } from './ActDocumentsTab'
import { ActViewOptionTab, ViewOption } from './ActViewOptionTab'
import { ActCreateTab, CreateActParams } from './ActCreateTab'
import { DocumentsConfig } from '#/utils/files'
import * as allure from 'allure-js-commons'

export type ApplicationReviewParams = {
  create?: CreateActParams
  view?: ViewOption
  documents?: DocumentsConfig
}
export class ApplicationReviewAct {
  readonly page: Page
  readonly goToSignetTestButton: Buttons
  readonly saveButton: Buttons
  readonly createTab: ActCreateTab
  readonly viewOptionTab: ActViewOptionTab
  readonly documents: ActDocumentTab
  constructor(page: Page) {
    this.page = page
    this.goToSignetTestButton = new Buttons(page.getByTestId('go-to-publish-btn'))
    this.saveButton = new Buttons(page.getByRole('button', { name: 'Сохранить', exact: true }))
    this.createTab = new ActCreateTab(page)
    this.viewOptionTab = new ActViewOptionTab(page)
    this.documents = new ActDocumentTab(page)
  }

  async goToSignedText() {
    await allure.step('Перейти на страницу подписания', async () => {
      await this.goToSignetTestButton.click()
    })
  }

  async save() {
    await allure.step('Сохранить акт', async () => {
      await this.saveButton.click()
    })
  }

  async fillApplicationReviewPage(params: ApplicationReviewParams) {
    await allure.step('Заполнить страницу акта рассмотрения заявок', async () => {
      if (params.create) {
        await this.createTab.fillActCreateTab(params.create)
      }

      if (params.view) {
        await this.viewOptionTab.fillViewTab(params.view)
      }

      if (params.documents) {
        await this.documents.fillDocumentsRequest(params.documents)
      }
    })
  }
}
