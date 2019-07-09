const Sequelize = require('sequelize')
const sequelize = require('../db')
const User = require('../User/model')


const Card = sequelize.define('cards', {
  value: {
    type:Sequelize.INTEGER
  }
},
{ 
  tableName: 'cards',
  timestamps: false 
}
)
//User.addCard
User.hasMany(Card)


module.exports = Card
