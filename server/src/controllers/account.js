import { Account } from '@/models'
import { accountValidate } from '@/validation'
import {
  formatError,
  uploadFileToFirebase,
  getUniqueFilename,
  getToday,
} from '@/utils'
import { ACCOUNT_STATUS } from '@/enum'
const { AVARTAR_DEFAULT, FIREBASE_PATH_AVATAR } = process.env

export const accountController = {
  getAccount: async (req, res) => {
    try {
      const account = await Account.findById(req.params.id, {
        include: ['profile', 'role'],
      })
      res.status(200).json({
        message: 'Account fetched successfully',
        data: account,
      })
    } catch (error) {
      res.status(500).json({
        message: 'Failed to fetch account',
        data: null,
      })
    }
  },
  getAccounts: async (req, res) => {
    try {
      const accounts = await Account.findAll({
        include: ['profile', 'role'],
      })
      res.status(200).json({
        message: 'Accounts fetched successfully',
        data: accounts,
      })
    } catch (error) {
      res.status(500).json({
        message: 'Failed to fetch accounts',
        data: null,
      })
    }
  },
  createAccount: async (req, res) => {
    try {
      const { email, password, roleId, profile } = req.body
      const avatar = req.file
      const { error } = accountValidate.createAccount.validate({
        email,
        password,
        roleId,
        profile,
      })
      if (error) {
        return res.status(400).json({
          message: error.details[0].message,
          data: null,
        })
      }

      let avatarUrl = AVARTAR_DEFAULT
      if (avatar) {
        const url = await uploadFileToFirebase({
          file: avatar,
          path: getUniqueFilename({
            originalname: avatar.originalname,
            path: FIREBASE_PATH_AVATAR,
          }),
        })
        avatarUrl = url
      }
      const account = await Account.create(
        {
          email,
          password,
          avatarUrl,
          roleId,
          ...(profile && { profile }),
        },
        { include: ['profile'] }
      )
      res.status(200).json({
        message: 'Account created successfully',
        data: account,
      })
    } catch (error) {
      res.status(500).json({
        message: formatError(error.message),
        data: null,
      })
    }
  },
  updateAccount: async (req, res) => {
    try {
      const { id } = req.params
      const { roleId, profile, status } = req.body
      const { error } = accountValidate.updateAccount.validate({
        roleId,
        profile,
        status,
      })
      if (error) {
        return res.status(400).json({
          message: error.details[0].message,
          data: null,
        })
      }
      let avatarUrl = null
      if (req.file) {
        const url = await uploadFileToFirebase({
          file: req.file,
          path: getUniqueFilename({
            originalname: req.file.originalname,
            path: FIREBASE_PATH_AVATAR,
          }),
        })
        avatarUrl = url
      }
      const account = await Account.findByPk(id, {
        include: ['profile'],
      })
      if (!account) {
        return res.status(404).json({
          message: 'Account not found',
          data: null,
        })
      }
      await account.update({
        roleId,
        ...(status && { status }),
        ...(avatarUrl && { avatarUrl }),
      })
      if (profile) {
        await account.profile.update({ ...profile })
      }
      await account.save()
      res.status(200).json({
        message: 'Account updated successfully',
        data: account,
      })
    } catch (error) {
      res.status(500).json({
        message: formatError(error.message),
        data: null,
      })
    }
  },
  deleteAccount: async (req, res) => {
    try {
      const { id } = req.params
      const account = await Account.findByPk(id)
      if (!account) {
        return res.status(404).json({
          message: 'Account not found',
          data: null,
        })
      }
      await account.update({
        status: ACCOUNT_STATUS.DELETED,
        deletedAt: getToday(),
        deletedBy: req.account.email,
      })
      await account.save()
      res.status(200).json({
        message: 'Account deleted successfully',
        data: null,
      })
    } catch (error) {
      res.status(500).json({
        message: formatError(error.message),
        data: null,
      })
    }
  },
}
