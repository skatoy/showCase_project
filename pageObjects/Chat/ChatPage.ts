import { Locator, Page } from '@playwright/test'
import * as allure from 'allure-js-commons'

export class BaseChatPage {
  readonly page: Page
  readonly backToChatListIcon: Locator
  readonly readMessageIcon: Locator
  readonly sendMessageIcon: Locator
  readonly importantMessageIcon: Locator
  readonly messageFileArrow: Locator
  readonly definiteMessageReply: Locator
  chatMessageInput: Locator
  chatMessageMakeImportant: Locator
  sendChatMessage: Locator
  addFileIcon: Locator

  constructor(page: Page) {
    this.page = page
    this.backToChatListIcon = page.getByTestId('icon-arrow')
    this.readMessageIcon = page.getByTestId('icon-check_double')
    this.sendMessageIcon = page.getByTestId('icon-check')
    this.importantMessageIcon = page.getByTestId('important-message-active')
    this.messageFileArrow = page.getByTestId('chat-file-chevron')
    this.definiteMessageReply = page.getByTestId('icon-share')
    this.addFileIcon = page.getByTestId('icon-paperclip')
    this.chatMessageInput = page.locator('#text')
    this.chatMessageMakeImportant = page.getByTestId('important-message')
    this.sendChatMessage = page.getByTestId('send-message')
  }

  async fillChatMessage(message: string) {
    await allure.step('Заполнить сообщение чата', async () => {
      await this.chatMessageInput.waitFor({ state: 'visible' })
      await this.chatMessageInput.click()
      await this.chatMessageInput.fill(message)
    })
  }

  async sendMessage() {
    await allure.step('Отправить сообщение', async () => {
      await this.sendChatMessage.click()
    })
  }

  async fillAndSendMessage(message: string, important: boolean = false, fileName?: string) {
    await allure.step('Заполнить сообщение и отправить', async () => {
      await this.fillChatMessage(message)

      if (important) {
        await this.makeMessageImportant()
      }

      if (fileName) {
        await this.addMessageFile(fileName)
      }

      await this.sendMessage()
    })
  }

  async makeMessageImportant() {
    await allure.step('Сделать сообщение важным', async () => {
      await this.chatMessageMakeImportant.click()
    })
  }

  async moveBack() {
    await allure.step('Вернуться назад', async () => {
      await this.backToChatListIcon.click()
    })
  }

  async addMessageFile(fileName: string) {
    await allure.step('Добавить вложение', async () => {
      const path = `./fixtures/${fileName}`
      await this.addFileIcon.click()
      await this.addFileIcon.setInputFiles(path)
    })
  }

  async replyMessage(messageNumber: string) {
    await allure.step('Ответить на сообщение', async () => {
      await this.page
        .getByTestId(`chat-message-${messageNumber}`)
        .getByTestId('icon-share')
        .nth(1)
        .click()
    })
  }
}

export class ChatPage extends BaseChatPage {
  readonly chatModalForm: Locator

  constructor(page: Page) {
    super(page)
    this.chatModalForm = page.getByTestId('chat-form')
  }
}

export class ChatModalWindow extends BaseChatPage {
  readonly modalChatBody: Locator
  readonly chatFullscreenIcon: Locator
  readonly chatModalForm: Locator

  constructor(page: Page) {
    super(page)
    this.modalChatBody = page.getByTestId('request-chat-window')
    this.chatFullscreenIcon = this.modalChatBody.getByTestId('icon-fullscreen')
    this.chatModalForm = page.getByTestId('chat-form')

    this.addFileIcon = this.chatModalForm.getByTestId('chat-file-input')
    this.chatMessageInput = this.chatModalForm.locator('#text')
    this.chatMessageMakeImportant = this.chatModalForm.getByTestId('important-message')
    this.sendChatMessage = this.chatModalForm.getByTestId('send-message')
  }

  async switchFullWindow() {
    await allure.step('Переключить вид окна чата', async () => {
      await this.modalChatBody.getByTestId('icon-fullscreen').nth(1).click()
    })
  }

  async fillChatMessage(message: string) {
    await allure.step('Заполнить сообщение чата', async () => {
      await this.chatMessageInput.waitFor({ state: 'visible' })
      await this.chatMessageInput.click()
      await this.chatMessageInput.fill(message)
    })
  }

  override async addMessageFile(fileName: string) {
    await allure.step('Добавить вложение', async () => {
      await this.addFileIcon.hover()
      super.addMessageFile(fileName)
    })
  }
}
