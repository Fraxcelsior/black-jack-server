const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')


const app = express()
const jsonParser = bodyParser.json()


const User = require('./User/model')

const authRouter = require('./Auth/router')

app.use(cors())
app.use(jsonParser)
app.use(authRouter)



const port = process.env.PORT || 5005
app.listen(port, () => console.log(`Listening on port: ${port}`))