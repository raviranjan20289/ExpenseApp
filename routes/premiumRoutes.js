const express = require('express');

const userAuth= require('../middleware/auth')

const router = express.Router();

const premiumController = require('../controllers/premiumController');

router.get('/leaderboard',userAuth.authenticate,premiumController.getLeaderBoard)





module.exports = router ;