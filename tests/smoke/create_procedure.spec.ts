import * as allure from 'allure-js-commons'
import { createProcedure } from '#/BusinessLogic/CreateProcedure'
import { CreateContainerData } from '#/pageObjects/Container/ContainerGeneralInfoTab'
import { defaultProcedureData, ProcedureData } from '#/testData/ProcedureData'
import { runnerName } from '#/utils/elkLogin'
import { createPageState } from '#/utils/pageState'
import { userBothRolesCustomerAuthFile } from '#/utils/setupConfig'
import test from '@playwright/test'
import { nanoid } from 'nanoid'

const newData: ProcedureData = {
  ...defaultProcedureData,
  container: {
    ...defaultProcedureData.container,
    customName: `custom ${nanoid()} by ${runnerName}`
  },
  procedure: { ...defaultProcedureData.procedure, procedureTitle: 'update' },
  contacts: {
    ...defaultProcedureData.contacts,
    newContact: { lastName: 'baobab', firstName: 'ivan', phone: '177445672', email: '1@1.ry' }
  },
  ...defaultProcedureData.questionary,
  questionary: [
    {
      questionTitle: 'The Ultimate Question of Life, the Universe, and Everything',
      questionType: 'Ответ текстом'
    }
  ],
  position: {
    ...defaultProcedureData.position,
    requirements: [
      {
        title: 'The Ultimate Question of Life, the Universe, and Everything',
        type: 'Ответ текстом',
        documents: {
          filesNames: [],
          fileBuffer: undefined,
          dropzoneIndex: undefined
        },
        needAnswer: false,
        forMainOffer: false,
        forAnalogOffer: false
      }
    ],
    position: [
      {
        positionTitle: 'Позиция 1',
        quantity: '10',
        okpd: 'авокадо',
        okei: 'АБОНЕНТ',
        description: 'Тестовое описание',
        requirements: [
          {
            title: 'The Ultimate Question of Life, the Universe, and Everything',
            type: 'Ответ текстом',
            documents: {
              filesNames: [],
              fileBuffer: undefined,
              dropzoneIndex: undefined
            },
            needAnswer: false,
            forMainOffer: false,
            forAnalogOffer: false
          }
        ]
      },
      {
        positionTitle: 'Позиция 2',
        quantity: '10',
        okpd: 'авокадо',
        okei: 'АБОНЕНТ',
        description: 'Тестовое описание',
        relation: 'Позиция 1'
      },
      { positionTitle: 'Позиция 3', quantity: '10', okpd: 'авокадо', okei: 'АБОНЕНТ' }
    ]
  }
}
test.describe('Тест создания закупки', () => {
  test.describe.configure({ mode: 'serial' })
  test.beforeEach(async () => {
    await allure.suite('Тест создания закупки')
  })

  const containerData: CreateContainerData = {
    containerTitle: defaultProcedureData.container.containerTitle
  }

  test('Создание закупки', async ({ browser }) => {
    await allure.step('Подготовить закупку', async () => {
      const { page, context } = await createPageState(browser, userBothRolesCustomerAuthFile)
      const procedure = createProcedure(page, containerData)
      await procedure.procedureCreate(newData)
      await context.close()
    })
  })
})
