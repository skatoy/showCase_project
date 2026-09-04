import { readFileSync } from 'node:fs'
import XLSX from 'xlsx'

export type DataForXlsxEdit = {
  rowIndex: number
  sheetIndex?: number
  cells: [number, string | number][]
}

export type editXlsxConfig = {
  editedFilePath: string
  data: DataForXlsxEdit[]
}

type ParsingDataRow = string[]
type ParsingDataSheet = ParsingDataRow[]
export type ParsingDataBook = [ParsingDataSheet, ParsingDataSheet, ParsingDataSheet]

export const XLSX_MIME_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'

export const getXlsxData = (fileName: string) => {
  const buffer = readFileSync(`./downloads/${fileName}`)
  const workbook = XLSX.read(buffer)
  const book: string[][][] = []
  workbook.SheetNames.forEach(sheetName => {
    const worksheet = workbook.Sheets[sheetName]
    const rowsData: string[][] = []

    for (const cell in worksheet) {
      if (cell[0] === '!') {
        // Skip metadata
        continue
      }

      // Parse the cell address
      const cellAddress = XLSX.utils.decode_cell(cell)
      const rowIndex = cellAddress.r

      // Initialize an array for the row if it doesn't exist
      if (!rowsData[rowIndex]) {
        rowsData[rowIndex] = []
      }

      // Get the cell value and push it to the row array
      const cellValue = worksheet[cell].v
      rowsData[rowIndex].push(String(cellValue))
    }

    book.push(rowsData)
  })

  return book as ParsingDataBook
}

export const editXlsx = (config: editXlsxConfig) => {
  const buffer = readFileSync(config.editedFilePath)
  const workbook = XLSX.read(buffer)

  config.data.forEach(item => {
    const sheetName = workbook.SheetNames[item.sheetIndex || 0]
    const sheet = workbook.Sheets[sheetName]

    item.cells.forEach(([colIndex, value]) => {
      const columnLetter = XLSX.utils.encode_col(colIndex - 1)
      const cellAddress = `${columnLetter}${item.rowIndex}`

      XLSX.utils.sheet_add_aoa(sheet, [[{ t: 's', v: value, z: '@' }]], {
        origin: cellAddress,
        sheetStubs: true
      })
    })
  })

  // Через buffer т.к. в playwright через xlsx не получается создать файл
  return XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' })
}

export const formatDownloadFileName = (fileName: string): string => {
  return fileName.replace(/(.{100}).+\.(.+)$/, '$1.$2')
}

export const createExcelFileBuffer = (data: DataForXlsxEdit[], editedFileName: string) => {
  const config: editXlsxConfig = {
    data,
    editedFilePath: `./downloads/${formatDownloadFileName(editedFileName)}`
  }

  return editXlsx(config)
}
