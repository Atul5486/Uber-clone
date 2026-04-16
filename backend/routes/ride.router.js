const express=require('express')
const router=express.Router();
const {body,query} =require('express-validator')
const {createRideController,getFare,confirmRide,startRide,endRide}=require('../controller/ride.controller');
const {authUser,authCaptain} =require('../middleware/authuser.middleware')

router.post('/create',
    authUser,
    body('pickup').isString().isLength({min:3}).withMessage('Invalid pickup address'),
    body('destination').isString().isLength({min:3}).withMessage('Invalid destination address'),
    body('vehicalType').isString().isIn(['auto','car','bike']).withMessage('Invalid vehical type'),
    createRideController
)

router.get('/get-fair',
    authUser,
    query('pickup').isString().isLength({min:3}).withMessage('Invalid pickup location'),
    query('destination').isString().isLength({min:3}).withMessage('Invalid destination location'),
    getFare
)

router.post('/confirm',
    authCaptain,
    body('rideId').isMongoId().withMessage('Invalid Ride id'),
    confirmRide
)
router.get('/start-ride',
    authCaptain,
    query('rideId').isMongoId().withMessage("Invalid ride id"),
    query('otp').isString().isLength({min:6,max:6}).withMessage('Invalid otp'),
    startRide
)

router.post('/end-ride',
    authCaptain,
    body('rideId').isMongoId().withMessage('Invalid ride id'),
    endRide
)

module.exports=router;