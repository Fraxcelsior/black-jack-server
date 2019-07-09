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
            const json = JSON.stringify(games)
            stream.updateInit(json)
            stream.init(req, res)
        })
        .catch(error => next(error))
}
// when fetching lobby URL, onMessage is called to list all available games
// auth needs to be added before onStream
router.get('/lobby', onStream)

function onCreateGame(req, res, next) {
    const {name} = request.body

    Game
        .create({
            name
        })
        .then(result => {
            Game.findAll()
            .then(games => {
                const json = JSON.stringify(games)
                stream.updateInit(json)
                stream.send(json)
            })
            .then(games => res.send(games))
        })
        .catch(error => next(error))
}
router.post('/lobby', onCreateGame)

module.exports = router
