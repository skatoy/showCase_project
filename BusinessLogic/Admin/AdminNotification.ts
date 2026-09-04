import { NotificationLogPage } from '#/pageObjects/Admin/AdminEmailLogPage'
import { expectEmailToMatch } from '#/utils/emailMatcher'
import { SidebarMenuItem } from '#/utils/sidebarMenuItems'
import { Page } from '@playwright/test'
import { DateTime } from 'luxon'
import * as allure from 'allure-js-commons'

export type CheckNotificationsParams = {
  procedureNumber?: string
  subject: string
  receiverEmail: string
  templateEmailBody: string
  expectedDate?: DateTime
  toleranceMinutes?: number
}

export class AdminNotification {
  readonly page: Page
  readonly menu: SidebarMenuItem
  readonly notification: NotificationLogPage

  constructor(page: Page) {
    this.page = page
    this.menu = new SidebarMenuItem(page)
    this.notification = new NotificationLogPage(page)
  }

  async checkNotifications(params: CheckNotificationsParams) {
    await allure.step(`Проверить уведомление: ${params.subject}`, async () => {
      await this.menu.clickMenuEmails()
      await this.notification.openFilter()

      if (params.procedureNumber) {
        await this.notification.fillFilterProcedureNumber(params.procedureNumber)
      }

      await this.notification.fillFilterNotificationTheme(params.subject)
      await this.notification.fillFilterEmail(params.receiverEmail)
      await this.notification.clickApply()

      const sentMail = await this.notification.getEmailBody('html')
      const template = params.templateEmailBody

      expectEmailToMatch(sentMail, template, {
        toleranceMinutes: params.toleranceMinutes,
        expectedDate: params.expectedDate
      })
    })
  }
}
