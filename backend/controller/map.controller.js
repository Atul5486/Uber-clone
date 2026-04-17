const {validationResult} =require('express-validator');
const {getAddressCordinate,getDistanceTime,getAutoCompleteSuggestions} =require('../service/map.service');

module.exports.getCoordinates=async(req,res)=>{

    const error=validationResult(req);

    if(!error.isEmpty()){
        res.status(400).json({error:error.array()})
    }

    const {address}=req.query;
    try{
        const coordinates=await getAddressCordinate(address);
        res.status(200).json(coordinates);

    }catch(err){
        res.status(400).json({message:'coordinates not found'});
    }

}

module.exports.getDistanceTimeController=async(req,res)=>{

    try{

        const errors=validationResult(req);
        if(!errors.isEmpty()){
            res.status(400).json({error:errors.array()})
        }

        const {origin,destination}=req.query;

        const distanceTime=await getDistanceTime(origin,destination);

        res.status(200).json(distanceTime);

    }catch(err){
        console.log(err);
        res.status(500).json({message:'internal server error'});
    }
}

module.exports.getAutoComplete=async(req,res)=>{        

    const errors=validationResult(req);

    if(!errors.isEmpty()){
        res.status(400).json({error:errors.array()})
    }

    try{

        const {input}=req.query;

        const suggestions=await getAutoCompleteSuggestions(input);

        res.status(200).json(suggestions)

    }catch(err){
        console.log(err);
        res.status(500).json({message:'internal server error'});
    }

}