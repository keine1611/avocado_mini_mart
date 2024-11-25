import { reviewController } from '@/controllers'
import { Router } from 'express'
import multer from 'multer'

const reviewRouter = Router()
const upload = multer({ storage: multer.memoryStorage() })

reviewRouter.post(
  '/',
  upload.array('mediaFiles', 5),
  reviewController.createReview
)
reviewRouter.get('/:productId', reviewController.getReviews)
export { reviewRouter }
