const User = require('../models/userModel')

exports.postLoginUser =async (req,res) => {
    try{
        const email = req.body.email;
        const password = req.body.password;
    
        const data = await User.findAll({where:{email:email}})
        console.log(data)
        if(data.length>0 && data[0].dataValues.email===email){
                
            if(data[0].dataValues.password===password){
                    res.status(201)
                    
            }
            else{
                res.status(401)
                
            }
        }
        else{
            res.status(404)
            
        }

        
        res.json({userData: data[0]});
    }catch(err){
        res.json(err)
        console.log(err)
    }
    
}