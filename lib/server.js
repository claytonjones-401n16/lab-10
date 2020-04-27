'use strict';

// esoteric resources
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const mongoose = require('mongoose');


// internal resources
const authRouter = require('./routes/auth-routes.js');
const notFound = require('./middleware/404.js');
const Model = require('./models/model.js');
const userSchema = require('./models/users-schema.js');
const UserModel = new Model(userSchema);
const generateSwagger = require('../docs/swagger.js');



// application middleware
const app = express();
generateSwagger(app);

app.use(morgan('dev'));
app.use(cors());
app.use(express.json());


// routes

/**
 * This route gives you a standard "Homepage" message
 * @route GET /
 * @group homepage
 * @returns {object} 200 - The string Homepage
 */

app.get('/', (req, res, next) => {
  res.send('Homepage');
});

/**
 * This route gives you an array of all current users
 * @route GET /users
 * @group users
 * @returns {array} 200 - Array of users
 */

app.get('/users', async (req, res, next) => {
  let allUsers = await UserModel.read();
  res.send(allUsers);
});



app.use(authRouter);

app.use('*', notFound);

// error handling

// exports
module.exports = {
  server: app,
  start: (port, mongodb_uri) => {
    app.listen(port, () => { console.log(`Server up and running on port ${port}.`) });

    // needed to connect to MongoDB
    let options = {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
  };

  mongoose.connect(mongodb_uri, options);

  }
}