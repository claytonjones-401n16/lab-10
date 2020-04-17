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

    if (user.length === 0) {
      req.hasValidCredentials = false;
      next();
      return;
    }

    let isCorrectPassword = await bcrypt.compare(userData.password, user[0].password);
    if (!isCorrectPassword) {
      req.hasValidCredentials = false;
      next();
      return;
    }
  }

  req.hasValidCredentials = true;

  next();
};

module.exports = authenticate;