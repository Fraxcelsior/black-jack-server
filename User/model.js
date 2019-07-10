const Sequelize = require('sequelize')
const sequelize = require('../db')

const User = sequelize.define('users', {
  name: Sequelize.STRING,
  password: Sequelize.STRING,
  points: Sequelize.INTEGER,
  stand: Sequelize.BOOLEAN,
  busted: Sequelize.BOOLEAN,
  value: {
    type: Sequelize.INTEGER,
    defaultValue: 0
  }
},
  {
    tableName: 'users',
    timestamps: false
  }
)
//user.save
module.exports = User