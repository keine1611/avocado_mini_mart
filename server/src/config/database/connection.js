import { Sequelize } from 'sequelize'
import { config } from './config'

export const sequelize = new Sequelize(
  config.DB,
  config.USER,
  config.PASSWORD,
  {
    dialect: config.DIALECT,
    host: config.HOST,
    port: config.PORT,
    logging: false,
    define: {
      timestamps: false,
    },
  },
)

export const connectToDB = async () => {
  try {
    await sequelize.authenticate()
    console.log('Connect to db success ful')
  } catch (error) {
    console.log(error)
  }
}

export const syncDatabase = async () => {
  try {
    await sequelize.sync({ force: true })
    console.log('All models were synchronized successfully.')
  } catch (error) {
    console.error('Error synchronizing models:', error)
  }
}
