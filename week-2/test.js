var fs = require('fs');

const _ = require("lodash");  

const data = require('./all-data.json')
const geo = require('./full-geocodes.json')

var newFull = []

for (var i = 0; i < data.length; i++) {
    newFull.push(
        {...data[i], address: geo[i].address, lat: geo[i].latLong.lat, long: geo[i].latLong.long}
    )
}

console.log(newFull[0].time)

var newTimes = []

for (var i = 0; i < newFull.length; i++) {
    newFull[i].time.forEach(t => {
        newTimes.push({
            ...{...t, interest: (t.interest ? t.interest : 'none')},
            ..._.omit(newFull[i], ['time'])
        })
    })
}

console.log(newTimes)

fs.writeFileSync(`./full-times.json`, JSON.stringify(newTimes))