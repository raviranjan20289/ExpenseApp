const User = require('../models/userModel')
const Expense = require('../models/expenseModel')
const sequelize = require('../utility/database')
const History = require('../models/reportModel')
const UserService = require('../services/userServices')
const S3Service = require('../services/S3Services')


exports.getExpenses = async (req,res) => {
    try{
        const page= +req.query.page || 1;
        const itemsPerPage=Number(req.query.items) ;
       
        console.log("OOOOOOO",itemsPerPage)
        
        const download = await UserService.getDownloadHistory(req)
        const expense= await req.user.getExpenses()
        const user= await req.user
        let expenseCount = await Expense.count({where:{userId:user.id}})
        console.log(expenseCount)
        const expenseToBeDisplayed =await Expense.findAll({
            offset: (page-1)*itemsPerPage,
            limit:itemsPerPage
        },{where:{userId:user.id}})
        
        return res.status(200).json({expenseData: expenseToBeDisplayed,
            premium:user.premiumUser,
            downloaded:download,
            currentPage:page,
            hasNextPage: expenseCount> (page*itemsPerPage),
            nextPage:page+1,
            hasPrevPage:page>1,
            prevPage:page-1,
            itemsPerPage:itemsPerPage,
            lastPage:Math.ceil(expenseCount/itemsPerPage)   
        })
    }catch(err){
        res.status(500).json({success:false,message:"ERR get_Expenses :no user found"})
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
        const user = await User.findOne({where:{id:resp.userId},transaction: t})
        console.log(user)
        const expenseSum = Number(user.totalExpense)-Number(resp.expense)
        await User.update({totalExpense: expenseSum},{where:{id:resp.userId},transaction: t})
        await t.commit()
        res.json({response:response})
    }catch(err){
        await t.rollback();
        res.status(500).json({success:false,Error:err})
        console.log(err)
    }
}



exports.downloadExpense = async (req,res) =>{
    try{
        const expense = await UserService.getExpenses(req);
        
        const userId = req.user.id
        const stringifiedExpense = JSON.stringify(expense)
        const filename =`Expense${userId}-${new Date()}.txt`
        const fileURL = await S3Service.uploadToS3(stringifiedExpense,filename) 
        await UserService.createDownloadHistory(req,fileURL)
        const download = await UserService.getDownloadHistory(req)
        

        res.status(200).json({success:true,fileURL:fileURL,downloaded:download})
    }catch(err){
        console.log("ERR Download_Expense",err)
        res.status(500).json({success:false,Error:err})
        throw new Error(JSON.stringify(err))

    }
}