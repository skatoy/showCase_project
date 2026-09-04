import { Tabs } from '#/components/Tabs'
import { DepartmensPage } from '#/pageObjects/Departments/DepartmensPage'
import { Page } from '@playwright/test'
import * as allure from 'allure-js-commons'

export class OrganizationDepartmentTab {
  readonly page: Page
  readonly tab: Tabs
  readonly departments: DepartmensPage
  constructor(page: Page) {
    this.page = page
    this.tab = new Tabs(page)
    this.departments = new DepartmensPage(page)
  }

  async goToDepartmentTab() {
    await allure.step('Перейти на вкладку подразделений', async () => {
      await this.tab.selectTab('/organizations/[organization_uuid]//departments')
    })
  }
}
