'use strict';

const bcrypt = require('bcrypt');

const Model = require('../models/model.js');
const userSchema = require('../models/users-schema.js');

const UserModel = new Model(userSchema);

/**
 * Returns an object with username and password decoded from base64
 *
 * @function base64Decoder
 * @param {string} endcodedString - The base64 encoded username:password string
 * @return {object} Object containing decoded username and password
 *
 * @example
 *
 *     base64Decoder(Y6hRiht57Y=);
 */

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

/**
 * Signin route middleware that creates and sets request object variable to boolean based on matching user credentials
 *
 * @function authenticate
 * @param {object, object, function} - request, response, and next
 *
 * @example
 *
 *     authenticate();
 */

const authenticate = async (req, res, next) => {
  const authData = req.headers.authorization.split(' ');

  if (authData.length === 2) {
    if (authData[0] === 'Basic') {
    
      let userData = base64Decoder(authData[1]);
      let user = await UserModel.readByQuery({
        username: userData.username
      });

      console.log('USER:', user);

      if (user.length === 0) {
        req.hasValidCredentials = false;
        next();
        return;
      }

      let isCorrectPassword = await bcrypt.compare(userData.password, user[0].password);
      if (!isCorrectPassword) {
        req.hasValidCredentials = false;
        req.user = user[0];
        next();
        return;
      }

      req.hasValidCredentials = true;
      req.user = user[0];
  
      next();
    }

    if (authData[0] === 'Bearer') {
      let tokenData = UserModel.verifyToken(authData[1]);
      req.user = await UserModel.read(tokenData._id);
      next();
    }
  }
};

module.exports = authenticate;