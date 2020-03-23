const express = require('express');
const router = express.Router();

const checkAuth = require('../auth/check-auth');
const usersController = require('../controllers/users-controller');

// Register
// www.*/users/signup
router.post('/signup', usersController.sign_in);

// Login user
router.post('/login', usersController.login);

// Delete user by id
router.delete('/:userId', checkAuth, usersController.delete_user);


module.exports = router;
