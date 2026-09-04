import { Buttons } from '#/components/Buttons'
import { Page } from '@playwright/test'
import { DecisionParams, ProtocolDecisionTab } from './ProtocolDecisionTab'
import { ParticipantStatusParams, ProtocolSupplierStatusTab } from './ProtocolParticipantStatusTab'
import { ProtocolVolumeControlTab, VolumeControlTabParams } from './ProtocolVolumeControlTab'
import { ProtocolViewOptionTab, ViewOption } from './ProtocolViewOptionTab'
import { ProtocolDocumentTab } from './ProtocolDocumentTab'
import { DocumentsConfig } from '#/utils/files'
import * as allure from 'allure-js-commons'

export type ProtocolParams = {
  decision: DecisionParams
  view?: ViewOption
  volumeControl?: VolumeControlTabParams
  status?: ParticipantStatusParams
  documents?: DocumentsConfig
}
export class ProtocolPage {
  readonly page: Page
  readonly decisionTab: ProtocolDecisionTab
  readonly statusTab: ProtocolSupplierStatusTab
  readonly volumeControl: ProtocolVolumeControlTab
  readonly viewTab: ProtocolViewOptionTab
  readonly documentsTab: ProtocolDocumentTab
  readonly redirectToPublishProtocol: Buttons

  constructor(page: Page) {
    this.page = page
    this.decisionTab = new ProtocolDecisionTab(page)
    this.statusTab = new ProtocolSupplierStatusTab(page)
    this.volumeControl = new ProtocolVolumeControlTab(page)
    this.viewTab = new ProtocolViewOptionTab(page)
    this.documentsTab = new ProtocolDocumentTab(page)
    this.redirectToPublishProtocol = new Buttons(
      page.getByTestId('redirect-to-publish-btn'),
      'Перейти к публикации протокола'
    )
  }

  async fillProtocol(params: ProtocolParams) {
    await allure.step('Заполнить протокол подведения итогов', async () => {
      await this.decisionTab.fillDecisionTab(params.decision)

      if (params.status) {
        await this.statusTab.fillParticipantStatusTab(params.status)
      }

      if (params.volumeControl) {
        await this.volumeControl.fillVolumeControlTab(params.volumeControl)
      }

      if (params.view) {
        await this.viewTab.fillViewTab(params.view)
      }

      if (params.documents) {
        await this.documentsTab.fillDocumentsTab(params.documents)
      }
    })
  }

  async goToSignetText() {
    await allure.step('Перейти к публикации протокола', async () => {
      await this.redirectToPublishProtocol.click()
    })
  }
}
