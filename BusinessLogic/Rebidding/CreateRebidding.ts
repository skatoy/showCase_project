import { ProcedureListPage } from '#/pageObjects/Procedure/ProcedureListPage'
import { ProcedureOverviewTab } from '#/pageObjects/Procedure/ProcedureView/ProcedureOverviewTab'
import { RebiddingAbsenteeParams } from '#/pageObjects/RebbidingTrade/CreateRebiddingAbsenteeParams'
import { RebiddingFaceToFaceParams } from '#/pageObjects/RebbidingTrade/CreateRebiddingFaceToFaceParam'
import {
  RebiddingBaseParam,
  CreateRebiddingBaseParamPage
} from '#/pageObjects/RebbidingTrade/RebbidingTradeCreatePage'
import { RebiddingSignetTextPage } from '#/pageObjects/SignetText/RebiddingSignetTextPage'
import { Page } from '@playwright/test'
import * as allure from 'allure-js-commons'

export type CreateRebiddingParams =
  | {
      rebiddingType: 'Заочная'
      baseParams: RebiddingBaseParam
      absenteeParams: RebiddingAbsenteeParams
    }
  | {
      rebiddingType: 'Очная'
      baseParams: RebiddingBaseParam
      faceToFaceParams: RebiddingFaceToFaceParams
    }

export class CreateRebidding {
  readonly page: Page
  readonly rebidding: CreateRebiddingBaseParamPage
  readonly grid: ProcedureListPage
  readonly procedureView: ProcedureOverviewTab
  readonly signetText: RebiddingSignetTextPage

  constructor(page: Page) {
    this.page = page
    this.rebidding = new CreateRebiddingBaseParamPage(page)
    this.grid = new ProcedureListPage(page)
    this.procedureView = new ProcedureOverviewTab(page)
    this.signetText = new RebiddingSignetTextPage(page)
  }

  async createRebidding(params: CreateRebiddingParams, procedureUuid: string) {
    await allure.step(`Создать переторжку: ${params.rebiddingType}`, async () => {
      await this.grid.goToProcedure(procedureUuid)
      await this.procedureView.waitStatus('Подведение итогов')
      await this.procedureView.goToRebidding()
      await this.rebidding.fillBaseParam(params.baseParams)

      switch (params.rebiddingType) {
        case 'Заочная': {
          const absentee = await this.rebidding.choiceAbsenteeRebidding()
          await absentee.fillAbsenteeParam(params.absenteeParams)
          break
        }
        case 'Очная': {
          const faceToFace = await this.rebidding.choiceFaceToFaceRebidding()
          await faceToFace.fillFaceToFaceParam(params.faceToFaceParams)
          break
        }
      }

      await this.rebidding.clickConfirmRebidding()
      await this.signetText.clickPublishRebidding()
    })
  }
}
