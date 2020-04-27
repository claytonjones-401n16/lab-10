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


/**
 * This route creates a user
 * @route POST /signup
 * @group signup
 * @returns {object} 200 - The user created or an object with error message
 */

router.post('/signup', async (req, res, next) => {
  let existingUser = await UserModel.readByQuery({username: req.body.username});
  if (existingUser.length === 0) {
    let user = await UserModel.create(req.body);
    let token = user.generateToken();
  
    res.send({user, token});
  } else {
    next({status: 400, message: 'Username already exists.'});
  }
});

/**
 * This route validates and signs a user in
 * @route POST /signin
 * @group signin
 * @returns {string, object} 200 - Signin successful message, or an object with an error message if credentials are invalid
 */

router.post('/signin', authenticate, async (req, res, next) => {
  if(req.hasValidCredentials) {
    let token = req.user.generateToken();


    res.status(200);
    res.send({user: req.user, token: token});
  } else {
    next({status: '401', message: 'Invalid Credentials'})
  }
});

/**
 * This route validates a user's token and allows them to see user specific information
 * @route GET /user
 * @group user
 * @returns {string} 200 - Returns username (user info) if token is valid
 */

router.get('/user', authenticate, async (req, res, next) => {
  if(req.user._id) {
    res.status(200).send({user: req.user.username});
  } else {
    next({status: 400, message: 'Not logged in / Invalid token'});
  }
});


// error handling
router.use(errorHandler);



module.exports = router;