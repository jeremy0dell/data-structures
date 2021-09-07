const fs = require('fs')
const got = require('got')

// The URLs are numbered 1-10, so i is set to those numbers in a loop
for (let i = 1; i <= 10; i++) {
  // use got to grab html of these files
  // .padStart is used because single digit numbers start with a 0 on the left
  got(`https://parsons.nyc/aa/m${(i + '').padStart(2, '0')}.html`)
    .then(data => {
      // take the response of this call and write the data to a text file in the current directory
      fs.writeFileSync(`./data/aa-${i}.txt`, data.body)
    })
}
