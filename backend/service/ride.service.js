const rideModel =require('../model/ride.model');
const {getDistanceTime}=require('../service/map.service')
const crypto =require('crypto');
const { sendMessageToSocketId } = require('../socket');

function getOtp(num){
    function generateOtp(num){
        const otp=crypto.randomInt(Math.pow(10,num-1),Math.pow(10,num)).toString();
        return otp;
    }
    return generateOtp(num);
}

async function getFare(pickup,destination){

    if(!pickup || !destination){
        throw new Error('Pick and Desitnation required');
    }

    // const distanceTime=await getDistanceTime(pickup,destination);

    const distanceTime={
        distance:{
            value:10000
        },
        duration:{
            value:1464
        }
    }

    const baseFare={
        auto:30,
        bike:20,
        car:50
    }
    const perKmRate={
        auto:10,
        bike:8,
        car:15
    }
    const perMinuteRate={
        auto:2,
        bike:1.5,
        car:3
    }

    const fare={
        auto:baseFare.auto +Math.round(((distanceTime.distance.value)/1000 * perKmRate.auto) +  ((distanceTime.duration.value)/60 * perMinuteRate.auto)),
        car:baseFare.car +Math.round(((distanceTime.distance.value)/1000  * perKmRate.car) +  ((distanceTime.duration.value)/60 * perMinuteRate.car)),
        bike:baseFare.bike +Math.round(((distanceTime.distance.value)/1000  * perKmRate.bike) +  ((distanceTime.duration.value)/60 * perMinuteRate.bike))
    }
    return fare;
}

module.exports.createRide=async ({user,pickup,destination,vehicalType})=>{

    if(!user || !pickup || !destination || !vehicalType ){
        throw new Error('All fields required')
    }

    const fare=await getFare(pickup,destination);
    const ride= await rideModel.create({
        user,
        pickup,
        destination,
        otp:getOtp(6),
        fare:fare[vehicalType]
    })
    return ride;
}

module.exports.confirmRide=async({rideId,captain})=>{
    if(!rideId){
        throw new Error('Ride id required')
    }

    await rideModel.findOneAndUpdate({
        _id:rideId
    },{
        status:'accepted',
        captain:captain._id
    })

    const ride= await rideModel.findOne({
        _id:rideId,
    }).populate('user').populate('captain').select('+otp');

    if(!ride){
        throw new Error('Ride not found');
    }
    ride.status='accepted'
    return ride.save();
}
module.exports.startRide=async({rideId,otp,captain})=>{
    if(!rideId || !otp){
        throw new Error('Ride id and otp required');
    }
    const ride=rideModel.findOne({_id:rideId}).populate('user').populate('captain').select('+otp');

    if(!ride){
        throw new Error('Ride not found');
    }
    if(ride.status!=='accepted'){
        throw new Error('Ride not accepted');
    }
    if(ride.otp!==otp){
        throw new Error('invalid otp');
    }
    await rideModel.findOneAndUpdate({
        _id:rideId
    },{
        status:'ongoing'
    })

    sendMessageToSocketId(ride.user.socketId,{
        event:'ride-started',
        data:ride
    })

    return ride;

} 

module.exports.endRide=async({rideId,captain})=>    {
        if(!rideId){
        throw new Error('Ride id and otp required');
        }
        const ride=await rideModel.findOne({
            _id:rideId,
            captain:captain._id
        }).populate('user').populate('captain').select('+otp');

        if(!ride){
            throw new Error('ride not found');
        }

        if(ride.status!=='ongoing'){
            throw new Error('ride not ongoing')
        }

        await rideModel.findOneAndUpdate({
            _id:rideId
        },{
            status:'completed'
        })
        return ride;
}