const User = require('../models/userModel')
const Expense = require('../models/expenseModel')
const sequelize = require('../utility/database')



exports.getExpenses = async (req,res) => {
    try{
    
        const expense= await req.user.getExpenses()
        const user= await req.user
        
        return res.status(200).json({expenseData: expense,premium:user.premiumUser})
    }catch(err){
        
        console.log(err)
    }
}


exports.postAddExpense = async (req,res) => {
    const t = await sequelize.transaction();
    try{
        const item = req.body.item;
        const expense = req.body.expense;
        const category = req.body.category;
        const description = req.body.description;

        if(item==''|| expense=='' || category=='' || description==''){
            res.json({message:'Please Enter All Fields'})
        }
        else{
            const data = await req.user.createExpense({
                item: item,
                expense: expense,
                category: category,
                description: description,    
            },{transaction: t});

            if(!req.user.totalExpense){
                req.user.totalExpense = 0;
            }

            let expenseSum = Number(req.user.totalExpense) + Number(expense);
            await User.update({totalExpense: expenseSum},{where:{id:req.user.id},transaction: t});
            await t.commit();
            res.status(200).json({expenseData: data});
        }
    } catch(err) {
        console.log(err);
        await t.rollback();
        return res.status(500).json({success: false, error: err});
    }
}

exports.deleteExpense = async (req,res) =>{
    const t = await sequelize.transaction();
    try{
 
        const expId = req.params.id
        const resp = await Expense.findOne({
            where:{id:expId},
            transaction: t
        })
        
        const response = await Expense.destroy({where:{id:expId},transaction: t})
        const user = await User.findOne({where:{id:resp[0].userId},transaction: t})
        console.log(user)
        const expenseSum = Number(user[0].totalExpense)-Number(resp[0].expense)
        await User.update({totalExpense: expenseSum},{where:{id:resp[0].userId},transaction: t})
        await t.commit()
        res.json({response:response})
    }catch(err){
        await t.rollback();
        res.status(500).json({success:false,Error:err})
        console.log(err)
    }
}