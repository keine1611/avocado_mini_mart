import cron from 'node-cron'
import { removeRestrictedStatus } from './removeRestrictedStatus'

export const initCronJobs = () => {
  cron.schedule('0 0 * * *', removeRestrictedStatus)
}
