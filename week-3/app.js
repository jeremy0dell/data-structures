"use strict"

// dependencies
const fs = require('fs'),
      querystring = require('querystring'),
      got = require('got'),
      async = require('async'),
      dotenv = require('dotenv');

// TAMU api key
dotenv.config();
const API_KEY = process.env.TAMU_KEY;
const API_URL = 'https://geoservices.tamu.edu/Services/Geocode/WebService/GeocoderWebServiceHttpNonParsed_V04_01.aspx'

// geocode addresses
let meetingsData = [];
let addresses = [
  '109 West 129th Street',
  '240 West 145th Street',
  '469 West 142nd Street',
  '204 West 134th Street',
  '2044 Adam Clayton Powell Blvd.',
  '469 West 142nd Street',
  '521 W 126th St',
  '109 West 129th Street',
  '469 West 142nd Street',
  '2044 Seventh Avenue',
  '127 West 127th Street',
  '310 West 139th Street',
  '409 West 141st Street',
  '91 Claremont Avenue',
  '1727 Amsterdam Avenue',
  '469 West 142nd Street',
  '91 Claremont Avenue',
  '219 West 132nd Street',
  '211 West 129th Street',
  '425 West 144th Street',
  '204 West 134th Street',
  '506 Lenox Avenue',
  '1727 Amsterdam Avenue',
  '1854 Amsterdam Avenue',
  '469 West 142nd Street',
  '58-66 West 135th Street',
]

// eachSeries in the async module iterates over an array and operates on each item in the array in series
async.eachSeries(addresses, function(value, callback) {
    let query = {
        streetAddress: value,
        city: "New York",
        state: "NY",
        apikey: API_KEY,
        format: "json",
        version: "4.01"
    };

    // construct a querystring from the `query` object's values and append it to the api URL
    let apiRequest = API_URL + '?' + querystring.stringify(query);

    (async () => {
    	try {
    	  const response = await got(apiRequest);
        var resBody = JSON.parse(response.body)

        let obj = {
          address: value + ', New York, NY',
          latLong: {
            lat: resBody.OutputGeocodes[0].OutputGeocode.Latitude,
            long: resBody.OutputGeocodes[0].OutputGeocode.Longitude
          }
        }
        
    	  meetingsData.push(obj);
    	} catch (error) {
    	  console.log(error.response.body);
    	}
    })();

    // sleep for a couple seconds before making the next request
    setTimeout(callback, 2000);
}, function() {
    console.log('*** *** *** *** ***');
    console.log(`Number of meetings in this zone: ${meetingsData.length}`);
    fs.writeFileSync('./geocoded-addresses.txt', JSON.stringify(meetingsData))
});
