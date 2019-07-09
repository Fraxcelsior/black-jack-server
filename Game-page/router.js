const { Router } = require('express')
const Sse = require('json-sse')
const User = require('../User/model')
const Card = require('../Cards/model')


const router = new Router()
// stream sends data
const stream = new Sse()

const deck = [
    {
        value: 2,
        name: '2'
    },
    {
        value: 3,
        name: '3'
    },
    {
        value: 4,
        name: '4'
    },
    {
        value: 5,
        name: '5'
    },
    {
        value: 6,
        name: '6'
    },
    {
        value: 7,
        name: '7'
    },
    {
        value: 8,
        name: '8'
    },
    {
        value: 9,
        name: '9'
    },
    {
        value: 10,
        name: '10'
    },
    {
        value: 10,
        name: 'King'
    },
    {
        value: 10,
        name: 'Queen'
    },
    {
        value: 10,
        name: 'Jack'
    },
    {
        value: 1 || 11,
        name: 'Ace'
    },
]

// this function will draw a card and update the gameState
// User.addCard method will be used to add a new card to user
// create card
function drawRandomCard() {
    const index = Math.floor(Math.random() *(13 - 0) ) + 0;
    const drawnCard = deck[index]
    const cardValue = drawnCard.value
    Card
        create({value: cardValue})
        .then(createdCard => {
            User.addCard(createdCard.id)
        })
    console.log('INDEX', index, 'CARD', deck[index], 'VALUE', cardValue )
}

function onStream(req, res) {

    //this function should retrieve gameState and put it in init
    gameState => {
            const json = JSON.stringify(gameState)
            stream.updateInit(json)
            stream.init(req, res)
            console.log('ONSTREAM GAME', stream)
        }
}
router.get(`/game/${id}`, onStream)




