import { Files } from '#/utils/files'
import { Page } from '@playwright/test'
import { ContactsTab } from '../Procedure/ProcedureContactsTab'
import { ProcedureParamsTab } from '../Procedure/ProcedureParamsTab'
import { ProcedureRequestParamsTab } from '../Procedure/ProcedureRequestParamsTab'
import { Buttons } from '#/components/Buttons'
import { ProcedureData, SinglePriceProcedureData } from '#/testData/ProcedureData'
import { ContainerGeneralInfoTab } from './ContainerGeneralInfoTab'
import { QuestionnaireTab } from '../Procedure/ProcedureQuestionnaireTab'
import { ProcedurePositionsTab } from '../Procedure/ProcedurePositionTab'
import * as allure from 'allure-js-commons'

export class ContainerCreateAndEditPage {
  readonly page: Page
  readonly moveForwardButton: Buttons
  readonly publishButton: Buttons
  readonly files: Files
  readonly container: ContainerGeneralInfoTab
  readonly procedureParamsTab: ProcedureParamsTab
  readonly requestParamsTab: ProcedureRequestParamsTab
  readonly contactsTab: ContactsTab
  readonly questionaryTab: QuestionnaireTab
  readonly positionTab: ProcedurePositionsTab

  constructor(page: Page) {
    this.page = page
    this.files = new Files(page)
    this.moveForwardButton = new Buttons(page.getByRole('button', { name: 'Далее' }))
    this.publishButton = new Buttons(page.getByRole('button', { name: 'Опубликовать' }))
    this.container = new ContainerGeneralInfoTab(page)
    this.procedureParamsTab = new ProcedureParamsTab(page)
    this.requestParamsTab = new ProcedureRequestParamsTab(page)
    this.contactsTab = new ContactsTab(page)
    this.questionaryTab = new QuestionnaireTab(page)
    this.positionTab = new ProcedurePositionsTab(page)
  }

  async fillProcedureData(data: ProcedureData | SinglePriceProcedureData) {
    return await allure.step('Заполнить данные закупки', async () => {
      await this.container.createContainer(data.container)
      await this.procedureParamsTab.fillProcedureParamPage(data.procedure)

      if (data.requestParam) {
        await this.requestParamsTab.fillRequestParamPage(data.requestParam)
      }

      if (data.contacts) {
        await this.contactsTab.fillContactsTab(data.contacts)
      }

      if (data.questionary) {
        await this.questionaryTab.fillQuestionaryPage(data.questionary)
      }

      await this.positionTab.fillPositionTab(data.position)
      await this.moveForwardButton.click()
      await this.publishButton.click()

      return this.page.url().split('/').reverse()[0]
    })
  }

  async procedureMoveNextStep() {
    await allure.step('Нажать: Далее', async () => {
      await this.moveForwardButton.click()
    })
  }

  async procedurePublish() {
    await allure.step('Нажать: Опубликовать', async () => {
      await this.publishButton.click()
    })
  }
}
