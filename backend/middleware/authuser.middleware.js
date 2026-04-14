const userModel=require('../model/user.model')
const jwt=require('jsonwebtoken')
const bcrypt=require('bcrypt');
const blacklistTokenModel = require('../model/blacklistToken.model');
const captainModel = require('../model/captain.model');

module.exports.authUser=async(req,res,next)=>{
    const token=req.cookies.token || req.headers.authorization?.split(' ')[1];
    if(!token){
        return res.status(401).json({message:"unauthorized user"});
    }

    const blacklistToken=await blacklistTokenModel.findOne({token:token});

    if(blacklistToken){
     return res.status(401).json({message:"unauthorized access"});
    }

    try{
        const decode=jwt.verify(token,process.env.JWT_SECRET);

        const user=await userModel.findById(decode._id)
        req.user=user;
        
        return next();
    }catch(err){
        res.status(401).json({message:'unauthorize user'});
    }
}
module.exports.authCaptain=async(req,res,next)=>{
    const token=req.cookies.token || req.headers.authorization?.split(' ')[1];
    if(!token){
        return res.status(401).json({message:"unauthorized captain"});
    }

    const blacklistToken=await blacklistTokenModel.findOne({token:token});

    if(blacklistToken){
     return res.status(401).json({message:"unauthorized access"});
    }

    try{
        const decode=jwt.verify(token,process.env.JWT_SECRET);

        const captain=await captainModel.findById(decode._id)
        req.captain=captain;
        
        return next();
    }catch(err){
        res.status(401).json({message:'unauthorize captain'});
    }
}