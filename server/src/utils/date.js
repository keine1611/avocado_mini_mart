import dayjs from 'dayjs'
import dotenv from 'dotenv'
dotenv.config()

const DATE_FORMAT = process.env.DATE_FORMAT

export const getToday = () => {
  return dayjs(new Date()).format(DATE_FORMAT)
}
