var fs = require('fs');
var cheerio = require('cheerio');

const checkForZipcode = str => (/\b\d{5}\b/g).test(str)

const num = 10

var everything = []

const parseFile = (fileName) => fs.readFile(fileName, 'utf8', function(err, data) {
  if (err) throw err;

  var $ = cheerio.load(data);

  var addressLines = Array.from($('body > center > table > tbody > tr > td > table > tbody > tr:nth-child(2) > td > div > table > tbody > tr > td:nth-child(1) br'))
    .filter(node => node.name && node.name == 'br' && node.next && node.next.type == 'text')
    .map(node => node.next.data.trim())
    .map(el => el.replace(/\t/g, ''))
    .map(el => el.replace(/\n/g, ''))
    .filter(string => string != '')
    .filter((el, i, arr) => checkForZipcode(el) || checkForZipcode(arr[i + 1]))
  

  var fullAddresses = []

  for (var i = 0; i < addressLines.length; i++) {
    // If current line has zipcode, it's a single line and will be pushed
    if (checkForZipcode(addressLines[i])) {
      fullAddresses.push(addressLines[i])
    } else {

    // If the current line doesn't have a zipcode, combine it with the next line, push it, and increment i so the next line is skipped
    // The rationale is that the next line (i + 1) is already accounted for here. With my data shape, I can assume i + 1 will contain a zipcode
      fullAddresses.push(addressLines[i] + addressLines[i + 1])
      i++
    }
  }

  // console.log(fullAddresses)


  var timesArr = [];


  var times = $('body > center > table > tbody > tr > td > table > tbody > tr:nth-child(2) > td > div > table > tbody > tr > td:nth-child(2)').length


  for (var i = 1; i <= times; i++) {
    // console.log($(`body > center > table > tbody > tr > td > table > tbody > tr:nth-child(2) > td > div > table > tbody > tr:nth-child(${i}) > td:nth-child(2)`))
    timesArr.push($(`body > center > table > tbody > tr > td > table > tbody > tr:nth-child(2) > td > div > table > tbody > tr:nth-child(${i}) > td:nth-child(2)`).text())
  }
  // console.log(timesArr.length)

  const timesRes = timesArr
    .map(el => el.replace(/\n/g, ''))
    .map(el => el.replace(/\t/g, '').trim())
    .filter(string => string != '')
    .map(el => el.split('                                               ').map(el => el.replace(/Meeting Type/g, '*').replace(/Special Interest/g, '^').split(/[*^]+/))
    .map(el => ({ time: el[0], ...(el[1]) && {type: el[1]},  ...(el[2]) && {interest: el[2]}})))

  
    // console.log(timesRes, fullAddresses)

    const final = fullAddresses.map((adr, i) => ({ address: adr, time: timesRes[i] }))
  // console.log(JSON.stringify(final))
  everything = [...everything, ...final]
  // fs.writeFileSync(`./addresses-aa-${num}.txt`, fullAddresses.join('\n'));
});

for (var i = 1; i < 10; i++) {
  parseFile(`data/aa-${i}.txt`)
}
setTimeout(() => {
  console.log(everything)
  fs.writeFileSync(`./all-data.json`, JSON.stringify(everything))
}, 4000)
// console.log(everything)

