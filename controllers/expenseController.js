const User = require('../models/userModel')
const Expense = require('../models/expenseModel')

exports.getExpenses = async (req,res) => {
    try{
        const data = await Expense.findAll()
        res.json({expenseData: data})
    }catch(err){
        
        console.log(err)
    }
}

exports.postAddExpense = async (req,res) => {
    try{
    console.log(req)
    const item =req.body.item;
    const expense = req.body.expense;
    const category = req.body.category;
    const description = req.body.description
    const data = await Expense.create({
        item: item,
        expense: expense,
        category: category,
        description: description
    })
    res.json({expenseData: data})
    }catch(err){
        console.log(err)
    }
    
}

exports.deleteExpense = async (req,res) =>{
    try{
        const expId = req.params.id
        const resp = await Expense.destroy({where:{id:expId}})
        res.json({response:resp})
    }catch(err){
        console.log(err)
    }
}