import React, { useEffect, useState } from 'react'
import { logo } from '@/constant'
import { useLoginMutation } from '@/services'
import { showToast } from '@/components'
import { useNavigate, useLocation } from 'react-router-dom'
import { authActions } from '@/store/auth'
import { FiMail, FiLock, FiLogIn } from 'react-icons/fi'
import { loadingActions } from '@/store/loading'
import {
  cartActions,
  favoriteActions,
  useAppDispatch,
  useAppSelector,
} from '@/store'
import Cookies from 'js-cookie'
import { setLastCartFromLocalStorage } from '@/utils'

export interface LoginAccount {
  email: string
  password: string
}

export const UserLogin = () => {
  const dispatch = useAppDispatch()
  const location = useLocation()
  const navigate = useNavigate()
  const [account, setAccount] = useState<LoginAccount>({
    email: '',
    password: '',
  })
  const [login] = useLoginMutation()
  const [isLoading, setIsLoading] = useState(false)
  const [errors, setErrors] = useState({ email: '', password: '' })
  const [rememberMe, setRememberMe] = useState(false)
  const { user } = useAppSelector((state) => state.auth)

  const from = location.state?.from

  useEffect(() => {
    if (user) {
      if (from) {
        navigate(from, { replace: true })
      } else {
        if (user.role.name.toLowerCase() === 'admin') {
          navigate('/admin')
        } else {
          navigate('/')
        }
      }
    }
  }, [user])

  const validateForm = () => {
    let isValid = true
    const newErrors = { email: '', password: '' }

    if (!account.email || !/\S+@\S+\.\S+/.test(account.email)) {
      newErrors.email = 'Please enter a valid email address'
      isValid = false
    }

    if (!account.password || account.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters long'
      isValid = false
    }

    setErrors(newErrors)
    return isValid
  }

  const handleChangeAccount = (
    e: React.ChangeEvent<HTMLInputElement>
  ): void => {
    const { name, value } = e.target
    setAccount((prev) => ({ ...prev, [name]: value }))
    setErrors((prev) => ({ ...prev, [name]: '' }))
  }

  const handleLogin = async () => {
    if (!validateForm()) return

    setIsLoading(true)
    dispatch(loadingActions.setLoading(true))
    try {
      const result = await login({ ...account, rememberMe }).unwrap()
      Cookies.set('rememberMe', rememberMe.toString())
      dispatch(authActions.setUser(result.data))
      dispatch(cartActions.setCarts(result.data?.carts || []))
      setLastCartFromLocalStorage(result.data?.carts || [])
      dispatch(favoriteActions.setFavorites(result.data?.favorites || []))
      navigate(from, { replace: true })
    } catch (error: any) {
      showToast.error(error.data?.message || 'Something went wrong')
    } finally {
      setIsLoading(false)
      dispatch(loadingActions.setLoading(false))
    }
  }

  return (
    <div className='min-h-screen w-full bg-gradient-to-br from-primary to-accent flex justify-center items-center p-4'>
      <div className='bg-base-100 rounded-3xl shadow-2xl md:w-96 w-full p-8 space-y-6 backdrop-blur-sm bg-opacity-80'>
        <div className='text-center'>
          <img src={logo} alt='logo' className='mx-auto h-24 w-auto' />
          <h2 className='mt-6 text-3xl font-bold text-primary'>Welcome Back</h2>
          <p className='mt-2 text-base text-base-content'>
            Sign in to your account
          </p>
        </div>
        <form
          className='mt-8 space-y-6'
          onSubmit={(e) => {
            e.preventDefault()
            handleLogin()
          }}
          noValidate
        >
          <div className='space-y-4'>
            <div className='relative'>
              <FiMail
                className='absolute top-3 left-3 text-gray-400 z-20'
                size={20}
              />
              <input
                id='email-address'
                name='email'
                type='email'
                autoComplete='email'
                required
                className='pl-10 appearance-none rounded-md relative block w-full px-3 py-2 border border-base-300 placeholder-base-400 text-base-content focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary focus:z-10 sm:text-sm'
                placeholder='Email address'
                value={account.email}
                onChange={handleChangeAccount}
              />
              {errors.email && (
                <p className='mt-2 text-sm text-error'>{errors.email}</p>
              )}
            </div>
            <div className='relative'>
              <FiLock
                className='absolute top-3 left-3 text-gray-400 z-20'
                size={20}
              />
              <input
                id='password'
                name='password'
                type='password'
                autoComplete='current-password'
                required
                className='pl-10 appearance-none rounded-md relative block w-full px-3 py-2 border border-base-300 placeholder-base-400 text-base-content focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary focus:z-10 sm:text-sm'
                placeholder='Password'
                value={account.password}
                onChange={handleChangeAccount}
              />
              {errors.password && (
                <p className='mt-2 text-sm text-error'>{errors.password}</p>
              )}
            </div>
          </div>
          <div>
            <label className='flex items-center gap-2'>
              <input
                type='checkbox'
                checked={rememberMe}
                onChange={() => setRememberMe(!rememberMe)}
                className='checkbox checkbox-primary checkbox-sm'
              />
              Remember me
            </label>
          </div>
          <div>
            <button
              type='submit'
              className='group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-primary hover:bg-primary-focus focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary'
              disabled={isLoading}
            >
              <span className='absolute left-0 inset-y-0 flex items-center pl-3'>
                <FiLogIn className='h-5 w-5 text-primary-content group-hover:text-white' />
              </span>
              {isLoading ? 'Signing in...' : 'Sign in'}
            </button>
          </div>
        </form>
        <div className='text-center'>
          <p className='text-sm text-base-content'>
            Don't have an account?{' '}
            <a
              href='/register'
              className='font-medium text-primary hover:text-primary-focus'
            >
              Register here
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}
