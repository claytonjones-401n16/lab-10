'use strict';

require('dotenv').config();

const server = require('./lib/server.js');

server.start(process.env.PORT, process.env.MONGODB_URI);
