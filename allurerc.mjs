import { defineConfig } from 'allure'

export default defineConfig({
  name: 'Procurement E2E',
  output: './allure-report',
  historyPath: './allure-history.jsonl',
  appendHistory: false,
  plugins: {
    awesome: {
      options: {
        reportName: 'Procurement E2E',
        reportLanguage: 'ru',
        singleFile: false,
        open: false
      }
    }
  }
})
