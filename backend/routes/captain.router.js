const express =require('express');
const router=express.Router();
const {registerCaptain,loginCaptain,getCaptainProfile,logoutCaptain} =require('../controller/captain.controller')
const {authCaptain}=require('../middleware/authuser.middleware')
const {body}=require('express-validator')


router.post('/register',[
    body('email').isEmail().withMessage('Invalid email'),
    body('password').isLength({min:6}).withMessage('Password length must be atleast 2 character long'),
    body('fullname.firstname').isLength({min:2}).withMessage('firstname must be atleast 2 character long'),
    body('vehical.color').isLength({min:3}).withMessage('Color must be atleast 2 character long'),
    body('vehical.plate').isLength({min:3}).withMessage('Vehical number must be atleast 3 character long'),
    body('vehical.capacity').isInt({min:1}).withMessage('Capacity must be atleast 1'),
    body('vehical.vehicalType').isIn(['car','bike','auto']).withMessage('Invalid vehical type'),
],
    registerCaptain
    );
    
router.post('/login',
    [ body('email').isEmail().withMessage('Invalid email'),
    body('password').isLength({min:6}).withMessage('Password length must be atleast 2 character long'),
    ],
    loginCaptain
);

router.get('/profile',authCaptain,getCaptainProfile)

router.get('/logout',authCaptain,logoutCaptain)



module.exports=router