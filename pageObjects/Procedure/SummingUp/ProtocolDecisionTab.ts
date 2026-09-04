import { Buttons } from '#/components/Buttons'
import { Select } from '#/components/Select'
import { Tabs } from '#/components/Tabs'
import { TextInput } from '#/components/TextInput'
import { Page, Locator } from '@playwright/test'
import * as allure from 'allure-js-commons'
export type ProcedureDecision =
  | 'Закупка по лоту признана состоявшейся'
  | 'Закупка по лоту признана несостоявшейся'
  | 'Закупка по лоту отменена'
export type WinnerType = 'Без распределения объема' | 'С распределением объема'
export type DecisionParams = {
  decision: ProcedureDecision
  winnerType?: WinnerType
  reason?: string
}
export class ProtocolDecisionTab {
  readonly page: Page
  readonly tab: Tabs
  readonly decisionSelect: Select
  readonly winnersChoiceTypeRadio: Locator
  readonly reasonTextBox: TextInput
  readonly saveProtocolButton: Buttons

  constructor(page: Page) {
    this.page = page

    this.tab = new Tabs(page)
    this.decisionSelect = new Select(page.getByTestId('select-decision'), 'решение по закупке')
    this.winnersChoiceTypeRadio = page.getByTestId('radio-buttons-tableType')
    this.reasonTextBox = new TextInput(page.locator('#reason'), 'причину')
    this.saveProtocolButton = new Buttons(
      page.getByTestId('save-protocol-btn'),
      'Сохранить протокол'
    )
  }

  async fillDecisionTab(data: DecisionParams) {
    await allure.step('Заполнить вкладку решения по протоколу', async () => {
      await this.tab.selectTab('access')
      await this.selectDecisionType(data.decision)

      if (data.winnerType) {
        await this.winnersChoiceType(data.winnerType)
      } else if (data.decision === 'Закупка по лоту отменена' && data.reason) {
        await this.fillDecisionReason(data.reason)
      }

      await this.saveProtocolButton.click()
    })
  }

  async selectDecisionType(decision: string) {
    await allure.step(`Выбрать решение по закупке: ${decision}`, async () => {
      await this.decisionSelect.select(decision)
    })
  }

  async winnersChoiceType(winnerType: string) {
    await allure.step(`Выбрать способ определения победителя: ${winnerType}`, async () => {
      await this.winnersChoiceTypeRadio.getByText(winnerType).click()
    })
  }

  async fillDecisionReason(reason: string) {
    await allure.step('Заполнить причину решения', async () => {
      await this.reasonTextBox.fill(reason)
    })
  }
}
