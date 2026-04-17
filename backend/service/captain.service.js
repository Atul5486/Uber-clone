const captainModel =require('../model/captain.model')
module.exports.createCaptain=async({
    firstname,lastname,email,password,
    color,plate,vehicalType,capacity
})=>{
    if(!firstname || !email || !password || !color|| !plate || !vehicalType ||!capacity){
     return  res.status(400).json({message:'All field required'});
    }

    const captain=await captainModel.create({
        fullname:{
            firstname,
            lastname
        },
        email,
        password,
        vehical:{
            color,
            plate,
            vehicalType,
            capacity
        }
    })
    return captain;
}