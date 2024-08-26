import { message } from 'antd'
import { error } from 'console'
import React from 'react'
import { ToastContainer, ToastOptions, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

export const MyToast: React.FC = () => {
  return (
    <ToastContainer
      position='top-right'
      autoClose={5000}
      hideProgressBar={false}
      newestOnTop={false}
      closeOnClick
      rtl={false}
      pauseOnFocusLoss
      draggable
      pauseOnHover
      theme='light'
    />
  )
}

export const showToast = {
  success: (message: string) => {
    toast.success(message + '👌', toastOption)
  },
  error: (message: string) => {
    toast.error(message + ' 🤯', toastOption)
  },
  promise: (
    promise: any,
    message: { pending: string; success: string; error: string },
  ) => {
    toast.promise(
      promise,
      {
        pending: message.pending,
        success: message.success,
        error: message.error,
      },
      toastOption,
    )
  },
}

const toastOption: ToastOptions = {
  position: 'top-right',
  autoClose: 5000,
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
  progress: undefined,
  theme: 'light',
}
