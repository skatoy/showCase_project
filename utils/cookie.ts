import { BrowserContext } from '@playwright/test'

export const getCookieValueByName = async (context: BrowserContext, name: string) => {
  const cookies = await context.cookies()
  const found = cookies.find(c => c.name === name)

  return found ? found.value : ''
}
