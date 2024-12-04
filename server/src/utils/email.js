import nodemailer from 'nodemailer'
import path from 'path'
import ejs from 'ejs'

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD,
  },
})
const compileTemplate = async (templateName, context) => {
  const filePath = path.resolve(__dirname, '../static', `${templateName}.ejs`)
  try {
    const html = await ejs.renderFile(filePath, context)
    return html
  } catch (err) {
    console.error('Failed to compile template:', err)
    throw new Error('Failed to compile template')
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
