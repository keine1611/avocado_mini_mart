import dayjs from "dayjs"

const dateFormat = 'DDMMYYYYHHmmss'

export const stringToDate = (date: string) => {
    if (!date) return 'Invalid date.'
    const parsedDate = dayjs(date, dateFormat)
    return parsedDate.format('DD-MM-YYYY')
}

export const stringToDateTime = (date: string) => {
    if (!date) return 'Invalid date.'
    const parsedDate = dayjs(date, dateFormat)
    return parsedDate.format('HH:mm DD-MM-YYYY ')
}