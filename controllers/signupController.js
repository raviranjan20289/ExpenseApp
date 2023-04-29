const User = require('../models/userModel')

const bcrypt = require('bcrypt')

exports.postAddUser =async (req,res) => {
    try{
        const name = req.body.name;
        const email = req.body.email;
        const password = req.body.password;
        
        
        bcrypt.hash(password, 10, async(err,hash) =>{
            const data = await User.create({
                name : name,
                email: email,
                password: hash
            })
            res.json({userData: data});
            console.log(err)
        })
        }catch(err){
        res.status(500).json({error:err,message:'user exists'})
        console.log(err)
    }
    
}