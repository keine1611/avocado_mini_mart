import { MainCategory } from './MainCategory'

export interface SubCategory {
  id: number
  name: string
  slug: string
  mainCategoryId: number
  mainCategory: MainCategory
}
