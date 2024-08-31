import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useRegisterMutation, useVerifyAndCreateAccountMutation } from '@/services/auth'
import { EyeIcon, EyeSlashIcon } from '@/resources'
import { logo } from '@/constant'
import { FiMail, FiLock, FiUserPlus } from 'react-icons/fi'
import { showToast } from '@/components'

export const UserRegister = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [retypePassword, setRetypePassword] = useState('')
  const [verificationCode, setVerificationCode] = useState('')
  const [showVerificationForm, setShowVerificationForm] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showRetypePassword, setShowRetypePassword] = useState(false)
  const [errors, setErrors] = useState({ email: '', password: '', retypePassword: '' })

  const [register] = useRegisterMutation()
  const [verifyAndCreateAccount] = useVerifyAndCreateAccountMutation()
  const navigate = useNavigate()

  const validateForm = () => {
    let isValid = true
    const newErrors = { email: '', password: '', retypePassword: '' }

    if (!email) {
      newErrors.email = 'Email is required'
      isValid = false
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Please enter a valid email address'
      isValid = false
    }

    if (!password) {
      newErrors.password = 'Password is required'
      isValid = false
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters long'
      isValid = false
    }

    if (!retypePassword) {
      newErrors.retypePassword = 'Please retype your password'
      isValid = false
    } else if (password !== retypePassword) {
      newErrors.retypePassword = 'Passwords do not match'
      isValid = false
    }

    setErrors(newErrors)
    return isValid
  }

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validateForm()) {
      return
    }
    try {
      await register({ email, password }).unwrap()
      setShowVerificationForm(true)
    } catch (error: any) {
      showToast.error(error.data?.message || 'Registration failed')
    }
  }

  const handleVerify = async (e: React.FormEvent) => {
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
      await verifyAndCreateAccount({ email, verificationCode }).unwrap()
      showToast.success('Account verified successfully')
      navigate('/login')
    } catch (error: any) {
      showToast.error(error.data?.message || 'Verification failed')
    }
  }

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword)
  }

  const toggleRetypePasswordVisibility = () => {
    setShowRetypePassword(!showRetypePassword)
  }

  if (showVerificationForm) {
    return (
      <div className='min-h-screen w-full bg-gradient-to-br from-primary to-accent flex justify-center items-center p-4'>
        <div className='bg-base-100 rounded-3xl shadow-2xl md:w-96 w-full p-8 space-y-6 backdrop-blur-sm bg-opacity-80'>
          <div className='text-center'>
            <img src={logo} alt='logo' className='mx-auto h-24 w-auto' />
            <h2 className='mt-6 text-3xl font-bold text-primary'>Verify Your Account</h2>
            <p className='mt-2 text-base text-base-content'>Enter the verification code sent to your email</p>
          </div>
          <form onSubmit={handleVerify} noValidate className='mt-8 space-y-6'>
            <div className='flex justify-between mb-4'>
              {[0, 1, 2, 3, 4, 5].map((index) => (
                <input
                  key={index}
                  type="text"
                  maxLength={1}
                  value={verificationCode[index] || ''}
                  onChange={(e) => {
                    const newCode = verificationCode.split('');
                    newCode[index] = e.target.value;
                    setVerificationCode(newCode.join(''));
                    if (e.target.value && e.target.nextSibling) {
                      (e.target.nextSibling as HTMLInputElement).focus();
                    }
                  }}
                  className='w-12 h-12 text-center border border-base-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary'
                  required
                />
              ))}
            </div>
            <button 
              type="submit"
              className='group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-primary hover:bg-primary-focus focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary'
            >
              Verify
            </button>
          </form>
        </div>
      </div>
    )
  }

  return (
    <div className='min-h-screen w-full bg-gradient-to-br from-primary to-accent flex justify-center items-center p-4'>
      <div className='bg-base-100 rounded-3xl shadow-2xl md:w-96 w-full p-8 space-y-6 backdrop-blur-sm bg-opacity-80'>
        <div className='text-center'>
          <img src={logo} alt='logo' className='mx-auto h-24 w-auto' />
          <h2 className='mt-6 text-3xl font-bold text-primary'>Create Account</h2>
          <p className='mt-2 text-base text-base-content'>Sign up for a new account</p>
        </div>
        <form onSubmit={handleRegister} noValidate className='mt-8 space-y-6'>
          <div className='space-y-4'>
            <div className='relative'>
              <FiMail className='absolute top-3 left-3 text-gray-400 z-20' size={20} />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
                className='pl-10 appearance-none rounded-md relative block w-full px-3 py-2 border border-base-300 placeholder-base-400 text-base-content focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary focus:z-10 sm:text-sm'
                required
              />
              {errors.email && <p className='mt-2 text-sm text-error'>{errors.email}</p>}
            </div>
            <div className='relative'>
              <FiLock className='absolute top-3 left-3 text-gray-400 z-20' size={20} />
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                className='pl-10 pr-10 appearance-none rounded-md relative block w-full px-3 py-2 border border-base-300 placeholder-base-400 text-base-content focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary focus:z-10 sm:text-sm'
                required
              />
              <button
                type="button"
                onClick={togglePasswordVisibility}
                className="absolute top-3 right-0 pr-3 flex items-center"
              >
                {showPassword ? (
                  <EyeSlashIcon className="h-5 w-5 text-gray-400" />
                ) : (
                  <EyeIcon className="h-5 w-5 text-gray-400" />
                )}
              </button>
              {errors.password && <p className='mt-2 text-sm text-error'>{errors.password}</p>}
            </div>
            <div className='relative'>
              <FiLock className='absolute top-3 left-3 text-gray-400 z-20' size={20} />
              <input
                type={showRetypePassword ? "text" : "password"}
                value={retypePassword}
                onChange={(e) => setRetypePassword(e.target.value)}
                placeholder="Retype Password"
                className='pl-10 pr-10 appearance-none rounded-md relative block w-full px-3 py-2 border border-base-300 placeholder-base-400 text-base-content focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary focus:z-10 sm:text-sm'
                required
              />
              <button
                type="button"
                onClick={toggleRetypePasswordVisibility}
                className="absolute top-3 right-0 pr-3 flex items-center"
              >
                {showRetypePassword ? (
                  <EyeSlashIcon className="h-5 w-5 text-gray-400" />
                ) : (
                  <EyeIcon className="h-5 w-5 text-gray-400" />
                )}
              </button>
              {errors.retypePassword && <p className='mt-2 text-sm text-error'>{errors.retypePassword}</p>}
            </div>
          </div>
          <div>
            <button 
              type="submit"
              className='group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-primary hover:bg-primary-focus focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary'
            >
              <span className='absolute left-0 inset-y-0 flex items-center pl-3'>
                <FiUserPlus className='h-5 w-5 text-primary-content group-hover:text-white' />
              </span>
              Register
            </button>
          </div>
        </form>
        <div className='text-center'>
          <p className='text-sm text-base-content'>
            Already have an account?{' '}
            <a href='/login' className='font-medium text-primary hover:text-primary-focus'>
              Sign in here
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}