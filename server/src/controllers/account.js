import { Account } from '@/model'
import { accountValidate } from '@/validation'

export const accountController = {
  getAccount: async (req, res) => {
    try {
      const account = await Account.findById(req.params.id, {
        include: ['profile'],
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
      const accounts = await Account.findAll({ include: ['profile'] })
      console.log(accounts)
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
      console.log(req.body)
      const { email, password, role, profile, avatar } = req.body

      const { error } = accountValidate.createAccount.validate({
        email,
        password,
        role,
        profile,
      })
      if (error) {
        return res.status(400).json({
          message: error.details[0].message,
          data: null,
        })
      }
      const account = await Account.create(
        {
          email,
          password,
          role,
          profile,
        },
        { include: ['profile'] }
      )
      res.status(200).json({
        message: 'Account created successfully',
        data: account,
      })
    } catch (error) {
      res.status(500).json({
        message: 'Failed to create account',
        data: null,
      })
    }
  },
  updateAccount: async (req, res) => {
    try {
      const { id } = req.params
      const { email, password, role, profile } = req.body
      const { error } = accountValidate.updateAccount.validate({
        email,
        password,
        role,
        profile,
      })
      if (error) {
        return res.status(400).json({
          message: error.details[0].message,
          data: null,
        })
      }
      const account = await Account.update(
        { email, password, role, profile },
        { where: { id } }
      )
      res.status(200).json({
        message: 'Account updated successfully',
        data: account,
      })
    } catch (error) {
      res.status(500).json({
        message: 'Failed to update account',
        data: null,
      })
    }
  },
  deleteAccount: async (req, res) => {
    try {
      const { id } = req.params
      await Account.destroy({ where: { id } })
      res.status(200).json({
        message: 'Account deleted successfully',
        data: null,
      })
    } catch (error) {
      res.status(500).json({
        message: 'Failed to delete account',
        data: null,
      })
    }
  },
}
