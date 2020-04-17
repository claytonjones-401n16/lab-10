'use strict';

const notFound = (req, res, next) => {
  res.status(404);
  res.statusMessage = 'Resource not found';
  res.send(res.statusMessage);
};

module.exports = notFound;
