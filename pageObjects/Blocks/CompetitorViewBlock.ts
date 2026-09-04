import { Locator, Page } from '@playwright/test'
import * as allure from 'allure-js-commons'

export type CompetitorVisibleParams = {
  viewOption: boolean
  viewRating?: boolean
  viewPrice?: boolean
  viewName?: boolean
}

export class CompetitorViewBlock {
  readonly page: Page
  readonly allowViewCompetitorsOffer: Locator
  readonly competitorsViewingAllowedRating: Locator
  readonly competitorsViewingAllowedPrice: Locator
  readonly competitorsViewingAllowedName: Locator

  constructor(page: Page) {
    this.page = page
    this.allowViewCompetitorsOffer = page.getByTestId('radio-buttons-isEnabled')
    this.competitorsViewingAllowedRating = page.getByTestId('checkbox-VISIBLE_RATING')
    this.competitorsViewingAllowedPrice = page.getByTestId('checkbox-VISIBLE_PRICE')
    this.competitorsViewingAllowedName = page.getByTestId('checkbox-VISIBLE_ONLY_OTHER_SUPPLIERS')
  }

  async selectViewCompetitorOffer(params: CompetitorVisibleParams) {
    await allure.step('Настроить просмотр предложений конкурентов', async () => {
      await this.allowViewCompetitorOffer(params.viewOption)

      if (params.viewRating) {
        await this.checkViewRating(params.viewRating)
      }

      if (params.viewPrice) {
        await this.checkViewPrice(params.viewPrice)
      }

      if (params.viewName) {
        await this.checkViewName(params.viewName)
      }
    })
  }

  async allowViewCompetitorOffer(allowCompetitor: boolean) {
    if (allowCompetitor) {
      await this.allowViewCompetitorsOffer.getByText('Разрешить').click()
    } else {
      await this.allowViewCompetitorsOffer.getByText('Запретить').click()
    }
  }

  async checkViewRating(viewRating: boolean) {
    await this.setCheckboxState(this.competitorsViewingAllowedRating, viewRating)
  }

  async checkViewPrice(viewPrice: boolean) {
    await this.setCheckboxState(this.competitorsViewingAllowedPrice, viewPrice)
  }

  async checkViewName(viewName: boolean) {
    await this.setCheckboxState(this.competitorsViewingAllowedName, viewName)
  }

  private async setCheckboxState(checkbox: Locator, desiredState: boolean) {
    const isChecked = await checkbox.locator('[data-cy="checkbox-checked"]').isVisible()

    if (desiredState !== isChecked) {
      await checkbox.click()
    }
  }
}
