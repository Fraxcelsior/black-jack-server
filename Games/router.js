const { Router } = require('express')
const Sse = require('json-sse')
const auth = require('../Auth/middleware')
const Game = require('./model')

const router = new Router()
// stream sends data
const stream = new Sse()

// here we listen for new clients and set initial data (gamestate)
function onStream( req, res) {
    Game
        .findAll()
        .then(games => {
            stream.updateInit(games)
            stream.init(req, res)
        })
        .catch(error => next(error))
}
// when fetching lobby URL, onMessage is called to list all available games
// auth needs to be added before onStream
app.get('/lobby', onStream)



