const axios = require("axios");

const getLocation = (place) => {
  return axios({
    method: "get",
    url: `http://api.positionstack.com/v1/reverse?access_key=a7d78e98c50102c451de640844e26f3a&query=${place.latitude},${place.longitude}`,
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
