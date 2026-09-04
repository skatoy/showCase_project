import { expect } from '@playwright/test'
import { DateTime } from 'luxon'

const DATE_TIME_PATTERN =
  /\d{2}:\d{2}:\d{2} \d{2}\.\d{2}\.\d{4} MSK|\d{2}\.\d{2}\.\d{4} \d{2}:\d{2}:\d{2} MSK/g

function normalizeEmailBody(body: string): string {
  return body
    .replace(DATE_TIME_PATTERN, '{{DATE_TIME}} MSK')
    .replace(/\n{2,}/g, match => '\n'.repeat(Math.floor(match.length / 2)))
}

function parseDateTime(text: string, index: number = 0): DateTime {
  const matches = [...text.matchAll(DATE_TIME_PATTERN)]
  const dateTime = matches[index][0]
  const formats = ["dd.MM.yyyy HH:mm:ss 'MSK'", "HH:mm:ss dd.MM.yyyy 'MSK'"]

  for (const format of formats) {
    const date = DateTime.fromFormat(dateTime, format, { zone: 'Europe/Moscow' })

    if (date.isValid) return date
  }

  throw new Error(`Не удалось распарсить временную метку: ${dateTime}`)
}

export function expectEmailToMatch(
  emailBody: string,
  templateEmailBody: string,
  {
    toleranceMinutes = 3,
    expectedDate,
    dateIndex = 0
  }: {
    toleranceMinutes?: number
    expectedDate?: DateTime
    dateIndex?: number
  }
) {
  const actualNormalized = normalizeEmailBody(emailBody)

  expect(actualNormalized).toBe(templateEmailBody)

  if (expectedDate) {
    const actualDate = parseDateTime(emailBody, dateIndex)
    const diffMinutes = Math.abs(actualDate.diff(expectedDate, 'minutes').minutes)
    expect(diffMinutes).toBeLessThanOrEqual(toleranceMinutes)
  }
}
