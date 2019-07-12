const { Router } = require('express')
const Sse = require('json-sse')
const User = require('../User/model')
const Card = require('../Cards/model')
const auth = require('../Auth/middleware')

const router = new Router()
// stream sends data
const stream = new Sse()

router.put(`/games/:id`, auth, updateUser, checkEnd)
router.post(`/games/:id`, auth, drawRandomCard)
router.get(`/games/:id`, auth, gameStart)

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

function gameStart(req, res, next) {
    //reset everything, should allow the user to act
    initializeRound(req, res)
}
function checkEnd(req, res) {
    let totalScore = (req.user.points + req.user.handScore)
    if (req.user.stand || req.user.busted) {
        console.log('HANDSCORE???', req.user.handScore)
        return req.user.update(
            { points: totalScore }
        )
            .then(() => {
                setTimeout(
                    () => {
                        initializeRound(req, res)
                            .then(() => {
                                return User.findByPk(req.user.id)
                                    .then(userState => {
                                        const json = JSON.stringify(userState)
                                        stream.updateInit(json)
                                        stream.init(req, res)
                                    })
                            })
                    },
                    3000
                )
            })
            .catch(error => console.log(error))
    }

}
function initializeRound(req, res) {
    return resetUser(req, res)
    .then(()=> emptyHand(req, res))
    .then(()=> initialiseStartingHand(req, res))
}

function resetUser(req, res) {
    return req.user.update(
        {
            stand: false,
            busted: false
        }
    )
}
function emptyHand(req, res) {
    return Card
        .destroy(
            { where: { userId: req.user.id } }
        )
        .catch(error => console.log('EMPTYHAND', error))
}

// method to draw initial hand each round
function initialiseStartingHand(req, res) {
    return Card
        .findAll(
            { where: { userId: req.user.id } }
        )
        .then(() => drawRandomCard(req, res))
        .then(() => drawRandomCard(req, res))
        .then(() => countHandValue(req, res))
        .then((req) => {
            return User.findByPk(req.user.id)
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
function drawRandomCard(req, res) {
    const index = Math.floor(Math.random() * (13 - 0)) + 0;
    const drawnCard = deck[index]

    return Card //create new card in database, value is equal to drawn card
        .create({ ...drawnCard, userId: req.user.id })
        //.then(createdCard => req.user.addCard(createdCard.id))
        .then(()=> countHandValue(req, res))
        .then(()=> checkEnd(req, res))
        .catch(error => console.log('DRAWCARD', error))
}

function countHandValue(req, res) {

    return Card
        .findAll(
            { where: { userId: req.user.id } }
        )
        .then(cardsInHand => {
            console.log('CARDS IN HAND', cardsInHand)
            //first we create a new array that holds the numeric values of the current hand
            const numericHand = cardsInHand.map(card => {
                return card.value
            })


            //Then we create a let(handValue) that returns the total score of the hand
            let handValue = numericHand.reduce((acc, currentCard) => {
                console.log('ACC', acc, 'CARD', currentCard)

                return acc + currentCard

            }, 0)


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
                return req.user
                    .update({
                        busted: true
                    })
                    .then(() => {
                        return checkEnd(req, res)
                    })
                    .catch(error => console.log(error))
                //return handValue
            }
            // if handscore is exactly 21: player has blackjack
            if (handValue === 21) {
                console.log('BLACKJACK!!')//update user: wins = true
                return req.user
                    .update({
                        stand: true,
                        handScore: 21,
                        points: +21

                    })
                    .then(() => {
                        return checkEnd(req, res)
                    })
                    .catch(error => console.log(error))
                //return handValue
            }
            //otherwise, simply return handvalue and allow player to hit or stand
            else {
                return req.user
                    .update({
                        handScore: +handValue
                    })
                //return handValue
            }
        })
}

function updateUser(req, res, next) {
    //expect: {stand: true}
    return req.user.update(req.body)
        .then(() => {
            countHandValue(req, res)
            return checkEnd(req, res)
        })
        .catch(error => next(error))
}

module.exports = router