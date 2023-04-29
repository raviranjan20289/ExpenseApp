const User = require('../models/userModel')

const bcrypt = require('bcrypt')

exports.postLoginUser =async (req,res,next) => {
    try{
        const email = req.body.email;
        const password = req.body.password;
    
        const data = await User.findAll({where:{email:email}})
        console.log(data)
        if(data.length>0){
                
            bcrypt.compare(password, data[0].password,(err,resp)=>{
                console.log(err)
                console.log(resp)
                if(err){
                    throw new Error('ERR_PASS_AUTH Something went wrong');
                }
                if(resp===true){
                    console.log(resp)
                    res.status(201).json({success:resp,message:'User login successful'})
                    
        
                }
                else{
                    res.status(401).json({success:false,message:'Incorrect Password'});
                }
            })
        }
        else{
            res.status(404).json({success:false,message:'User Not Found'})    
        }
    }        
    catch(err){
        res.status(500).json({success:false, error:err})
        console.log(err)
    }
    
}   

exports.getExpensePage = (req,res) =>{
    
}