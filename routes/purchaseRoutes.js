const express = require('express');

const userAuth = require('../middleware/auth')

const router = express.Router();

const purchaseController = require('../controllers/purchaseController');

router.get('/premium',userAuth.authenticate,purchaseController.purchasePremium)

router.post('/update-transaction',userAuth.authenticate, purchaseController.updateTransaction)



module.exports = router ;