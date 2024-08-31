import React from 'react'
import { useAppSelector } from '@/hooks'
import { Loading } from './Loading'

export const LoadingOverlay: React.FC = () => {
  const isLoading = useAppSelector((state) => state.loading.isLoading)

  if (!isLoading) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <Loading size="large" color="text-white" />
    </div>
  )
}