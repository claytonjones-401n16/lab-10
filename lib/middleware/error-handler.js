'use strict';

const errorHandler = (err, req, res, next) => {
  res.status(err.status);
  res.send({status: err.status, message: err.message});
};

module.exports = errorHandler;
