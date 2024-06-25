import { authRouter } from './auth'
import { brandRouter } from './brand'

export const route = (app) => {
  app.use('/api/brands', brandRouter)
  app.use('/api/auth', authRouter)
}
