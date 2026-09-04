// Save your storage state to a file in the .auth directory via setup test

import { test as setup } from '@playwright/test'
import { withSession } from '../utils/elkLogin'
import {
  userBothRolesCustomerAuthFile,
  userSecondCustomerAuthFile,
  userBothRolesSupplierAuthFile,
  userSupplierAuthFile,
  userSupplierSecondAuthFile,
  userSupplierIndividualAuthFile,
  userSupplierWithoutFinance,
  userOrganizationAdminAuthFile,
  //userSupplierNotResidentCis,
  //userSupplierNotResident
} from '../utils/setupConfig'

const usersToSetup: { name: string; path: string }[] = [
  { name: 'userBothRoles customer', path: userBothRolesCustomerAuthFile },
  { name: 'secondCustomer', path: userSecondCustomerAuthFile },
  { name: 'organization admin', path: userOrganizationAdminAuthFile },
  { name: 'userBothRoles supplier', path: userBothRolesSupplierAuthFile },
  { name: 'supplier1', path: userSupplierAuthFile },
  { name: 'supplier2', path: userSupplierSecondAuthFile },
  { name: 'supplierIndividual', path: userSupplierIndividualAuthFile },
  { name: 'supplierWithoutFinance', path: userSupplierWithoutFinance },
  //{ name: 'supplierNotResidentCis', path: userSupplierNotResidentCis },
  //{ name: 'supplierNotResident', path: userSupplierNotResident }
]

usersToSetup.forEach(({ name, path }) => {
  setup(`Create ${name}`, async () => {
    await withSession(path)
  })
})
