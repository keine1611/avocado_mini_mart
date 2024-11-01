const formatError = (error) => {
  const text = error.split(':')[1]
  if (text) {
    const message = text.toString().trim()
    return message
  } else {
    return error
  }
}

export { formatError }
