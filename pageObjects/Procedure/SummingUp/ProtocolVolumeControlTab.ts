import { Buttons } from '#/components/Buttons'
import { Tabs } from '#/components/Tabs'
import { Page, Locator } from '@playwright/test'
import * as allure from 'allure-js-commons'

export type FiltrationParams = {
  notFilled?: boolean
  notCompleteFilled?: boolean
  filled?: boolean
}
export type VolumeControlParams = {
  position: string
  supplier: string
  amount: string
}
export type VolumeControlTabParams = {
  filter?: FiltrationParams
  volumeControl?: VolumeControlParams
}
export class ProtocolVolumeControlTab {
  readonly page: Page
  readonly tab: Tabs
  readonly positionFiltrationCheckBox: Locator
  readonly volumeNotFilledIcon: Locator
  readonly volumeNotCompleteFilledIcon: Locator
  readonly volumeFilledIcon: Locator
  readonly withoutOffersCheckBox: Locator
  readonly applicationViewIcon: Locator
  readonly editVolumePlaceholder: Locator
  readonly volumeEmptyStarIcon: Locator
  readonly volumeFillStarIcon: Locator
  readonly searchFieldPlaceholder: Locator
  readonly searchIcon: Locator
  readonly positionTableName: Locator
  readonly distributeVolumeButton: Buttons
  readonly positionPaginationSelect: Locator
  readonly positionPaginationMoveForward: Locator
  readonly positionPaginationBackForward: Locator

  constructor(page: Page) {
    this.page = page
    this.tab = new Tabs(page)
    this.positionFiltrationCheckBox = page.getByTestId('checkbox-')
    this.volumeNotFilledIcon = page.getByTestId('icon-volume')
    this.volumeNotCompleteFilledIcon = page.getByTestId('icon-volume_half_filled')
    this.volumeFilledIcon = page.getByTestId('icon-volume_filled')
    this.withoutOffersCheckBox = page
      .getByTestId('checkbox-')
      .getByText('Поставщики без предложений')
    this.applicationViewIcon = page.getByTestId('icon-eye-on')
    this.volumeEmptyStarIcon = page.getByTestId('icon-star')
    this.volumeFillStarIcon = page.getByTestId('icon-star_active')
    this.editVolumePlaceholder = this.page.getByPlaceholder('Введите число')
    this.searchFieldPlaceholder = page.locator('#search')
    this.searchIcon = page.getByTestId('icon-search')
    this.positionTableName = page.getByTestId('table-col-procedurePositionName')
    this.distributeVolumeButton = new Buttons(
      page.getByRole('button', { name: 'Распределить объем' })
    )
    this.positionPaginationSelect = page.getByTestId('select-perPage')
    this.positionPaginationMoveForward = page.getByTestId('select-perPage').nth(1)
    this.positionPaginationBackForward = page.getByTestId('select-perPage').nth(0)
  }

  async fillVolumeControlTab(params: VolumeControlTabParams) {
    await allure.step('Заполнить вкладку распределения объема', async () => {
      await this.tab.selectTab('quantityControl')

      if (params.filter) {
        await this.filterPositionVolume(params.filter)
      }

      if (params.volumeControl) {
        await this.fillPositionAmount(params.volumeControl)
      }
    })
  }

  async filterPositionVolume(params: FiltrationParams) {
    await allure.step('Применить фильтр по заполнению объема', async () => {
      if (params.notFilled) {
        await this.clickNotFilledFilter()
      }

      if (params.notCompleteFilled) {
        await this.clickNotCompleteFilledFilter()
      }

      if (params.filled) {
        await this.clickFilledFilter()
      }
    })
  }

  async clickNotFilledFilter() {
    await allure.step('Нажать: Фильтр незаполненного объема', async () => {
      await this.positionFiltrationCheckBox.getByText('Объем не заполнен').click()
    })
  }

  async clickNotCompleteFilledFilter() {
    await allure.step('Нажать: Фильтр неполностью заполненного объема', async () => {
      await this.positionFiltrationCheckBox.getByText('Объем заполнен не полностью').click()
    })
  }

  async clickFilledFilter() {
    await allure.step('Нажать: Фильтр заполненного объема', async () => {
      await this.positionFiltrationCheckBox.getByText('Объем заполнен').click()
    })
  }

  async searchPosition(name: string) {
    await allure.step(`Найти позицию: ${name}`, async () => {
      await this.searchFieldPlaceholder.click()
      await this.searchFieldPlaceholder.fill(name)
      await this.searchIcon.click()
    })
  }

  async selectPosition(name: string) {
    await allure.step(`Выбрать позицию: ${name}`, async () => {
      await this.searchPosition(name)
      await this.positionTableName.getByText(name).click()
    })
  }

  async clickDistributeVolume() {
    await allure.step('Нажать: Распределить объем', async () => {
      await this.distributeVolumeButton.click()
    })
  }

  async fillPositionAmount(data: VolumeControlParams) {
    await allure.step(`Заполнить объем для позиции: ${data.position}`, async () => {
      await this.selectPosition(data.position)
      await this.fillSupplierAmount(data.supplier, data.amount)
    })
  }

  async fillSupplierAmount(name: string, amount: string) {
    await allure.step(`Заполнить объем для поставщика: ${name}`, async () => {
      const supplierRow = this.page.locator('tbody tr', {
        has: this.page.getByText(name, { exact: true })
      })
      await supplierRow.locator('+ tr').locator(this.editVolumePlaceholder).fill(amount)
    })
  }
}
