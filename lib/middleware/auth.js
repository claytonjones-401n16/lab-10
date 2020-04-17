'use strict';

const bcrypt = require('bcrypt');

const Model = require('../models/model.js');
const userSchema = require('../models/users-schema.js');

const UserModel = new Model(userSchema);

const base64Decoder = (encodedString) => {
  let data = {
    username: '',
    password: ''
  }

  let decodedString = Buffer.from(encodedString, 'base64').toString();
  let dataPieces = decodedString.split(':');

  data.username = dataPieces[0];
  data.password = dataPieces[1];

  return data;
}

const authenticate = async (req, res, next) => {
  const basicAuth = req.headers.authorization.split(' ');

  if (basicAuth.length === 2 && basicAuth[0] === 'Basic') {
    let userData = base64Decoder(basicAuth[1]);
    let user = await UserModel.readByQuery({
      username: userData.username
    });
    console.log('user:', user);

    if (user.length === 0) {
      next({status: '401', message: 'Invalid Credentials'});
      return;
    }

    let isCorrectPassword = await bcrypt.compare(userData.password, user[0].password);
    console.log('isCorrectPassword:', isCorrectPassword);
    if (!isCorrectPassword) {
      next({status: '401', message: 'Invalid Credentials'});
      return;
    }
  }

  next();
};

module.exports = authenticate;