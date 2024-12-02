import { models } from '@/models'
import { sequelize } from '@/config'
import { statusProduct } from '@/enum'
import fs from 'fs/promises'
import path from 'path'

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
    await models.Role.bulkCreate([
      { id: 1, name: 'ADMIN' },
      { id: 2, name: 'USER' },
      { id: 3, name: 'STAFF' },
    ])

    // Create initial data
    await importDataFromJson('brands.json', models.Brand)
    await importDataFromJson('mainCategories.json', models.MainCategory)
    await importDataFromJson('subCategories.json', models.SubCategory)
    await importDataFromJson('products.json', models.Product)
    await importDataFromJson('imagesProduct.json', models.ProductImage)
    await importDataFromJson('batch.json', models.Batch)
    await importDataFromJson('batchProduct.json', models.BatchProduct)
    const permissions = await importDataFromJson(
      'permission.json',
      models.Permission
    )
    await importDataFromJson('role_permission.json', models.RolePermission)

    await models.Account.create(
      {
        email: 'admin@gmail.com',
        password: '123456',
        roleId: 1,
        profile: {
          firstName: 'Admin',
          lastName: 'Admin',
          phone: '0909090909',
          dob: '16112002000000',
          address: '123 Main St, Anytown, USA',
          gender: 'male',
        },
      },
      {
        include: ['profile'],
      }
    )
    await models.Account.create({
      email: 'staff@gmail.com',
      password: '123456',
      roleId: 3,
    })

    const adminRolePermission = await models.RolePermission.bulkCreate(
      permissions.map((permission) => ({
        roleId: 1,
        permissionName: permission.name,
      }))
    )

    // const staffRolePermission = await models.RolePermission.bulkCreate([])

    console.log('Initial data created successfully.')
  } catch (error) {
    console.error('Error synchronizing models:', error)
  }
}

const importDataFromJson = async (fileName, model) => {
  try {
    const dataPath = path.join(__dirname, '../../static/json', fileName)
    const data = await fs.readFile(dataPath, 'utf8')
    const jsonData = JSON.parse(data)
    return await model.bulkCreate(jsonData)
  } catch (error) {
    console.error('Error importing data from JSON:', error)
  }
}
