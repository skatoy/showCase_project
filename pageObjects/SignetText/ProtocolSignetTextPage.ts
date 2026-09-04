import { Buttons } from '#/components/Buttons'
import { type Page, type Locator } from '@playwright/test'
import * as allure from 'allure-js-commons'

export class ProtocolSignetTextPage {
  readonly page: Page
  readonly protocolInfoTable: Locator
  readonly supplierPositionViewIcon: Locator
  readonly decisionSupplierTable: Locator
  readonly applicationViewIcon: Locator
  readonly supplierCheckIcon: Locator
  readonly publishProtocolButton: Buttons

  constructor(page: Page) {
    this.page = page
    this.protocolInfoTable = page.getByTestId('protocol-info') //Блок информации
    this.supplierPositionViewIcon = page.getByTestId('icon-eye-on') //Просмотр позиций поставщика
    this.decisionSupplierTable = page.getByTestId('decisions-table') //Таблица победителей
    this.applicationViewIcon = page
      .getByRole('table')
      .locator('tr')
      .filter({ has: this.page.getByTestId('icon-eye-on') }) //Просмотр заявки поставщика
    this.supplierCheckIcon = page
      .getByRole('table')
      .locator('tr')
      .filter({ has: this.page.getByTestId('icon-user') }) //Загрузка отчета по поставщику
    this.publishProtocolButton = new Buttons(
      page.getByTestId('publish-protocol-btn'),
      'Опубликовать протокол'
    )
  }

  async publishSummingUpProtocol() {
    await allure.step('Опубликовать протокол подведения итогов', async () => {
      await this.publishProtocolButton.click()
    })
  }
}

export class ProtocolSignetTextDistributedVolumePage {
  page: Page
  readonly volumeControlTab: Locator
  readonly volumeFiltrationTable: Locator
  readonly volumeNotFilledCheckBox: Locator
  readonly volumeNotCompleteFilledCheckBox: Locator
  readonly volumeFilledCheckBox: Locator
  readonly volumeNotFilledIcon: Locator
  readonly volumeNotCompleteFilledIcon: Locator
  readonly volumeFilledIcon: Locator
  readonly withoutOffersCheckBox: Locator
  readonly applicationViewIcon: Locator
  readonly volumeFillStarIcon: Locator
  readonly positionTableBlock: Locator
  readonly searchFieldPlaceholder: Locator
  readonly searchIcon: Locator
  readonly positionPaginationSelect: Locator
  readonly positionPaginationMoveForward: Locator
  readonly positionPaginationBackForward: Locator
  constructor(page: Page) {
    this.page = page
    this.volumeControlTab = page.getByTestId('tab-element-quantityControl') //Таб страницы
    this.volumeFiltrationTable = page.getByTestId('expander-content') //Таблица фильтров
    this.volumeNotFilledCheckBox = page
      .getByRole('checkbox')
      .filter({ hasText: 'Объем не заполнен' }) //Чек-бокс фильтра не заполненного объема
    this.volumeNotFilledIcon = page.getByTestId('icon-volume') //Иконка фильтра незаполненного объема
    this.volumeNotCompleteFilledCheckBox = page
      .getByRole('checkbox')
      .filter({ hasText: 'Объем заполнен не полностью' }) //Чек-бокс фильтра недозаполненного объема
    this.volumeNotCompleteFilledIcon = page.getByTestId('icon-volume_half_filled') //Иконка фильтра недозаполненного объема
    this.volumeFilledCheckBox = page.getByRole('checkbox').filter({ hasText: 'Объем заполнен' }) //Чек-бокс фильтра заполненного объема
    this.volumeFilledIcon = page.getByTestId('icon-volume_filled') //Иконка фильтра заполненного объема
    this.withoutOffersCheckBox = page
      .getByRole('checkbox')
      .filter({ hasText: 'Поставщики без предложений' }) //Чек-бокс отображения поставщиков без заявки
    this.applicationViewIcon = page.getByTestId('icon-eye-on') //Иконка просмотра заявки поставщика
    this.volumeFillStarIcon = page.getByTestId('icon-star_active') //Иконка заполненного объема
    this.searchFieldPlaceholder = page.getByPlaceholder('Введите текст') //Поле поиска
    this.searchIcon = page.getByTestId('icon-search') //Иконка поиска
    this.positionTableBlock = page.getByTestId('positions-table') //Блок позиций
    this.positionPaginationSelect = page.getByTestId('select-perPage') //Селектор выбора отображаемых элементов
    this.positionPaginationMoveForward = page.getByTestId('select-perPage').nth(1) //Кнопка пагинации вперед
    this.positionPaginationBackForward = page.getByTestId('select-perPage').nth(0) //Кнопка пагинации назад
  }
}
