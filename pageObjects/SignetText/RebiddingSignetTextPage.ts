import { Buttons } from '#/components/Buttons'
import { Page } from '@playwright/test'
import * as allure from 'allure-js-commons'

export class RebiddingSignetTextPage {
  readonly page: Page
  readonly rebiddingPublishButton: Buttons

  constructor(page: Page) {
    this.page = page
    this.rebiddingPublishButton = new Buttons(
      page.getByTestId('publish-rebidding-btn'),
      'Опубликовать переторжку'
    )
  }

  async clickPublishRebidding() {
    await allure.step('Нажать: Опубликовать переторжку', async () => {
      await this.rebiddingPublishButton.click()
    })
  }
}
