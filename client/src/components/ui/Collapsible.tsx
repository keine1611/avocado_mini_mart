import React, { useState } from 'react'
import { FaPlus, FaMinus } from 'react-icons/fa'

interface CollapsibleProps {
  title: React.ReactNode
  children: React.ReactNode
  className?: string
}

const Collapsible: React.FC<CollapsibleProps> = ({
  title,
  children,
  className,
}) => {
  const [isOpen, setIsOpen] = useState(false)

  const toggleCollapse = () => {
    setIsOpen(!isOpen)
  }

  return (
    <div className={className}>
      <div className='flex items-center justify-between py-2 transition-colors duration-500'>
        {title}
        <label className='swap swap-rotate'>
          <input type='checkbox' checked={isOpen} onChange={toggleCollapse} />
          <FaPlus className='swap-off' />
          <FaMinus className='swap-on' />
        </label>
      </div>

      <div
        className={`overflow-hidden transition-all duration-500 ${
          isOpen ? 'max-h-40 opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div className='pl-4 py-1'>{children}</div>
      </div>
    </div>
  )
}

export { Collapsible }
