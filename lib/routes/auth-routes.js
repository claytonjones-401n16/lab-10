'use strict';

const express = require('express');
const bcrypt = require('bcrypt');

const router = express.Router();

const Model = require('../models/model.js');
const userSchema = require('../models/users-schema.js');

const UserModel = new Model(userSchema);

// route middleware
const authenticate = require('../middleware/auth.js');
const errorHandler = require('../middleware/error-handler.js');

router.use('/signin', authenticate);

router.post('/signup', async (req, res, next) => {
  let existingUser = await UserModel.readByQuery({username: req.body.username});
  if (existingUser.length === 0) {
    let user = await UserModel.create(req.body);
  
    res.send(user);
  } else {
    next({status: 400, message: 'Username already exists.'});
  }
});

router.post('/signin', async (req, res, next) => {
  res.send('Sign-in successful');
});


// error handling
router.use(errorHandler);



module.exports = router;