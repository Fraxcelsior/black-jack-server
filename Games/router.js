const { Router } = require('express')
const Sse = require('json-sse')
const auth = require('../Auth/middleware')
const Game = require('./model')

const router = new Router()
// stream sends data
const stream = new Sse()

// here we listen for new clients and set initial data (gamestate)
function onStream(req, res) {
    Game
        .findAll()
        .then(games => {
            const json = JSON.stringify(games)
            stream.updateInit(json)
            stream.init(req, res)
            console.log('ONSTREAM', stream)
        })
        .catch(error => next(error))
}
// when fetching lobby URL, onMessage is called to list all available games
// auth needs to be added before onStream
router.get('/lobby', auth, onStream)
/*
router.get('/test', (req, res, next) => {
    Game
        .findAll()
        .then(games => {
            res.status(200).json({ games })
        })
        .catch(error => next(error))
})
*/
function onCreateGame(req, res, next) {
    const { name } = req.body

    Game
        .create({
            name
        })
        .then(result => {
            req.user.setGame(result)
            req.user.save()
                .then(
                    () =>
                        Game.findAll()
                            .then(games => {
                                const json = JSON.stringify(games)
                                stream.updateInit(json)
                                stream.send(json)
                                console.log('ONCREATE', stream)
                            })
                            .then(games => res.json({ games })))
        })
        .catch(error => next(error))
}
router.post('/lobby', auth, onCreateGame)

module.exports = router
