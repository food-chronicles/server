const axios = require("axios");

const getLocation = (place) => {
  let GEO_API = process.env.GEO_API;
  return axios({
    method: "get",
    url: `http://api.positionstack.com/v1/reverse?access_key=${GEO_API}&query=${place.latitude},${place.longitude}`,
  })
    .then((res) => {
      const location = {
        latitude: res.data.data[0].latitude,
        longitude: res.data.data[0].longitude,
        city: res.data.data[0].county,
        region: res.data.data[0].region,
        country: res.data.data[0].country,
      };
      return location;
    })
    .catch((err) => {
      return err;
    });
};

module.exports = getLocation;
