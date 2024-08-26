import { authRouter } from './auth'
import { brandRouter } from './brand'
import { uploadRouter } from './upload'

export const route = (app) => {
  app.use('/api/brand', brandRouter)
  app.use('/api/auth', authRouter)
  app.use('/api/upload', uploadRouter)
}
