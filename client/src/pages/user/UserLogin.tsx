import React, { useState } from 'react'
import { logo } from '@/constant'
import { Account } from '@/types'
import { useLoginMutation } from '@/services'
import { showToast } from '@/components'
import Cookies from 'js-cookie'
import { useNavigate } from 'react-router-dom'
import { authActions } from '@/store/auth'
import { useAppDispatch } from '@/hooks'

const initialState: Account = {
  email: '',
  password: '',
}

export const UserLogin = () => {
  const [account, setAccount] = useState<Account>(initialState)
  const [login] = useLoginMutation()

  const navigate = useNavigate()
  const dispath = useAppDispatch()
  const handleChangeAccount = (
    e: React.ChangeEvent<HTMLInputElement>,
  ): void => {
    const { name, value } = e.target
    setAccount((prev) => ({ ...prev, [name]: value }))
  }

  const handleLogin = async () => {
    const result = await login(account)
    if (result.error) {
      showToast.error('Login failed')
    } else {
      dispath(authActions.setUser(result.data.data))
      showToast.success('Login success')
      await new Promise((resolve) => {
        setTimeout(resolve, 2000)
      })
      navigate('/admin')
    }
  }

  return (
    <div className='h-screen w-screen bg-cover bg-center flex justify-center items-center bg-gradient-to-br from-neutral to-accent'>
      <div className=' border border-gray-300 md:px-24 md:py-12 px-8 py-8 relative backdrop-blur-md bg-white/20 shadow-lg rounded-md'>
        <img
          src={logo}
          alt='logo'
          className='mx-auto h-28'
        />
        <p className=' mt-2 font-bold text-2xl text-center mb-5'>LOGIN</p>
        <div className=' flex flex-col gap-4 '>
          <label className='input input-bordered flex items-center gap-2 sm:w-80'>
            <svg
              xmlns='http://www.w3.org/2000/svg'
              viewBox='0 0 16 16'
              fill='currentColor'
              className='w-4 h-4 opacity-70'
            >
              <path d='M2.5 3A1.5 1.5 0 0 0 1 4.5v.793c.026.009.051.02.076.032L7.674 8.51c.206.1.446.1.652 0l6.598-3.185A.755.755 0 0 1 15 5.293V4.5A1.5 1.5 0 0 0 13.5 3h-11Z' />
              <path d='M15 6.954 8.978 9.86a2.25 2.25 0 0 1-1.956 0L1 6.954V11.5A1.5 1.5 0 0 0 2.5 13h11a1.5 1.5 0 0 0 1.5-1.5V6.954Z' />
            </svg>
            <input
              name='email'
              type='email'
              className='grow'
              placeholder='Email'
              value={account.email}
              onChange={handleChangeAccount}
            />
          </label>
          <label className='input input-bordered flex items-center gap-2'>
            <svg
              xmlns='http://www.w3.org/2000/svg'
              viewBox='0 0 16 16'
              fill='currentColor'
              className='h-4 w-4 opacity-70'
            >
              <path
                fillRule='evenodd'
                d='M14 6a4 4 0 0 1-4.899 3.899l-1.955 1.955a.5.5 0 0 1-.353.146H5v1.5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1-.5-.5v-2.293a.5.5 0 0 1 .146-.353l3.955-3.955A4 4 0 1 1 14 6Zm-4-2a.75.75 0 0 0 0 1.5.5.5 0 0 1 .5.5.75.75 0 0 0 1.5 0 2 2 0 0 0-2-2Z'
                clipRule='evenodd'
              />
            </svg>
            <input
              type='password'
              name='password'
              className='grow'
              placeholder='Password'
              value={account.password}
              onChange={handleChangeAccount}
            />
          </label>
          <button
            onClick={handleLogin}
            className=' btn btn-primary'
          >
            LOGIN
          </button>
        </div>
      </div>
    </div>
  )
}
