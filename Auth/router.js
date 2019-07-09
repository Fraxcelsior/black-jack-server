const { Router } = require('express')
const { toJWT } = require('./jwt')
const bcrypt = require('bcrypt')
const User = require('../User/model')

const router = new Router()

router.post('/login', (req, res, next) => {
  const { name, password } = req.body
  if(name && password){
    User
      .findOne({
        where: {name: name}
      })
      .then(entity => {
        console.log('ENTITY', entity.password)
        if(!entity) {
          res.status(400).send({message: 'name is incorrect'})
        if(bcrypt.compareSync(req.body.password, entity.password)) {
          res.send({jwt: toJWT({ userId: entity.id }) })
        }else {
          res.status(400).send({message: 'Password was incorrect'})
        }
      }
        //res.send({jwt: toJWT({userId: entity.id})})
      })
      .catch(error => next(error))

  }else {
    res.status(400).send({message: 'please supply a valid name' })
  }
})

router.post('/signup', (req, res, next) => {
  const user = {
    name: req.body.name,
    password: bcrypt.hashSync(req.body.password,)
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

module.exports = router