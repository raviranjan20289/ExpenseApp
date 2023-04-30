const express = require('express');

const userAuth= require('../middleware/auth')

const router = express.Router();

const forgotPassController = require('../controllers/forgotPassController');

router.post('/forgotpassword',forgotPassController.forgotPassword);

router.get('/resetpassword/:id',forgotPassController.resetPassword)



router.get('/updatepassword/:forgotId',forgotPassController.updatePassword)



module.exports = router ;