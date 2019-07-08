const Sequelize = require('sequelize')
const sequelize = require('../db')

const User = sequelize.define('users', {
  name: {
    type:Sequelize.STRING
  },
  password: {
    type:Sequelize.STRING
  },
  points: {
    type:Sequelize.INTEGER
  }
},
{ 
  tableName: 'users',
  timestamps: false 
}
)



module.exports = User