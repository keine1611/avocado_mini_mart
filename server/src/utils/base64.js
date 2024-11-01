import JSON5 from 'json5'

export const decodeQueryFromBase64 = async ({ param }) => {
  try {
    const decodeString = Buffer.from(param, 'base64').toString('utf8')
    const decodedObject = JSON5.parse(decodeString)
    return decodedObject
  } catch (error) {
    return null
  }
}

export const encodeToBase64 = ({ string }) => {
  const queryString = JSON.stringify(string)
  const encodeQuery = Buffer.from(queryString).toString('base64')
  return encodeQuery
}
