import React from 'react'
import { Modal, Button } from 'antd'
import { Product } from '@/types'
import { formatCurrency } from '@/utils'

interface ProductViewModalProps {
  visible: boolean
  product: Product | null
  onClose: () => void
}

const ProductViewModal: React.FC<ProductViewModalProps> = ({
  visible,
  product,
  onClose,
}) => {
  const renderProductDetails = () => {
    if (!product) {
      return <p>No product data available.</p>
    }

    return (
      <div className='flex flex-col items-center'>
        <img
          src={product.mainImage}
          alt={product.name}
          className='w-48 h-48 object-cover mb-4'
        />
        <h2 className='text-2xl font-bold mb-2'>{product.name}</h2>
        <p className='text-gray-600'>Barcode: {product.barcode}</p>
        <p className='text-gray-600'>
          Standard Price: {formatCurrency(product.standardPrice)}
        </p>
        <p className='text-gray-600'>Status: {product.status}</p>
        <p className='text-gray-600'>
          Created At: {new Date(product.createdAt).toLocaleDateString()}
        </p>
        <p className='text-gray-600'>
          Updated At: {new Date(product.updatedAt).toLocaleDateString()}
        </p>
      </div>
    )
  }

  return (
    <Modal
      title='Product Details'
      visible={visible}
      onCancel={onClose}
      footer={[
        <Button key='close' onClick={onClose}>
          Close
        </Button>,
      ]}
      width={800}
      centered
    >
      {renderProductDetails()}
    </Modal>
  )
}

export { ProductViewModal }
