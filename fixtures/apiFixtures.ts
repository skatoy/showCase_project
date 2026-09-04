import { withSession } from '#/utils/elkLogin'
import * as paths from '#/utils/setupConfig'
import { test as base, request, APIRequestContext } from '@playwright/test'

export const userStorageMap = {
  bothRolesCustomer: paths.userBothRolesCustomerAuthFile,
  curator: paths.userCuratorAuthFile,
  organizationAdmin: paths.userOrganizationAdminAuthFile,
  bothRolesSupplier: paths.userBothRolesSupplierAuthFile,
  supplier: paths.userSupplierAuthFile,
  supplierSecond: paths.userSupplierSecondAuthFile,
  supplierIndividual: paths.userSupplierIndividualAuthFile,
  businessAdmin: paths.businessAdminAuthFile,
  supplierWithoutFinance: paths.userSupplierWithoutFinance,
  supplierNotResidentCis: paths.userSupplierNotResidentCis,
  supplierNotResident: paths.userSupplierNotResident
} as const

export type UserKey = keyof typeof userStorageMap

export const test = base.extend<{
  apiAs: (userKey: UserKey) => Promise<APIRequestContext>
}>({
  apiAs: async (_, use) => {
    const apiContexts: Partial<Record<UserKey, APIRequestContext>> = {}

    const getApiContext = async (userKey: UserKey) => {
      let context = apiContexts[userKey]

      if (!context) {
        const storageState = userStorageMap[userKey]
        await withSession(storageState)
        context = await request.newContext({ storageState })
        apiContexts[userKey] = context
      }

      return context
    }

    await use(getApiContext)

    for (const context of Object.values(apiContexts)) {
      if (context) await context.dispose()
    }
  }
})

export { expect } from '@playwright/test'
