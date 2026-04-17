const axios = require("axios");
module.exports.getAddressCordinate = async (address) => {
  const apikey = process.env.GOOGLE_MAPS_API;
  
  const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${apikey}`;

  try {
    const response = await axios.get(url);

    if (response.data.status === "OK") {
      const location = response.data.results[0].geometry.location;
      return {
        ltd: location.lat,
        lng: location.lng,
      };
    } else {
      throw new Error("Unable to fetch location");
    }
  } catch (err) {
    console.log(err);
    throw err;
  }
};
module.exports.getDistanceTime = async (origin, destination) => {
  if (!origin || !destination) {
    throw new Error("Origin and Destination both required");
  }

  const apikey = process.env.GOOGLE_MAPS_API;
  console.log(apikey);

  const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${apikey}`;

  try {
    const response = await axios.get(url);

    if (response.data.status === "OK") {
      if (response.data.rows[0].elements[0].status === "ZERO_RESULTS") {
        throw new Error("No routes found");
      }

      return response.data.rows[0].elements[0];
    } else {
      throw new Error("Unable to fetch coordinates");
    }
  } catch (err) {
    console.log(err);
    throw err;
  }
};

module.exports.getAutoCompleteSuggestions = async (input) => {
  if (!input) {
    throw new Error("Query required");
  }
   const apikey=process.env.GOOGLE_MAPS_API
    console.log(apikey);

    const url=`https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${apikey}`

    try{

        const response=await axios.get(url);

        if(response.data.status==='OK'){
           return response.data.predictions;
        }else{
            throw new Error('Unable to fetch suggestion');
        }
    }catch(err){
            console.log(err);
            throw err;
    }
};


module.exports.getCaptainsInTheRadius = async (ltd, lng, radius) => {

    // radius in km

    const captains = await captainModel.find({
        location: {
            $geoWithin: {
                $centerSphere: [ [ ltd, lng ], radius / 6371 ]
            }
        }
    });

    return captains;


}
