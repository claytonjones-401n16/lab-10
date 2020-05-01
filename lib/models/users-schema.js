'use strict';
require('dotenv').config();

const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const roles = require('../../docs/roles.json');

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
  return jwt.sign({_id: this._id}, process.env.SECRET);
}

schema.statics.verifyToken = function (token) {
  let tokenContents = jwt.verify(token, process.env.SECRET);
  return tokenContents;
};

schema.methods.hasCapability = function (capability) {
  for (let i = 0; i < roles.length; i++) {
      if (roles[i].role === this.role)
          return roles[i].capabilities.includes(capability);
  }

  return false;
};

const model = mongoose.model('users', schema);

module.exports = model;