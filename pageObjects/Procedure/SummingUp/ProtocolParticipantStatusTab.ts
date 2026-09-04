import { Buttons } from '#/components/Buttons'

import { Select } from '#/components/Select'

import { Tabs } from '#/components/Tabs'

import { TextInput } from '#/components/TextInput'

import { Page, Locator } from '@playwright/test'
import * as allure from 'allure-js-commons'

export type SupplierDecision = 'Допущен' | 'Не допущен' | 'Победитель'

export type ParticipantStatusParams = {
  autoWinner?: string

  supplierDecisions: {
    name: string

    decision: SupplierDecision
  }[]
}

export class ProtocolSupplierStatusTab {
  readonly page: Page

  readonly tab: Tabs

  readonly autoChoiceWinnerButton: Buttons

  readonly supplierControlTab: Locator

  readonly applicationViewIcon: Locator

  readonly dragonDropWinnerIcon: Locator

  readonly supplierDecisionSelect: Locator

  readonly supplierCheckIcon: Locator

  readonly amountWinnerInput: TextInput

  constructor(page: Page) {
    this.page = page

    this.tab = new Tabs(page)

    this.autoChoiceWinnerButton = new Buttons(
      page.getByTestId('autoselect-winners-btn'),
      'Автовыбор победителей'
    )

    this.supplierControlTab = page.getByTestId('tab-element-requestControl') //Переход на вкладку

    this.applicationViewIcon = page.getByTestId('icon-eye-on') // Просмотр заявки

    this.dragonDropWinnerIcon = page.getByTestId('icon-drag_drop') // Иконка перемещения порядка поставщика

    this.supplierDecisionSelect = page.getByTestId('select-supplier-decision') //Селектор выбора решения

    this.supplierCheckIcon = page.getByTestId('icon-user') //Отчет по поставщику

    this.amountWinnerInput = new TextInput(
      page.locator('#maxWinnersAmount'),
      'количество победителей'
    )
  }

  async fillParticipantStatusTab(params: ParticipantStatusParams) {
    await allure.step('Заполнить вкладку статусов участников', async () => {
      await this.tab.selectTab('requestControl')

      if (params.autoWinner) {
        await this.clickAutoSelectWinner(params.autoWinner)
      }

      if (params.supplierDecisions) {
        for (const param of params.supplierDecisions) {
          await this.selectSupplierDecision(param.name, param.decision)
        }
      }
    })
  }

  async selectSupplierDecision(supplierName: string, supplierDecision: string) {
    await allure.step(`Выбрать решение для ${supplierName}: ${supplierDecision}`, async () => {
      const supplier = this.page
        .getByRole('table')
        .locator('tr')
        .filter({ has: this.page.getByText(supplierName, { exact: true }) })
      const select = new Select(supplier.locator(this.supplierDecisionSelect), 'решение')
      await select.select(supplierDecision)
    })
  }

  async applicationView(supplierName: string) {
    await allure.step(`Открыть заявку поставщика: ${supplierName}`, async () => {
      const supplier = this.page

        .getByRole('table')

        .locator('tr')

        .filter({ has: this.page.getByText(supplierName, { exact: true }) })
      await supplier.locator(this.applicationViewIcon).click()
    })
  }

  async checkSupplier(supplierName: string) {
    await allure.step(`Открыть отчет по поставщику: ${supplierName}`, async () => {
      const supplier = this.page

        .getByRole('table')

        .locator('tr')

        .filter({ has: this.page.getByText(supplierName, { exact: true }) })
      await supplier.locator(this.supplierCheckIcon).click()
    })
  }

  async clickAutoSelectWinner(amount?: string) {
    await allure.step('Нажать: Автоматический выбор победителя', async () => {
      if (amount) {
        await this.amountWinnerInput.fill(amount)
      }

      await this.autoChoiceWinnerButton.click()
    })
  }
}
