import { TextInput } from '#/components/TextInput'
import { Page } from '@playwright/test'
import * as allure from 'allure-js-commons'

export type DeliveryParams = {
  conditional: string
  address: string
  date: string
}

export class DeliveryBlock {
  readonly page: Page
  readonly deliveryConditional: TextInput
  readonly deliveryAddress: TextInput
  readonly deliveryDate: TextInput

  constructor(page: Page) {
    this.page = page
    this.deliveryConditional = new TextInput(page.getByTestId('text-input-deliveryCondition'))
    this.deliveryAddress = new TextInput(page.getByTestId('text-input-deliveryAddress'))
    this.deliveryDate = new TextInput(page.getByTestId('text-input-deliveryDate'))
  }

  async fillDeliveryConditional(conditional: string) {
    await allure.step(`Заполнить условие поставки: ${conditional}`, async () => {
      await this.deliveryConditional.fill(conditional)
    })
  }

  async fillDeliveryAddress(address: string) {
    await allure.step(`Заполнить адрес поставки: ${address}`, async () => {
      await this.deliveryAddress.fill(address)
    })
  }

  async fillDeliveryDate(date: string) {
    await allure.step(`Заполнить дату поставки: ${date}`, async () => {
      await this.deliveryDate.fill(date)
    })
  }

  async fill({ conditional, address, date }: DeliveryParams) {
    await allure.step('Заполнить условия поставки', async () => {
      await this.fillDeliveryConditional(conditional)
      await this.fillDeliveryAddress(address)
      await this.fillDeliveryDate(date)
    })
  }

  async clear() {
    await allure.step('Очистить условия поставки', async () => {
      await this.deliveryConditional.clear()
      await this.deliveryAddress.clear()
      await this.deliveryDate.clear()
    })
  }
}
