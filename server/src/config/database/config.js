import dotenv from 'dotenv'

dotenv.config()

const { DB_HOST, DB_USER, DB_PASSWORD, DB_NAME, DB_PORT } = process.env

export const config = {
  HOST: DB_HOST,
  USER: DB_USER,
  PASSWORD: DB_PASSWORD,
  DB: DB_NAME,
  DIALECT: 'mysql',
  PORT: DB_PORT,
}
