const Sequelize = require('sequelize')
const sequelize = require('../db')

const User = sequelize.define('users', {
  name: {
    type: Sequelize.STRING
  },
  password: {
    type: Sequelize.STRING
  },
  points: {
    type: Sequelize.INTEGER
  }
},
  {
    tableName: 'users',
    timestamps: false
  }
)
//user.save
module.exports = User