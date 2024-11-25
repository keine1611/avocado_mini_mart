import { Account } from './Account'

export type Review = {
  id: number
  rating: number
  comment: string
  accountId: string
  productId: number
  createdAt: string
  reviewMedia: ReviewMedia[]
  account: Account
}

export type ReviewMedia = {
  id: string
  reviewId: string
  url: string
  mediaType: 'image' | 'video'
  review: Review
}
