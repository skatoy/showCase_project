import { ProcedureListPage } from '#/pageObjects/Procedure/ProcedureListPage'
import { ProcedureOverviewTab } from '#/pageObjects/Procedure/ProcedureView/ProcedureOverviewTab'
import {
  CreateRebiddingBaseParamPage,
  EditRebiddingBaseParam
} from '#/pageObjects/RebbidingTrade/RebbidingTradeCreatePage'
import { Page } from '@playwright/test'
import { Tabs } from '#/components/Tabs'
import {
  CreateRebiddingAbsenteeParams,
  EditRebiddingAbsenteeParams
} from '#/pageObjects/RebbidingTrade/CreateRebiddingAbsenteeParams'
import {
  CreateRebiddingFaceToFaceParams,
  RebiddingFaceToFaceParams
} from '#/pageObjects/RebbidingTrade/CreateRebiddingFaceToFaceParam'
import { AcceptCritChangeModal } from '#/pageObjects/Modal/Modals'
import * as allure from 'allure-js-commons'

export type EditRebiddingParams =
  | {
      rebiddingType: 'Заочная'
      baseParams: EditRebiddingBaseParam
      absenteeParams: EditRebiddingAbsenteeParams
    }
  | {
      rebiddingType: 'Очная'
      baseParams: EditRebiddingBaseParam
      faceToFaceParams: RebiddingFaceToFaceParams
    }

export class EditRebidding {
  readonly page: Page
  readonly modal: AcceptCritChangeModal
  readonly rebidding: CreateRebiddingBaseParamPage
  readonly absentee: CreateRebiddingAbsenteeParams
  readonly faceToFace: CreateRebiddingFaceToFaceParams
  readonly grid: ProcedureListPage
  readonly procedureView: ProcedureOverviewTab
  readonly tab: Tabs

  constructor(page: Page) {
    this.page = page
    this.modal = new AcceptCritChangeModal(page)
    this.rebidding = new CreateRebiddingBaseParamPage(page)
    this.absentee = new CreateRebiddingAbsenteeParams(page)
    this.faceToFace = new CreateRebiddingFaceToFaceParams(page)
    this.grid = new ProcedureListPage(page)
    this.procedureView = new ProcedureOverviewTab(page)
    this.tab = new Tabs(page)
  }

  async editRebidding(params: EditRebiddingParams, procedureUuid: string) {
    await allure.step(`Редактировать переторжку: ${params.rebiddingType}`, async () => {
      await this.grid.goToProcedure(procedureUuid)
      await this.procedureView.editProcedure()

      switch (params.rebiddingType) {
        case 'Заочная': {
          await this.tab.selectTab('rebidding_step_edit')
          await this.rebidding.fillBaseParam(params.baseParams)
          await this.absentee.fillAbsenteeParam(params.absenteeParams)
          break
        }
        case 'Очная': {
          await this.tab.selectTab('rebidding_trade_step_edit')
          await this.rebidding.fillBaseParam(params.baseParams)
          await this.faceToFace.fillFaceToFaceParam(params.faceToFaceParams)
          break
        }
      }

      await this.rebidding.procedureMoveNextStep()
      await this.rebidding.procedurePublish()

      if (await this.modal.modal.window.isVisible()) {
        await this.modal.acceptCriticalChange()
      }
    })
  }
}
