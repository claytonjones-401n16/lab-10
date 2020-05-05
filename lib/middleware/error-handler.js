'use strict';

/**
 * This function is middleware that gets called on any errors
 *
 * @param {object} err - An object containing error details
 * @param {object} req - the request object
 * @param {object} res - the response object
 * @param {function} next - callback function
 * @return {string} A good string
 *
 */

const errorHandler = (err, req, res, next) => {
  res.status(err.status);
  res.send({status: err.status, message: err.message});
};

module.exports = errorHandler;
