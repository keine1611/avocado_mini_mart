export const slugToTitle = (slug: string) => {
  return slug.replace(/-/g, ' ').replace(/\b\w/g, (char) => char.toUpperCase())
}

export const formatPhoneNumber = (phone: string) => {
  let normalized = phone.replace(/^(\+84|84)/, '0')

  return normalized.replace(/(\d{4})(\d{3})(\d{3})/, '$1 $2 $3')
}

export const getValueByPath = (obj: any, path: string) => {
  return path.split('.').reduce((acc, key) => acc && acc[key], obj)
}

export const formatEnumValue = (value: string): string => {
  return value
    .toLowerCase()
    .replace(/_/g, ' ')
    .replace(/\b\w/g, (char) => char.toUpperCase())
}

export const enumToArray = <T extends object>(
  enumObj: T
): { label: string; value: string }[] => {
  return Object.keys(enumObj)
    .filter((key) => isNaN(Number(key)))
    .map((key) => ({
      label: formatEnumValue(key),
      value: enumObj[key as keyof T] as string,
    }))
}

export const formatQuantity = (quantity: number) => {
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(quantity)
}
