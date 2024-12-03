import { Account } from '@/models'
import { generateVerificationCode, sendVerificationEmail } from '@/utils'
import bcrypt from 'bcrypt'

// Store reset codes in memory with expiration
const resetCodes = new Map()

const forgotPasswordController = {
  // Send verification code via email
  sendResetCode: async (req, res) => {
    try {
      const { email } = req.body

      // Check if email exists
      const user = await Account.findOne({ where: { email } })
      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'Email does not exist',
        })
      }

      // Generate 6-digit verification code
      const verificationCode = generateVerificationCode()

      // Store code in memory with 15 minutes expiration
      resetCodes.set(email, {
        code: verificationCode,
        expires: Date.now() + 15 * 60 * 1000, // 15 minutes
      })

      // Clean up expired codes
      cleanupExpiredCodes()

      // Send email
      await sendVerificationEmail(email, verificationCode, 'forgot-password')

      res.json({
        success: true,
        message: 'Verification code sent',
      })
    } catch (error) {
      console.error('Send reset code error:', error)
      res.status(500).json({
        success: false,
        message: 'An error occurred, please try again later',
      })
    }
  },

  // Verify reset code
  verifyResetCode: async (req, res) => {
    try {
      const { email, code } = req.body

      const storedData = resetCodes.get(email)
      if (
        !storedData ||
        storedData.code !== code ||
        storedData.expires < Date.now()
      ) {
        return res.status(400).json({
          success: false,
          message: 'Invalid verification code or expired',
        })
      }

      res.json({
        success: true,
        message: 'Verification code is valid',
      })
    } catch (error) {
      console.error('Verify reset code error:', error)
      res.status(500).json({
        success: false,
        message: 'An error occurred, please try again later',
      })
    }
  },

  // Reset password
  resetPassword: async (req, res) => {
    try {
      const { email, code, newPassword } = req.body

      const storedData = resetCodes.get(email)
      if (
        !storedData ||
        storedData.code !== code ||
        storedData.expires < Date.now()
      ) {
        return res.status(400).json({
          success: false,
          message: 'Invalid verification code or expired',
        })
      }

      const user = await Account.findOne({ where: { email } })
      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'Account not found',
        })
      }

      // Hash new password
      const salt = await bcrypt.genSalt(10)
      const hashedPassword = await bcrypt.hash(newPassword, salt)

      // Update password
      user.password = hashedPassword
      await user.save()

      // Remove used code
      resetCodes.delete(email)

      res.json({
        success: true,
        message: 'Reset password successfully',
      })
    } catch (error) {
      console.error('Reset password error:', error)
      res.status(500).json({
        success: false,
        message: 'An error occurred, please try again later',
      })
    }
  },

  // Clean up expired codes periodically
}
const cleanupExpiredCodes = () => {
  for (const [email, data] of resetCodes.entries()) {
    if (data.expires < Date.now()) {
      resetCodes.delete(email)
    }
  }
}

export { forgotPasswordController }
