import { ProcedureListPage } from '#/pageObjects/Procedure/ProcedureListPage'
import { ProcedureOverviewTab } from '#/pageObjects/Procedure/ProcedureView/ProcedureOverviewTab'
import { ProtocolPage, ProtocolParams } from '#/pageObjects/Procedure/SummingUp/ProtocolPage'
import { ProtocolSignetTextPage } from '#/pageObjects/SignetText/ProtocolSignetTextPage'
import { Page } from '@playwright/test'
import * as allure from 'allure-js-commons'

export type ProtocolCreateOptions = {
  beforePublish?: () => Promise<void>
  skipFillProtocol?: boolean
}

export class ProcedureSummingUp {
  readonly page: Page
  readonly grid: ProcedureListPage
  readonly procedureView: ProcedureOverviewTab
  readonly protocol: ProtocolPage
  readonly signetText: ProtocolSignetTextPage

  constructor(page: Page) {
    this.page = page
    this.grid = new ProcedureListPage(page)
    this.procedureView = new ProcedureOverviewTab(page)
    this.protocol = new ProtocolPage(page)
    this.signetText = new ProtocolSignetTextPage(page)
  }

  async createProtocol(
    protocolParams: ProtocolParams,
    procedureUuid: string,
    options?: ProtocolCreateOptions
  ) {
    await allure.step('Подвести итоги закупки', async () => {
      await this.grid.goToProcedure(procedureUuid)
      await this.procedureView.waitCountDownTimer()
      await this.procedureView.goToProtocolPage()
      await this.protocol.fillProtocol(protocolParams)

      if (!options?.skipFillProtocol) {
        await this.protocol.goToSignetText()
      }

      await this.signetText.publishSummingUpProtocol()
    })
  }
}
