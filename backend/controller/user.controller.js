const {validationResult}=require('express-validator')
const {createUser} =require('../service/user.service')
const userModel =require('../model/user.model')
const blackListTokenModel =require('../model/blacklistToken.model')
const registerUser=async (req,res)=>{ 

    const errors=validationResult(req);

    if(!errors.isEmpty()){
      return res.status(400).json({error:errors.array()});
    }

    const {fullname,email,password}=req.body;


    const isUserExist=await userModel.findOne({email});

    if(isUserExist){
      return res.status(400).json({message:'user already exist'})
    }
    
    const hashPassword=await userModel.hashPassword(password);

    const user=await createUser({fullname,email,hashPassword});
    
    console.log(user)
    
    const token=user.generateAuthToken();

    res.status(201).json({token,user})
}

const loginUser = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ error: errors.array() });
    }

    const { email, password } = req.body;

    const user = await userModel.findOne({ email }).select('+password');

    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }
    const isMatch = await user.comparePassword(password);

    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const token = user.generateAuthToken();
    res.cookie('token',token);
    res.status(200).json({ token, user });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getProfile=async(req,res,next)=>{
  res.status(200).json({user:req.user})
}
const logoutUser=async(req,res,next)=>{
    res.clearCookie('token');

    const token=req.cookies.token || req.headers.authorization?.split(' ')[1];

   await blackListTokenModel.create({token});

    res.status(200).json({message:'logout successfully'});

}

module.exports={
    registerUser,
    loginUser,
    getProfile,
    logoutUser
}