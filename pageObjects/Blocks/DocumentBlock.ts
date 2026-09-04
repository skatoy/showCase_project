import { Buttons } from '#/components/Buttons'
import { TextInput } from '#/components/TextInput'
import { Locator, Page } from '@playwright/test'
import * as allure from 'allure-js-commons'

export type DocumentsBlock = {
  titleBlock?: string
  descriptionBlock?: string
  blockIsRequired?: boolean
}

export type DocumentEditorScope = 'container-editor' | 'lot-editor'

const documentBlockDescriptionInput = '[data-testid^="text-input-description_"]'

export class DocumentBlock {
  readonly page: Page
  readonly documentBlock: Locator
  readonly nameInput: TextInput
  readonly descriptionInput: TextInput
  readonly requiredCheckbox: Locator
  readonly confirmButton: Buttons
  readonly deleteButton: Buttons
  readonly addButton: Buttons

  constructor(page: Page, editor: DocumentEditorScope) {
    this.page = page
    this.documentBlock = page.getByTestId('documents-block')
    this.nameInput = new TextInput(
      page.getByRole('textbox', { name: 'Наименование блока*' }).last()
    )
    this.descriptionInput = new TextInput(page.locator(documentBlockDescriptionInput).last())
    this.requiredCheckbox = page.getByTestId('checkbox-not-checked')
    this.confirmButton = new Buttons(page.getByTestId('icon-check'))
    this.deleteButton = new Buttons(page.getByRole('button', { name: 'Удалить блок' }))
    this.addButton = new Buttons(page.getByTestId(editor).getByTestId('add-block-btn'))
  }

  async addNewBlock() {
    await allure.step('Добавить блок документов', async () => {
      await this.addButton.click()
    })
  }

  async fillTitle(title: string) {
    await allure.step(`Заполнить название блока документов: ${title}`, async () => {
      await this.nameInput.fill(title)
    })
  }

  async fillDescription(description: string) {
    await allure.step(`Заполнить описание блока документов: ${description}`, async () => {
      await this.descriptionInput.fill(description)
    })
  }

  async setRequired(index: number) {
    await allure.step(`Отметить блок документов как обязательный: ${index}`, async () => {
      await this.requiredCheckbox.nth(index).click()
    })
  }

  async deleteBlock(index: number) {
    await allure.step(`Удалить блок документов: ${index}`, async () => {
      await this.deleteButton.locator.nth(index).click()
    })
  }

  async blockAction(
    action: 'Создать' | 'Удалить',
    { titleBlock, descriptionBlock, blockIsRequired }: DocumentsBlock,
    blockIndex: number
  ) {
    await allure.step(`${action} блок документов`, async () => {
      if (action === 'Создать') {
        await this.addNewBlock()

        if (titleBlock) {
          await this.fillTitle(titleBlock)
        }

        if (descriptionBlock) {
          await this.fillDescription(descriptionBlock)
        }

        if (blockIsRequired) {
          await this.setRequired(blockIndex)
        }

        await this.confirmButton.click()
      }

      if (action === 'Удалить') {
        await this.deleteBlock(blockIndex)
      }
    })
  }

  async applyDocumentBlocks(
    documentsBlocks?: DocumentsBlock[],
    deleteDocumentBlocks?: number[]
  ) {
    await allure.step('Применить блоки документов', async () => {
      if (deleteDocumentBlocks) {
        for (const blockIndex of deleteDocumentBlocks) {
          await this.blockAction('Удалить', {}, blockIndex)
        }
      }

      if (documentsBlocks) {
        for (const [blockIndex, block] of documentsBlocks.entries()) {
          await this.blockAction('Создать', block, blockIndex)
        }
      }
    })
  }
}
