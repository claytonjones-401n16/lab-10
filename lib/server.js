'use strict';

// esoteric resources
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const mongoose = require('mongoose');


// internal resources
const authRouter = require('./routes/auth-routes.js');
const notFound = require('./middleware/404.js');

// application middleware
const app = express();

app.use(morgan('dev'));
app.use(cors());
app.use(express.json());


// routes
app.get('/', (req, res, next) => {
  res.send('Homepage');
});



app.use('', authRouter);

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