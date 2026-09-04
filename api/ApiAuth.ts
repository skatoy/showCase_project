import { BrowserContext } from '@playwright/test'
import * as allure from 'allure-js-commons'
import { ApiInstance } from './ApiInstance'
import { withSession, getSessionAccessToken, UserCred } from '../utils/elkLogin'
import { isTokenExpired } from '../utils/jwt'

const API_PREFIX = '/api/public/gate/grpc/v1'

export class ApiAuth {
  public userInfo: { user: { guid: string }; organization: { guid: string } } | null = null
  private apiInstance: ApiInstance

  constructor(
    private context: BrowserContext,
    private user: UserCred,
    private role: string,
    private storageStatePath: string
  ) {
    this.apiInstance = new ApiInstance(context)
  }

  async login() {
    await allure.step(
      `API: Авторизоваться: ${this.user.email}`,
      async () => {
        const existingUserInfo = await this.tryFetchUserInfo()

        if (existingUserInfo) {
          this.userInfo = existingUserInfo

          return
        }

        await withSession(this.storageStatePath)
        const accessToken = getSessionAccessToken(this.storageStatePath)

        if (!accessToken || isTokenExpired(accessToken)) {
          throw new Error(`Не удалось восстановить сессию (${this.storageStatePath})`)
        }

        await this.apiInstance.post(`${API_PREFIX}/auth/loginwithtoken`, { token: accessToken })
        await this.selectOrganization()
        await this.fetchUserInfo()
      }
    )
  }

  private async tryFetchUserInfo() {
    const response = await this.apiInstance
      .post(`${API_PREFIX}/auth/userinfo`, {})
      .catch(() => null)

    if (response?.ok()) return await response.json()

    return null
  }

  private async selectOrganization() {
    const orgListResponse = await this.apiInstance.get(`${API_PREFIX}/auth/organizationlist`)
    const { organizations } = await orgListResponse.json()
    await this.apiInstance.post(`${API_PREFIX}/auth/saveorganizationselect`, {
      organizationUuid: organizations[0].uuid,
      roleCode: this.role
    })
  }

  private async fetchUserInfo() {
    const response = await this.apiInstance.post(`${API_PREFIX}/auth/userinfo`, {})
    this.userInfo = await response.json()
  }
}
