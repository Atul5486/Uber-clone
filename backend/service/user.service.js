const userModel =require("../model/user.model")

const createUser=async({email,fullname,hashPassword})=>{

    const {firstname,lastname}=fullname;


    if(!firstname || !hashPassword || !email){
        // throw new Error("All Field required");
        return res.status(400).json({error:"All field required"})
    }

    const user=await userModel.create({
        fullname:{
            firstname,lastname
        },
        email,
        password:hashPassword, 
        })
    return user;    
}

module.exports={
    createUser
}