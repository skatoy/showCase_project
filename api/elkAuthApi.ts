// Showcase alias: SSO session helpers (sanitized)
import { APIRequestContext } from '@playwright/test'
import * as allure from 'allure-js-commons'

export class ElkAuthApi {
  public access_token = ''
  public refresh_token = ''

  constructor(
    private request: APIRequestContext,
    private issuer: string
  ) {}

  async refreshToken(refreshToken: string) {
    return await allure.step('API: Обновить токен SSO', async () => {
      const form = {
        grant_type: 'refresh_token',
        refresh_token: refreshToken,
        client_id: process.env.OIDC_CLIENT_ID ?? 'procurement-demo'
      }

      const urls = [`${this.issuer}/protocol/openid-connect/token`, `${this.issuer}/consents/token`]

      for (const url of urls) {
        const response = await this.request.post(url, { form })

        if (!response.ok()) continue

        const json = await response.json()

        if (!json.access_token) continue

        this.access_token = json.access_token
        this.refresh_token = json.refresh_token ?? refreshToken

        return true
      }

      return false
    })
  }
}
