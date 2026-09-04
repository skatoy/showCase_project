import { Tabs } from '#/components/Tabs'
import { Page, Locator } from '@playwright/test'
import * as allure from 'allure-js-commons'

export type QuestionAnswerData = {
  questionTitle: string
  questionType: 'single' | 'multiple' | 'text' | 'file' | 'date' | 'number' | undefined
  answers: string[]
  customAnswer?: string
  commentAnswer?: string
}

export class RequestQuestionnaireTab {
  readonly page: Page
  readonly tab: Tabs

  readonly questionSingleAnswer: Locator
  readonly questionCustomSingleAnswer: Locator
  readonly questionCard: Locator
  readonly questionComments: Locator
  readonly questionMultipleAnswer: Locator
  readonly questionCustomMultipleAnswer: Locator
  readonly questionTextAnswer: Locator
  readonly questionFileAnswer: Locator
  readonly questionDateAnswer: Locator
  readonly questionNumberAnswer: Locator

  constructor(page: Page) {
    this.page = page
    this.tab = new Tabs(page)

    this.questionSingleAnswer = page.getByTestId('single-answer-block')
    this.questionCustomSingleAnswer = page.getByTestId('custom-answer-single')
    this.questionMultipleAnswer = page.getByTestId('multiple-answer-block')
    this.questionCustomMultipleAnswer = page.getByTestId('custom-answer-multiple')
    this.questionCard = page.getByTestId('questionary-view')
    this.questionComments = page.getByTestId('text-input-comment')
    this.questionTextAnswer = page.getByTestId('text-input-custom-answer')
    this.questionFileAnswer = page.getByTestId('dropzone')
    this.questionDateAnswer = page.getByTestId('date-picker-date')
    this.questionNumberAnswer = page.getByTestId('numeric-answer-input')
  }

  async cardClick(questionName: string) {
    await allure.step(`Выбрать вопрос: ${questionName}`, async () => {
      const question = this.questionCard.filter({ hasText: questionName })
      await question.click()
    })
  }

  async fillQuestionAnswer(questionName: string, answerData: QuestionAnswerData) {
    await allure.step(`Заполнить ответы на анкету`, async () => {
      await this.tab.selectTab('questionary')
      await this.cardClick(questionName)
      const question = this.questionCard.filter({ hasText: questionName }).first()
      const { questionType, answers, customAnswer, commentAnswer } = answerData

      switch (questionType) {
        case 'single': {
          await question.getByText(answers[0]).click()

          if (customAnswer) {
            await question.locator(this.questionCustomSingleAnswer).fill(customAnswer)
          }

          if (commentAnswer) {
            await question.locator(this.questionComments).fill(commentAnswer)
          }

          break
        }

        case 'multiple': {
          for (const answer of answers) {
            await question.getByText(answer).click()
          }

          if (customAnswer) {
            await question.locator(this.questionCustomMultipleAnswer).fill(customAnswer)
          }

          if (commentAnswer) {
            await question.locator(this.questionComments).fill(commentAnswer)
          }

          break
        }

        case 'text': {
          await question.locator(this.questionTextAnswer).fill(answers[0])
          break
        }

        case 'file': {
          const dropzone = question.locator(this.questionFileAnswer)
          const fileInput = dropzone.locator('input[type="file"]')
          const filePaths = answers.map(file => `./fixtures/${file}`)
          await fileInput.setInputFiles(filePaths)
          break
        }

        case 'date': {
          await question.locator(this.questionDateAnswer).fill(answers[0])
          break
        }

        case 'number': {
          await question.locator(this.questionNumberAnswer).fill(answers[0])
          break
        }
      }
    })
  }
}
