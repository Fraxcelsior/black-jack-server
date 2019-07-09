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
User.belongsTo(Card)
Card.hasMany(User)


module.exports = Card
