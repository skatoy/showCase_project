import { Buttons } from '#/components/Buttons'
import { Tabs } from '#/components/Tabs'
import { Page, Locator } from '@playwright/test'
import * as allure from 'allure-js-commons'

export type ViewOption = {
  protocolView?: 'Отображать' | 'Не отображать'
  supplierNameView?: 'Отображать' | 'Не отображать'
  priceWinnerView?: 'Отображать' | 'Не отображать'
}

export class ProtocolViewOptionTab {
  readonly page: Page
  readonly tab: Tabs
  readonly protocolViewOptionTab: Locator
  readonly protocolVisibilitySuppliersRadio: Locator
  readonly supplierNameVisibilityRadio: Locator
  readonly winnerPriceVisibilityRadio: Locator
  readonly saveButton: Buttons

  constructor(page: Page) {
    this.page = page
    this.tab = new Tabs(page)
    this.protocolViewOptionTab = page.getByTestId('tab-element-visibility')
    this.protocolVisibilitySuppliersRadio = page.getByTestId(
      'radio-buttons-protocolForAllSuppliersVisibility'
    )
    this.supplierNameVisibilityRadio = page.getByTestId('radio-buttons-supplierNameVisibility')
    this.winnerPriceVisibilityRadio = page.getByTestId('radio-buttons-winnersPriceVisibility')
    this.saveButton = new Buttons(page.getByTestId('save-protocol-btn'))
  }

  async fillViewTab(option: ViewOption) {
    await allure.step('Заполнить вкладку параметров отображения', async () => {
      await this.tab.selectTab('visibility')

      if (option.protocolView) {
        await this.setProtocolVision(option.protocolView)
      }

      if (option.supplierNameView) {
        await this.setSuppliersNameVision(option.supplierNameView)
      }

      if (option.priceWinnerView) {
        await this.setWinnerPriceVision(option.priceWinnerView)
      }

      await this.saveProtocol()
    })
  }

  async saveProtocol() {
    await allure.step('Нажать: Сохранить протокол', async () => {
      await this.saveButton.click()
    })
  }

  async setProtocolVision(protocolVision: string) {
    await allure.step(`Выбрать видимость протокола: ${protocolVision}`, async () => {
      await this.protocolVisibilitySuppliersRadio.getByText(protocolVision).click({ force: true })
    })
  }

  async setSuppliersNameVision(nameVision: string) {
    await allure.step(`Выбрать видимость наименования поставщика: ${nameVision}`, async () => {
      await this.supplierNameVisibilityRadio.getByText(nameVision).click({ force: true })
    })
  }

  async setWinnerPriceVision(priceVision: string) {
    await allure.step(`Выбрать видимость цены победителя: ${priceVision}`, async () => {
      await this.winnerPriceVisibilityRadio.getByText(priceVision).click({ force: true })
    })
  }
}
