const Sequelize = require('sequelize')
const sequelize = require('../db')
const User = require('../User/model')

const Game = sequelize.define(
    'games',
    {
        name: {
            type: Sequelize.STRING,
            field: 'game_name'
        }
    },
    { tableName: 'games'}
)
User.belongsTo(Game)
Game.hasMany(User)

module.exports = Game