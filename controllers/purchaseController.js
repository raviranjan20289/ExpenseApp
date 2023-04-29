const Razorpay = require('razorpay');


const Order = require('../models/orderModel');
const User = require('../models/userModel');

exports.purchasePremium = async (req,res) => {
    try{
        const rzp= new Razorpay({
            key_id: process.env.RAZORPAY_KEYID,
            key_secret: process.env.RAZORPAY_SECRET_KEY
        })
        
        
        const amount = 5000
        rzp.orders.create({amount, currency:'INR'},(err,order) =>{
            
                if(err){
                    throw new Error(JSON.stringify(err))
                }
               req.user.createOrder({orderId:order.id, status:'PENDING'}).then(()=>{
                   return res.status(201).json({order, key_id:rzp.key_id})
               }).catch(err => {
                    throw new Error(JSON.stringify(err))
               })
               

            
            
        })

    }catch(err){
        console.log('ERR__purchaseController_purchaePremium')
        res.status(403).json({message:'something went wrong PURCHASECONTROLLER_PURCHASEPREMIUM'})    
        console.log(err)
    }
}

exports.updateTransaction = async (req,res) => {
    try{
        console.log(req.body)
        const {orderId,payment_id} = req.body;
        const order = await Order.findOne({where:{orderId: orderId}})
        if(payment_id==null){
            const updateOrder= order.update({paymentId: payment_id,status:'FAILED'})
            const updateUser = req.user.update({premiumUser:false})
            Promise.all([updateOrder,updateUser]).then(()=>{
                return res.status(202).json({success:false, message:'Transaction Failed'})
            }).catch(err=>{
                throw new Error(JSON.stringify(err))} )
        }
        else{
            const updateOrder= order.update({paymentId: payment_id, status:'SUCCESSFUL'})
            const updateUser = req.user.update({premiumUser:true})
            Promise.all([updateOrder,updateUser]).then(()=>{
                return res.status(202).json({success:true, message:'Transaction Successful'})
            }).catch(err=>{
                throw new Error(JSON.stringify(err))} )
        }
    }catch(err){
        console.log('ERR__purchaseController_updateTransaction')
        throw new Error(err)
    }
}