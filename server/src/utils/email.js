import nodemailer from 'nodemailer'
import path from 'path'
import ejs from 'ejs'
import fs from 'fs'

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD,
  },
})
const compileTemplate = async (templateName, context) => {
  const rootDir = path.join(__dirname, '..')
  const filePath = path.join(rootDir, 'static', `${templateName}.ejs`)

  try {
    // Check if file exists
    if (!fs.existsSync(filePath)) {
      throw new Error(`Template file not found at: ${filePath}`)
    }

    const html = await ejs.renderFile(filePath, context)
    return html
  } catch (err) {
    console.error('Failed to compile template:', {
      error: err.message,
      path: filePath,
      dirname: __dirname,
      templateName,
      exists: fs.existsSync(filePath),
    })
    throw new Error(`Failed to compile template: ${err.message}`)
  }
}

export const sendOrderConfirmationEmail = async (email, orderDetails) => {
  const total =
    orderDetails.totalAmount + orderDetails.shippingFee - orderDetails.discount
  const html = await compileTemplate('orderConfirmation', {
    orderDetails,
    total,
  })
  const mailOptions = {
    from: process.env.GMAIL_USER,
    to: email,
    subject: 'Order Confirmation',
    html,
  }

  try {
    await transporter.sendMail(mailOptions)
  } catch (error) {
    throw new Error('Failed to send order confirmation email')
  }
}

export const sendVerificationEmail = async (email, code, type) => {
  const html = await compileTemplate('verifiedCode', { code, type })
  const mailOptions = {
    from: process.env.GMAIL_USER,
    to: email,
    subject: 'Verification Code',
    html,
  }
  try {
    await transporter.sendMail(mailOptions)
  } catch (error) {
    throw new Error('Failed to send verification code email')
  }
}
