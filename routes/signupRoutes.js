const express = require('express');

const router = express.Router();

const signUpController = require('../controllers/signupController');

router.post('/signup',signUpController.postAddUser)

module.exports = router ;
