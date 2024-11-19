import dayjs from 'dayjs'

const {
  VITE_DATE_FORMAT_API,
  VITE_DATE_FORMAT_DISPLAY_TIME,
  VITE_DATE_FORMAT_DISPLAY,
} = import.meta.env

export const stringToDate = (date: string) => {
  if (!date) return 'Invalid date.'
  const parsedDate = dayjs(date, VITE_DATE_FORMAT_API)
  return parsedDate.format(VITE_DATE_FORMAT_DISPLAY)
}

export const stringToDateTime = (date: string) => {
  if (!date) return 'Invalid date.'
  const parsedDate = dayjs(date, VITE_DATE_FORMAT_API)
  return parsedDate.format(VITE_DATE_FORMAT_DISPLAY_TIME)
}
