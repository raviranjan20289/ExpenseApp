const Sib = require('sib-api-v3-sdk');
const { v4: uuidv4 } = require('uuid');
const sequelize = require('../utility/database')
const bcrypt = require('bcrypt')
const User = require('../models/userModel')

const Forgot =  require('../models/forgotPassModel')
require('dotenv').config()



exports.forgotPassword = async(req,res) => {
    const t = await sequelize.transaction();
    try{
        const user = await User.findOne({where:{email:req.body.email},transaction: t})
        console.log('>>>>>>>>>>>>>',user)
        if(user){
            const id = uuidv4() 
            const createForgot = await Forgot.create({
                id:id,
                isActive:true,
                userId: user.id
            },{transaction:t})
            
            const client = Sib.ApiClient.instance
    
            const apiKey = client.authentications['api-key']
            apiKey.apiKey = process.env.FORGOT_PASS_API_KEY;
            const tranEmailApi =  new Sib.TransactionalEmailsApi()
    
            const sender = {
                email: 'diler20289@gmail.com'
            }
    
            const receivers = [
                {
                    email: req.body.email
                },
            ]
            
            
            const data = await tranEmailApi.sendTransacEmail({
                sender,
                to: receivers,
                subject:'Forgot Password',
                htmlContent:`<a href="http://localhost:3000/password/resetpassword/${id}">Reset Password</a>`
            })
            t.commit()
            res.status(200).json({data:data})
        }
        else{
            res.status(402).json({message:'No user found'})
        }

    }catch(err){
        console.log('ERROR IN FORGOT PASS',err);
        t.rollback();
        res.status(500).json({success: false,error:err})
        throw new Error(JSON.stringify(err))
    }
}

exports.resetPassword = async(req,res) => {
    try{
        const forgotId = req.params.id
    
        const forgotPass =  await Forgot.findOne({where: {id: forgotId}})

        // console.log(forgotPass)

        if(forgotPass.isActive){
            forgotPass.update({isActive:false})
           
           
            res.send(`
            <html>
            
            <body>
            <section class="container">
            <form   id="forgotForm"  action="http://localhost:3000/password/updatepassword/${forgotId}" name="forgotForm">
                <h5 style="color: #ccc;">Forgot Password</h5>
                
                
               
                    <label for="password">Enter New Password</label>
                    <input type="password"id="password" name="password" required>
               
                    
                
                    
               
               
                    <button type="submit" class="btn">Send</button>
                    <script src="https://cdnjs.cloudflare.com/ajax/libs/axios/0.19.0/axios.min.js"></script>          
          <script>
            document.getElementById('forgotForm').addEventListener('submit',formSubmit)
            const pass= document.getElementById("password")
            
            funtion formSubmit(e){
                e.preventDefault()
                
            }
          </script>          
                    
    </body></html>`)
            res.end()
        }
        else{
            res.send('<body>Reset Link Expired</body>')
            res.end()
        }

    }catch(err){
        res.status(500).json({success:false, error:err})
        console.log('ERROR>>>>>>>>>',err)
        throw new Error(JSON.stringify(err))
    }

}
 exports.updatePassword = async (req,res) =>{
    try{
        const password = req.query.password;
        console.log(req.query)
        const forgotId = req.params.forgotId
        const user = await Forgot.findOne({where: {id: forgotId}}) 
        const userId = user.userId
        console.log('....<<this>>......',req.query)
        
        bcrypt.hash(password, 10, async(err,hash) =>{
            
            const data = await User.update({
                password: hash
            },{where:{id: userId}})
            console.log(err)
        })
        if(data){
            res.send('<body>Password Reset Successful</body>')
            res.end()
        }
        
    }catch(err){
        console.log(err)
        res.status(500).json({messgae:err})
    }
 }