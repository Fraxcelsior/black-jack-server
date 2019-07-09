const { Router } = require('express')
const { toJWT } = require('./jwt')
const bcrypt = require('bcrypt')
const User = require('../User/model')
const auth = require('./middleware')

const router = new Router()

router.post('/login', (req, res, next) => {
  const name = req.body.name
  const password = req.body.password
 
  if (!name || !password) {
    res.status(400).send({
      message: 'Please supply a valid name and password'
    })
  }

  else {
    User
      .findOne({
        where: {
          name: req.body.name
        }
      })
      .then(entity => {
        if (!entity) {
          res.status(400).send({
            message: 'Name or password was incorrect'
          })
        }
        if (bcrypt.compareSync(req.body.password, entity.password)) {
          res.send({
            jwt: toJWT({ userId: entity.id })
          })
        }
        else {
          res.status(400).send({
            message: 'Name or password was incorrect'
          })
        }
      })
      .catch(error => {
        console.error(error)
        res.status(500).send({
          message: 'Oops! Something went wrong'
        })
      })
  }
 })
 
router.post('/signup', (req, res, next) => {
  const user = {
    name: req.body.name,
    password: bcrypt.hashSync(req.body.password, 10)
  }
  if(!req.body.name || !req.body.password) {
    res.status(404).json({message: 'password or email unknown'}).end()
  }else {
    User
      .create(user)
      .then(user => {
       return res.send(user)
      })
      .catch(err => next(err))
    
  }
})

//test
router.get('/secret-endpoint', auth, (req, res) => {
  res.send({
    message: `You are visiting the secret endpoint ${req.user.name}.`,
  })
})


module.exports = router