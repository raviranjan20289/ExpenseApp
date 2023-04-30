const express = require('express');

const userAuth= require('../middleware/auth');

const router = express.Router();

const expenseController = require('../controllers/expenseController');

router.get('/getExpenses',userAuth.authenticate,expenseController.getExpenses)

router.get('/download',userAuth.authenticate,expenseController.downloadExpense)

router.post('/addExpense',userAuth.authenticate, expenseController.postAddExpense)

router.delete('/deleteExpense/:id',expenseController.deleteExpense)

module.exports = router ;