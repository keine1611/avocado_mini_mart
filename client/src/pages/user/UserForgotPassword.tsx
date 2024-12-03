import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { EyeIcon, EyeSlashIcon } from '@/resources'
import { logo } from '@/constant'
import { FiMail, FiLock } from 'react-icons/fi'
import { Loading, showToast } from '@/components'
import {
  useForgotPasswordMutation,
  useVerifyResetCodeMutation,
  useResetPasswordMutation,
} from '@/services/auth'

export const UserForgotPassword = () => {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [verificationCode, setVerificationCode] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [stage, setStage] = useState<'email' | 'verify' | 'reset'>('email')
  const [errors, setErrors] = useState({
    email: '',
    newPassword: '',
    confirmPassword: '',
  })
  const [resendTimer, setResendTimer] = useState(0)
  const [isResending, setIsResending] = useState(false)

  const [forgotPassword, { isLoading: isSendingEmail }] =
    useForgotPasswordMutation()
  const [verifyCode, { isLoading: isVerifying }] = useVerifyResetCodeMutation()
  const [resetPassword, { isLoading: isResetting }] = useResetPasswordMutation()

  useEffect(() => {
    let timer: NodeJS.Timeout
    if (resendTimer > 0) {
      timer = setInterval(() => {
        setResendTimer((prev) => prev - 1)
      }, 1000)
    }
    return () => {
      if (timer) clearInterval(timer)
    }
  }, [resendTimer])

  const validateEmail = () => {
    if (!email) {
      setErrors((prev) => ({ ...prev, email: 'Email is required' }))
      return false
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      setErrors((prev) => ({
        ...prev,
        email: 'Please enter a valid email address',
      }))
      return false
    }
    return true
  }

  const validatePasswords = () => {
    let isValid = true
    const newErrors = { ...errors }

    if (!newPassword) {
      newErrors.newPassword = 'Password is required'
      isValid = false
    } else if (newPassword.length < 6) {
      newErrors.newPassword = 'Password must be at least 6 characters long'
      isValid = false
    }

    if (!confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password'
      isValid = false
    } else if (newPassword !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match'
      isValid = false
    }

    setErrors(newErrors)
    return isValid
  }

  const handleSendEmail = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validateEmail()) return

    try {
      await forgotPassword({ email }).unwrap()
      showToast.success('Verification code sent to your email')
      setStage('verify')
      setResendTimer(60)
    } catch (error: any) {
      showToast.error(error.data?.message || 'Failed to send verification code')
    }
  }

  const handleVerifyCode = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!verificationCode) {
      showToast.error('Verification code is required')
      return
    }
    if (verificationCode.length !== 6) {
      showToast.error('Please enter a valid 6-digit verification code')
      return
    }

    try {
      await verifyCode({ email, code: verificationCode }).unwrap()
      setStage('reset')
    } catch (error: any) {
      showToast.error(error.data?.message || 'Invalid verification code')
    }
  }

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validatePasswords()) return

    try {
      await resetPassword({
        email,
        code: verificationCode,
        newPassword,
      }).unwrap()
      showToast.success('Password reset successfully')
      navigate('/login')
    } catch (error: any) {
      showToast.error(error.data?.message || 'Failed to reset password')
    }
  }

  const handleResendCode = async () => {
    if (resendTimer > 0) return

    setIsResending(true)
    try {
      await forgotPassword({ email }).unwrap()
      showToast.success('New verification code sent to your email')
      setResendTimer(60)
      setVerificationCode('')
    } catch (error: any) {
      showToast.error(error.data?.message || 'Failed to send verification code')
    } finally {
      setIsResending(false)
    }
  }

  const renderEmailForm = () => (
    <form onSubmit={handleSendEmail} noValidate className='mt-8 space-y-6'>
      <div className='relative'>
        <FiMail
          className='absolute top-2 left-3 text-gray-400 z-20'
          size={20}
        />
        <input
          type='email'
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder='Email'
          className='pl-10 appearance-none rounded-md relative block w-full px-3 py-2 border border-base-300 placeholder-base-400 text-base-content focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary focus:z-10 sm:text-sm'
          required
        />
        {errors.email && (
          <p className='mt-2 text-sm text-error'>{errors.email}</p>
        )}
      </div>
      <button
        type='submit'
        className='group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-primary hover:bg-primary-focus focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary'
        disabled={isSendingEmail}
      >
        {isSendingEmail ? (
          <Loading size='loading-sm' color='text-white' />
        ) : (
          'Send Reset Code'
        )}
      </button>
    </form>
  )

  const renderVerificationForm = () => (
    <form onSubmit={handleVerifyCode} noValidate className='mt-8 space-y-6'>
      <div className='flex flex-col gap-4'>
        <div className='flex justify-between mb-4'>
          {[0, 1, 2, 3, 4, 5].map((index) => (
            <input
              key={index}
              type='text'
              maxLength={1}
              value={verificationCode[index] || ''}
              onChange={(e) => {
                const newCode = verificationCode.split('')
                newCode[index] = e.target.value
                setVerificationCode(newCode.join(''))
                if (e.target.value && e.target.nextSibling) {
                  ;(e.target.nextSibling as HTMLInputElement).focus()
                }
              }}
              onKeyDown={(e) => {
                if (
                  e.key === 'Backspace' &&
                  !verificationCode[index] &&
                  index > 0
                ) {
                  const prevInput = (e.target as HTMLInputElement)
                    .previousElementSibling as HTMLInputElement
                  if (prevInput) prevInput.focus()
                }
              }}
              onPaste={(e) => {
                e.preventDefault()
                const pasteData = e.clipboardData.getData('text').slice(0, 6)
                setVerificationCode(pasteData)
              }}
              className='w-12 h-12 text-center border border-base-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary'
              required
            />
          ))}
        </div>
        <div className='flex justify-center'>
          <button
            type='button'
            onClick={handleResendCode}
            disabled={isResending || resendTimer > 0}
            className={`text-primary hover:text-primary-focus text-sm font-medium flex items-center gap-2 ${
              isResending || resendTimer > 0
                ? 'opacity-50 cursor-not-allowed'
                : ''
            }`}
          >
            <svg
              xmlns='http://www.w3.org/2000/svg'
              className={`h-4 w-4 ${isResending ? 'animate-spin' : ''}`}
              fill='none'
              viewBox='0 0 24 24'
              stroke='currentColor'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={2}
                d='M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15'
              />
            </svg>
            {isResending
              ? 'Sending...'
              : resendTimer > 0
              ? `Resend code in ${resendTimer}s`
              : 'Resend code'}
          </button>
        </div>
      </div>
      <button
        type='submit'
        className='group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-primary hover:bg-primary-focus focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary'
        disabled={isVerifying}
      >
        {isVerifying ? (
          <Loading size='loading-sm' color='text-white' />
        ) : (
          'Verify Code'
        )}
      </button>
    </form>
  )

  const renderResetPasswordForm = () => (
    <form onSubmit={handleResetPassword} noValidate className='mt-8 space-y-6'>
      <div className='space-y-4'>
        <div className='relative'>
          <FiLock
            className='absolute top-3 left-3 text-gray-400 z-20'
            size={20}
          />
          <input
            type={showPassword ? 'text' : 'password'}
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder='New Password'
            className='pl-10 pr-10 appearance-none rounded-md relative block w-full px-3 py-2 border border-base-300 placeholder-base-400 text-base-content focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary focus:z-10 sm:text-sm'
            required
          />
          <button
            type='button'
            onClick={() => setShowPassword(!showPassword)}
            className='absolute top-3 right-0 pr-3 flex items-center'
          >
            {showPassword ? (
              <EyeSlashIcon className='h-5 w-5 text-gray-400' />
            ) : (
              <EyeIcon className='h-5 w-5 text-gray-400' />
            )}
          </button>
          {errors.newPassword && (
            <p className='mt-2 text-sm text-error'>{errors.newPassword}</p>
          )}
        </div>
        <div className='relative'>
          <FiLock
            className='absolute top-3 left-3 text-gray-400 z-20'
            size={20}
          />
          <input
            type={showConfirmPassword ? 'text' : 'password'}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder='Confirm New Password'
            className='pl-10 pr-10 appearance-none rounded-md relative block w-full px-3 py-2 border border-base-300 placeholder-base-400 text-base-content focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary focus:z-10 sm:text-sm'
            required
          />
          <button
            type='button'
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            className='absolute top-3 right-0 pr-3 flex items-center'
          >
            {showConfirmPassword ? (
              <EyeSlashIcon className='h-5 w-5 text-gray-400' />
            ) : (
              <EyeIcon className='h-5 w-5 text-gray-400' />
            )}
          </button>
          {errors.confirmPassword && (
            <p className='mt-2 text-sm text-error'>{errors.confirmPassword}</p>
          )}
        </div>
      </div>
      <button
        type='submit'
        className='group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-primary hover:bg-primary-focus focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary'
        disabled={isResetting}
      >
        {isResetting ? (
          <Loading size='loading-sm' color='text-white' />
        ) : (
          'Reset Password'
        )}
      </button>
    </form>
  )

  const getStageTitle = () => {
    switch (stage) {
      case 'email':
        return 'Forgot Password'
      case 'verify':
        return 'Verify Code'
      case 'reset':
        return 'Reset Password'
      default:
        return ''
    }
  }

  const getStageDescription = () => {
    switch (stage) {
      case 'email':
        return 'Enter your email to receive a reset code'
      case 'verify':
        return 'Enter the verification code sent to your email'
      case 'reset':
        return 'Enter your new password'
      default:
        return ''
    }
  }

  return (
    <div className='min-h-screen w-full bg-gradient-to-br from-primary to-accent flex justify-center items-center p-4'>
      <div className='bg-base-100 rounded-3xl shadow-2xl md:w-96 w-full p-8 space-y-6 backdrop-blur-sm bg-opacity-80'>
        <div className='text-center'>
          <img src={logo} alt='logo' className='mx-auto h-24 w-auto' />
          <h2 className='mt-6 text-3xl font-bold text-primary'>
            {getStageTitle()}
          </h2>
          <p className='mt-2 text-base text-base-content'>
            {getStageDescription()}
          </p>
        </div>
        {stage === 'email' && renderEmailForm()}
        {stage === 'verify' && renderVerificationForm()}
        {stage === 'reset' && renderResetPasswordForm()}
        <div className='text-center'>
          <p className='text-sm text-base-content'>
            Remember your password?{' '}
            <a
              href='/login'
              className='font-medium text-primary hover:text-primary-focus'
            >
              Sign in here
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}
