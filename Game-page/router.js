const { Router } = require('express')
const Sse = require('json-sse')
const User = require('../User/model')
const Card = require('../Cards/model')
const auth = require('../Auth/middleware')


const router = new Router()
// stream sends data
const stream = new Sse()

function gameStart() {
    //reset everything, should allow the user to act
    initializeRound()
}
function checkEnd() {
    if (req.user.stand || req.user.busted) {
        req.user.update(
            {points: + handScore}
        )
        .then(userState => {
            const json = JSON.stringify(userState)
            stream.updateInit(json)
            stream.init(req, res)
        })
        initializeRound()
        .catch(error => console.log(error))
    }

}
function initializeRound() {
    resetUser()
    emptyHand()
    initialiseStartingHand()
}

function resetUser() {
    req.user.update(
        {
            stand: false,
            busted: false
        }
    )
}
function emptyHand() {
    Card
        .delete(
            { where: { userId: req.user } }
        )
        .then(()=>{
            User.findByPk(req.user)
            .then(userState => {
                const json = JSON.stringify(userState)
                stream.updateInit(json)
                stream.init(req, res)
            })
        })
        .catch(error => console.log('EMPTYHAND', error))
}

// method to draw initial hand each round
function initialiseStartingHand() {
    Card
        .findAll(
            { where: { userId: req.user } }
        )
        .then(cardsInHand => {
            if (cardsInHand.length < 2) {
                drawRandomCard()
            }
        })
        .then(()=>{
            User.findByPk(req.user)
            .then(userState => {
                const json = JSON.stringify(userState)
                stream.updateInit(json)
                stream.init(req, res)
            })
        })
        .catch(error => console.log('INITHAND', error))
}

// this function will draw a card and update the gameState
// User.addCard method will be used to add a new card to user
// create card 
function drawRandomCard() {
    const index = Math.floor(Math.random() * (13 - 0)) + 0;
    const drawnCard = deck[index]

    //this.hasCards.push(drawnCard) // for now, push into handArray

    return Card //create new card in database, value is equal to drawn card
        .create({ ...drawnCard, userId: req.user })
        .then(createdCard => {
            //link card to user model
            req.user.addCard(createdCard.id)
        })
        .then(()=>{
            countHandValue()
        })
        .then(()=>{
            User.findByPk(req.user)
            .then(userState => {
                const json = JSON.stringify(userState)
                stream.updateInit(json)
                stream.init(req, res)
            })
        })
        .then(()=> {
            checkEnd()
        })
        .catch(error => console.log('DRAWCARD', error))
}

function countHandValue() {

    Card
        .findAll(
            { where: { userId: req.user } }
        )
        .then(cardsInHand => {
            //first we create a new array that holds the numeric values of the current hand
            const numericHand = cardsInHand.map(card => {
                return card.value
            })
        }).then(numericHand => {
            //Then we create a let(handValue) that returns the total score of the hand
            let handValue = numericHand.reduce((acc, currentCard) => {
                console.log('ACC', acc, 'CARD', currentCard)

                return acc + currentCard

            }, 0)
        })
        .then(handValue => {
            // After calculating hand score, we'll check if any drawn aces should be 11 or 1
            // first we define the starting index [0] for the while-loop
            let index = 0
            // this while loop will start if index is les than handsize AND if the handvalue is greater than 10
            while (index < numericHand.length && handValue > 10) {
                // card is the current card being checked (through index)
                let card = numericHand[index]
                // if the current card has a value, it's an ace, thus true
                isAce = card === 11
                // check if the card is an ace and the hand score would be greater than 21
                if (isAce && handValue > 21) {
                    //in that case, ace should be 1, so we simply deduct 10 from handscore
                    return handValue -= 10
                }
                //for looping purpose, we increment index, so it will run the checks for all cards in hand
                index++
            }
            // check if the total hand has a score greater than 21, user will bust
            if (handValue > 21) {
                console.log('BUSTED!')//update user: busted = true
                req.user
                    .update({
                        busted: true
                    })
                return handValue
            }
            // if handscore is exactly 21: player has blackjack
            if (handValue === 21) {
                console.log('BLACKJACK!!')//update user: wins = true
                req.user
                    .update({
                        stand: true,
                        handScore: 21,
                        points: +21

                    })
                return handValue
            }
            //otherwise, simply return handvalue and allow player to hit or stand
            else {
                req.user
                    .update({
                        handScore: +handValue
                    })
                return handValue
            }
        })
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
        value: 11,
        name: 'Ace'
    },
]

function updateUser(req, res, next) {
    //expect: {stand: true}
    req.user.update(req.body)
        .then(userState => {
            const json = JSON.stringify(userState)
            stream.updateInit(json)
            stream.init(req, res)
        })
        .then(()=>{
            checkEnd()
        })
        .catch(error => next(error))
}

router.put(`/games/:id`, auth, updateUser)
router.post(`/games/:id`, auth, drawRandomCard, countHandValue)
router.get(`games/:id`, auth, gameStart)

router.get(`/streamdata/:id`, (req, res, next) => {
    const id = req.params.id
    User
        .findAll(
            { where: { gameId: id } }
        )
        .then(users => {
            const json = JSON.stringify(users)
            stream.updateInit(json)
            stream.init(req, res)
        })
        .catch(error => next(error))
})

module.exports = router