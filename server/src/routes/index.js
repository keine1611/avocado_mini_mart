import { authRouter } from './auth'
import { brandRouter } from './brand'
import { uploadRouter } from './upload'
import { productRouter } from './product'
import { subCategoryRouter } from './subCategory'
import { mainCategoryRouter } from './mainCategory'
import { accountRouter } from './account'

export const route = (app) => {
  app.use('/api/brands', brandRouter)
  app.use('/api/auth', authRouter)
  app.use('/api/upload', uploadRouter)
  app.use('/api/products', productRouter)
  app.use('/api/sub-categories', subCategoryRouter)
  app.use('/api/main-categories', mainCategoryRouter)
  app.use('/api/accounts', accountRouter)
}
