import { ACCOUNT_STATUS } from '@/enum'
import { Account } from '@/models'
import { getToday } from '@/utils'
import { Op } from 'sequelize'

export const removeRestrictedStatus = async () => {
  const accounts = await Account.findAll({
    where: {
      status: ACCOUNT_STATUS.RESTRICTED,
      restrictedUntil: { [Op.gte]: getToday() },
    },
  })
  for (const account of accounts) {
    await account.update({
      status: ACCOUNT_STATUS.ACTIVE,
      restrictedUntil: null,
    })
  }
}
