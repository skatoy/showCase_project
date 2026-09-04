import { Locator, Page } from '@playwright/test'
import * as allure from 'allure-js-commons'

export class ChatListBase {
  readonly page: Page
  readonly loading: Locator
  readonly messageBadgeIcon: Locator
  chatList: Locator
  openChatListIcon: Locator
  readonly readMessageIcon: Locator
  readonly sendMessageIcon: Locator
  readonly importantMessageIcon: Locator
  selfChatTab: Locator
  allChatTab: Locator

  constructor(page: Page) {
    this.page = page
    this.loading = page.getByTestId('skeleton')
    this.messageBadgeIcon = page.getByTestId('badge')
    this.selfChatTab = page.getByTestId('tab-element-own')
    this.allChatTab = page.getByTestId('tab-element-all')
    this.chatList = page.getByTestId('chat-list-scroll')
    this.readMessageIcon = page.getByTestId('icon-check_double')
    this.sendMessageIcon = page.getByTestId('icon-check')
    this.importantMessageIcon = page.getByTestId('important-message-active')
    this.openChatListIcon = page.getByTestId('menu-navigation-chats')
  }

  async waitForLoading() {
    await allure.step('Дождаться загрузки чатов', async () => {
      await this.loading.waitFor({ state: 'hidden' })
    })
  }

  async openChat(chatNumber: string) {
    await allure.step('Открыть Чат', async () => {
      await this.chatList.waitFor({ state: 'visible' })
      await this.chatList.getByTestId(`chat-list-item-${chatNumber}`).click()
    })
  }

  async changeTab(tab: 'Все' | 'Мои') {
    await allure.step('Сменить вкладку чата', async () => {
      if (tab === 'Все') {
        await this.allChatTab.click()
      } else if (tab === 'Мои') {
        await this.selfChatTab.click()
      }
    })
  }

  async openChatWindow() {
    await allure.step('Открыть окно чата', async () => {
      await this.openChatListIcon.click()
      await this.waitForLoading()
    })
  }

  async openChatWithTab(chatNumber: string, tab?: 'Все' | 'Мои') {
    await allure.step('Открыть чат на вкладке', async () => {
      await this.openChatWindow()

      if (tab) {
        await this.changeTab(tab)
      }

      await this.openChat(chatNumber)
    })
  }
}

export class ChatListPage extends ChatListBase {
  constructor(page: Page) {
    super(page)
  }
}

export class ChatModalList extends ChatListBase {
  readonly modalChatBody: Locator
  readonly chatFullscreenIcon: Locator

  constructor(page: Page) {
    super(page)
    this.openChatListIcon = page.getByTestId('request-chat-opener')
    this.modalChatBody = page.getByTestId('request-chat-window')
    this.selfChatTab = this.modalChatBody.getByTestId('tab-element-own')
    this.allChatTab = this.modalChatBody.getByTestId('tab-element-all')
    this.chatFullscreenIcon = this.modalChatBody.getByTestId('icon-fullscreen')
    this.chatList = this.modalChatBody.getByTestId('chat-list-scroll')
  }

  async switchFullWindow() {
    await allure.step('Переключить вид окна чата', async () => {
      await this.chatFullscreenIcon.click()
    })
  }
}
