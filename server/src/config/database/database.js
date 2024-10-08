import { Sequelize } from 'sequelize'
import { config } from './config'

const sequelize = new Sequelize(config.DB, config.USER, config.PASSWORD, {
  dialect: config.DIALECT,
  host: config.HOST,
  port: config.PORT,
  logging: false,
  define: {
    timestamps: false,
  },
})

export { sequelize }
