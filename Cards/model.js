const Sequelize = require('sequelize')
const sequelize = require('../db')
const User = require('../User/model')


const Card = sequelize.define(
  'cards', 
  {
    value: Sequelize.INTEGER,
    name: Sequelize.STRING
  },
  { 
    tableName: 'cards',
    timestamps: false 
  }
)

// User.addCard
// Card.belongsTo(User)
User.hasMany(Card)


module.exports = Card
