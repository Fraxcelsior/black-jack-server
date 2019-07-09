const { Router } = require('express')
const Sse = require('json-sse')
const User = require('../User/model')
const Card = require('../Cards/model')
const auth = require('../Auth/middleware')


const router = new Router()
// stream sends data
const stream = new Sse()

//define player class
class Player {
    constructor(id) {
        this.id = id
        this.points = 100
        this.hasCards = []
        this.betpoints = 0 //the amount of points that a player bets
        this.stand = false //true if stand is pressed
        this.busted = false //true if countHandValue > 21
    }
    // method to draw initial hand each round
    initialiseStartingHand(hasCards) {
        if (this.hasCards.length < 2) {
            drawRandomCard()
        }
    }
    // method to score hand, still need to apply ace logic
    countHandValue(hasCards) {
        let score = 0

        this.hasCards.reduce((acc, currentCard) => {
            if (acc > 21 && currentCard.name === 'ace') {
                currentCard.value = 1
            } 
            if (acc > 21) {
                this.busted = true
            }
            else {
                acc + card
            }
        }, score)
        return score
    }
}

const gameState = {
    activePlayers: [],
    checkWinner: function () {
        // check if all players .stand || .busted
        // check for players who stand: which is highest?
        // highest score wins: 3 : 2 on points spent
        // draw: players regain bet
        console.log('checkWinner is called')
    }

}

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
        value: 11 || 1,
        name: 'Ace'
    },
]

// this function will draw a card and update the gameState
// User.addCard method will be used to add a new card to user
// create card
function drawRandomCard() {
    const index = Math.floor(Math.random() * (13 - 0)) + 0;
    const drawnCard = deck[index]
    const cardValue = drawnCard.value
    this.hasCards.push(drawnCard) // for now, push into handArray
    Card //create new card in database, value is equal to drawn card
    create({ value: cardValue, userId: req.user })
        .then(createdCard => {
            //link card to user model
            req.user.addCard(createdCard.id)
        })
    console.log('INDEX', index, 'CARD', deck[index], 'VALUE', cardValue)
}

function onStream(req, res) {
    //push user to gameState.activePlayers if neccesary
    //gameState.activePlayers.push(new Player(req.user))

    //set points to 100    

    //this function should retrieve gameState and put it in init
    gameState => {
        const json = JSON.stringify(gameState)
        stream.updateInit(json)
        stream.init(req, res)
        console.log('ONSTREAM GAME', stream)
    }
}
router.get(`/lobby/${id}`, auth, onStream)

function createGameData(req, res, next) {
    //this function will handle the input from client, update gameState and send it back
    const json = JSON.stringify(gameState)
    stream.updateInit(json)
    stream.init(req, res)

    return gameState
}

router.post(`/lobby/${id}`, auth, createGameData)