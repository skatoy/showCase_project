import * as allure from 'allure-js-commons'
import { ApiAuth } from '#/api/ApiAuth'
import { EditRequest } from '#/BusinessLogic/EditRequest'
import { ApiCreateProcedure } from '#/api/ApiCreateProcedure'
import { CreateRequest } from '#/BusinessLogic/Request/CreateRequest'
import { getPositionsTenderSteps } from '#/factories/steps'
import { defaultApiProcedureData } from '#/testData/ApiData/ApiProcedureData'
import { defaultRequestData, RequestData } from '#/testData/RequestData'
import { userCreds } from '#/utils/elkLogin'
import { createPageState } from '#/utils/pageState'
import { userBothRolesCustomerAuthFile, userSupplierAuthFile } from '#/utils/setupConfig'
import { test } from '@playwright/test'
import { nowAtMsk } from '#/components/DateInput'

const newRequestData: RequestData = {
  ...defaultRequestData,
  containerDocuments: {
    ...defaultRequestData.containerDocuments,
    filesNames: ['Test.txt']
  }
}
test.describe('Тест редактирования заявки', () => {
  test.describe.configure({ mode: 'serial' })
  test.beforeEach(async () => {
    await allure.suite('Тест редактирования заявки')
  })

  let procedureUuid: string

  test('Создание закупки', async ({ browser }) => {
    await allure.step('Подготовить закупку', async () => {
      const context = await browser.newContext({
        storageState: userBothRolesCustomerAuthFile
      })
      const user = userCreds.userBothRoles
      const apiAuth = new ApiAuth(context, user, 'customer', userBothRolesCustomerAuthFile)
      await apiAuth.login()

      const steps = getPositionsTenderSteps(
        nowAtMsk().toISO()!,
        nowAtMsk().plus({ minutes: 1 }).toISO()!
      )
      const procedureData = {
        ...defaultApiProcedureData,

        procedureInfo: { ...defaultApiProcedureData.procedureInfo, steps }
      }
      const creator = new ApiCreateProcedure(context)
      const result = await creator.createProcedure(procedureData)
      procedureUuid = result.procedureUuid

      await context.close()
    })
  })

  test('Заполнить заявку', async ({ browser }) => {
    await allure.step('Заполнить заявку', async () => {
      const { page, context } = await createPageState(browser, userSupplierAuthFile)
      const request = new CreateRequest(page)
      await request.requestCreate(defaultRequestData, procedureUuid!)
      await context.close()
    })
  })
  test('Редактирование заявки', async ({ browser }) => {
    await allure.step('Редактирование заявки', async () => {
      const { page, context } = await createPageState(browser, userSupplierAuthFile)
      const request = new EditRequest(page)
      await request.editRequest(newRequestData, procedureUuid!)
      await context.close()
    })
  })
})
