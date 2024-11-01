export const decodeBase64 = (base64: string) => {
  return atob(base64)
}
export const encodeBase64 = (str: string) => {
  return btoa(str)
}
