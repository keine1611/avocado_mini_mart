const formatError = (error) => {
  const text = error.split(':')[1]
  const message = text.toString().trim()
  return message
}

export { formatError }
