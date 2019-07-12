const Sequelize = require('sequelize')
const sequelize = require('../db')

const User = sequelize.define('users', {
  name: Sequelize.STRING,
  password: Sequelize.STRING,
  points: {
    type: Sequelize.INTEGER,
    defaultValue: 0
  },
  stand: {
    type: Sequelize.BOOLEAN,
    defaultValue: false
  },
  busted: {
    type: Sequelize.BOOLEAN,
    defaultValue: false
  },
  handScore: {
    type: Sequelize.INTEGER,
    defaultValue: 0
  },
  wonRound: {
    type: Sequelize.BOOLEAN,
    defaultValue: false
  }
},
  {
    tableName: 'users',
    timestamps: false
  }
)
//user.save
module.exports = User