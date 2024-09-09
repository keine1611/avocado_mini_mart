import { models } from '@/model'
import { sequelize } from '@/config'

export const connectToDB = async () => {
  try {
    await sequelize.authenticate()
    console.log('Connect to db success full')
  } catch (error) {
    console.log(error)
  }
}

export const syncDatabase = async () => {
  try {
    // Disable foreign key checks
    await sequelize.query('SET FOREIGN_KEY_CHECKS = 0')

    // Sync all models
    await sequelize.sync({ force: true })

    // Re-enable foreign key checks
    await sequelize.query('SET FOREIGN_KEY_CHECKS = 1')

    console.log('All models were synchronized successfully.')

    // Create initial data
    const brand = await models.Brand.create({
      name: 'Initial Brand',
      code: 'IB',
      slug: 'initial-brand',
      description: 'This is the initial brand created during database sync.',
    })

    const mainCategory = await models.MainCategory.create({
      name: 'Initial Category',
      code: 'IC',
    })

    const subCategory = await models.SubCategory.create({
      name: 'Initial Subcategory',
      code: 'IS',
      mainCategoryId: mainCategory.id,
    })

    console.log('Initial data created successfully.')
  } catch (error) {
    console.error('Error synchronizing models:', error)
  }
}
