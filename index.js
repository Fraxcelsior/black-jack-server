const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
const authRouter = require('./Auth/router')
const gamesRouter = require('./Games/router')
const cardRouter = require('./Cards/router')
const gamePageRouter = require('./Game-page/router')

const app = express()
const jsonParser = bodyParser.json()

app.use(cors())
app.use(jsonParser)
app.use(authRouter)
app.use(gamesRouter)
app.use(cardRouter)
app.use(gamePageRouter)

const port = process.env.PORT || 5005
app.listen(port, () => console.log(`Listening on port: ${port}`))