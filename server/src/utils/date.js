import dayjs from 'dayjs'
import dotenv from 'dotenv'
import customParseFormat from 'dayjs/plugin/customParseFormat'

dayjs.extend(customParseFormat)

dotenv.config()

const DATE_FORMAT = process.env.DATE_FORMAT

export const getToday = () => {
  return dayjs(new Date()).format(DATE_FORMAT)
}

export const stringToDayjs = (stringDate) => {
  return dayjs(stringDate, DATE_FORMAT)
}

export const dayjsToString = (dayjsDate) => {
  return dayjsDate.format(DATE_FORMAT)
}
