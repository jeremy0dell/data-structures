var fs = require('fs');
var cheerio = require('cheerio');

const parseFile = (fileName) => fs.readFile(fileName, 'utf8', function(err, data) {
  if (err) throw err;
  console.log('OK: ' + fileName);

  var $ = cheerio.load(data);

  var addressLines = Array.from($('body > center > table > tbody > tr > td > table > tbody > tr:nth-child(2) > td > div > table > tbody > tr > td:nth-child(1) br'))
    .filter(node => node.name && node.name == 'br' && node.next && node.next.type == 'text')
    .map(node => node.next.data.trim())
    .map(el => el.replace(/\t/g, ''))
    .map(el => el.replace(/\n/g, ''))
    .filter(string => string != '')
    .filter((el, i, arr) => (/\b\d{5}\b/g).test(el) || (/\b\d{5}\b/g).test(arr[i + 1]))
  

  var fullAddresses = []

  for (var i = 0; i < addressLines.length; i++) {
    // If current line has zipcode, it's a single line and will be pushed
    if ((/\b\d{5}\b/g).test(addressLines[i])) {
      fullAddresses.push(addressLines[i])
    } else {
      fullAddresses.push(addressLines[i] + addressLines[i + 1])
      i++
    }
  }

  console.log(fullAddresses)
  fs.writeFileSync(`./addresses-aa-${8}.txt`, fullAddresses.join('\n'));
});

parseFile(`data/aa-${8}.txt`)

