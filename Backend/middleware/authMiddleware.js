const jwt=require('jsonwebtoken')

module.exports=function(req,res,next){
    try{
        let token=req.headers['authorization'] || req.headers['x-auth-token']

        if(!token){
            return res.status(401).json({message:'No token'})
        }

        if(token.startsWith('Bearer')){
            token=token.slice(7, token.length).trim()
        }

        const decoded=jwt.verify(token, process.env.JWT_SECRET)

        req.userId=decoded.id
        next()
    }
    catch(err){
        return res.status(401).json({message:"Token not valid"})
    } 
}