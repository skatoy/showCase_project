// Save your storage state to a file in the .auth directory via setup test

import { test as setup } from '@playwright/test'
import { withSession } from '../utils/elkLogin'
import { businessAdminAuthFile } from '../utils/setupConfig'

export type Roles =
  | 'customer'
  | 'supplier'
  | 'curator'
  | 'admin_for_users'
  | 'security_officer'
  | 'auditor'
  | 'business_admin'
  | 'first_line_operator'
  | 'second_line_operator'

setup('Create businessAdmin', async () => {
  await withSession(businessAdminAuthFile)
})
