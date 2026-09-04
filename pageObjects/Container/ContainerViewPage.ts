import { Buttons } from '#/components/Buttons'
import { type Page, type Locator } from '@playwright/test'
import { ChatModalWindow } from '../Chat/ChatPage'
import * as allure from 'allure-js-commons'

export class ContainerViewPage {
  readonly page: Page
  readonly chat: ChatModalWindow
  readonly backButton: Buttons
  readonly editButton: Buttons
  readonly copyButton: Buttons
  readonly submitApplicationButton: Buttons
  readonly downloadArchiveButton: Buttons
  readonly downloadNoticeButton: Buttons
  readonly containerTitle: Locator
  readonly containerNumber: Locator
  readonly containerBannerEmpty: Locator
  readonly containerBannerView: Locator
  readonly containerBannerFromIntegration: Locator
  readonly containerDocuments: Locator
  readonly containerType: Locator
  readonly containerTypeName: Locator
  readonly containerDepartment: Locator
  readonly containerDepartmentRole: Locator
  readonly lotNumber: Locator
  readonly lotDownTimer: Locator
  readonly lotWithoutPrice: Locator
  readonly priceContainer: Locator
  readonly priceInt: Locator
  readonly priceFloat: Locator
  readonly priceCurrency: Locator
  readonly lotStatus: Locator
  readonly lotCountView: Locator
  readonly lotCountParticipants: Locator
  readonly lotCountRequest: Locator
  readonly lotCountMessage: Locator
  readonly lotClosed: Locator
  readonly iconIntegration: Locator
  readonly lotAcceptApplicationsStart: Locator
  readonly lotItem: Locator
  readonly containerCancelButton: Locator
  readonly lotViewButton: Locator
  readonly containerDownloadDocumentButton: Locator
  readonly containerEditBannerButton: Locator
  readonly containerNotificationsTab: Locator
  readonly containerOverviewTab: Locator

  constructor(page: Page) {
    this.page = page
    this.chat = new ChatModalWindow(page)
    this.backButton = new Buttons(page.getByTestId('move-back-btn'))
    this.editButton = new Buttons(page.getByTestId('edit-btn'))
    this.copyButton = new Buttons(page.getByTestId('copy-btn'))
    this.submitApplicationButton = new Buttons(page.getByTestId('add-request-btn'))
    this.downloadArchiveButton = new Buttons(page.getByTestId('download-archive-btn'))
    this.downloadNoticeButton = new Buttons(page.getByTestId('button-outline'))
    this.containerTitle = page.getByTestId('title')
    this.containerNumber = page.getByTestId('container-registry-number')
    this.containerBannerEmpty = page.getByTestId('procedure-global-banner-empty')
    this.containerBannerView = page.getByTestId('procedure-global-banner-view')
    this.containerBannerFromIntegration = page.getByTestId('procedure-global-banner-integration')
    this.containerDocuments = page.getByTestId('procedure-documents')
    this.containerType = page.getByTestId('procedure-type')
    this.containerTypeName = page.getByTestId('procedure-views-count')
    this.containerDepartment = page.getByTestId('procedure-department')
    this.containerDepartmentRole = page.getByTestId('procedure-departmentRole')
    this.lotNumber = page.getByTestId('lot-number')
    this.lotDownTimer = page.getByTestId('count-down-timer')
    this.lotWithoutPrice = page.getByTestId('without-price')
    this.priceContainer = page.getByTestId('price')
    this.priceInt = page.getByTestId('price-int')
    this.priceFloat = page.getByTestId('price-float')
    this.priceCurrency = page.getByTestId('price-currency')
    this.lotStatus = page.getByTestId('procedure-status')
    this.lotCountView = page.getByTestId('procedure-views-count')
    this.lotCountParticipants = page.getByTestId('participants-count')
    this.lotCountRequest = page.getByTestId('request-count')
    this.containerCancelButton = page.getByText('Отменить закупку')
    this.lotViewButton = page.getByText('Просмотреть')
    this.containerNotificationsTab = page.getByText('Рассылка уведомлений')
    this.containerOverviewTab = page.getByText('Обзор')
    this.lotCountMessage = page.getByTestId('badge')
    this.lotClosed = page.getByTestId('icon-locked')
    this.iconIntegration = page.getByTestId('icon-integration')
    this.containerDownloadDocumentButton = page.getByTestId('icon-download')
    this.containerEditBannerButton = page.getByTestId('icon-edit')
    this.lotAcceptApplicationsStart = page.getByTestId('procedure-acceptance-date')
    this.lotItem = page.getByTestId('procedure-card')
  }

  async clickBack(): Promise<void> {
    await allure.step('Нажать: Назад', async () => {
      await this.backButton.click()
    })
  }

  async clickEdit(): Promise<void> {
    await allure.step('Нажать: Редактировать', async () => {
      await this.editButton.click()
    })
  }

  async submitApplication(): Promise<void> {
    await allure.step('Нажать: Подать заявку', async () => {
      await this.submitApplicationButton.click()
    })
  }

  async openNotificationsTab(): Promise<void> {
    await allure.step('Вкладка Рассылка уведомлений', async () => {
      await this.containerNotificationsTab.click()
    })
  }

  async openOverviewTab(): Promise<void> {
    await allure.step('Вкладка Обзор', async () => {
      await this.containerOverviewTab.click()
    })
  }

  async openLot(): Promise<void> {
    await allure.step('Перейти к просмотру лота', async () => {
      await this.lotViewButton.click()
    })
  }

  async copyContainer(): Promise<void> {
    await allure.step('Копировать закупку', async () => {
      await this.copyButton.click()
    })
  }

  async cancelContainer(): Promise<void> {
    await allure.step('Отменить контейнер', async () => {
      await this.containerCancelButton.click()
    })
  }

  async downloadSingleDocument(): Promise<void> {
    await allure.step('Скачать документ', async () => {
      await this.containerDownloadDocumentButton.first().click()
    })
  }

  async downloadDocumentsArchive(): Promise<void> {
    await allure.step('Скачать архив', async () => {
      await this.downloadArchiveButton.click()
    })
  }

  async downloadTheNotice(): Promise<void> {
    await allure.step('Скачать извещение', async () => {
      await this.downloadNoticeButton.click()
    })
  }

  async editBanner(): Promise<void> {
    await allure.step('Редактировать баннер', async () => {
      await this.containerEditBannerButton.click()
    })
  }
}
