import { ApiFromUiProcedure } from '#/api/ApiFromUi/ApiFromUiProcedure'
import { ContainerCreateAndEditPage } from '#/pageObjects/Container/ContainerCreateAndEditPage'
import { ProcedureListPage } from '#/pageObjects/Procedure/ProcedureListPage'
import { SinglePriceProcedureData } from '#/testData/ProcedureData'
import { Page } from '@playwright/test'
import * as allure from 'allure-js-commons'

export class SinglePriceProcedure {
  page: Page
  container: ContainerCreateAndEditPage
  grid: ProcedureListPage
  apiFromUi: ApiFromUiProcedure
  constructor(page: Page) {
    this.page = page
    this.container = new ContainerCreateAndEditPage(page)
    this.grid = new ProcedureListPage(page)
    this.apiFromUi = new ApiFromUiProcedure(page)
  }

  async procedureCreate(data: SinglePriceProcedureData) {
    await allure.step('Создать закупку по единичным расценкам', async () => {
      await this.grid.createNewProcedure()
      await this.container.fillProcedureData(data)
    })
  }
}
