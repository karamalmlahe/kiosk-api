const jwt = require("jsonwebtoken");
const user = require("./../models/user");

module.exports =(req,res,next)=>{
    const bearerHeaders =req.headers['authorization'];

    if(bearerHeaders){

        const bearer=bearerHeaders.split(' ');
        const bearerToken = bearer[1];
        jwt.verify(bearerToken, 'YATb7pSC6vs7Hiqu69CULzt6KNBoxHsp',(err,authData)=>{
            if(err){
                return res.sendStatus(403);
            }
            else{
                user.findById(authData._id)
                .then(account=>{
                    req.token=bearerToken;
                    req.account=account;
                    next();
                })
                .catch(err=>{
                    return res.sendStatus(403);
                })
            }
        })

    }
    else{
        return res.sendStatus(403);
    }
}
