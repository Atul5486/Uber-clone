const  rideService= require("../service/ride.service");
const {getCaptainsInTheRadius,getAddressCordinate}=require('../service/map.service')
const { validationResult } = require("express-validator");
const {sendMessageToSocketId} =require('../socket')

module.exports.createRideController = async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({ error: errors.array() });
  }

  const { userId, pickup, destination, vehicalType } = req.body;

  try {
    const ride = await rideService.createRide({
      user: req.user._id,
      pickup,
      destination,
      vehicalType,
    });

    const pickupCoordinates=await getAddressCordinate(pickup)

    const captainInRaduis=await getCaptainsInTheRadius(pickupCoordinates.ltd,pickupCoordinates.lng,2);

    ride.otp=""

      const rideWithUser = await rideModel.findOne({ _id: ride._id }).populate('user');

    captainInRaduis.map(async captain=>{
      sendMessageToSocketId(captain.socketId,{
        event:'new-ride',
        data:rideWithUser
      })  
    })

    res.status(201).json(ride);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

module.exports.getFare=async (req,res)=>{
   const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({ error: errors.array() });
  }

  const {pickup,destination}=req.body;

  try{  

    const fare=await rideService.getFare(pickup,destination);
    res.status(200).json(fare)

  }catch(err){
      console.log(err)
      res.status(500).json({message:err.message});
  }

}

module.exports.confirmRide=async(req,res)=>{

    const errors=validationResult(req);

    if(!errors.isEmpty()){
     return res.status(400).json({error:errors.array()})
    }

    const {rideId}=req.body;

    try{  
      const ride=await rideService.confirmRide({rideId,captain:req.captain})

      sendMessageToSocketId(ride.user.socketId,{
        event:'ride-confirmed',
        data:ride
      })

      res.status(200).json(ride)
      }catch(err){
      res.status(500).json({message:err.message})
    }
}

module.exports.startRide=async(req,res)=>{

   const errors=validationResult(req);

    if(!errors.isEmpty()){
      return res.status(400).json({error:errors.array()})
    }

    const {rideId,otp}=req.body;

    try{  
      const ride=await rideService.startRide({rideId,otp,captain:req.captain})
      res.status(200).json(ride)
      }catch(err){
      res.status(500).json({message:err.message})
    }
}

module.exports.endRide=async(req,res)=>{
    const errors=validationResult(req);

    if(!errors.isEmpty()){
      return res.status(400).json({error:errors.array()});
    }

    const {rideId}=req.body;

    try{

      const ride=await rideService.endRide({rideId,captain:req.captain})

      sendMessageToSocketId(ride.user.socketId,{
        event:'ride-ended',
        data:ride
      })

    }catch(err){
      res.status(500).json({message:err.message})
    }
}