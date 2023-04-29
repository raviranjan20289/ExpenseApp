const User = require('../models/userModel')

exports.postAddUser =async (req,res) => {
    try{
        const name = req.body.name;
        const email = req.body.email;
        const password = req.body.password;
    
        const data = await User.create({
            name : name,
            email: email,
            password: password
        })
        res.json({userData: data});
    }catch(err){
        res.json(err)
        console.log(err)
    }
    
}