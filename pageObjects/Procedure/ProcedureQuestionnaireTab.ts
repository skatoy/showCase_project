import { Buttons } from '#/components/Buttons'

import { Tabs } from '#/components/Tabs'
import { Page, Locator } from '@playwright/test'
import { TextInput } from '#/components/TextInput'
import * as allure from 'allure-js-commons'

export type AnswerData = { text: string; weight?: number; isCommentRequired: boolean }
export type Questionary = {
  questionTitle: string
  questionType?: string
  addAnswer?: boolean
  answers?: AnswerData[]
  customAnswer?: boolean
}[]

export type EditingQuestionaryData = {
  questionTitle: string
  questionsData: Questionary
}

export class QuestionnaireTab {
  readonly page: Page
  readonly addQuestionButton: Buttons
  readonly addAnswerButton: Buttons
  readonly saveButton: Buttons
  readonly editQuestionButton: Buttons
  readonly deleteQuestionButton: Buttons
  readonly tab: Tabs
  readonly informationBanner: Locator
  readonly questionTitle: TextInput
  readonly requiredTypeSupplier: Locator
  readonly questionTypeAnswer: Locator
  readonly answerName: Locator
  readonly commentRequired: Locator
  readonly wightAnswer: TextInput
  readonly customAnswer: Locator
  readonly deleteAnswer: Locator
  readonly questionTitleList: Locator

  constructor(page: Page) {
    this.page = page
    this.addQuestionButton = new Buttons(page.getByRole('button', { name: 'Добавить вопрос' }))
    this.addAnswerButton = new Buttons(page.getByRole('button', { name: 'Добавить ответ' }))
    this.saveButton = new Buttons(page.getByRole('button', { name: 'Сохранить', exact: true }))
    this.editQuestionButton = new Buttons(page.getByRole('button', { name: 'Редактировать' }))
    this.deleteQuestionButton = new Buttons(page.getByRole('button', { name: 'Удалить вопрос' }))
    this.tab = new Tabs(page)
    this.informationBanner = page.getByTestId('questionary-notification-banner')
    this.questionTitle = new TextInput(page.getByPlaceholder('Напишите вопрос'))
    this.requiredTypeSupplier = page.getByTestId('radio-buttons-requiredForParticipantType')
    this.questionTypeAnswer = page.getByTestId('radio-buttons-answerType')
    this.answerName = page.getByPlaceholder('Укажите вариант ответа')
    this.wightAnswer = new TextInput(page.getByPlaceholder('Вес'))
    this.deleteAnswer = page.getByTestId('delete-answer')
    this.commentRequired = page.getByTestId('checkbox-is-comment-required')
    this.customAnswer = page.getByTestId('checkbox-is-custom-answer-allowed')
    this.questionTitleList = page.getByTestId('question-title-list')
  }

  async fillQuestionaryPage(questionData: Questionary) {
    await allure.step('Вкладка: "Анкета"', async () => {
      await this.tab.selectTab('questionary')

      if (questionData) {
        await this.addQuestionary(questionData)
      }
    })
  }

  async fillQuestionTitle(questionTitle: string) {
    await allure.step(`Заполнить текст вопроса: ${questionTitle}`, async () => {
      await this.questionTitle.fill(questionTitle)
    })
  }

  async requiredBySupplierType(supplierType: string) {
    await allure.step(`Выбрать тип поставщика для вопроса: ${supplierType}`, async () => {
      await this.requiredTypeSupplier.getByText(supplierType).click()
    })
  }

  async fillAnswer(fieldIndex: number, answer: string) {
    await allure.step(`Заполнить вариант ответа: ${fieldIndex + 1}`, async () => {
      await this.answerName.nth(fieldIndex).fill(answer)
    })
  }

  async fillAnswerWeight(fieldIndex: number, weight: number) {
    await allure.step(`Заполнить вес ответа: ${fieldIndex + 1}`, async () => {
      await this.wightAnswer.locator.nth(fieldIndex).fill(weight.toString())
      await this.page.keyboard.press('ArrowDown')
      await this.page.keyboard.press('Enter')
    })
  }

  async setCommentRequired(checkboxIndex: number) {
    await allure.step(`Отметить обязательность комментария: ${checkboxIndex + 1}`, async () => {
      await this.commentRequired.nth(checkboxIndex).click()
    })
  }

  async setCustomAnswerAllowed() {
    await allure.step('Разрешить свой вариант ответа', async () => {
      await this.customAnswer.click()
    })
  }

  async choiceAnswerType(answerType: string) {
    await allure.step(`Выбрать тип ответа: ${answerType}`, async () => {
      await this.questionTypeAnswer.getByText(answerType).click()
    })
  }

  async addQuestionary(questionData: Questionary) {
    await allure.step(`Добавить вопросы анкеты: ${questionData.length}`, async () => {
      for (const question of questionData) {
        await this.addQuestionButton.click()
        await this.fillQuestionTitle(question.questionTitle)

        if (question.questionType) {
          await this.questionTypeAnswer.getByText(question.questionType).click()
        }

        if (question.answers) {
          await this.fillQuestionAnswers(question.answers)
        }

        if (question.customAnswer) {
          await this.setCustomAnswerAllowed()
        }

        await this.saveButton.click()
      }
    })
  }

  async fillQuestionAnswers(answers: AnswerData[]) {
    await allure.step(`Заполнить варианты ответа: ${answers.length}`, async () => {
      for (const [index, answer] of answers.entries()) {
        if (index >= 2) {
          await this.addAnswerButton.click()
        }

        await this.fillAnswer(index, answer.text)

        if (answer.weight) {
          await this.fillAnswerWeight(index, answer.weight)
        }

        if (answer.isCommentRequired) {
          await this.setCommentRequired(index)
        }
      }
    })
  }

  async clickQuestionTitle(title: string) {
    await allure.step('Нажать: Заголовок вопроса', async () => {
      await this.questionTitleList.getByText(title, { exact: true }).click()
    })
  }

  async deleteQuestion(questionTitle: string) {
    await allure.step(`Удалить вопрос: ${questionTitle}`, async () => {
      await this.clickQuestionTitle(questionTitle)
      await this.editQuestionButton.click()
      await this.deleteQuestionButton.click()
    })
  }

  async deleteQuestions(questionTitles: string[]) {
    await allure.step('Удалить вопросы', async () => {
      for (const questionTitle of questionTitles) {
        await this.deleteQuestion(questionTitle)
      }
    })
  }

  async editQuestions({ questionTitle, questionsData }: EditingQuestionaryData) {
    await allure.step(`Отредактировать вопрос: ${questionTitle}`, async () => {
      await this.tab.selectTab('questionary')

      for (const question of questionsData) {
        await this.deleteQuestion(questionTitle)
        await this.addQuestionary([question])
      }
    })
  }
}
