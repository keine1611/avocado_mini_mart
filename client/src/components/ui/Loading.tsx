import React from 'react'

interface LoadingProps {
  size?: 'loading-sm' | 'loading-md' | 'loading-lg' | 'loading-xl'
  color?: string
}

export const Loading: React.FC<LoadingProps> = ({
  size = 'loading-lg',
  color = 'text-primary',
}) => {
  return (
    <div className='flex justify-center items-center'>
      <span
        className={`loading loading-ring ${
          size === 'loading-xl'
            ? 'w-24 h-24'
            : size === 'loading-lg'
            ? 'w-16 h-16'
            : size === 'loading-md'
            ? 'w-8 h-8'
            : 'w-6 h-6'
        } ${color}`}
      ></span>
    </div>
  )
}
