'use strict';
require('dotenv').config();

const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const schema = mongoose.Schema({
  username: { type: 'String', required: true, unique: true },
  password: { type: 'String', required: true },
  email: { type: 'String' },
  role: {type: 'String', required: true, default: 'user', enum: ['admin', 'editor', 'user']}
});

schema.pre('save', async function() {
  this.password = await bcrypt.hash(this.password, 10);
});

schema.methods.generateToken = function() {
  console.log('Process SECRET:', process.env.SECRET);
  console.log('Process PORT:', process.env.PORT);
  return jwt.sign({_id: this._id}, process.env.SECRET);
}

schema.statics.verifyToken = function (token) {
  let tokenContents = jwt.verify(token, process.env.SECRET);
  return tokenContents;
};

const model = mongoose.model('users', schema);

module.exports = model;