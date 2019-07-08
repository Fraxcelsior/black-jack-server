const Sequelize = require('sequelize')
const sequelize = require('../db')
const User = require('../User/model')

const Game = sequelize.define(
    'games',
    {}
)