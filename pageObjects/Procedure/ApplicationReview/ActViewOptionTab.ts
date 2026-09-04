import { Tabs } from '#/components/Tabs'
import { Page, Locator } from '@playwright/test'
import * as allure from 'allure-js-commons'

export type ViewOption = {
  protocolView?: 'Отображать' | 'Не отображать'
  supplierNameView?: 'Отображать' | 'Не отображать'
  priceWinnerView?: 'Отображать' | 'Не отображать'
}
export class ActViewOptionTab {
  readonly page: Page
  readonly tab: Tabs
  readonly protocolViewOptionTab: Locator
  readonly protocolVisibilitySuppliersRadio: Locator
  readonly supplierNameVisibilityRadio: Locator
  readonly winnerPriceVisibilityRadio: Locator
  constructor(page: Page) {
    this.page = page
    this.tab = new Tabs(page)
    this.protocolViewOptionTab = page.getByTestId('tab-element-visibility')
    this.protocolVisibilitySuppliersRadio = page.getByTestId(
      'radio-buttons-protocolForAllSuppliersVisibility'
    )
    this.supplierNameVisibilityRadio = page.getByTestId('radio-buttons-supplierNameVisibility')
    this.winnerPriceVisibilityRadio = page.getByTestId('radio-buttons-winnersPriceVisibility')
  }

  async setProtocolView(protocolOption: string) {
    await allure.step(`Выбрать видимость протокола: ${protocolOption}`, async () => {
      await this.protocolVisibilitySuppliersRadio.getByText(protocolOption).click({ force: true })
    })
  }

  async setSuppliersNameView(nameOption: string) {
    await allure.step(`Выбрать видимость наименования поставщика: ${nameOption}`, async () => {
      await this.supplierNameVisibilityRadio.getByText(nameOption).click({ force: true })
    })
  }

  async setWinnerPriceView(priceOption: string) {
    await allure.step(`Выбрать видимость цены победителя: ${priceOption}`, async () => {
      await this.supplierNameVisibilityRadio.getByText(priceOption).click({ force: true })
    })
  }

  async fillViewTab(option: ViewOption) {
    await allure.step('Заполнить вкладку параметров отображения', async () => {
      await this.tab.selectTab('visibility')

      if (option.protocolView) {
        await this.setProtocolView(option.protocolView)
      }

      if (option.supplierNameView) {
        await this.setSuppliersNameView(option.supplierNameView)
      }

      if (option.priceWinnerView) {
        await this.setWinnerPriceView(option.priceWinnerView)
      }
    })
  }
}
