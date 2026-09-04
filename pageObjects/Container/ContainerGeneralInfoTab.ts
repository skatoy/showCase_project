import { Buttons } from '#/components/Buttons'
import { DocumentBlock, DocumentsBlock } from '#/pageObjects/Blocks/DocumentBlock'
import { TextInput } from '#/components/TextInput'
import { type Page, type Locator, expect } from '@playwright/test'
import { DocumentsConfig, Files } from '#/utils/files'
import { Tabs } from '#/components/Tabs'
import { Select } from '#/components/Select'
import * as allure from 'allure-js-commons'

export type { DocumentsBlock } from '#/pageObjects/Blocks/DocumentBlock'

export type EditingContainerData = {
  containerTitle?: string
  customName?: string
  addFileConfig?: DocumentsConfig
  documentsBlocks?: DocumentsBlock[]
  deleteDocumentBlocks?: number[]
}
export type CreateContainerData = {
  containerUuid?: string
  registryNumber?: string
  containerTitle: string
  procedureType?: string
  customName?: string
  addFileConfig?: DocumentsConfig
  documentsBlocks?: DocumentsBlock[]
  deleteDocumentBlocks?: number[]
}

export class ContainerGeneralInfoTab {
  readonly page: Page
  readonly files: Files
  readonly tab: Tabs
  readonly documents: DocumentBlock
  readonly saveContainerButton: Buttons
  readonly generalInformation: Locator
  readonly containerTitle: TextInput
  readonly selectPurchaseType: Select
  readonly customNamePurchaseType: TextInput
  readonly documentsDropzone: Locator
  readonly dragonDropDocumentBlockIcon: Locator
  readonly informationBlockBanner: Locator
  constructor(page: Page) {
    this.page = page
    this.tab = new Tabs(page)
    this.files = new Files(page)
    this.documents = new DocumentBlock(page, 'container-editor')
    this.saveContainerButton = new Buttons(
      page.getByRole('button', { name: 'Сохранить закупку', exact: true })
    )
    this.generalInformation = page.getByTestId('tab-element-general')
    this.containerTitle = new TextInput(page.getByTestId('text-input-title').first())
    this.selectPurchaseType = new Select(page.getByTestId('select-type'))
    this.customNamePurchaseType = new TextInput(page.getByTestId('text-input-typeCustomName'))
    this.documentsDropzone = page.getByTestId('dropzone')
    this.informationBlockBanner = page.getByTestId('banner')
    this.dragonDropDocumentBlockIcon = page.getByTestId('icon-drag_drop')
  }

  async fillContainerTitle(containerTitle: string) {
    await allure.step(`Заполнить поле "Наименование закупки": ${containerTitle}`, async () => {
      await this.containerTitle.fill(containerTitle)
    })
  }

  async choiceProcedureType(procedureType: string) {
    await allure.step('Выбрать тип процедуры', async () => {
      await this.selectPurchaseType.select(procedureType)
    })
  }

  async fillCustomName(customName: string) {
    await allure.step(`Заполнить поле "Наименование способа закупки": ${customName}`, async () => {
      await this.customNamePurchaseType.fill(customName)
    })
  }

  async saveContainer() {
    await allure.step('Сохранить контейнер', async () => {
      await this.saveContainerButton.click()
    })
  }

  async createContainer({
    containerTitle,
    procedureType,
    customName,
    addFileConfig,
    documentsBlocks,
    deleteDocumentBlocks
  }: CreateContainerData) {
    await allure.step('Создать контейнер закупки', async () => {
      await this.tab.selectTab('general')
      await this.fillContainerTitle(containerTitle)

      if (procedureType) {
        await this.choiceProcedureType(procedureType)
      }

      if (customName) {
        await this.fillCustomName(customName)
      }

      if (addFileConfig) {
        await this.files.addFiles(addFileConfig)
      }

      await this.documents.applyDocumentBlocks(documentsBlocks, deleteDocumentBlocks)
      await this.saveContainerButton.click()
    })
  }

  async editContainer({
    containerTitle,
    customName,
    addFileConfig,
    documentsBlocks,
    deleteDocumentBlocks
  }: EditingContainerData) {
    await allure.step('Редактировать контейнер закупки', async () => {
      if (containerTitle) {
        await this.page.getByTestId(`tab-element-general`).waitFor({ state: 'visible' })
        await this.page.getByTestId(`tab-element-general`).click({ force: true })
        await this.containerTitle.locator.waitFor()
        await this.fillContainerTitle(containerTitle)
      }

      if (customName) {
        await this.fillCustomName(customName)
      }

      if (addFileConfig) {
        await this.files.addFiles(addFileConfig)
      }

      await this.documents.applyDocumentBlocks(documentsBlocks, deleteDocumentBlocks)
    })
  }

  async visibleBannerInformation() {
    expect(this.informationBlockBanner).toBeVisible()
  }
}
