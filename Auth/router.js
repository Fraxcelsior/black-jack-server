const { Router } = require('express')
const { toJWT } = require('./jwt')
const bcrypt = require('bcrypt')
const User = require('../User/model')

const router = new Router()

router.post('/login', (req, res, next) => {
  const { name } = req.body
  if(name){
    User
      .findOne({
        where: {name: name}
      })
      .then(entity => {
        if(!entity) {
          res.status(400).send({message: 'name is incorrect'})
          if (bcrypt.compareSync(req.body.password, entity.password)) {
            res.send({jwt: toJWT({ userId: entity.id }) })
          }else {

            res.status(400).send({message: 'Password was incorrect'})
          }
        }
        res.send({jwt: toJWT({userId: entity})})
      })
      .catch(error => next(error))

  }else {
    res.status(400).send({message: 'please supply a valid name' })
  }
})