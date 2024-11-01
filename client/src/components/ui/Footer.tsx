import React from 'react'

export const Footer: React.FC = () => {
  return (
    <footer className='bg-base-200 text-center p-4'>
      <p className='text-sm text-gray-600'>
        © {new Date().getFullYear()} Minimart. All rights reserved.
      </p>
    </footer>
  )
}
