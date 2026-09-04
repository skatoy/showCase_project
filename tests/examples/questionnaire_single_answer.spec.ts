import * as allure from 'allure-js-commons'
import { test } from '@playwright/test'
import { ApiAuth } from '#/api/ApiAuth'
import { ApiCreateProcedure } from '#/api/ApiCreateProcedure'
import { nowAtMsk } from '#/components/DateInput'
import { getPositionsTenderSteps } from '#/factories/steps'
import { defaultApiProcedureData } from '#/testData/ApiData/ApiProcedureData'
import { userCreds } from '#/utils/elkLogin'
import { userBothRolesCustomerAuthFile, userSupplierAuthFile } from '#/utils/setupConfig'
import { CreateRequest } from '#/BusinessLogic/Request/CreateRequest'
import { defaultRequestData } from '#/testData/RequestData'
import { createPageState } from '#/utils/pageState'
import { PageNotification } from '#/components/PageNotification'

const questionarySettings = {
  isEnabled: true,
  questionList: [
    {
      answerType: 'SINGLE',
      title: 'Вопрос 1',
      isCustomAnswerAllowed: true,
      answerVariants: [{ name: 'Ответ 1', weight: 0, isCommentRequired: false }]
    },
    {
      answerType: 'SINGLE',
      title: 'Вопрос 2',
      isCustomAnswerAllowed: false,
      answerVariants: [
        { name: 'Ответ 1', weight: 0, isCommentRequired: false },
        { name: 'Ответ 2', weight: 0, isCommentRequired: false }
      ]
    },
    {
      answerType: 'SINGLE',
      title: 'Вопрос 3',
      isCustomAnswerAllowed: false,
      answerVariants: [
        { name: 'Ответ 1', weight: 0, isCommentRequired: false },
        { name: 'Ответ 2', weight: 1, isCommentRequired: false },
        { name: 'Ответ 3', weight: 100, isCommentRequired: false }
      ]
    },
    {
      answerType: 'SINGLE',
      title: 'Вопрос 4',
      isCustomAnswerAllowed: false,
      answerVariants: [
        { name: 'Ответ 1', weight: 0, isCommentRequired: false },
        { name: 'Ответ 2', weight: 0, isCommentRequired: true }
      ]
    },
    {
      answerType: 'SINGLE',
      title: 'Вопрос 5',
      isCustomAnswerAllowed: false,
      answerVariants: [
        { name: 'Ответ 1', weight: 0, isCommentRequired: false },
        { name: 'Ответ 2', weight: 55, isCommentRequired: true }
      ]
    }
  ]
}

test.describe('Questionnaire: single-answer questions', () => {
  test.describe.configure({ mode: 'serial' })
  test.beforeEach(async () => {
    await allure.suite('Questionnaire: single-answer questions')
  })

  let procedureUuid: string

  test('Создание закупки', async ({ browser }) => {
    await allure.step('Создание закупки с анкетой из 6 вопросов', async () => {
      const context = await browser.newContext({
        storageState: userBothRolesCustomerAuthFile
      })
      const user = userCreds.userBothRoles
      const apiAuth = new ApiAuth(context, user, 'customer', userBothRolesCustomerAuthFile)
      await apiAuth.login()

      const steps = getPositionsTenderSteps(
        nowAtMsk().toISO()!,
        nowAtMsk().plus({ minutes: 30 }).toISO()!
      )
      const procedureData = {
        ...defaultApiProcedureData,
        procedureInfo: {
          ...defaultApiProcedureData.procedureInfo,
          steps,
          questionary: questionarySettings
        }
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
      const pageNitification = new PageNotification(
        page,
        page.getByTestId('notification-warning').first()
      )
      await request.requestCreate(defaultRequestData, procedureUuid!, {
        beforeSignetPage: async () => {
          await pageNitification.checkWarningNotificationText(`Заполните данные в разделе Анкета`)
        },
        skipPublish: true
      })

      await context.close()
    })
  })
})
