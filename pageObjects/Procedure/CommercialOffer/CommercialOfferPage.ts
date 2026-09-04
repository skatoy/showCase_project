import { Buttons } from '#/components/Buttons'
import { CompetitorViewBlock, CompetitorVisibleParams } from '#/pageObjects/Blocks/CompetitorViewBlock'
import {
  ProlongationByBestPriceParams,
  ProlongationByRequestParams,
  ProlongationBlock
} from '#/pageObjects/Blocks/ProlongationBlock'
import { Locator, Page } from '@playwright/test'
import { ActCreateTab } from '../ApplicationReview/ActCreateTab'
import { DurationLikeObject } from 'luxon'
import { Tabs } from '#/components/Tabs'
import { DateInput } from '#/components/DateInput'
import * as allure from 'allure-js-commons'

export type { CompetitorVisibleParams } from '#/pageObjects/Blocks/CompetitorViewBlock'
export type {
  ProlongationByBestPriceParams,
  ProlongationByRequestParams
} from '#/pageObjects/Blocks/ProlongationBlock'

export type CommercialOfferApplicationDecision = 'Допущен' | 'Отклонен'

export type CommercialOfferCreateParams = {
  admitAll: boolean
  supplierDecisions: {
    name: string
    decision: CommercialOfferApplicationDecision
  }[]
}

export type SupplierAdmitPositions = {
  supplierName: string
  allPosition?: boolean
  positions: string[]
}[]

type CommercialOfferParamsBase = {
  decisions?: CommercialOfferCreateParams
  admitPositions?: SupplierAdmitPositions
  viewApplication?: string
  checkSupplier?: string
  competitorVisible?: CompetitorVisibleParams
  end?: DurationLikeObject
  prolongationByRequest?: ProlongationByRequestParams
  prolongationByBestPrice?: ProlongationByBestPriceParams
}

export type EditCommercialOfferParams = CommercialOfferParamsBase

export type AnnounceCommercialOfferParams = CommercialOfferParamsBase & {
  end: DurationLikeObject
}

export class CommercialOfferPage {
  readonly page: Page
  readonly tab: Tabs
  readonly supplierViewTable: ActCreateTab
  readonly partialPositions: Locator
  readonly modalMoveBackButton: Buttons
  readonly competitorView: CompetitorViewBlock
  readonly endCommercialInput: DateInput
  readonly prolongation: ProlongationBlock
  readonly moveForwardButton: Buttons
  readonly publishButton: Buttons

  constructor(page: Page) {
    this.page = page
    this.tab = new Tabs(page)
    this.supplierViewTable = new ActCreateTab(page)
    this.partialPositions = this.page.getByTestId('icon-list')
    this.modalMoveBackButton = new Buttons(page.getByTestId('modal-move-back-btn'))
    this.competitorView = new CompetitorViewBlock(page)
    this.endCommercialInput = new DateInput(
      page.getByTestId('date-picker-dateEnd').getByRole('textbox')
    )
    this.prolongation = new ProlongationBlock(page)
    this.moveForwardButton = new Buttons(page.getByRole('button', { name: 'Далее' }))
    this.publishButton = new Buttons(page.getByRole('button', { name: 'Опубликовать' }))
  }

  async announceCommercialOfferPage(params: AnnounceCommercialOfferParams) {
    await allure.step('Заполнить форму объявления коммерческого предложения', async () => {
      await this.fillCommercialOfferParams(params)
    })
  }

  async editCommercialOfferPage(params: EditCommercialOfferParams) {
    await allure.step('Заполнить форму редактирования коммерческого предложения', async () => {
      await this.fillCommercialOfferParams(params)
    })
  }

  async fillCommercialOfferParams(params: EditCommercialOfferParams) {
    if (params.decisions) {
      await this.selectSupplierDecision(params.decisions)
    }

    if (params.viewApplication) {
      await this.supplierViewTable.viewApplication(params.viewApplication)
    }

    if (params.checkSupplier) {
      await this.supplierViewTable.checkSupplier(params.checkSupplier)
    }

    if (params.admitPositions) {
      await this.selectAdmitPositions(params.admitPositions)
    }

    if (params.competitorVisible) {
      await this.competitorView.selectViewCompetitorOffer(params.competitorVisible)
    }

    if (params.end) {
      await allure.step('Заполнить дату окончания этапа коммерческих предложений', async () => {
        await this.endCommercialInput.fill(params.end!)
      })
    }

    if (params.prolongationByRequest) {
      await this.prolongation.fillByRequest(params.prolongationByRequest)
    }

    if (params.prolongationByBestPrice) {
      await this.prolongation.fillByBestPrice(params.prolongationByBestPrice)
    }
  }

  // Таблица поставщиков — выбор решения по заявкам
  async selectSupplierDecision(decisionParams: CommercialOfferCreateParams) {
    await allure.step('Выбрать решение по поставщику', async () => {
      if (decisionParams.admitAll) {
        await this.supplierViewTable.clickAdmitAll()
      }

      if (decisionParams.supplierDecisions?.length) {
        for (const param of decisionParams.supplierDecisions) {
          await this.supplierViewTable.selectSupplierDecision(param.name, param.decision)
        }
      }
    })
  }

  // Допуск по позициям — открытие списка позиций поставщика
  async openSupplierPositionList(name: string) {
    await allure.step('Открыть допуск к позициям поставщика', async () => {
      const supplier = this.page
        .getByRole('table')
        .locator('tr')
        .filter({ has: this.page.getByText(name, { exact: true }) })
      await supplier.waitFor({ state: 'visible' })
      await supplier.locator(this.partialPositions).click()
    })
  }

  // Допуск по позициям
  async selectAdmitPositions(admitPositions: SupplierAdmitPositions) {
    await allure.step('Выбрать допуски для позиций', async () => {
      for (const supplier of admitPositions) {
        await this.openSupplierPositionList(supplier.supplierName)

        if (supplier.allPosition) {
          await this.page.getByTestId('checkbox-select-all-positions').click()
        }

        for (const position of supplier.positions) {
          await this.admitSpecificPosition(position)
        }

        await this.modalMoveBackButton.click()
      }
    })
  }

  // Допуск по позициям — выбор конкретной позиции
  async admitSpecificPosition(positionName: string) {
    await allure.step(`Выбрать допуск для позиции: ${positionName}`, async () => {
      const checkboxContainer = this.page
        .getByTestId('modal-body')
        .locator('tr', {
          has: this.page.getByText(positionName, { exact: true })
        })
        .locator('[data-cy^="checkbox-select-position-"]')
      const isChecked = await checkboxContainer.locator('[data-cy="checkbox-checked"]').isVisible()

      if (!isChecked) {
        await checkboxContainer.click()
      }
    })
  }

  // Переход к следующему шагу
  async procedureMoveNextStep() {
    await allure.step('Нажать: Далее', async () => {
      await this.moveForwardButton.click()
    })
  }

  // Публикация процедуры
  async procedurePublish() {
    await allure.step('Нажать: Опубликовать', async () => {
      await this.publishButton.click()
    })
  }
}
