'use strict';

const express = require('express');
const bcrypt = require('bcrypt');

const router = express.Router();

const Model = require('../models/model.js');
const userSchema = require('../models/users-schema.js');

const UserModel = new Model(userSchema);

router.post('/signup', async (req, res, next) => {
  let user = await UserModel.create(req.body);

  res.send(user);
});

router.post('/signin', async (req, res, next) => {
  res.send('signin');
});

router.get('/users', async (req, res, next) => {
  let allUsers = await UserModel.read();
  res.send(allUsers);
});

module.exports = router;