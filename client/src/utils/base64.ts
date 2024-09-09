export const decodeBase64 = (base64: string) => {
  return Buffer.from(base64, 'base64').toString('utf-8')
}
export const encodeBase64 = (str: string) => {
  return Buffer.from(str).toString('base64')
}