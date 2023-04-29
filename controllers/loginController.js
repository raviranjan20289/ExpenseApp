const User = require('../models/userModel')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')


function generateToken(id, name){
    return jwt.sign({userId:id,userName:name},'seekretKey')
}

exports.postLoginUser =async (req,res,next) => {
    try{
        const email = req.body.email;
        const password = req.body.password;
    
        const data = await User.findAll({where:{email:email}})
        console.log(data)
        if(data.length>0){
                
            bcrypt.compare(password, data[0].password,(err,resp)=>{
                
                if(err){
                    throw new Error('ERR_PASS_AUTH Something went wrong');
                }
                if(resp===true){
                    
                    res.status(201).json({success:resp,message:'User login successful', token:generateToken(data[0].id,data[0].name)})
                    
        
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