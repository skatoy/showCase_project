import { Select } from '#/components/Select'
import { TextInput } from '#/components/TextInput'
import { Buttons } from '#/components/Buttons'

import { Locator, Page } from '@playwright/test'
import * as allure from 'allure-js-commons'

export class DepartmensPage {
  readonly page: Page
  readonly addButton: Buttons
  readonly departmentNameInput: TextInput
  readonly departmentTable: Locator
  readonly departmentViewIcon: Locator

  constructor(page: Page) {
    this.page = page
    this.addButton = new Buttons(page.getByRole('button', { name: 'Добавить', exact: true }))
    this.departmentNameInput = new TextInput(page.locator('#fio')) // поле ввода наименования отдела при его создании
    this.departmentTable = page.getByTestId('table-loaded') // таблица отделов
    this.departmentViewIcon = page.getByTestId('icon-eye-on') // иконка просмотра отдела
  }

  // просмотр отдела
  async departmentView(department: string) {
    await allure.step(`Просмотр отдела: ${department}`, async () => {
      const stepRow = this.page
        .getByRole('table')
        .locator('tr')
        .filter({ has: this.page.getByText(department, { exact: true }) })
      await stepRow.getByTestId('icon-eye-on').click()
    })
  }

  //добавление отдела
  async addDepartmentForUser(departmentName: string) {
    await allure.step(`Добавить отдел: ${departmentName}`, async () => {
      await this.addButton.click()
      await this.fillDepartmentName(departmentName)
      await this.addButton.locator.nth(0).click()
    })
  }

  // заполнение наименования отдела при создании
  async fillDepartmentName(departmentName: string) {
    await allure.step(`Заполнить название отдела значением: ${departmentName}`, async () => {
      await this.departmentNameInput.fill(departmentName)
    })
  }
}

export class DepartamentPage {
  readonly page: Page

  readonly deleteDepartmentButton: Buttons
  readonly deleteDepartmentConfirmButton: Buttons
  readonly addUsersForDepartmentButton: Buttons
  readonly departmentEmployeesCheckbox: Locator
  readonly departmentNameInput: TextInput
  readonly departmentTableEmployees: Locator
  readonly departmentRoleEmployeesSelect: Select
  readonly departmentEmployeesDeleteIcon: Locator
  readonly departmentEmployeesEditIcon: Locator
  constructor(page: Page) {
    this.page = page

    this.deleteDepartmentButton = new Buttons(page.getByRole('button', { name: 'Удалить отдел' }))
    this.deleteDepartmentConfirmButton = new Buttons(
      page.getByRole('button', { name: 'Удалить', exact: true })
    )
    this.addUsersForDepartmentButton = new Buttons(
      page.getByRole('button', { name: 'Добавить сотрудников' })
    )
    this.departmentTableEmployees = page.getByTestId('table-loaded') // таблица сотрудников
    this.departmentNameInput = new TextInput(page.locator('#fio')) // поле наименования отдела
    this.departmentEmployeesCheckbox = page.getByTestId('table-col-checkbox') // чекбокс выбора сотрудников
    this.departmentRoleEmployeesSelect = new Select(page.getByTestId('select-role')) // дропдаун выбора ролей отдела
    this.departmentEmployeesDeleteIcon = page.getByTestId('icon-delete') // иконка удаления сотрудника
    this.departmentEmployeesEditIcon = page.getByTestId('icon-edit') // иконка изменения данных сотрудника
  }

  // выбор роли для сотрудника
  async selectEmployeeRole(employeeRole: string) {
    await allure.step(`Выбрать роль сотрудника: ${employeeRole}`, async () => {
      await this.departmentRoleEmployeesSelect.select(employeeRole)
    })
  }

  //удаление отдела на странице отдела
  async deleteDepartment() {
    await allure.step('Удалить отдел', async () => {
      await this.deleteDepartmentButton.click()
      await this.deleteDepartmentConfirmButton.click()
    })
  }

  //изменение наименования отдела
  async changeDepartmentName(newName: string) {
    await allure.step(`Изменить название отдела на: ${newName}`, async () => {
      await this.departmentNameInput.fill(newName)
    })
  }

  // добавление пользователя в отдел
  async addUserForDepartment(user: string) {
    await allure.step(`Добавить пользователя: ${user} в отдел`, async () => {
      await this.addUsersForDepartmentButton.click()
      const stepRow = this.page
        .getByRole('table')
        .locator('tr')
        .filter({ has: this.page.getByText(user, { exact: true }) })
      await stepRow.getByRole('checkbox').click()
    })
  }

  //изменение параметров пользователя отдела
  async editUserForDepartment(tableUser: string) {
    await allure.step(`Изменить параметры пользователя: ${tableUser} в отделе`, async () => {
      this.page
        .getByRole('table')
        .locator('tr')
        .filter({ has: this.page.getByText(tableUser, { exact: true }) })
        .getByTestId('icon-edit')
        .click()
    })
  }

  //удаление пользователя из отдела
  async deleteUserForDepartment(tableUser: string) {
    await allure.step(`Удалить пользователя: ${tableUser} из отдела`, async () => {
      this.page
        .getByRole('table')
        .locator('tr')
        .filter({ has: this.page.getByText(tableUser, { exact: true }) })
        .getByTestId('icon-delete')
        .click()
    })
  }
}
