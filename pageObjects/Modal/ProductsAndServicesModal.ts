import { type Page, type Locator } from '@playwright/test'
import * as allure from 'allure-js-commons'

export class ProductsAndServicesModal {
  readonly page: Page
  readonly modalContainer: Locator
  readonly productsModalButton: Locator
  readonly cardProcurementBusiness: Locator
  readonly cardPlatform: Locator
  readonly cardSSO: Locator
  readonly cardClickMarket: Locator
  readonly cardAllProducts: Locator

  constructor(page: Page) {
    this.page = page
    this.modalContainer = page.getByTestId('products-modal')
    this.productsModalButton = page.getByTestId('products-modal-button')
    this.cardProcurementBusiness = page.getByTestId('product-card-procurement-business')
    this.cardPlatform = page.getByTestId('product-card-platform')
    this.cardSSO = page.getByTestId('product-card-sso')
    this.cardClickMarket = page.getByTestId('product-card-click-market')
    this.cardAllProducts = page.getByTestId('product-card-all-products')
  }

  async isOpened() {
    return await allure.step('Проверить, что модальное окно продуктов открыто', async () => {
      return await this.modalContainer.isVisible()
    })
  }

  async clickCardProcurementBusiness() {
    await allure.step('Нажать: Карточка Procurement Portal', async () => {
      await this.cardProcurementBusiness.click()
    })
  }

  async clickCardPlatform() {
    await allure.step('Нажать: Карточка procurement platform', async () => {
      await this.cardPlatform.click()
    })
  }

  async clickCardSSO() {
    await allure.step('Нажать: Карточка SSO', async () => {
      await this.cardSSO.click()
    })
  }

  async openClickMarket() {
    await allure.step('Открыть: Клик Маркет', async () => {
      await this.cardClickMarket.click()
    })
  }

  async clickAllProducts() {
    await allure.step('Нажать: Все продукты', async () => {
      await this.cardAllProducts.click()
    })
  }
}
