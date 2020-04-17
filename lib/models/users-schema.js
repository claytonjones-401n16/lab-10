'use strict';

const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const schema = mongoose.Schema({
  username: { type: 'String', required: true, unique: true },
  password: { type: 'String', required: true },
  email: { type: 'String' },
  role: {type: 'String', required: true, default: 'user', enum: ['admin', 'editor', 'user']}
});

schema.pre('save', async function() {
  this.password = await bcrypt.hash(this.password, 10);
});

const model = mongoose.model('users', schema);

module.exports = model;