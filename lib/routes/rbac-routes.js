'use strict';

const express = require('express');

const router = express.Router();

const Model = require('../models/model.js');
const userSchema = require('../models/users-schema.js');

const UserModel = new Model(userSchema);

// route middleware
const authenticate = require('../middleware/auth.js');

/**
 * Public page everyone can see
 * @route GET /public
 * @group public
 * @returns {string} 200 - Public page everyone can see
 */

router.get('/public', (req, res, next) => {
  res.send('Public page everyone can see');
});

/**
 * Private page for logged in users
 * @route GET /private
 * @group private
 * @returns {string} 200 - Logging in, can view content
 */
router.get('/private', authenticate, (req, res, next) => {
  if (req.user && req.user._id) {
    res.send('Logged in, can view content.');
  } else {
    next({status: 403, message: 'Unauthorized'});
  }
});

/**
 * Only available to users with read capabilities
 * @route GET /readonly
 * @group readonly
 * @returns {string} 200 - You have read access
 */
router.get('/readonly', authenticate, (req, res, next) => {
  if (req.user && req.user._id) {
    if (req.user.hasCapability('read')) {
      res.send('You have read access');
      return;
    }
  }
  next({status: 403, message: 'No access'});
});

/**
 * Only available to users with create capabilities
 * @route POST /create
 * @group create
 * @returns {string} 200 - You have create access
 */
router.post('/create', authenticate, (req, res, next) => {
  if (req.user && req.user._id) {
    if (req.user.hasCapability('create')) {
      res.send('You have create access');
      return;
    }
  }
  next({status: 403, message: 'No access'});
});

/**
 * Only available to users with update capabilities
 * @route PUT /update
 * @group update
 * @returns {string} 200 - You have update access
 */
router.put('/update', authenticate, (req, res, next) => {
  if (req.user && req.user._id) {
    if (req.user.hasCapability('update')) {
      res.send('You have update access');
      return;
    }
  }
  next({status: 403, message: 'No access'});
});

/**
 * Only available to users with delete capabilities
 * @route DELETE /delete
 * @group delete
 * @returns {string} 200 - You have delete access
 */
router.delete('/delete', authenticate, (req, res, next) => {
  if (req.user && req.user._id) {
    if (req.user.hasCapability('delete')) {
      res.send('You have delete access');
      return;
    }
  }
  next({status: 403, message: 'No access'});
});




module.exports = router;