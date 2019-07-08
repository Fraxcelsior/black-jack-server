const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')


const app = express()
const jsonParser = bodyParser.json()


const User = require('./User/model')

app.use(cors())
app.use(jsonParser)



const port = process.env.PORT || 5005
app.listen(port, () => console.log(`Listening on port: ${port}`))