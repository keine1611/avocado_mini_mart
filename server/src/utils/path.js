const checkPath = (path1, path2) => {
  const cleanedPath1 = path1.replace(/^\/+|\/+$/g, '')
  const cleanedPath2 = path2.replace(/^\/+|\/+$/g, '')
  const regexPath1 = cleanedPath1.replace(/:\w+/g, '[^/]+')
  const regex = new RegExp(`^${regexPath1}$`)
  return regex.test(cleanedPath2)
}

export { checkPath }
