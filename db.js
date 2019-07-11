const Sequelize = require('sequelize')
const databaseUrl = process.env.DATABASE_URL || 'postgres://postgres:secret@localhost:5432/postgres'
const sequelize = new Sequelize(databaseUrl)

//{force: true}
sequelize   
  .sync({force: true})
  .then(() => console.log('Database schema has been updated'))
  .catch(console.error)

module.exports = sequelize
