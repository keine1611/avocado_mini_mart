export const validate = (schema, data) => {
  const { error } = schema.validate(data)
  if (error) {
    const message = error.details[0].message
    return message
      .replace(/"/g, '')
      .replace(/_/g, ' ')
      .replace(/([A-Z])/g, ' $1')
      .trim()
  }
  return ''
}
