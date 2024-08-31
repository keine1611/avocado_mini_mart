import JSON5 from 'json5'

export const decodeQueryFromBase64 = async ({ base64String }) => {
  const decodeString = Buffer.from(base64String, 'base64').toString('utf8')
  const decodedObject = JSON5.parse(decodeString)
  return decodedObject
}

export const encodeToBase64 = ({ string }) => {
  const queryString = JSON.stringify(string)
  const encodeQuery = Buffer.from(queryString).toString('base64')
  return encodeQuery
}
