import React from 'react'

interface LoadingProps {
  size?: 'small' | 'medium' | 'large'
  color?: string
}

export const Loading: React.FC<LoadingProps> = ({
  size = 'medium',
  color = 'text-primary',
}) => {
  const sizeClasses = {
    small: 'w-6 h-6',
    medium: 'w-12 h-12',
    large: 'w-16 h-16',
  }

  return (
    <div className='flex justify-center items-center'>
      <div
        className={`animate-spin rounded-full border-t-2 border-b-2 ${color} ${sizeClasses[size]}`}
      ></div>
    </div>
  )
}
