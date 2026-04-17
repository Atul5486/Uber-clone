const express=require('express')
const router=express.Router();
const {authUser} =require('../middleware/authuser.middleware')
const {query} =require('express-validator')
const {getCoordinates,getDistanceTimeController,getAutoComplete}=require('../controller/map.controller')

router.get('/get-coordinates',
    authUser,
    query('address').isString().isLength({min:3}),
    getCoordinates
);

router.get('/get-distance-time',
    authUser,
    query('origin').isString().isLength({min:3}),
    query('destination').isString().isLength({min:3}),
    getDistanceTimeController
)
router.get('/get-suggestions',
    authUser,
    query('input').isString().isLength({min:3}),
    getAutoComplete
)

module.exports=router;