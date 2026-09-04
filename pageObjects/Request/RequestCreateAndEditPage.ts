import { Buttons } from '#/components/Buttons'
import { Page } from '@playwright/test'
import { RequestData } from '#/testData/RequestData'
import { RequestDocumentsTab } from './RequestDocumentsTab'
import { RequestPositionTab } from './RequestPositionTab'
import { RequestQuestionnaireTab } from './RequestQuestionnaireTab'
import * as allure from 'allure-js-commons'

export class RequestCreateAndEditPage {
  readonly page: Page
  readonly saveRequestButton: Buttons
  readonly moveForwardButton: Buttons
  readonly positionTab: RequestPositionTab
  readonly questionaryTab: RequestQuestionnaireTab
  readonly documentsTab: RequestDocumentsTab

  constructor(page: Page) {
    this.page = page
    this.saveRequestButton = new Buttons(page.getByTestId('save-request-btn'), 'Сохранить заявку')
    this.moveForwardButton = new Buttons(page.getByRole('button', { name: 'Далее' }))
    this.positionTab = new RequestPositionTab(page)
    this.questionaryTab = new RequestQuestionnaireTab(page)
    this.documentsTab = new RequestDocumentsTab(page)
  }

  async fillRequestData(data: RequestData) {
    await allure.step('Заполнить заявку', async () => {
      if (data.positions?.length) {
        await this.positionTab.fillPositions(data.positions)
      }

      if (data.questionary?.length) {
        for (const questionItem of data.questionary) {
          await this.questionaryTab.fillQuestionAnswer(questionItem.questionTitle, questionItem)
        }
      }

      if (data.containerDocuments) {
        await this.documentsTab.fillContainerDocumentsBlock(data.containerDocuments)
      }

      if (data.procedureDocuments) {
        await this.documentsTab.fillProcedureDocumentsBlock(data.procedureDocuments)
      }

      if (data.containerDocuments || data.procedureDocuments) {
        await this.saveRequest()
      }
    })
  }

  async saveRequest() {
    await allure.step('Сохранить заявку', async () => {
      await this.saveRequestButton.click()
    })
  }

  async goToSignetPage(afterClick?: () => Promise<void>) {
    await allure.step('Перейти на страницу подписания', async () => {
      await this.moveForwardButton.click()
      if (afterClick) {
        await afterClick()
      }
    })
  }
}
