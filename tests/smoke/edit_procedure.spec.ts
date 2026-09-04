import * as allure from 'allure-js-commons'
import { ApiAuth } from '#/api/ApiAuth'
import { ApiCreateProcedure } from '#/api/ApiCreateProcedure'
import { getPositionsTenderSteps } from '#/factories/steps'
import { ContainerCreateAndEditPage } from '#/pageObjects/Container/ContainerCreateAndEditPage'
import { ProcedureListPage } from '#/pageObjects/Procedure/ProcedureListPage'
import { ProcedureOverviewTab } from '#/pageObjects/Procedure/ProcedureView/ProcedureOverviewTab'
import { defaultApiProcedureData } from '#/testData/ApiData/ApiProcedureData'
import { defaultEditingProcedureData } from '#/testData/EditingProcedureData'
import { defaultProcedureData } from '#/testData/ProcedureData'
import { userCreds } from '#/utils/elkLogin'
import { createPageState } from '#/utils/pageState'
import { userBothRolesCustomerAuthFile } from '#/utils/setupConfig'
import { nowAtMsk } from '#/components/DateInput'
import test from '@playwright/test'

const newPosition = {
  title: `Позиция 2`,
  quantity: '10',
  price: '',
  okpd: '01.22.11',
  okpdName: 'Авокадо',
  okei: '7923',
  okeiName: 'Абонент',
  okeiShortName: 'АБОНЕНТ',
  type: '7923',
  requirementSettings: {
    isEnabled: false,
    requirementList: []
  },
  deliveryCondition: '',
  deliveryAddress: '',
  deliveryDate: '',
  description: '',
  isForPriceList: false
}

const newEditData = {
  ...defaultEditingProcedureData,

  procedure: {
    ...defaultProcedureData.procedure,
    procedureDate: {
      dateFinish: { minutes: 2 }
    }
  },
  position: {
    ...defaultEditingProcedureData.position,
    positionTitle: 'Позиция 2',
    positionData: {
      positionTitle: 'Позиция 3',
      quantity: '1000',
      okpd: 'авокадо',
      okei: 'АБОНЕНТ',
      conditional: undefined,
      address: undefined,
      date: undefined
    }
  }
}

test.describe('Тест создания и редактирования закупки', () => {
  test.describe.configure({ mode: 'serial' })
  test.beforeEach(async () => {
    await allure.suite('Тест создания и редактирования закупки')
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
      const newProcedureData = {
        ...defaultApiProcedureData,

        procedureInfo: { ...defaultApiProcedureData.procedureInfo, steps },
        positions: [...defaultApiProcedureData.positions, newPosition]
      }
      const creator = new ApiCreateProcedure(context)
      const result = await creator.createProcedure(newProcedureData)
      procedureUuid = result.procedureUuid
      await context.close()
    })
  })

  test('Подготовить редактирование закупки', async ({ browser }) => {
    await allure.step('Подготовить редактирование закупки', async () => {
      const { page, context } = await createPageState(browser, userBothRolesCustomerAuthFile)
      const grid = new ProcedureListPage(page)
      const procedureView = new ProcedureOverviewTab(page)
      const edit = new ContainerCreateAndEditPage(page)
      await grid.goToProcedure(procedureUuid)
      await procedureView.editProcedure('Лот 1')
      await edit.positionTab.editPosition(newEditData.position)
      await context.close()
    })
  })
})
