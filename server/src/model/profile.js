import { sequelize } from '@/config'
import { DataTypes } from 'sequelize'
import { getToday } from '@/utils'

export const Profile = sequelize.define('Profile', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  firstName: {
    type: DataTypes.STRING(50),
  },
  lastName: {
    type: DataTypes.STRING(50),
  },
  dob: {
    type: DataTypes.STRING(14),
  },
  phone: {
    type: DataTypes.STRING(10),
  },
  address: {
    type: DataTypes.STRING(255),
  },
  updateAt: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: () => getToday(),
  },
})

Profile.afterUpdate(async (profile, options) => {
  profile.updateAt = getToday()
})
