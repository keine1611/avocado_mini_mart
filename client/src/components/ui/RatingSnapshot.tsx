import { Review } from '@/types'
import { Rate, Progress } from 'antd'
import React from 'react'

interface RatingSnapshotProps {
  reviews: Review[]
}

const RatingSnapshot: React.FC<RatingSnapshotProps> = ({ reviews }) => {
  const totalReviews = reviews.length
  const averageRating =
    totalReviews > 0
      ? reviews.reduce((acc, review) => acc + review.rating, 0) / totalReviews
      : 0

  const ratingCounts = [1, 2, 3, 4, 5].map((star) => ({
    star,
    count: reviews.filter((review) => review.rating === star).length,
  }))

  return (
    <div className='rating-snapshot-container p-4 bg-white shadow-md rounded-lg flex md:flex-row flex-col items-center gap-4'>
      <div className='flex flex-col items-center gap-2 min-w-[300px]'>
        <div className='flex items-center mb-4'>
          <Rate value={averageRating} disabled className='text-yellow-500' />
          <span className='ml-2 text-gray-600'>
            ({averageRating.toFixed(1)})
          </span>
        </div>
        <p className='text-gray-500 mb-4'>{totalReviews} reviews</p>
      </div>
      <div className='space-y-2 w-full'>
        {ratingCounts.map(({ star, count }) => (
          <div key={star} className='flex items-center'>
            <Rate value={star} disabled className='text-yellow-500' />
            <Progress
              percent={(count / totalReviews) * 100}
              showInfo={false}
              className='flex-1 mx-2'
              strokeColor={{
                '0%': '#108ee9',
                '100%': '#87d068',
              }}
            />
            <span className='ml-2 text-gray-600'>{count} reviews</span>
          </div>
        ))}
      </div>
    </div>
  )
}

export { RatingSnapshot }
