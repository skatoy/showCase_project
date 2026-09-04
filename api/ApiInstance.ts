import { BrowserContext } from '@playwright/test'
import { getCookieValueByName } from '#/utils/cookie'
import { baseApiURLConfig, TEST_ENV } from '#/playwright.config'

export class ApiInstance {
  private baseURL: string

  constructor(private browserContext: BrowserContext) {
    this.baseURL = baseApiURLConfig[TEST_ENV]
  }

  async post(url: string, data?: any) {
    const csrfToken = await getCookieValueByName(this.browserContext, 'csrf-token')
    const headers: Record<string, string> = {}

    if (csrfToken) {
      headers['x-csrf-token'] = csrfToken
    }

    return this.browserContext.request.post(`${this.baseURL}${url}`, {
      data,
      headers
    })
  }

  async get(url: string, params?: any) {
    const csrfToken = await getCookieValueByName(this.browserContext, 'csrf-token')
    const headers: Record<string, string> = {}

    if (csrfToken) {
      headers['x-csrf-token'] = csrfToken
    }

    return this.browserContext.request.get(`${this.baseURL}${url}`, {
      params,
      headers
    })
  }

  async postMultipart(url: string, formData: FormData) {
    const csrfToken = await getCookieValueByName(this.browserContext, 'csrf-token')
    const headers: Record<string, string> = {}

    if (csrfToken) {
      headers['x-csrf-token'] = csrfToken
    }

    return this.browserContext.request.post(`${this.baseURL}${url}`, {
      multipart: formData,
      headers
    })
  }

  async delete(url: string, params?: any) {
    const csrfToken = await getCookieValueByName(this.browserContext, 'csrf-token')
    const headers: Record<string, string> = {}

    if (csrfToken) {
      headers['x-csrf-token'] = csrfToken
    }

    return this.browserContext.request.delete(`${this.baseURL}${url}`, {
      params,
      headers
    })
  }
}
