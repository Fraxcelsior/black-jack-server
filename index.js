const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')


const app = express()
const jsonParser = bodyParser.json()




const authRouter = require('./Auth/router')
const cardRouter = require('./Cards/router')

app.use(cors())
app.use(jsonParser)
app.use(authRouter)
app.use(cardRouter)



const port = process.env.PORT || 5005
app.listen(port, () => console.log(`Listening on port: ${port}`))