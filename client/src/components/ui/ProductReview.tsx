import React, { useState } from 'react'
import { Rate, Modal } from 'antd'
import { Review } from '@/types'
import { stringToDateTime } from '@/utils'
import { PlayCircleOutlined } from '@ant-design/icons'
const ProductReview: React.FC<{ review: Review }> = ({ review }) => {
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [modalContent, setModalContent] = useState<React.ReactNode>(null)

  const handleMediaClick = (
    e: React.MouseEvent,
    mediaUrl: string,
    isVideo: boolean
  ) => {
    e.stopPropagation()
    setModalContent(
      isVideo ? (
        <video src={mediaUrl} className='w-fit h-fit' controls />
      ) : (
        <img src={mediaUrl} alt='Review' className='w-fit h-fit' />
      )
    )
    setIsModalVisible(true)
  }

  return (
    <div className='review-container p-4 border-b border-gray-200'>
      <div className='flex items-center mb-4 gap-2'>
        <img
          src={review.account.avatarUrl}
          alt='User Avatar'
          className='w-14 h-14 rounded-full object-cover'
        />

        <div>
          <p className='font-semibold'>{review.account.email}</p>
          <p className='text-gray-500 text-sm'>
            {stringToDateTime(review.createdAt)}
          </p>
          <Rate value={review.rating} disabled className='text-red-500' />
        </div>
      </div>

      <p className='text-gray-700 mb-2'>{review.comment}</p>
      <div className='flex space-x-2 mb-2'>
        {review.reviewMedia.map((media, index) =>
          media.mediaType === 'image' ? (
            <img
              key={index}
              src={media.url}
              alt='Review'
              className='w-24 h-24 object-cover rounded cursor-pointer'
              onClick={(e) => handleMediaClick(e, media.url, false)}
            />
          ) : (
            <div className='relative'>
              <video
                key={index}
                src={media.url}
                className='w-24 h-24 object-cover rounded cursor-pointer'
                onClick={(e) => handleMediaClick(e, media.url, true)}
              />
              <div
                onClick={(e) => handleMediaClick(e, media.url, true)}
                className='absolute inset-0 flex items-center justify-center hover:cursor-pointer'
              >
                <PlayCircleOutlined className='text-white p-2 rounded-full bg-gray-200' />
              </div>
            </div>
          )
        )}
      </div>

      <Modal
        open={isModalVisible}
        footer={null}
        onCancel={() => setIsModalVisible(false)}
        centered
      >
        <div className='w-full h-full max-h-[calc(100vh-100px)] flex items-center justify-center pt-8'>
          {modalContent}
        </div>
      </Modal>
    </div>
  )
}

export { ProductReview }
