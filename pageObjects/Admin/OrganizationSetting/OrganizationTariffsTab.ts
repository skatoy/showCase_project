import { DateInput } from '#/components/DateInput'

import { Select } from '#/components/Select'

import { Tabs } from '#/components/Tabs'

import { TextInput } from '#/components/TextInput'

import { Buttons } from '#/components/Buttons'

import { DocumentsConfig, Files } from '#/utils/files'

import { Page, Locator } from '@playwright/test'

import { DurationLikeObject } from 'luxon'
import * as allure from 'allure-js-commons'

type TafiffsDateParam = {
  dateStart: DurationLikeObject

  dateEnd: DurationLikeObject
}

type FreeTariffParams = {
  turnOn: boolean

  date?: TafiffsDateParam

  description?: string

  documents?: DocumentsConfig
}

export class OrganizationTariffsTab {
  readonly page: Page

  readonly tab: Tabs

  readonly organizationTariffsSaveButton: Buttons

  readonly files: Files

  readonly organizationTariffsSelect: Select

  readonly freeTariffOptionRadio: Locator

  readonly dateFrom: DateInput

  readonly dateTo: DateInput

  readonly description: TextInput

  constructor(page: Page) {
    this.page = page

    this.tab = new Tabs(page)

    this.organizationTariffsSaveButton = new Buttons(
      page.getByTestId('organization-tariffs-save-btn')
    )

    this.files = new Files(page)

    this.organizationTariffsSelect = new Select(page.getByTestId('select-verification'))

    this.freeTariffOptionRadio = page.getByTestId('radio-buttons-isFreeTariff')

    this.dateFrom = new DateInput(this.page.locator('#dateStart'))

    this.dateTo = new DateInput(this.page.locator('#dateEnd'))

    this.description = new TextInput(this.page.locator('#description'))

    this.freeTariffOptionRadio = page.getByTestId('radio-buttons-isFreeTariff')
  }

  async goToTariffsTab() {
    await allure.step('Перейти: Тарифы', async () => {
      await this.tab.selectTab('/organizations/[organization_uuid]//tariffs')
    })
  }

  async clickSave() {
    await allure.step('Нажать: Сохранить', async () => {
      await this.organizationTariffsSaveButton.click()
    })
  }

  async signSetting() {
    await allure.step('Нажать: Подписать', async () => {
      await this.clickSave()
      const buttonText = await this.organizationTariffsSaveButton.textContent()

      if (buttonText?.includes('Подписать')) {
        await this.clickSave()
      }
    })
  }

  async selectFreeTariffOption(option: 'Да' | 'Нет') {
    await allure.step('Заполнить радиокнопку: Включить тариф', async () => {
      await this.freeTariffOptionRadio.getByText(option).click()
    })
  }

  async activateFreeTariff(data: FreeTariffParams) {
    await allure.step('Произвести активацию тарифа', async () => {
      if (data.turnOn) {
        await this.selectFreeTariffOption('Да')

        if (data.date) {
          await this.fillDate({ dateStart: data.date.dateStart, dateEnd: data.date.dateEnd })
        }

        if (data.description) {
          await this.fillDescription(data.description)
        }

        if (data.documents) {
          await this.addFiles(data.documents)
        }
      } else if (data.turnOn === false) {
        await this.selectFreeTariffOption('Нет')
      }
    })
  }

  async fillDate(date: TafiffsDateParam) {
    await allure.step('Заполнить: дату начала и дату окончания', async () => {
      await this.dateFrom.fill(date.dateStart)
      await this.dateTo.fill(date.dateEnd)
    })
  }

  async fillDescription(description: string) {
    await allure.step('Заполнить: Описание', async () => {
      await this.description.fill(description)
    })
  }

  async selectTariff(tariff: string) {
    await allure.step('Выбрать тариф организации', async () => {
      await this.organizationTariffsSelect.select(tariff)
    })
  }

  async addFiles(config: DocumentsConfig) {
    await allure.step('Добавить файл', async () => {
      await this.files.addFiles(config)
    })
  }
}
