import { Buttons } from '#/components/Buttons'
import { pageUtils } from '#/utils/pageUtils'
import { SidebarMenuItem } from '#/utils/sidebarMenuItems'
import { Locator, Page } from '@playwright/test'
import * as allure from 'allure-js-commons'

export class ProcedureListPage {
  readonly page: Page
  readonly menu: SidebarMenuItem
  readonly procedureList: Locator
  readonly buttonCreateProcedure: Buttons
  readonly tabAllProcedure: Locator
  readonly tabMyProcedure: Locator
  readonly tabDraft: Locator
  readonly inputSearchField: Locator
  readonly procedureFilter: Locator
  readonly procedureTypeSelect: Locator
  readonly procedureNameInput: Locator
  readonly registryNumberInput: Locator
  readonly privateProcedureCheckbox: Locator
  readonly subsidiariesProcedureHideCheckbox: Locator
  readonly customNameProcedureInput: Locator
  readonly positionTitleInput: Locator
  readonly okpdListInput: Locator
  readonly subsidiariesSearchCheckbox: Locator
  readonly searchOrganizationNameInput: Locator
  readonly searchOrganizationInnInput: Locator
  readonly procedureWithPriceInput: Locator
  readonly priceFromRangeInput: Locator
  readonly priceToRangeInput: Locator
  readonly curencyTypeInput: Locator
  readonly dateFromPublicationProcedureInput: Locator
  readonly dateToPublicationProcedureInput: Locator
  readonly applicationsAcceptanceDateEndInput: Locator
  readonly statusTypeInput: Locator

  constructor(page: Page) {
    this.page = page
    this.menu = new SidebarMenuItem(page)
    this.procedureList = page.getByTestId('procedures-loaded')
    this.buttonCreateProcedure = new Buttons(
      page.getByRole('button', { name: 'Создать закупку', exact: true })
    )
    this.tabAllProcedure = page.getByTestId('tab-element-all')
    this.tabMyProcedure = page.getByTestId('data-cy="tab-element-my"')
    this.tabDraft = page.getByTestId('tab-element-drafts')
    this.inputSearchField = page.locator('#search')
    this.procedureFilter = page.getByTestId('icon-filter')
    this.procedureTypeSelect = page.getByTestId('select-type')
    this.procedureNameInput = page.locator('#typeCustomName')
    this.registryNumberInput = page.locator('#registryNumber')
    this.privateProcedureCheckbox = page.getByTestId('checkbox-').getByText('Закрытая закупка')
    this.subsidiariesProcedureHideCheckbox = page
      .getByTestId('checkbox-')
      .getByText('Скрыть закупки дочерних организаций')
    this.customNameProcedureInput = page.getByText('Наименование закупки').getByRole('textbox')
    this.positionTitleInput = page.locator('#positionTitles')
    this.okpdListInput = page.getByTestId('select-okpdList')
    this.subsidiariesSearchCheckbox = page.getByTestId('checkbox-').getByText('Поиск по дочерним')
    this.searchOrganizationNameInput = page.getByPlaceholder('Название организации')
    this.searchOrganizationInnInput = page.getByPlaceholder('Введите ИНН')
    this.procedureWithPriceInput = page.getByTestId('select-withoutPrice')
    this.priceFromRangeInput = page.locator('#from-priceRange')
    this.priceToRangeInput = page.locator('#to-priceRange')
    this.curencyTypeInput = page.getByTestId('select-currency')
    this.dateFromPublicationProcedureInput = page.getByTestId('date-picker-publishDate-from')
    this.dateToPublicationProcedureInput = page.getByTestId('date-picker-publishDate-to')
    this.applicationsAcceptanceDateEndInput = page.getByTestId(
      'date-picker-applicationsAcceptanceDateEnd'
    )
    this.statusTypeInput = page.getByTestId('select-status')
  }

  async createNewProcedure() {
    await allure.step('Создать закупку', async () => {
      const list = await this.procedureList.isVisible()

      if (list !== true) {
        await this.menu.clickMenuProcedures()
      }

      await this.buttonCreateProcedure.locator.waitFor()
      await this.buttonCreateProcedure.click()
      await this.page.waitForURL('**/container')
    })
  }

  async goToProcedure(procedureUuid: string) {
    await allure.step('Открыть карточку закупки', async () => {
      await pageUtils.goto(this.page, `procedure/${procedureUuid}`)
    })
  }

  async goToContainer(containerUuid: string) {
    await allure.step('Открыть карточку контейнера закупки', async () => {
      await pageUtils.goto(this.page, `procedure/container/${containerUuid}`)
    })
  }

  async waitProcedureListLoaded() {
    await allure.step('Дождаться загрузки', async () => {
      await this.procedureList.waitFor()
    })
  }
}
