import fs from 'fs'
import path from 'path'

export const logRequest = (req, res, next) => {
  const logDetails = `
  Timestamp: ${new Date().toISOString()}
  Method: ${req.method}
  URL: ${req.url}
  Headers: ${JSON.stringify(req.headers, null, 2)}
  Body: ${JSON.stringify(req.body, null, 2)}
  ---------------------------------------
  `
  fs.appendFile(path.join(__dirname, '../../access.log'), logDetails, (err) => {
    if (err) throw err
  })
  next()
}
