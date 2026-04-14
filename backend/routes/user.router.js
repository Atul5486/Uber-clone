const express=require('express')
const router=express.Router();
const {body} =require('express-validator')
const {registerUser,loginUser,getProfile,logoutUser} =require('../controller/user.controller')
const {authUser} =require('../middleware/authuser.middleware')

router.post('/register',[
    body('email').isEmail().withMessage('email must be valid'),
    body('fullname.firstname').isLength({min:2}).withMessage('First name must be 2 character long'),
    body('password').isLength({min:6}).withMessage('Password must be 6 character long'),
    ]
    ,registerUser)

router.post('/login',[
    body('email').isEmail().withMessage("Email is invalid"),
    body('password').isLength({min:6}).withMessage("password must be 6 character long")
],
loginUser
)

router.get('/profile',authUser,getProfile);

router.get('/logout',authUser,logoutUser);
module.exports=router;