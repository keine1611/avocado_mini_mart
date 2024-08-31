import xlsx from 'xlsx'

export const readExcelFile = (filePath) => {
  const workbook = xlsx.readFile(filePath)
  let sheetsData = {}
  workbook.SheetNames.forEach((sheetName) => {
    const worksheet = workbook.Sheets[sheetName]
    sheetsData[sheetName] = xlsx.utils.sheet_to_json(worksheet)
  })
  return sheetsData
}

export const readExcelFromBuffer = async (buffer) => {
  if (!buffer) throw new Error('Buffer is undefined or null. ')
  const workbook = xlsx.read(buffer, { type: 'buffer' })
  let sheetsData = {}
  workbook.SheetNames.forEach((sheetName) => {
    const worksheet = workbook.Sheets[sheetName]
    sheetsData[sheetName] = xlsx.utils.sheet_to_json(worksheet)
  })
  return sheetsData
}

export const importDataToDatabase = async (data, Model) => {
  try {
    await Model.bulkCreate(data)
    return { success: true, message: 'Data imported successfully.' }
  } catch (error) {
    console.error('Error  importing data: ' + error)
    return { success: false, message: 'Error importing data.' }
  }
}

//Filter field valid
export const filterValidFields = (data, Model) => {
  const validFields = Object.keys(Model.rawAttributes)

  return data.map((row) => {
    const filteredRow = {}
    for (const key of validFields) {
      if (row[key] !== undefined) {
        filteredRow[key] = row[key]
      }
    }
    return filteredRow
  })
}

export const saveExcelToDb = async ({ file, Model }) => {
  const dataSheets = await readExcelFromBuffer(file.buffer)
  const data = dataSheets[Model.name]
  const filteredData = filterValidFields(data, Model)
  const result = await importDataToDatabase(filteredData, Model)
  return result
}
