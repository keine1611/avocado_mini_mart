export const slugToTitle = (slug: string) => {
  return slug.replace(/-/g, ' ').replace(/\b\w/g, (char) => char.toUpperCase())
}

export const formatPhoneNumber = (phone: string) => {
  return phone.replace(/(\d{3})(\d{3})(\d{4})/, '($1) $2-$3')
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
