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
  {
      "address": "20 Cardinal Hayes Place, Rectory Basement,(Between Duane and Pearl Streets), 10007",
      "time": [
          {
              "time": "Thursdays From  7:00 AM to 8:00 AM ",
              "type": " OD = Open Discussion meeting"
          },
          {
              "time": " Tuesdays From  7:00 AM to 8:00 AM ",
              "type": " B = Beginners meeting"
          }
      ]
  },
  {
      "address": "20 Cardinal Hayes Place, Enter through driveway behind Church.,(1 Block North of Chambers Street) NY 10007",
      "time": [
          {
              "time": "Mondays From  12:15 PM to 1:15 PM ",
              "type": " OD = Open Discussion meeting"
          },
          {
              "time": " Wednesdays From  12:15 PM to 1:15 PM ",
              "type": " S = Step meeting"
          },
          {
              "time": " Thursdays From  12:15 PM to 1:15 PM ",
              "type": " B = Beginners meeting"
          },
          {
              "time": " Fridays From  12:15 PM to 1:15 PM ",
              "type": " BB = Big Book meeting"
          }
      ]
  },
  {
      "address": "29 Mott Street, Basement,(@ Mott & Mosco Streets) NY 10013",
      "time": [
          {
              "time": "Tuesdays From  6:30 PM to 7:30 PM ",
              "type": " C = Closed Discussion meeting"
          }
      ]
  },
  {
      "address": "49 Fulton Street, 1st Floor Library,(@ Pearl Street) 10038",
      "time": [
          {
              "time": "Mondays From  7:00 PM to 8:00 PM ",
              "type": " OD = Open Discussion meeting"
          }
      ]
  },
  {
      "address": "44 John Street,between Nassau and William 10038",
      "time": [
          {
              "time": "Mondays From  12:15 PM to 1:15 PM ",
              "type": " OD = Open Discussion meeting"
          },
          {
              "time": " Tuesdays From  12:15 PM to 1:15 PM ",
              "type": " S = Step meeting"
          },
          {
              "time": " Thursdays From  12:15 PM to 1:15 PM ",
              "type": " OD = Open Discussion meeting"
          },
          {
              "time": " Mondays From  1:30 PM to 2:30 PM ",
              "type": " B = Beginners meeting ",
              "interest": " Living Sober"
          },
          {
              "time": "Thursdays From  1:30 PM to 2:30 PM ",
              "type": " S = Step meeting"
          }
      ]
  },
  {
      "address": "49 Fulton Street,near Water 10038",
      "time": [
          {
              "time": "Mondays From  6:30 AM to 7:30 AM ",
              "type": " C = Closed Discussion meeting ",
              "interest": " Topic"
          },
          {
              "time": "Tuesdays From  6:30 AM to 7:30 AM ",
              "type": " C = Closed Discussion meeting"
          },
          {
              "time": " Wednesdays From  6:30 AM to 7:30 AM ",
              "type": " C = Closed Discussion meeting ",
              "interest": " Topic"
          },
          {
              "time": "Thursdays From  6:30 AM to 7:30 AM ",
              "type": " S = Step meeting"
          },
          {
              "time": " Fridays From  6:30 AM to 7:30 AM ",
              "type": " BB = Big Book meeting"
          },
          {
              "time": " Mondays From  7:30 AM to 8:30 AM ",
              "type": " S = Step meeting"
          },
          {
              "time": " Tuesdays From  7:30 AM to 8:30 AM ",
              "type": " OD = Open Discussion meeting"
          },
          {
              "time": " Wednesdays From  7:30 AM to 8:30 AM ",
              "type": " OD = Open Discussion meeting"
          },
          {
              "time": " Thursdays From  7:30 AM to 8:30 AM ",
              "type": " OD = Open Discussion meeting"
          },
          {
              "time": " Fridays From  7:30 AM to 8:30 AM ",
              "type": " B = Beginners meeting"
          },
          {
              "time": " Sundays From  7:45 AM to 8:45 AM ",
              "type": " OD = Open Discussion meeting ",
              "interest": " Round-Robin Meeting Format"
          },
          {
              "time": "Saturdays From  7:45 AM to 8:45 AM ",
              "type": " OD = Open Discussion meeting ",
              "interest": " Round-Robin Meeting Format"
          },
          {
              "time": "Fridays From  5:30 PM to 6:30 PM ",
              "type": " B = Beginners meeting"
          }
      ]
  },
  {
      "address": "20 Cardinal Hayes Place, Enter thru driveway behind Church.,(1 Block North of Chamber Street, Behind Federal Courthouse) NY 10007",
      "time": [
          {
              "time": "Fridays From  6:00 PM to 7:00 PM ",
              "type": " OD = Open Discussion meeting"
          }
      ]
  },
  {
      "address": "20 Cardinal Hayes Place, Enter thru driveway behind Church.,(Betw. Duane & Pearl Streets) NY 10007",
      "time": [
          {
              "time": "Sundays From  6:00 PM to 7:00 PM ",
              "type": " BB = Big Book meeting"
          }
      ]
  },
  {
      "address": "22 Barclay Street (Basement),(Corner of Barclay & Church Streets) 10007",
      "time": [
          {
              "time": "Mondays From  1:15 PM to 2:15 PM ",
              "type": " B = Beginners meeting"
          },
          {
              "time": " Tuesdays From  1:15 PM to 2:15 PM ",
              "type": " C = Closed Discussion meeting"
          },
          {
              "time": " Wednesdays From  1:15 PM to 2:15 PM ",
              "type": " C = Closed Discussion meeting ",
              "interest": " Promises"
          },
          {
              "time": "Thursdays From  1:15 PM to 2:15 PM ",
              "type": " S = Step meeting"
          },
          {
              "time": " Fridays From  1:15 PM to 2:15 PM ",
              "type": " BB = Big Book meeting"
          }
      ]
  },
  {
      "address": "283 West Broadway,(Betw. Lispenard and Canal Streets), Ground Floor, Broadway Room, Enter through Green Door 10013",
      "time": [
          {
              "time": "Thursdays From  7:30 PM to 8:45 PM ",
              "type": " OD = Open Discussion meeting"
          }
      ]
  },
  {
      "address": "125 Barclay Street,(Betw. Greenwich Street & West Side Highway) NY 10007",
      "time": [
          {
              "time": "Wednesdays From  7:00 PM to 8:00 PM ",
              "type": " C = Closed Discussion meeting ",
              "interest": " Mental Health Issues in Sobriety"
          }
      ]
  },
  {
      "address": "49 Fulton Street, Conference Room #1,(@ Water & Fulton Streets) 10038",
      "time": [
          {
              "time": "Saturdays From  2:00 PM to 3:15 PM ",
              "type": " OD = Open Discussion meeting"
          }
      ]
  },
  {
      "address": "49 Fulton Street,(Corner of Fulton & Pearl Streets @ Water Street) NY 10038",
      "time": [
          {
              "time": "Tuesdays From  6:00 PM to 7:00 PM ",
              "type": " S = Step meeting"
          }
      ]
  },
  {
      "address": "20 Cardinal Hayes Place, 10007",
      "time": [
          {
              "time": "Thursdays From  12:15 PM to 1:15 PM ",
              "type": " C = Closed Discussion meeting"
          },
          {
              "time": " Fridays From  12:15 PM to 1:15 PM ",
              "type": " S = Step meeting"
          },
          {
              "time": " Mondays From  12:15 PM to 1:15 PM ",
              "type": " S = Step meeting ",
              "interest": " Meditation"
          },
          {
              "time": "Wednesdays From  12:15 PM to 1:15 PM ",
              "type": " BB = Big Book meeting"
          },
          {
              "time": " Tuesdays From  12:15 PM to 1:15 PM ",
              "type": " B = Beginners meeting"
          }
      ]
  },
  {
      "address": "283 West Broadway,Canal and Lispendard Sts. 10013",
      "time": [
          {
              "time": "Wednesdays From  5:30 PM to 6:30 PM ",
              "type": " OD = Open Discussion meeting"
          }
      ]
  },
  {
      "address": "49 Fulton Street,Near Water 10038",
      "time": [
          {
              "time": "Sundays From  11:00 AM to 12:00 PM ",
              "type": " C = Closed Discussion meeting ",
              "interest": " Meditation"
          },
          {
              "time": "Fridays From  12:30 PM to 1:30 PM ",
              "type": " BB = Big Book meeting"
          },
          {
              "time": " Mondays From  6:30 PM to 7:30 PM ",
              "type": " C = Closed Discussion meeting"
          },
          {
              "time": " Thursdays From  6:30 PM to 7:30 PM ",
              "type": " C = Closed Discussion meeting"
          }
      ]
  },
  {
      "address": "22 Barclay Street- basement chapel,between Church and Broadway NY 10006",
      "time": [
          {
              "time": "Fridays From  7:30 PM to 8:30 PM ",
              "type": " S = Step meeting"
          },
          {
              "time": " Saturdays From  7:30 PM to 8:30 PM ",
              "type": " OD = Open Discussion meeting"
          },
          {
              "time": " Tuesdays From  7:30 PM to 8:30 PM ",
              "type": " BB = Big Book meeting"
          },
          {
              "time": " Thursdays From  7:30 PM to 8:30 PM ",
              "type": " B = Beginners meeting"
          }
      ]
  },
  {
      "address": "20 Cardinal Hayes Place,On Plaza east of Centre St and Reade St, 1st floor 10007",
      "time": [
          {
              "time": "Mondays From  7:45 PM to 8:45 PM ",
              "type": " S = Step meeting"
          },
          {
              "time": " Wednesdays From  8:00 PM to 9:00 PM ",
              "type": " OD = Open Discussion meeting"
          }
      ]
  },
  {
      "address": "283 West Broadway, 10013",
      "time": [
          {
              "time": "Wednesdays From  1:15 PM to 2:15 PM ",
              "type": " S = Step meeting"
          }
      ]
  },
  {
      "address": "283 West Broadway,(Between West Broadway and Canal Street) 10013",
      "time": [
          {
              "time": "Wednesdays From  8:30 PM to 9:30 PM ",
              "type": " C = Closed Discussion meeting ",
              "interest": " Gay, Lesbian and Bisexual"
          }
      ]
  },
  {
      "address": "283 W. Broadway,(at Canal Street) NY 10013",
      "time": [
          {
              "time": "Tuesdays From  7:45 PM to 8:45 PM ",
              "type": " C = Closed Discussion meeting ",
              "interest": " Young People"
          }
      ]
  },
  {
      "address": "273 Bowery, Downstairs,(@ Houston Street) NY 10002",
      "time": [
          {
              "time": "Fridays From  6:00 PM to 7:00 PM ",
              "type": " C = Closed Discussion meeting"
          }
      ]
  },
  {
      "address": "232 West 11th Street,(Off 7th Avenue) NY 10014",
      "time": [
          {
              "time": "Thursdays From  6:15 PM to 7:15 PM ",
              "type": " S = Step meeting"
          }
      ]
  },
  {
      "address": "283 West Broadway,@ Canal Street 10013",
      "time": [
          {
              "time": "Saturdays From  12:00 PM to 1:00 PM ",
              "type": " C = Closed Discussion meeting"
          }
      ]
  },
  {
      "address": "232 W. 11th Street,(between Waverly and West 4th Streets) 10014",
      "time": [
          {
              "time": "Sundays From  6:30 PM to 7:45 PM ",
              "type": " B = Beginners meeting"
          }
      ]
  },
  {
      "address": "220 West Houston Street, 2nd Floor,(Betw. 6th Avenue & Varick Street) 10014",
      "time": [
          {
              "time": "Sundays From  10:30 AM to 12:00 PM ",
              "type": " OD = Open Discussion meeting"
          }
      ]
  },
  {
      "address": "253 Center Street, 3rd Floor,(@ Broome Street) 10013",
      "time": [
          {
              "time": "Mondays From  5:15 PM to 6:15 PM ",
              "type": " OD = Open Discussion meeting ",
              "interest": " Meditation at Meeting"
          }
      ]
  },
  {
      "address": "273 Bowery,(@ Houston Street) NY 10002",
      "time": [
          {
              "time": "Fridays From  6:45 PM to 8:00 PM ",
              "type": " OD = Open Discussion meeting ",
              "interest": " Agnostic"
          }
      ]
  },
  {
      "address": "487 Hudson Street, Basement,(South of Christopher Street - behind church) NY 10014",
      "time": [
          {
              "time": "Mondays From  7:15 PM to 8:15 PM ",
              "type": " B = Beginners meeting"
          },
          {
              "time": " Tuesdays From  7:15 PM to 8:15 PM ",
              "type": " BB = Big Book meeting"
          },
          {
              "time": " Wednesdays From  7:15 PM to 8:15 PM ",
              "type": " OD = Open Discussion meeting"
          },
          {
              "time": " Fridays From  8:00 PM to 9:00 PM ",
              "type": " S = Step meeting"
          },
          {
              "time": " Mondays From  8:30 PM to 9:30 PM ",
              "type": " S = Step meeting ",
              "interest": " Steps 1-2-3"
          }
      ]
  },
  {
      "address": "292 Henry Street, Basement,(A la isquierda de la iglesia) NY 10002",
      "time": [
          {
              "time": "Sundays From  3:00 PM to 4:00 PM ",
              "type": " O = Open meeting"
          },
          {
              "time": " Tuesdays From  7:30 PM to 8:30 PM ",
              "type": " C = Closed Discussion meeting"
          },
          {
              "time": " Fridays From  8:00 PM to 9:00 PM ",
              "type": " O = Open meeting"
          }
      ]
  },
  {
      "address": "232 West 11th Street,Between Waverly Place and West 4th Street 10014",
      "time": [
          {
              "time": "s From  12:00 AM to 12:00 AM"
          },
          {
              "time": " Mondays From  7:00 PM to 8:00 PM ",
              "type": " C = Closed Discussion meeting ",
              "interest": " Gay Men"
          }
      ]
  },
  {
      "address": "141 Henry Street, 1st Floor,(Betw Henry & Rutgers Streets) 10002",
      "time": [
          {
              "time": "Tuesdays From  7:00 PM to 8:00 PM ",
              "type": " C = Closed Discussion meeting"
          }
      ]
  },
  {
      "address": "220 West Houston Street, 2nd Floor,(Betw 6th Avenue & Varick Street) 10014",
      "time": [
          {
              "time": "Mondays From  12:00 AM to 1:15 AM ",
              "type": " S = Step meeting"
          },
          {
              "time": " Sundays From  12:00 AM to 1:15 AM ",
              "type": " S = Step meeting"
          },
          {
              "time": " Wednesdays From  12:00 AM to 1:15 AM ",
              "type": " B = Beginners meeting"
          },
          {
              "time": " Saturdays From  12:00 AM to 1:15 AM ",
              "type": " C = Closed Discussion meeting"
          },
          {
              "time": " Tuesdays From  12:00 AM to 1:15 AM ",
              "type": " C = Closed Discussion meeting"
          },
          {
              "time": " Fridays From  12:00 AM to 1:15 AM ",
              "type": " C = Closed Discussion meeting ",
              "interest": " Promises"
          },
          {
              "time": "Thursdays From  12:00 AM to 1:15 AM ",
              "type": " C = Closed Discussion meeting"
          },
          {
              "time": " Saturdays From  2:00 AM to 3:15 AM ",
              "type": " OD = Open Discussion meeting"
          },
          {
              "time": " Tuesdays From  2:00 AM to 3:15 AM ",
              "type": " OD = Open Discussion meeting"
          },
          {
              "time": " Fridays From  2:00 AM to 3:15 AM ",
              "type": " OD = Open Discussion meeting"
          },
          {
              "time": " Mondays From  2:00 AM to 3:15 AM ",
              "type": " OD = Open Discussion meeting"
          },
          {
              "time": " Thursdays From  2:00 AM to 3:15 AM ",
              "type": " OD = Open Discussion meeting"
          },
          {
              "time": " Sundays From  2:00 AM to 3:15 AM ",
              "type": " OD = Open Discussion meeting"
          },
          {
              "time": " Wednesdays From  2:00 AM to 3:15 AM ",
              "type": " OD = Open Discussion meeting"
          },
          {
              "time": " Saturdays From  12:30 PM to 1:30 PM ",
              "type": " C = Closed Discussion meeting"
          },
          {
              "time": " Tuesdays From  12:30 PM to 1:30 PM ",
              "type": " C = Closed Discussion meeting"
          },
          {
              "time": " Mondays From  12:30 PM to 1:30 PM ",
              "type": " C = Closed Discussion meeting"
          },
          {
              "time": " Thursdays From  12:30 PM to 1:30 PM ",
              "type": " S = Step meeting"
          },
          {
              "time": " Wednesdays From  12:30 PM to 1:30 PM ",
              "type": " C = Closed Discussion meeting"
          },
          {
              "time": " Fridays From  12:30 PM to 1:30 PM ",
              "type": " C = Closed Discussion meeting ",
              "interest": " Topic"
          },
          {
              "time": "Sundays From  12:30 PM to 1:30 PM ",
              "type": " C = Closed Discussion meeting ",
              "interest": " Meditation"
          },
          {
              "time": "Tuesdays From  5:15 PM to 6:15 PM ",
              "type": " C = Closed Discussion meeting"
          },
          {
              "time": " Fridays From  5:15 PM to 6:15 PM ",
              "type": " C = Closed Discussion meeting"
          },
          {
              "time": " Thursdays From  5:15 PM to 6:15 PM ",
              "type": " C = Closed Discussion meeting"
          },
          {
              "time": " Sundays From  5:15 PM to 6:15 PM ",
              "type": " S = Step meeting"
          },
          {
              "time": " Wednesdays From  5:15 PM to 6:15 PM ",
              "type": " C = Closed Discussion meeting"
          },
          {
              "time": " Mondays From  5:15 PM to 6:15 PM ",
              "type": " C = Closed Discussion meeting ",
              "interest": " Living Sober"
          },
          {
              "time": "Wednesdays From  6:30 PM to 7:30 PM ",
              "type": " C = Closed Discussion meeting"
          },
          {
              "time": " Saturdays From  6:30 PM to 7:30 PM ",
              "type": " C = Closed Discussion meeting"
          },
          {
              "time": " Tuesdays From  6:30 PM to 7:30 PM ",
              "type": " C = Closed Discussion meeting"
          },
          {
              "time": " Fridays From  6:30 PM to 7:30 PM ",
              "type": " C = Closed Discussion meeting"
          },
          {
              "time": " Mondays From  6:30 PM to 7:30 PM ",
              "type": " B = Beginners meeting"
          },
          {
              "time": " Thursdays From  6:30 PM to 7:30 PM ",
              "type": " C = Closed Discussion meeting"
          },
          {
              "time": " Sundays From  6:30 PM to 7:30 PM ",
              "type": " C = Closed Discussion meeting"
          },
          {
              "time": " Sundays From  8:00 PM to 9:15 PM ",
              "type": " BB = Big Book meeting"
          },
          {
              "time": " Wednesdays From  8:00 PM to 9:15 PM ",
              "type": " C = Closed Discussion meeting ",
              "interest": " Men"
          },
          {
              "time": "Saturdays From  8:00 PM to 9:15 PM ",
              "type": " O = Open meeting"
          },
          {
              "time": " Tuesdays From  8:00 PM to 9:15 PM ",
              "type": " C = Closed Discussion meeting ",
              "interest": " Women"
          },
          {
              "time": "Mondays From  8:00 PM to 9:15 PM ",
              "type": " C = Closed Discussion meeting ",
              "interest": " Topic"
          },
          {
              "time": "Fridays From  8:00 PM to 9:15 PM ",
              "type": " S = Step meeting"
          },
          {
              "time": " Thursdays From  8:00 PM to 9:15 PM ",
              "type": " B = Beginners meeting ",
              "interest": " Under Six Months Sober"
          },
          {
              "time": "Sundays From  10:00 PM to 11:15 PM ",
              "type": " C = Closed Discussion meeting"
          },
          {
              "time": " Wednesdays From  10:00 PM to 11:15 PM ",
              "type": " C = Closed Discussion meeting"
          },
          {
              "time": " Saturdays From  10:00 PM to 11:15 PM ",
              "type": " C = Closed Discussion meeting"
          },
          {
              "time": " Tuesdays From  10:00 PM to 11:15 PM ",
              "type": " S = Step meeting"
          },
          {
              "time": " Mondays From  10:00 PM to 11:15 PM ",
              "type": " C = Closed Discussion meeting"
          },
          {
              "time": " Fridays From  10:00 PM to 11:15 PM ",
              "type": " B = Beginners meeting"
          },
          {
              "time": " Thursdays From  10:00 PM to 11:15 PM ",
              "type": " C = Closed Discussion meeting ",
              "interest": " Topic"
          }
      ]
  },
  {
      "address": "83 Christopher Street (Red Door, Left of Church),(West of 7th Avenue, Enter Left, Red Door, Ring Buzzer) NY 10014",
      "time": [
          {
              "time": "Sundays From  12:30 PM to 1:30 PM ",
              "type": " O = Open meeting ",
              "interest": " Gay, Lesbian and Bisexual"
          },
          {
              "time": "Wednesdays From  6:30 PM to 7:30 PM ",
              "type": " B = Beginners meeting ",
              "interest": " Gay, Lesbian and Bisexual"
          },
          {
              "time": "Fridays From  7:30 PM to 8:30 PM ",
              "type": " B = Beginners meeting ",
              "interest": " Gay, Lesbian and Bisexual"
          }
      ]
  },
  {
      "address": "50 Perry Street, Ground Floor,(Betw. 7th Avenue South & West 4th Street) NY 10014",
      "time": [
          {
              "time": "Wednesdays From  7:30 AM to 8:30 AM ",
              "type": " C = Closed Discussion meeting"
          },
          {
              "time": " Tuesdays From  7:30 AM to 8:30 AM ",
              "type": " C = Closed Discussion meeting"
          },
          {
              "time": " Mondays From  7:30 AM to 8:30 AM ",
              "type": " C = Closed Discussion meeting"
          },
          {
              "time": " Sundays From  7:30 AM to 8:30 AM ",
              "type": " OD = Open Discussion meeting"
          },
          {
              "time": " Saturdays From  7:30 AM to 8:30 AM ",
              "type": " C = Closed Discussion meeting"
          },
          {
              "time": " Fridays From  7:30 AM to 8:30 AM ",
              "type": " C = Closed Discussion meeting"
          },
          {
              "time": " Thursdays From  7:30 AM to 8:30 AM ",
              "type": " S = Step meeting"
          },
          {
              "time": " Thursdays From  9:00 AM to 10:00 AM ",
              "type": " C = Closed Discussion meeting"
          },
          {
              "time": " Wednesdays From  9:00 AM to 10:00 AM ",
              "type": " C = Closed Discussion meeting"
          },
          {
              "time": " Tuesdays From  9:00 AM to 10:00 AM ",
              "type": " C = Closed Discussion meeting"
          },
          {
              "time": " Mondays From  9:00 AM to 10:00 AM ",
              "type": " OD = Open Discussion meeting"
          },
          {
              "time": " Sundays From  9:00 AM to 10:00 AM ",
              "type": " C = Closed Discussion meeting"
          },
          {
              "time": " Fridays From  9:00 AM to 10:00 AM ",
              "type": " C = Closed Discussion meeting"
          },
          {
              "time": " Saturdays From  9:30 AM to 10:00 AM ",
              "type": " C = Closed Discussion meeting"
          },
          {
              "time": " Fridays From  10:30 AM to 11:30 AM ",
              "type": " C = Closed Discussion meeting ",
              "interest": " Women"
          },
          {
              "time": "Sundays From  11:00 AM to 12:00 PM ",
              "type": " C = Closed Discussion meeting"
          },
          {
              "time": " Saturdays From  12:00 PM to 1:00 PM ",
              "type": " C = Closed Discussion meeting"
          },
          {
              "time": " Fridays From  12:15 PM to 1:15 PM ",
              "type": " C = Closed Discussion meeting"
          },
          {
              "time": " Thursdays From  12:15 PM to 1:15 PM ",
              "type": " C = Closed Discussion meeting"
          },
          {
              "time": " Wednesdays From  12:15 PM to 1:15 PM ",
              "type": " C = Closed Discussion meeting"
          },
          {
              "time": " Tuesdays From  12:15 PM to 1:15 PM ",
              "type": " S = Step meeting"
          },
          {
              "time": " Mondays From  12:15 PM to 1:15 PM ",
              "type": " B = Beginners meeting"
          },
          {
              "time": " Sundays From  1:00 PM to 2:00 PM ",
              "type": " C = Closed Discussion meeting ",
              "interest": " Children Welcome"
          },
          {
              "time": "Saturdays From  2:30 PM to 3:30 PM ",
              "type": " C = Closed Discussion meeting"
          },
          {
              "time": " Fridays From  2:30 PM to 3:30 PM ",
              "type": " OD = Open Discussion meeting"
          },
          {
              "time": " Thursdays From  2:30 PM to 3:30 PM ",
              "type": " C = Closed Discussion meeting"
          },
          {
              "time": " Tuesdays From  2:30 PM to 3:30 PM ",
              "type": " C = Closed Discussion meeting"
          },
          {
              "time": " Mondays From  2:30 PM to 3:30 PM ",
              "type": " C = Closed Discussion meeting"
          },
          {
              "time": " Wednesdays From  2:30 PM to 3:30 PM ",
              "type": " B = Beginners meeting"
          },
          {
              "time": " Sundays From  3:00 PM to 4:30 PM ",
              "type": " C = Closed Discussion meeting"
          },
          {
              "time": " Mondays From  4:00 PM to 5:00 PM ",
              "type": " C = Closed Discussion meeting"
          },
          {
              "time": " Saturdays From  4:00 PM to 5:00 PM ",
              "type": " C = Closed Discussion meeting"
          },
          {
              "time": " Thursdays From  4:00 PM to 5:00 PM ",
              "type": " C = Closed Discussion meeting"
          },
          {
              "time": " Wednesdays From  4:00 PM to 5:00 PM ",
              "type": " OD = Open Discussion meeting"
          },
          {
              "time": " Tuesdays From  4:00 PM to 5:00 PM ",
              "type": " C = Closed Discussion meeting"
          },
          {
              "time": " Fridays From  4:00 PM to 6:00 PM ",
              "type": " C = Closed Discussion meeting"
          },
          {
              "time": " Thursdays From  5:30 PM to 6:30 PM ",
              "type": " BB = Big Book meeting"
          },
          {
              "time": " Mondays From  6:00 PM to 7:00 PM ",
              "type": " C = Closed Discussion meeting"
          },
          {
              "time": " Saturdays From  6:00 PM to 7:00 PM ",
              "type": " OD = Open Discussion meeting"
          },
          {
              "time": " Sundays From  6:00 PM to 7:00 PM ",
              "type": " C = Closed Discussion meeting"
          },
          {
              "time": " Fridays From  6:00 PM to 7:00 PM ",
              "type": " C = Closed Discussion meeting"
          },
          {
              "time": " Wednesdays From  6:00 PM to 7:00 PM ",
              "type": " S = Step meeting"
          },
          {
              "time": " Tuesdays From  6:00 PM to 7:00 PM ",
              "type": " C = Closed Discussion meeting"
          },
          {
              "time": " Thursdays From  7:00 PM to 8:00 PM ",
              "type": " B = Beginners meeting"
          },
          {
              "time": " Tuesdays From  8:30 PM to 9:30 PM ",
              "type": " C = Closed Discussion meeting"
          },
          {
              "time": " Mondays From  8:30 PM to 9:30 PM ",
              "type": " C = Closed Discussion meeting"
          },
          {
              "time": " Saturdays From  8:30 PM to 9:30 PM ",
              "type": " C = Closed Discussion meeting"
          },
          {
              "time": " Sundays From  8:30 PM to 9:30 PM ",
              "type": " C = Closed Discussion meeting"
          },
          {
              "time": " Thursdays From  8:30 PM to 9:30 PM ",
              "type": " OD = Open Discussion meeting"
          },
          {
              "time": " Fridays From  8:30 PM to 10:30 PM ",
              "type": " S = Step meeting"
          },
          {
              "time": " Wednesdays From  8:30 PM to 9:30 PM ",
              "type": " C = Closed Discussion meeting"
          },
          {
              "time": " Tuesdays From  10:15 PM to 11:15 PM ",
              "type": " C = Closed Discussion meeting"
          },
          {
              "time": " Mondays From  10:15 PM to 11:15 PM ",
              "type": " C = Closed Discussion meeting"
          },
          {
              "time": " Thursdays From  10:15 PM to 11:15 PM ",
              "type": " C = Closed Discussion meeting"
          },
          {
              "time": " Wednesdays From  10:15 PM to 11:15 PM ",
              "type": " BB = Big Book meeting"
          },
          {
              "time": " Sundays From  10:30 PM to 11:30 PM ",
              "type": " C = Closed Discussion meeting"
          },
          {
              "time": " Saturdays From  11:00 PM to 12:00 AM ",
              "type": " C = Closed Discussion meeting"
          },
          {
              "time": " Fridays From  11:00 PM to 12:00 AM ",
              "type": " C = Closed Discussion meeting"
          }
      ]
  },
  {
      "address": "232 West 11th Street,off 7th Ave, downstairs in Junior Room 10014",
      "time": [
          {
              "time": "Thursdays From  6:30 PM to 7:45 PM ",
              "type": " OD = Open Discussion meeting"
          },
          {
              "time": " Tuesdays From  6:30 PM to 7:45 PM ",
              "type": " S = Step meeting"
          }
      ]
  },
  {
      "address": "224 Waverly Place, 1st floor event room.,(@ 11th Street & 7th Avenue South) NY 10014",
      "time": [
          {
              "time": "Sundays From  7:00 PM to 8:00 PM ",
              "type": " S = Step meeting ",
              "interest": " Gay, Lesbian and Bisexual"
          },
          {
              "time": "Thursdays From  7:00 PM to 8:00 PM ",
              "type": " B = Beginners meeting ",
              "interest": " Gay, Lesbian and Bisexual"
          },
          {
              "time": "Fridays From  7:00 PM to 8:00 PM ",
              "type": " OD = Open Discussion meeting ",
              "interest": " Promises"
          },
          {
              "time": "Sundays From  8:30 PM to 9:30 PM ",
              "type": " OD = Open Discussion meeting ",
              "interest": " Gay, Lesbian and Bisexual"
          },
          {
              "time": "Fridays From  8:30 PM to 9:30 PM ",
              "type": " OD = Open Discussion meeting ",
              "interest": " Gay, Lesbian and Bisexual"
          }
      ]
  },
  {
      "address": "154 Sullivan Street,(Enter on Sullivan Street) NY 10012",
      "time": [
          {
              "time": "Mondays From  7:30 AM to 8:30 AM ",
              "type": " BB = Big Book meeting"
          },
          {
              "time": " Tuesdays From  7:30 AM to 8:30 AM ",
              "type": " B = Beginners meeting"
          },
          {
              "time": " Wednesdays From  7:30 AM to 8:30 AM ",
              "type": " C = Closed Discussion meeting"
          },
          {
              "time": " Thursdays From  7:30 AM to 8:30 AM ",
              "type": " C = Closed Discussion meeting ",
              "interest": " Promises"
          },
          {
              "time": "Fridays From  7:30 AM to 8:30 AM ",
              "type": " S = Step meeting"
          }
      ]
  },
  {
      "address": "273 Bowery Street, 10012",
      "time": [
          {
              "time": "Sundays From  7:30 AM to 8:30 AM ",
              "type": " Topic"
          },
          {
              "time": "Saturdays From  7:30 AM to 8:30 AM ",
              "type": " Topic"
          }
      ]
  },
  {
      "address": "371 6th Avenue,  Basement,(@ Corner of 6th Avenue & Washington Place) NY 10014",
      "time": [
          {
              "time": "Saturdays From  6:00 PM to 7:00 PM ",
              "type": " B = Beginners meeting ",
              "interest": " Gay, Lesbian and Bisexual"
          }
      ]
  },
  {
      "address": "155 Sullivan Street, Basement,(@ Houston Street) 10012",
      "time": [
          {
              "time": "Fridays From  6:30 PM to 7:30 PM ",
              "type": " B = Beginners meeting ",
              "interest": " Interpreted for the Deaf"
          },
          {
              "time": "Mondays From  7:00 PM to 8:00 PM ",
              "type": " B = Beginners meeting"
          },
          {
              "time": " Fridays From  8:00 PM to 9:00 PM ",
              "type": " C = Closed Discussion meeting"
          },
          {
              "time": " Mondays From  8:30 PM to 9:30 PM ",
              "type": " S = Step meeting"
          }
      ]
  },
  {
      "address": "7 East 10th Strert,(@ Houston Street) NY 10003",
      "time": [
          {
              "time": "Sundays From  11:00 AM to 12:15 PM ",
              "type": " C = Closed Discussion meeting ",
              "interest": " Eleventh Step"
          }
      ]
  },
  {
      "address": "81 Christopher Street,enter at 83, basement 10014",
      "time": [
          {
              "time": "Mondays From  6:30 PM to 7:30 PM ",
              "type": " Women"
          }
      ]
  },
  {
      "address": "273 Bowery, Downstairs,(@ Houston Street) 10002",
      "time": [
          {
              "time": "Tuesdays From  8:00 PM to 9:00 PM ",
              "type": " C = Closed Discussion meeting"
          }
      ]
  },
  {
      "address": "232 West 11th Street,(Just off of 7th avenue) 10014",
      "time": [
          {
              "time": "Thursdays From  7:00 PM to 8:00 PM ",
              "type": " BB = Big Book meeting ",
              "interest": " Men"
          }
      ]
  },
  {
      "address": "232 West 11th Street,(Btwneen 7th Avenue and West 4th Street NY 10014",
      "time": [
          {
              "time": "Tuesdays From  6:45 PM to 8:00 PM ",
              "type": " S = Step meeting"
          }
      ]
  },
  {
      "address": "83 Christopher Street,  Basement,(Betw. Bleeker & 7th Avenue) 10014",
      "time": [
          {
              "time": "Wednesdays From  6:15 PM to 7:15 PM ",
              "type": " C = Closed Discussion meeting"
          }
      ]
  },
  {
      "address": "220 West Houston Street, 2nd Floor,(Betw. 6th Avenue & Varick Street) NY 10014",
      "time": [
          {
              "time": "Thursdays From  6:30 PM to 7:45 PM ",
              "type": " C = Closed Discussion meeting ",
              "interest": " Women"
          }
      ]
  },
  {
      "address": "273 Bowery, Classroom Floor,(@ The corner of Houston Street) NY 10002",
      "time": [
          {
              "time": "Saturdays From  4:45 PM to 5:45 PM ",
              "type": " C = Closed Discussion meeting ",
              "interest": " Women"
          }
      ]
  },
  {
      "address": "35 East 125 Street, 1st Floor Conference Room,(@ Madison Avenue) 10035",
      "time": [
          {
              "time": "Saturdays From  4:15 PM to 5:30 PM ",
              "type": " B = Beginners meeting"
          }
      ]
  },
  {
      "address": "223 East 117th Street, 1st Floor Dining Room,(Betw. 2nd & 3rd Avenues) NY 10035",
      "time": [
          {
              "time": "Tuesdays From  6:30 PM to 7:30 PM ",
              "type": " B = Beginners meeting ",
              "interest": " Living Sober"
          }
      ]
  },
  {
      "address": "2126 2nd Avenue, 1st Floor,(Betw. 109th & 110th Streets) NY 10029",
      "time": [
          {
              "time": "Sundays From  5:00 PM to 6:00 PM ",
              "type": " OD = Open Discussion meeting"
          },
          {
              "time": " Mondays From  8:00 PM to 9:00 PM ",
              "type": " B = Beginners meeting"
          },
          {
              "time": " Tuesdays From  8:00 PM to 9:00 PM ",
              "type": " OD = Open Discussion meeting"
          },
          {
              "time": " Wednesdays From  8:00 PM to 9:00 PM ",
              "type": " C = Closed Discussion meeting"
          },
          {
              "time": " Thursdays From  8:00 PM to 9:00 PM ",
              "type": " OD = Open Discussion meeting"
          },
          {
              "time": " Fridays From  8:00 PM to 9:00 PM ",
              "type": " OD = Open Discussion meeting"
          },
          {
              "time": " Saturdays From  8:00 PM to 9:00 PM ",
              "type": " OD = Open Discussion meeting"
          }
      ]
  },
  {
      "address": "22 East 119th Street,  1st Floor Cafeteria,(Betw. Madison & 5th Avenues) NY 10035",
      "time": [
          {
              "time": "Sundays From  1:00 PM to 2:00 PM ",
              "type": " T = Tradition meeting"
          },
          {
              "time": " Mondays From  1:00 PM to 2:00 PM ",
              "type": " B = Beginners meeting"
          }
      ]
  },
  {
      "address": "252 West 46th Street, 3rd Floor,(Betw Broadway & 8th Avenue) 10036",
      "time": [
          {
              "time": "Sundays From  4:00 PM to 5:00 PM ",
              "type": " BB = Big Book meeting"
          },
          {
              "time": " Mondays From  4:00 PM to 5:00 PM ",
              "type": " BB = Big Book meeting"
          },
          {
              "time": " Tuesdays From  4:00 PM to 5:00 PM ",
              "type": " BB = Big Book meeting ",
              "interest": " Living Sober"
          },
          {
              "time": "Wednesdays From  4:00 PM to 5:00 PM ",
              "type": " BB = Big Book meeting"
          },
          {
              "time": " Thursdays From  4:00 PM to 5:00 PM ",
              "type": " BB = Big Book meeting"
          },
          {
              "time": " Fridays From  4:00 PM to 5:00 PM ",
              "type": " BB = Big Book meeting"
          },
          {
              "time": " Saturdays From  4:00 PM to 5:00 PM ",
              "type": " BB = Big Book meeting"
          }
      ]
  },
  {
      "address": "303 West 42nd Street, Room #404,(Betw 8th & 9th Avenues) 10036",
      "time": [
          {
              "time": "Mondays From  9:15 PM to 10:15 PM ",
              "type": " BB = Big Book meeting"
          },
          {
              "time": " Wednesdays From  9:15 PM to 10:15 PM ",
              "type": " C = Closed Discussion meeting ",
              "interest": " As Bill Sees It"
          },
          {
              "time": "Thursdays From  9:15 PM to 10:15 PM ",
              "type": " S = Step meeting"
          },
          {
              "time": " Fridays From  9:15 PM to 10:15 PM ",
              "type": " S = Step meeting"
          },
          {
              "time": " Saturdays From  9:15 PM to 10:15 PM ",
              "type": " C = Closed Discussion meeting"
          },
          {
              "time": " Sundays From  9:15 PM to 10:15 PM ",
              "type": " OD = Open Discussion meeting ",
              "interest": " Beginners Workshop"
          },
          {
              "time": "Tuesdays From  9:15 PM to 10:30 PM ",
              "type": " S = Step meeting ",
              "interest": " Meditation"
          }
      ]
  },
  {
      "address": "303 West 42nd Street, 3rd Floor, Room #306,(Betw. 8th & 9th Avenues) 10036",
      "time": [
          {
              "time": "Wednesdays From  8:00 AM to 9:00 AM ",
              "type": " OD = Open Discussion meeting"
          },
          {
              "time": " Thursdays From  8:00 AM to 9:00 AM ",
              "type": " C = Closed Discussion meeting ",
              "interest": " Daily Reflections"
          },
          {
              "time": "Fridays From  8:00 AM to 9:00 AM ",
              "type": " T = Tradition meeting"
          },
          {
              "time": " Saturdays From  8:00 AM to 9:00 AM ",
              "type": " OD = Open Discussion meeting ",
              "interest": " Living Sober"
          },
          {
              "time": "Sundays From  8:00 AM to 9:00 AM ",
              "type": " S = Step meeting"
          },
          {
              "time": " Mondays From  8:00 AM to 9:00 AM ",
              "type": " S = Step meeting"
          },
          {
              "time": " Tuesdays From  8:00 AM to 9:00 AM ",
              "type": " BB = Big Book meeting"
          }
      ]
  },
  {
      "address": "305 7th Avenue, 6th Floor,(Betw. 27th & 28th Streets) NY 10001",
      "time": [
          {
              "time": "Wednesdays From  8:00 PM to 9:00 PM ",
              "type": " OD = Open Discussion meeting"
          }
      ]
  },
  {
      "address": "1 West 53rd Street, 3rd Floor, Andrew Hall,(Betw 5th & 6th Avenues) 10019",
      "time": [
          {
              "time": "Fridays From  7:00 PM to 8:00 PM ",
              "type": " O = Open meeting ",
              "interest": " Gay, Lesbian and Bisexual"
          }
      ]
  },
  {
      "address": "303 West 42nd Street, 3rd Floor, Room #306,(@ Corner of 8th Avenue) 10036",
      "time": [
          {
              "time": "Mondays From  12:00 PM to 1:00 PM ",
              "type": " C = Closed Discussion meeting"
          },
          {
              "time": " Thursdays From  12:00 PM to 1:00 PM ",
              "type": " C = Closed Discussion meeting"
          },
          {
              "time": " Saturdays From  12:00 PM to 1:00 PM ",
              "type": " B = Beginners meeting"
          },
          {
              "time": " Tuesdays From  12:00 PM to 1:00 PM ",
              "type": " C = Closed Discussion meeting"
          },
          {
              "time": " Sundays From  12:00 PM to 1:00 PM ",
              "type": " C = Closed Discussion meeting"
          },
          {
              "time": " Wednesdays From  12:00 PM to 1:00 PM ",
              "type": " C = Closed Discussion meeting"
          },
          {
              "time": " Fridays From  12:00 PM to 1:00 PM ",
              "type": " C = Closed Discussion meeting"
          },
          {
              "time": " Sundays From  2:00 PM to 3:00 PM ",
              "type": " C = Closed Discussion meeting ",
              "interest": " Women"
          },
          {
              "time": "Mondays From  2:30 PM to 3:30 PM ",
              "type": " C = Closed Discussion meeting"
          },
          {
              "time": " Saturdays From  2:30 PM to 3:30 PM ",
              "type": " C = Closed Discussion meeting"
          },
          {
              "time": " Thursdays From  2:30 PM to 3:30 PM ",
              "type": " C = Closed Discussion meeting"
          },
          {
              "time": " Tuesdays From  2:30 PM to 3:30 PM ",
              "type": " C = Closed Discussion meeting"
          },
          {
              "time": " Wednesdays From  2:30 PM to 3:30 PM ",
              "type": " C = Closed Discussion meeting"
          },
          {
              "time": " Fridays From  2:30 PM to 3:30 PM ",
              "type": " C = Closed Discussion meeting"
          },
          {
              "time": " Mondays From  6:15 PM to 7:15 PM ",
              "type": " C = Closed Discussion meeting"
          },
          {
              "time": " Saturdays From  6:15 PM to 7:15 PM ",
              "type": " C = Closed Discussion meeting"
          },
          {
              "time": " Thursdays From  6:15 PM to 7:15 PM ",
              "type": " S = Step meeting"
          },
          {
              "time": " Tuesdays From  6:15 PM to 7:15 PM ",
              "type": " C = Closed Discussion meeting"
          },
          {
              "time": " Sundays From  6:15 PM to 7:15 PM ",
              "type": " C = Closed Discussion meeting"
          },
          {
              "time": " Wednesdays From  6:15 PM to 7:15 PM ",
              "type": " C = Closed Discussion meeting"
          },
          {
              "time": " Fridays From  6:15 PM to 7:15 PM ",
              "type": " C = Closed Discussion meeting"
          },
          {
              "time": " Fridays From  8:00 PM to 9:00 PM ",
              "type": " C = Closed Discussion meeting"
          },
          {
              "time": " Mondays From  8:00 PM to 9:00 PM ",
              "type": " C = Closed Discussion meeting"
          },
          {
              "time": " Saturdays From  8:00 PM to 9:00 PM ",
              "type": " C = Closed Discussion meeting"
          },
          {
              "time": " Thursdays From  8:00 PM to 9:00 PM ",
              "type": " C = Closed Discussion meeting"
          },
          {
              "time": " Sundays From  8:00 PM to 9:00 PM ",
              "type": " C = Closed Discussion meeting"
          },
          {
              "time": " Wednesdays From  8:00 PM to 9:00 PM ",
              "type": " C = Closed Discussion meeting"
          }
      ]
  },
  {
      "address": "133 West 46th Street, 3rd Floor,Between 6th & 7th Avenues NY 10036",
      "time": [
          {
              "time": "Mondays From  7:30 AM to 8:30 AM ",
              "type": " C = Closed Discussion meeting"
          },
          {
              "time": " Tuesdays From  7:30 AM to 8:30 AM ",
              "type": " C = Closed Discussion meeting"
          },
          {
              "time": " Wednesdays From  7:30 AM to 8:30 AM ",
              "type": " C = Closed Discussion meeting"
          },
          {
              "time": " Thursdays From  7:30 AM to 8:30 AM ",
              "type": " S = Step meeting"
          },
          {
              "time": " Fridays From  7:30 AM to 8:30 AM ",
              "type": " C = Closed Discussion meeting"
          }
      ]
  },
  {
      "address": "441 West 26th Street, 2nd Fl., Activity Room A,(Betw. 9th & 10th Avenues) NY 10001",
      "time": [
          {
              "time": "Saturdays From  3:00 PM to 4:00 PM ",
              "type": " OD = Open Discussion meeting"
          }
      ]
  },
  {
      "address": "446 West 33rd Street, 6th Floor, Room #6046,(@ 10th Avenue) NY 10001",
      "time": [
          {
              "time": "Tuesdays From  8:00 PM to 9:00 PM ",
              "type": " O = Open meeting ",
              "interest": " Gay, Lesbian and Bisexual"
          }
      ]
  },
  {
      "address": "252 West 46th Street, 3rd Floor,(Betw. 7th & 8th Avenues) 10036",
      "time": [
          {
              "time": "Tuesdays From  9:15 PM to 10:15 PM ",
              "type": " C = Closed Discussion meeting ",
              "interest": " Special Purpose Groups"
          }
      ]
  },
  {
      "address": "252 West 46th Street, 3rd Floor,(Betw. Broadway & 8th Avenue) 10036",
      "time": [
          {
              "time": "Mondays From  1:30 PM to 2:30 PM ",
              "type": " B = Beginners meeting ",
              "interest": " Living Sober"
          },
          {
              "time": "Tuesdays From  1:30 PM to 2:30 PM ",
              "type": " B = Beginners meeting ",
              "interest": " Living Sober"
          },
          {
              "time": "Wednesdays From  1:30 PM to 2:30 PM ",
              "type": " B = Beginners meeting ",
              "interest": " Living Sober"
          },
          {
              "time": "Thursdays From  1:30 PM to 2:30 PM ",
              "type": " B = Beginners meeting ",
              "interest": " Living Sober"
          },
          {
              "time": "Fridays From  1:30 PM to 2:30 PM ",
              "type": " B = Beginners meeting ",
              "interest": " Living Sober"
          },
          {
              "time": "Saturdays From  1:30 PM to 2:30 PM ",
              "type": " B = Beginners meeting ",
              "interest": " Living Sober"
          }
      ]
  },
  {
      "address": "252 West 46th Street, 3rd Floor,(Betw. Broadway & 8th Avenue) 10036",
      "time": [
          {
              "time": "Sundays From  2:45 PM to 3:45 PM ",
              "type": " B = Beginners meeting"
          },
          {
              "time": " Mondays From  2:45 PM to 3:45 PM ",
              "type": " B = Beginners meeting"
          },
          {
              "time": " Tuesdays From  2:45 PM to 3:45 PM ",
              "type": " B = Beginners meeting"
          },
          {
              "time": " Wednesdays From  2:45 PM to 3:45 PM ",
              "type": " B = Beginners meeting"
          },
          {
              "time": " Thursdays From  2:45 PM to 3:45 PM ",
              "type": " B = Beginners meeting"
          },
          {
              "time": " Fridays From  2:45 PM to 3:45 PM ",
              "type": " B = Beginners meeting"
          },
          {
              "time": " Saturdays From  2:45 PM to 3:45 PM ",
              "type": " B = Beginners meeting"
          }
      ]
  },
  {
      "address": "339 West 47th Street,(Betw 8th & 9th Avenues) NY 10036",
      "time": [
          {
              "time": "Wednesdays From  5:00 PM to 6:00 PM ",
              "type": " C = Closed Discussion meeting"
          }
      ]
  },
  {
      "address": "303 West 42nd St Rm 306,8th Avenue 10036",
      "time": [
          {
              "time": "Fridays From  4:30 PM to 5:30 AM ",
              "type": " Living Sober"
          },
          {
              "time": "Tuesdays From  4:30 PM to 4:30 PM ",
              "type": " BB = Big Book meeting"
          },
          {
              "time": " Wednesdays From  4:30 PM to 5:30 PM ",
              "type": " Meditation"
          },
          {
              "time": "Thursdays From  4:30 PM to 5:30 PM ",
              "type": " As Bill Sees It"
          },
          {
              "time": "Saturdays From  4:30 PM to 5:30 PM ",
              "type": " S = Step meeting"
          },
          {
              "time": " Mondays From  4:30 PM to 5:30 PM ",
              "type": " Came To Believe"
          }
      ]
  },
  {
      "address": "139 West 31st Street, 3rd Floor,(Betw. 6th & 7th Avenues) NY 10001",
      "time": [
          {
              "time": "Mondays From  12:00 PM to 1:00 PM ",
              "type": " C = Closed Discussion meeting"
          },
          {
              "time": " Wednesdays From  12:00 PM to 1:00 PM ",
              "type": " C = Closed Discussion meeting"
          },
          {
              "time": " Fridays From  12:00 PM to 1:00 PM ",
              "type": " C = Closed Discussion meeting"
          }
      ]
  },
  {
      "address": "422 West 57th Street, Upstairs,(Betw 9th & 10th Avenues) NY 10019",
      "time": [
          {
              "time": "Sundays From  5:00 PM to 5:45 PM ",
              "type": " B = Beginners meeting"
          },
          {
              "time": " Sundays From  6:00 PM to 7:00 PM ",
              "type": " OD = Open Discussion meeting"
          }
      ]
  },
  {
      "address": "211 West 30th Street,(Betw 7th & 8th Avenues, Basement) NY 10001",
      "time": [
          {
              "time": "Wednesdays From  6:00 PM to 7:00 PM ",
              "type": " C = Closed Discussion meeting"
          },
          {
              "time": " Mondays From  6:00 PM to 7:00 PM ",
              "type": " S = Step meeting"
          }
      ]
  },
  {
      "address": "252 West 46th Street, 3rd Floor,(Betw. Broadway & 8th Avenue) 10036",
      "time": [
          {
              "time": "Saturdays From  12:00 PM to 1:00 PM ",
              "type": " C = Closed Discussion meeting ",
              "interest": " Women"
          }
      ]
  },
  {
      "address": "1 West 53rd Street, 3rd Floor,(Betw. 5th & 6th Avenues) 10019",
      "time": [
          {
              "time": "Saturdays From  10:00 AM to 11:00 AM ",
              "type": " S = Step meeting"
          }
      ]
  },
  {
      "address": "422 West 57th Street,(Betw 9th & 10th Avenues) NY 10019",
      "time": [
          {
              "time": "Wednesdays From  12:00 PM to 1:00 PM ",
              "type": " B = Beginners meeting"
          },
          {
              "time": " Thursdays From  12:00 PM to 1:00 PM ",
              "type": " B = Beginners meeting"
          },
          {
              "time": " Fridays From  12:00 PM to 1:00 PM ",
              "type": " B = Beginners meeting"
          },
          {
              "time": " Mondays From  12:00 PM to 1:00 PM ",
              "type": " B = Beginners meeting"
          },
          {
              "time": " Tuesdays From  12:00 PM to 1:00 PM ",
              "type": " B = Beginners meeting"
          },
          {
              "time": " Wednesdays From  12:30 PM to 1:30 PM ",
              "type": " BB = Big Book meeting"
          },
          {
              "time": " Thursdays From  12:30 PM to 1:30 PM ",
              "type": " S = Step meeting"
          },
          {
              "time": " Fridays From  12:30 PM to 1:30 PM ",
              "type": " OD = Open Discussion meeting"
          },
          {
              "time": " Mondays From  12:30 PM to 1:30 PM ",
              "type": " OD = Open Discussion meeting"
          },
          {
              "time": " Tuesdays From  12:30 PM to 1:30 PM ",
              "type": " OD = Open Discussion meeting"
          }
      ]
  },
  {
      "address": "7 West 55th Street, 5th Floor,(@ 5th Avenue) NY 10019",
      "time": [
          {
              "time": "s From  12:00 AM to 12:00 AM"
          },
          {
              "time": " s From  12:00 AM to 12:00 AM"
          },
          {
              "time": " Wednesdays From  12:30 PM to 1:30 PM ",
              "type": " B = Beginners meeting"
          },
          {
              "time": " Wednesdays From  12:30 PM to 1:30 PM ",
              "type": " S = Step meeting"
          },
          {
              "time": " Thursdays From  12:30 PM to 1:30 PM ",
              "type": " B = Beginners meeting"
          },
          {
              "time": " Thursdays From  12:30 PM to 1:30 PM ",
              "type": " OD = Open Discussion meeting"
          },
          {
              "time": " Mondays From  12:30 PM to 1:30 PM ",
              "type": " B = Beginners meeting"
          },
          {
              "time": " Mondays From  12:30 PM to 1:30 PM ",
              "type": " OD = Open Discussion meeting"
          },
          {
              "time": " Tuesdays From  12:30 PM to 1:30 PM ",
              "type": " B = Beginners meeting"
          },
          {
              "time": " Tuesdays From  12:30 PM to 1:30 PM ",
              "type": " OD = Open Discussion meeting"
          }
      ]
  },
  {
      "address": "252 West 46th Street,(Betw Broadway & 8th Avenue) NY 10036",
      "time": [
          {
              "time": "Saturdays From  10:30 PM to 11:30 PM ",
              "type": " C = Closed Discussion meeting"
          },
          {
              "time": " Sundays From  10:30 PM to 11:30 PM ",
              "type": " C = Closed Discussion meeting"
          },
          {
              "time": " Mondays From  10:30 PM to 11:30 PM ",
              "type": " C = Closed Discussion meeting"
          },
          {
              "time": " Tuesdays From  10:30 PM to 11:30 PM ",
              "type": " C = Closed Discussion meeting"
          },
          {
              "time": " Wednesdays From  10:30 PM to 11:30 PM ",
              "type": " C = Closed Discussion meeting"
          },
          {
              "time": " Thursdays From  10:30 PM to 11:30 PM ",
              "type": " C = Closed Discussion meeting"
          },
          {
              "time": " Fridays From  10:30 PM to 11:30 PM ",
              "type": " C = Closed Discussion meeting"
          }
      ]
  },
  {
      "address": "729 7th Avenue, 10th Floor small conference room,(@ 49th Street) NY 10019",
      "time": [
          {
              "time": "Thursdays From  5:30 PM to 6:30 PM ",
              "type": " C = Closed Discussion meeting ",
              "interest": " Special Purpose Groups"
          }
      ]
  },
  {
      "address": "538 West 47th Street,(Betw 10th & 11th Avenuess) NY 10036",
      "time": [
          {
              "time": "Mondays From  8:00 PM to 9:00 PM ",
              "type": " Sp = Spanish speaking group"
          },
          {
              "time": " Wednesdays From  8:00 PM to 9:00 PM ",
              "type": " Sp = Spanish speaking group"
          },
          {
              "time": " Fridays From  8:00 PM to 9:00 PM ",
              "type": " Sp = Spanish speaking group"
          }
      ]
  },
  {
      "address": "1000 Tenth Avenue, 8th Floor (Room #8G49,(Betw 58th & 59th Streets) NY 10019",
      "time": [
          {
              "time": "Mondays From  7:30 PM to 8:30 PM ",
              "type": " OD = Open Discussion meeting"
          },
          {
              "time": " Thursdays From  7:30 PM to 8:30 PM ",
              "type": " C = Closed Discussion meeting"
          }
      ]
  },
  {
      "address": "303 West 42nd Street, 3rd Floor, Room #306,(@ Corner of 8th Avenue) NY 10036",
      "time": [
          {
              "time": "Tuesdays From  7:30 PM to 8:30 PM ",
              "type": " BB = Big Book meeting"
          }
      ]
  },
  {
      "address": "252 West 46th Street, 3rd Floor,(Betw. Broadway & 8th Avenue) 10036",
      "time": [
          {
              "time": "Mondays From  9:15 PM to 10:15 PM ",
              "type": " B = Beginners meeting"
          }
      ]
  },
  {
      "address": "307 West 26th Street,26th Street and 8th Avenue NY 10001",
      "time": [
          {
              "time": "Wednesdays From  12:00 PM to 1:00 PM ",
              "type": " S = Step meeting"
          },
          {
              "time": " Thursdays From  12:00 PM to 1:00 PM ",
              "type": " C = Closed Discussion meeting ",
              "interest": " Promises"
          },
          {
              "time": "Fridays From  12:00 PM to 1:00 PM ",
              "type": " OD = Open Discussion meeting"
          },
          {
              "time": " Mondays From  12:00 PM to 1:00 PM ",
              "type": " B = Beginners meeting"
          },
          {
              "time": " Tuesdays From  12:00 PM to 1:00 PM ",
              "type": " BB = Big Book meeting"
          }
      ]
  },
  {
      "address": "405 West 59th Street,Ninth Avenue 10019",
      "time": [
          {
              "time": "Wednesdays From  1:00 PM to 2:00 PM ",
              "type": " BB = Big Book meeting"
          }
      ]
  },
  {
      "address": "303 West 42nd Street,(Betw 8th & 9th Avenues - Room 404) 10036",
      "time": [
          {
              "time": "Sundays From  12:00 AM to 1:00 AM ",
              "type": " S = Step meeting"
          },
          {
              "time": " Mondays From  12:00 AM to 1:00 AM ",
              "type": " C = Closed Discussion meeting"
          },
          {
              "time": " Tuesdays From  12:00 AM to 1:00 AM ",
              "type": " BB = Big Book meeting"
          },
          {
              "time": " Wednesdays From  12:00 AM to 1:00 AM ",
              "type": " C = Closed Discussion meeting ",
              "interest": " Living Sober"
          },
          {
              "time": "Thursdays From  12:00 AM to 1:00 AM ",
              "type": " C = Closed Discussion meeting"
          },
          {
              "time": " Fridays From  12:00 AM to 1:00 AM ",
              "type": " B = Beginners meeting"
          },
          {
              "time": " Saturdays From  12:00 AM to 1:00 AM ",
              "type": " O = Open meeting ",
              "interest": " Eleventh Step"
          }
      ]
  },
  {
      "address": "422 W. 57th St.,(Betw. 9th and 10th Aves.), Second Floor NY 10019",
      "time": [
          {
              "time": "Mondays From  7:00 PM to 8:00 PM ",
              "type": " B = Beginners meeting"
          }
      ]
  },
  {
      "address": "133 West 46th Street, 3rd Floor,(Betw. 6th & 7th Avenues) 10036",
      "time": [
          {
              "time": "Thursdays From  6:00 AM to 7:00 AM ",
              "type": " B = Beginners meeting"
          },
          {
              "time": " Tuesdays From  6:00 AM to 7:00 AM ",
              "type": " S = Step meeting"
          }
      ]
  },
  {
      "address": "133 West 46th Street, 2nd & 3rd Floor,(Betw. 6th & 7th Avenue) NY 10036",
      "time": [
          {
              "time": "Saturdays From  10:00 AM to 11:00 AM ",
              "type": " C = Closed Discussion meeting"
          },
          {
              "time": " Mondays From  12:30 PM to 1:30 PM ",
              "type": " B = Beginners meeting"
          },
          {
              "time": " Mondays From  12:30 PM to 1:30 PM ",
              "type": " OD = Open Discussion meeting"
          },
          {
              "time": " Thursdays From  12:30 PM to 1:30 PM ",
              "type": " S = Step meeting ",
              "interest": " Steps 1-2-3"
          },
          {
              "time": "Mondays From  12:30 PM to 1:30 PM ",
              "type": " C = Closed Discussion meeting ",
              "interest": " Men"
          },
          {
              "time": "Thursdays From  12:30 PM to 1:30 PM ",
              "type": " S = Step meeting"
          },
          {
              "time": " Tuesdays From  12:30 PM to 1:30 PM ",
              "type": " B = Beginners meeting"
          },
          {
              "time": " Thursdays From  12:30 PM to 1:30 PM ",
              "type": " S = Step meeting"
          },
          {
              "time": " Tuesdays From  12:30 PM to 1:30 PM ",
              "type": " C = Closed Discussion meeting"
          },
          {
              "time": " Tuesdays From  12:30 PM to 1:30 PM ",
              "type": " S = Step meeting"
          },
          {
              "time": " Fridays From  12:30 PM to 1:30 PM ",
              "type": " B = Beginners meeting"
          },
          {
              "time": " Fridays From  12:30 PM to 1:30 PM ",
              "type": " BB = Big Book meeting"
          },
          {
              "time": " Fridays From  12:30 PM to 1:30 PM ",
              "type": " S = Step meeting"
          },
          {
              "time": " Wednesdays From  12:30 PM to 1:30 PM ",
              "type": " B = Beginners meeting"
          },
          {
              "time": " Wednesdays From  12:30 PM to 1:30 PM ",
              "type": " OD = Open Discussion meeting"
          },
          {
              "time": " Wednesdays From  12:30 PM to 1:30 PM ",
              "type": " C = Closed Discussion meeting ",
              "interest": " Women"
          },
          {
              "time": "Sundays From  5:00 PM to 6:00 PM ",
              "type": " C = Closed Discussion meeting"
          },
          {
              "time": " Wednesdays From  5:30 PM to 6:30 PM ",
              "type": " C = Closed Discussion meeting"
          },
          {
              "time": " Mondays From  5:30 PM to 6:30 PM ",
              "type": " B = Beginners meeting"
          },
          {
              "time": " Thursdays From  5:30 PM to 6:30 PM ",
              "type": " S = Step meeting"
          },
          {
              "time": " Tuesdays From  5:30 PM to 6:30 PM ",
              "type": " BB = Big Book meeting"
          },
          {
              "time": " Fridays From  5:30 PM to 6:30 PM ",
              "type": " OD = Open Discussion meeting"
          }
      ]
  },
  {
      "address": "303 West 42nd Street,  Room #306,(Betw. 8th & 9th Avenues) 10036",
      "time": [
          {
              "time": "Sundays From  10:30 AM to 11:30 AM ",
              "type": " C = Closed Discussion meeting"
          },
          {
              "time": " Mondays From  10:30 AM to 11:30 AM ",
              "type": " C = Closed Discussion meeting"
          },
          {
              "time": " Tuesdays From  10:30 AM to 11:30 AM ",
              "type": " C = Closed Discussion meeting"
          },
          {
              "time": " Wednesdays From  10:30 AM to 11:30 AM ",
              "type": " C = Closed Discussion meeting"
          },
          {
              "time": " Thursdays From  10:30 AM to 11:30 AM ",
              "type": " C = Closed Discussion meeting"
          },
          {
              "time": " Fridays From  10:30 AM to 11:30 AM ",
              "type": " C = Closed Discussion meeting"
          },
          {
              "time": " Saturdays From  10:30 AM to 11:30 AM ",
              "type": " C = Closed Discussion meeting"
          }
      ]
  },
  {
      "address": "296 9th Avenue, 2nd Floor,(Corner of West 28th Street) NY 10001",
      "time": [
          {
              "time": "Wednesdays From  6:15 PM to 7:15 PM ",
              "type": " C = Closed Discussion meeting"
          },
          {
              "time": " Mondays From  6:15 PM to 7:15 PM ",
              "type": " B = Beginners meeting"
          },
          {
              "time": " Wednesdays From  7:30 PM to 8:45 PM ",
              "type": " S = Step meeting"
          },
          {
              "time": " Mondays From  7:45 PM to 8:45 PM ",
              "type": " C = Closed Discussion meeting"
          },
          {
              "time": " Wednesdays From  9:00 PM to 10:00 PM ",
              "type": " B = Beginners meeting ",
              "interest": " First Step Workshop"
          },
          {
              "time": "Mondays From  9:00 PM to 10:00 PM ",
              "type": " O = Open meeting"
          }
      ]
  },
  {
      "address": "139 West 31st Street, 3rd Floor,(Betw 6th & 7th Avenues) NY 10001",
      "time": [
          {
              "time": "Sundays From  6:00 PM to 7:30 PM ",
              "type": " S = Step meeting"
          },
          {
              "time": " Thursdays From  6:00 PM to 7:30 PM ",
              "type": " OD = Open Discussion meeting"
          },
          {
              "time": " Saturdays From  6:00 PM to 7:30 PM ",
              "type": " OD = Open Discussion meeting"
          }
      ]
  },
  {
      "address": "1 West 53rd Street, 3rd Floor, 10019",
      "time": [
          {
              "time": "Tuesdays From  12:30 PM to 1:30 PM ",
              "type": " OD = Open Discussion meeting"
          }
      ]
  },
  {
      "address": "484 West 43rd Street, 1st Floor,@ 43rd Street & 10th Avenue NY 10036",
      "time": [
          {
              "time": "Saturdays From  7:00 PM to 8:00 PM ",
              "type": " C = Closed Discussion meeting ",
              "interest": " Promises"
          },
          {
              "time": "Mondays From  7:00 PM to 8:00 PM ",
              "type": " BB = Big Book meeting"
          },
          {
              "time": " Tuesdays From  7:00 PM to 8:00 PM ",
              "type": " S = Step meeting"
          },
          {
              "time": " Thursdays From  7:00 PM to 8:00 PM ",
              "type": " B = Beginners meeting"
          },
          {
              "time": " Fridays From  7:00 PM to 8:00 PM ",
              "type": " C = Closed Discussion meeting ",
              "interest": " Living Sober"
          }
      ]
  },
  {
      "address": "7 West 55th Street,(@ 5th Av) NY 10019",
      "time": [
          {
              "time": "Fridays From  12:30 PM to 1:30 PM ",
              "type": " OD = Open Discussion meeting"
          }
      ]
  },
  {
      "address": "252 West 46th Street, 3rd Floor,(Betw. Broadway & 8 Avenue) 10036",
      "time": [
          {
              "time": "Thursdays From  9:15 PM to 10:15 PM ",
              "type": " S = Step meeting"
          }
      ]
  },
  {
      "address": "252 West 46th Street, 3rd Floor,(Betw. Broadway & 8th Avenue) NY 10036",
      "time": [
          {
              "time": "Saturdays From  5:30 PM to 6:30 PM ",
              "type": " C = Closed Discussion meeting ",
              "interest": " Gay, Lesbian and Bisexual"
          },
          {
              "time": "Wednesdays From  5:30 PM to 6:30 PM ",
              "type": " C = Closed Discussion meeting ",
              "interest": " Gay, Lesbian and Bisexual"
          },
          {
              "time": "Sundays From  5:30 PM to 6:30 PM ",
              "type": " S = Step meeting ",
              "interest": " Gay, Lesbian and Bisexual"
          },
          {
              "time": "Thursdays From  5:30 PM to 6:30 PM ",
              "type": " C = Closed Discussion meeting ",
              "interest": " Gay, Lesbian and Bisexual"
          },
          {
              "time": "Mondays From  5:30 PM to 6:30 PM ",
              "type": " C = Closed Discussion meeting ",
              "interest": " Gay, Lesbian and Bisexual"
          },
          {
              "time": "Fridays From  5:30 PM to 6:30 PM ",
              "type": " C = Closed Discussion meeting ",
              "interest": " Gay, Lesbian and Bisexual"
          },
          {
              "time": "Tuesdays From  5:30 PM to 6:30 PM ",
              "type": " C = Closed Discussion meeting ",
              "interest": " Gay, Lesbian and Bisexual"
          },
          {
              "time": "Saturdays From  6:45 PM to 7:45 PM ",
              "type": " B = Beginners meeting ",
              "interest": " Gay, Lesbian and Bisexual"
          },
          {
              "time": "Wednesdays From  6:45 PM to 7:45 PM ",
              "type": " OD = Open Discussion meeting ",
              "interest": " Gay, Lesbian and Bisexual"
          },
          {
              "time": "Sundays From  6:45 PM to 7:45 PM ",
              "type": " C = Closed Discussion meeting ",
              "interest": " Gay, Lesbian and Bisexual"
          },
          {
              "time": "Mondays From  6:45 PM to 7:45 PM ",
              "type": " OD = Open Discussion meeting ",
              "interest": " Gay, Lesbian and Bisexual"
          },
          {
              "time": "Fridays From  6:45 PM to 7:45 PM ",
              "type": " OD = Open Discussion meeting ",
              "interest": " Gay, Lesbian and Bisexual"
          },
          {
              "time": "Tuesdays From  6:45 PM to 7:45 PM ",
              "type": " OD = Open Discussion meeting ",
              "interest": " Gay, Lesbian and Bisexual"
          },
          {
              "time": "Thursdays From  6:45 PM to 7:45 PM ",
              "type": " OD = Open Discussion meeting ",
              "interest": " H.I.V Positive"
          },
          {
              "time": "Tuesdays From  8:00 PM to 9:00 PM ",
              "type": " BB = Big Book meeting ",
              "interest": " Gay, Lesbian and Bisexual"
          },
          {
              "time": "Saturdays From  8:00 PM to 9:00 PM ",
              "type": " O = Open meeting ",
              "interest": " Gay, Lesbian and Bisexual"
          },
          {
              "time": "Sundays From  8:00 PM to 9:00 PM ",
              "type": " BB = Big Book meeting ",
              "interest": " Gay, Lesbian and Bisexual"
          },
          {
              "time": "Thursdays From  8:00 PM to 9:00 PM ",
              "type": " O = Open meeting ",
              "interest": " Gay, Lesbian and Bisexual"
          },
          {
              "time": "Mondays From  8:00 PM to 9:00 PM ",
              "type": " O = Open meeting ",
              "interest": " Gay, Lesbian and Bisexual"
          },
          {
              "time": "Fridays From  8:00 PM to 9:00 PM ",
              "type": " S = Step meeting ",
              "interest": " Gay, Lesbian and Bisexual"
          },
          {
              "time": "Wednesdays From  8:00 PM to 9:00 PM ",
              "type": " C = Closed Discussion meeting ",
              "interest": " Gay, Lesbian and Bisexual"
          }
      ]
  },
  {
      "address": "4 West 43rd Street,(Off of 5th Avenue) NY 10017",
      "time": [
          {
              "time": "Mondays From  12:30 AM to 1:30 PM ",
              "type": " C = Closed Discussion meeting"
          },
          {
              "time": " Tuesdays From  12:30 PM to 1:30 PM ",
              "type": " C = Closed Discussion meeting"
          },
          {
              "time": " Wednesdays From  12:30 PM to 1:30 PM ",
              "type": " S = Step meeting"
          },
          {
              "time": " Thursdays From  12:30 PM to 1:30 PM ",
              "type": " B = Beginners meeting"
          },
          {
              "time": " Fridays From  12:30 PM to 1:30 PM ",
              "type": " C = Closed Discussion meeting"
          }
      ]
  },
  {
      "address": "252 West 46th Street, 3rd Floor,(Betw. Broadway & 8th Avenue) 10036",
      "time": [
          {
              "time": "Saturdays From  9:15 PM to 10:15 PM ",
              "type": " S = Step meeting"
          }
      ]
  },
  {
      "address": "296 Ninth Avenue, Rectory, 1st Floor,(@28th street, Enter at 9th avenue, small building south of the church) 10001",
      "time": [
          {
              "time": "Fridays From  6:30 PM to 7:30 PM ",
              "type": " OD = Open Discussion meeting ",
              "interest": " Spiritual Workshop"
          }
      ]
  },
  {
      "address": "1 West 53rd Street, 3rd Floor,(@ 5th Avenue) NY 10019",
      "time": [
          {
              "time": "Tuesdays From  7:45 AM to 8:45 AM ",
              "type": " C = Closed Discussion meeting"
          }
      ]
  },
  {
      "address": "210 West 31st Street, Basement (On Left),(Betw. 7th & 8th Aves) NY 10001",
      "time": [
          {
              "time": "Tuesdays From  12:00 PM to 1:00 PM ",
              "type": " C = Closed Discussion meeting"
          },
          {
              "time": " Thursdays From  12:00 PM to 1:00 PM ",
              "type": " C = Closed Discussion meeting"
          }
      ]
  },
  {
      "address": "422 West 57th Street,(Betw 9th and 10th Avenue) NY 10019",
      "time": [
          {
              "time": "Wednesdays From  7:00 PM to 8:15 PM ",
              "type": " S = Step meeting"
          }
      ]
  },
  {
      "address": "252 West 46th Street, 3rd Floor,(Betw. Broadway & 8th Avenue) 10036",
      "time": [
          {
              "time": "Sundays From  9:15 PM to 10:15 PM ",
              "type": " B = Beginners meeting"
          }
      ]
  },
  {
      "address": "134 West 29th Street - 2nd floor Studio 203, 10001",
      "time": [
          {
              "time": "Tuesdays From  6:00 PM to 7:00 PM ",
              "type": " OD = Open Discussion meeting ",
              "interest": " Agnostic"
          }
      ]
  },
  {
      "address": "1000 Tenth Avenue, 8th Fl, Room #8G-49,(Betw 58th & 59th Streets) NY 10019",
      "time": [
          {
              "time": "Fridays From  7:30 PM to 8:30 PM ",
              "type": " S = Step meeting"
          }
      ]
  },
  {
      "address": "446 West 33rd Street,(Betw. 9th & 10th Avenues) NY 10001",
      "time": [
          {
              "time": "Fridays From  6:30 PM to 7:45 PM ",
              "type": " C = Closed Discussion meeting ",
              "interest": " Women"
          }
      ]
  },
  {
      "address": "423 West 46th Street,(Betw. 9th and 10th) Downstairs 10036",
      "time": [
          {
              "time": "Sundays From  7:30 PM to 8:30 PM ",
              "type": " BB = Big Book meeting"
          }
      ]
  },
  {
      "address": "252 West 46th Street, 3rd Floor,Btw. 7th & 8th Avenues @ 46th Street Clubhouse 10036",
      "time": [
          {
              "time": "Fridays From  9:15 PM to 10:15 PM ",
              "type": " BB = Big Book meeting ",
              "interest": " Young People"
          }
      ]
  },
  {
      "address": "7 East 10th Street, 2nd Floor, 10003",
      "time": [
          {
              "time": "Wednesdays From  8:15 PM to 9:15 PM ",
              "type": " C = Closed Discussion meeting"
          }
      ]
  },
  {
      "address": "155 East 22nd Street, Basement,(Betw Lexington & 3rd Avenues) NY 10010",
      "time": [
          {
              "time": "Thursdays From  12:15 PM to 1:15 PM ",
              "type": " OD = Open Discussion meeting"
          },
          {
              "time": " Fridays From  12:15 PM to 1:15 PM ",
              "type": " C = Closed Discussion meeting"
          },
          {
              "time": " Mondays From  12:15 PM to 1:15 PM ",
              "type": " BB = Big Book meeting"
          },
          {
              "time": " Tuesdays From  12:15 PM to 1:15 PM ",
              "type": " B = Beginners meeting ",
              "interest": " Living Sober"
          },
          {
              "time": "Wednesdays From  12:15 PM to 1:15 PM ",
              "type": " S = Step meeting"
          }
      ]
  },
  {
      "address": "61 Fourth Avenue, 3rd Floor,9th & 10th St 10003",
      "time": [
          {
              "time": "Thursdays From  6:00 PM to 7:15 PM ",
              "type": " Meditation"
          },
          {
              "time": "Sundays From  7:00 PM to 8:30 PM ",
              "type": " Meditation"
          }
      ]
  },
  {
      "address": "208 West 13th Street, 3rd Floor, Room #312,(Betw. 7th & 8th Avenues) NY 10011",
      "time": [
          {
              "time": "Thursdays From  12:00 PM to 1:00 PM ",
              "type": " C = Closed Discussion meeting ",
              "interest": " Agnostic"
          }
      ]
  },
  {
      "address": "123 East 15th Street,  2nd Floor Conference Room,(@ Irving Place) NY 10003",
      "time": [
          {
              "time": "Saturdays From  1:00 PM to 2:00 PM ",
              "type": " S = Step meeting"
          }
      ]
  },
  {
      "address": "61 Gramercy Park North,(Betw Park & Lexington Avenues) NY 10010",
      "time": [
          {
              "time": "Wednesdays From  6:30 PM to 7:30 PM ",
              "type": " C = Closed Discussion meeting"
          }
      ]
  },
  {
      "address": "155 East 22nd Street, Ground Floor,(Betw. Lexington & 3rd Avenues) NY 10010",
      "time": [
          {
              "time": "Wednesdays From  7:00 PM to 8:00 PM ",
              "type": " BB = Big Book meeting"
          }
      ]
  },
  {
      "address": "127 East 22nd Street, 2nd Floor Auditorium,(Betw. Lexington & Park Avenues) 10010",
      "time": [
          {
              "time": "Sundays From  7:00 PM to 8:00 PM ",
              "type": " O = Open meeting"
          }
      ]
  },
  {
      "address": "602 East 9th Street,(@ Avenue B) 10009",
      "time": [
          {
              "time": "Thursdays From  7:00 PM to 8:15 PM ",
              "type": " C = Closed Discussion meeting"
          }
      ]
  },
  {
      "address": "125 West 14th Street, Kuttner Room,(Betw. 6th & 7th Avenues) 10011",
      "time": [
          {
              "time": "Thursdays From  7:45 PM to 8:45 PM ",
              "type": " BB = Big Book meeting ",
              "interest": " Big Book Topic"
          }
      ]
  },
  {
      "address": "346 W. 20th Street,between 8th and 9th Avenue 10011",
      "time": [
          {
              "time": "Tuesdays From  8:00 AM to 9:00 AM ",
              "type": " B = Beginners meeting"
          },
          {
              "time": " Mondays From  8:00 AM to 9:00 AM ",
              "type": " OD = Open Discussion meeting"
          },
          {
              "time": " Wednesdays From  8:00 AM to 9:00 AM ",
              "type": " S = Step meeting"
          },
          {
              "time": " Thursdays From  8:00 AM to 9:00 AM ",
              "type": " BB = Big Book meeting"
          },
          {
              "time": " Fridays From  8:00 AM to 9:00 AM ",
              "type": " C = Closed Discussion meeting ",
              "interest": " Meditation"
          },
          {
              "time": "Saturdays From  8:00 AM to 9:00 AM ",
              "type": " OD = Open Discussion meeting"
          }
      ]
  },
  {
      "address": "125 West 14th Street, Ground Floor,(Betw 6th & 7th Avenues) NY 10011",
      "time": [
          {
              "time": "Tuesdays From  12:00 PM to 1:00 PM ",
              "type": " C = Closed Discussion meeting"
          },
          {
              "time": " Thursdays From  12:00 PM to 1:00 PM ",
              "type": " C = Closed Discussion meeting"
          }
      ]
  },
  {
      "address": "414 East 14th Street, Auditorium,(Betw 1st Avenue & Avenue A) NY 10009",
      "time": [
          {
              "time": "Wednesdays From  8:30 PM to 9:30 PM ",
              "type": " S = Step meeting"
          }
      ]
  },
  {
      "address": "119 Ninth Avenue,(Betw. 17th and 18th Streets), Auditorium NY 10011",
      "time": [
          {
              "time": "Mondays From  6:45 PM to 8:00 PM ",
              "type": " OD = Open Discussion meeting"
          }
      ]
  },
  {
      "address": "202 West 24 Street, Mezzanine,(between 7th and 8th Avenues) 10011",
      "time": [
          {
              "time": "Saturdays From  4:00 PM to 5:00 PM ",
              "type": " O = Open meeting"
          },
          {
              "time": " Sundays From  4:00 PM to 5:00 PM ",
              "type": " O = Open meeting"
          }
      ]
  },
  {
      "address": "28 Gramercy Park South, 1st Floor,(East 20th Street @ Irving Place) NY 10003",
      "time": [
          {
              "time": "Wednesdays From  7:00 PM to 8:00 PM ",
              "type": " C = Closed Discussion meeting"
          }
      ]
  },
  {
      "address": "50 East 7th Street, 3rd and 4th floors,@2nd Avenue NY 10003",
      "time": [
          {
              "time": "Tuesdays From  7:00 PM to 8:00 PM ",
              "type": " O = Open meeting"
          },
          {
              "time": " Saturdays From  7:00 PM to 8:00 PM ",
              "type": " B = Beginners meeting"
          },
          {
              "time": " Saturdays From  7:00 PM to 8:00 PM ",
              "type": " OD = Open Discussion meeting"
          },
          {
              "time": " Sundays From  7:00 PM to 8:00 PM ",
              "type": " BB = Big Book meeting"
          },
          {
              "time": " Tuesdays From  7:00 PM to 8:15 PM ",
              "type": " S = Step meeting"
          },
          {
              "time": " Tuesdays From  8:30 PM to 9:30 PM ",
              "type": " C = Closed Discussion meeting"
          },
          {
              "time": " Saturdays From  8:30 PM to 9:30 PM ",
              "type": " C = Closed Discussion meeting"
          }
      ]
  },
  {
      "address": "273 Bowery, 2nd Floor Classroom,(Southeast corner of Houston Street) NY 10003",
      "time": [
          {
              "time": "Wednesdays From  7:00 PM to 8:00 PM ",
              "type": " C = Closed Discussion meeting"
          }
      ]
  },
  {
      "address": "802 Broadway, 3rd Floor Conference Room,(@ 10th Street) NY 10003",
      "time": [
          {
              "time": "Mondays From  8:15 AM to 9:15 AM ",
              "type": " O = Open meeting"
          },
          {
              "time": " Tuesdays From  8:15 AM to 9:15 AM ",
              "type": " C = Closed Discussion meeting"
          },
          {
              "time": " Thursdays From  8:15 AM to 9:15 AM ",
              "type": " C = Closed Discussion meeting"
          }
      ]
  },
  {
      "address": "28 Grammercy Park South, 2nd floor,East 20th Street (between 3rd Ave. & Irving Place) NY 10010",
      "time": [
          {
              "time": "Mondays From  6:30 PM to 7:30 PM ",
              "type": " C = Closed Discussion meeting"
          },
          {
              "time": " Thursdays From  6:30 PM to 7:30 PM ",
              "type": " S = Step meeting"
          }
      ]
  },
  {
      "address": "209 East 16th Street, Basement,(Betw 3rd Avenue & Rutherford Place) 10003",
      "time": [
          {
              "time": "Mondays From  5:00 PM to 6:00 PM ",
              "type": " B = Beginners meeting"
          },
          {
              "time": " Fridays From  5:00 PM to 6:00 PM ",
              "type": " BB = Big Book meeting"
          },
          {
              "time": " Tuesdays From  5:00 PM to 6:00 PM ",
              "type": " O = Open meeting"
          },
          {
              "time": " Thursdays From  5:00 PM to 6:00 PM ",
              "type": " Meditation"
          },
          {
              "time": "Sundays From  5:00 PM to 6:00 PM ",
              "type": " O = Open meeting ",
              "interest": " Men"
          },
          {
              "time": "Wednesdays From  5:00 PM to 6:00 PM ",
              "type": " S = Step meeting"
          },
          {
              "time": " Mondays From  6:15 PM to 7:00 PM ",
              "type": " S = Step meeting ",
              "interest": " Fourth Step Workshop"
          }
      ]
  },
  {
      "address": "44 2nd Avenue, Main Floor,(Betw East 2nd & 3rd Streets) NY 10003",
      "time": [
          {
              "time": "Sundays From  8:00 PM to 9:00 PM ",
              "type": " O = Open meeting"
          }
      ]
  },
  {
      "address": "229 West 14th Street,(Betw. 7th & 8th Avenues) NY 10011",
      "time": [
          {
              "time": "Mondays From  8:00 PM to 9:00 PM ",
              "type": " C = Closed Discussion meeting"
          },
          {
              "time": " Tuesdays From  8:00 PM to 9:00 PM ",
              "type": " O = Open meeting"
          }
      ]
  },
  {
      "address": "229 West 14th Street,(Betw. 7th & 8th Avenues) NY 10011",
      "time": [
          {
              "time": "Tuesdays From  1:00 PM to 2:00 PM ",
              "type": " C = Closed Discussion meeting"
          }
      ]
  },
  {
      "address": "208 West 13th Street,(Betw 7th & 8th Avenues) NY 10011",
      "time": [
          {
              "time": "Sundays From  12:00 PM to 1:00 PM ",
              "type": " O = Open meeting ",
              "interest": " Interpreted for the Deaf"
          }
      ]
  },
  {
      "address": "28 Gramercy Park South,(@ East 20th Street & Irving Place) NY 10003",
      "time": [
          {
              "time": "Tuesdays From  7:00 PM to 8:00 PM ",
              "type": " S = Step meeting"
          }
      ]
  },
  {
      "address": "208 W 13th Street, Room 212,Between 7th Avenue & Greenwich Avenue 10001",
      "time": [
          {
              "time": "Saturdays From  8:00 PM to 9:00 PM ",
              "type": " O = Open meeting"
          }
      ]
  },
  {
      "address": "307 W. 26th St.,(at 8th Avenues) 10011",
      "time": [
          {
              "time": "Thursdays From  12:00 PM to 1:00 AM ",
              "type": " C = Closed Discussion meeting ",
              "interest": " Promises"
          },
          {
              "time": "Mondays From  12:00 PM to 1:00 PM ",
              "type": " B = Beginners meeting"
          },
          {
              "time": " Tuesdays From  12:00 PM to 1:00 PM ",
              "type": " BB = Big Book meeting"
          },
          {
              "time": " Wednesdays From  12:00 PM to 1:00 PM ",
              "type": " S = Step meeting"
          },
          {
              "time": " Fridays From  12:00 PM to 1:00 PM ",
              "type": " OD = Open Discussion meeting"
          }
      ]
  },
  {
      "address": "343 West 25th Street,downstairs 10001",
      "time": [
          {
              "time": "Mondays From  7:00 PM to 8:00 PM ",
              "type": " O = Open meeting"
          }
      ]
  },
  {
      "address": "80 St. Mark's Place, 2nd Floor,(Betw. 1st & 2nd Avenues) NY 10003",
      "time": [
          {
              "time": "Saturdays From  10:00 AM to 11:00 AM ",
              "type": " O = Open meeting"
          },
          {
              "time": " Sundays From  10:00 AM to 11:00 AM ",
              "type": " OD = Open Discussion meeting"
          },
          {
              "time": " Sundays From  10:15 AM to 11:15 AM ",
              "type": " C = Closed Discussion meeting"
          },
          {
              "time": " Thursdays From  1:00 PM to 2:00 PM ",
              "type": " S = Step meeting"
          },
          {
              "time": " Saturdays From  1:00 PM to 2:00 PM ",
              "type": " OD = Open Discussion meeting ",
              "interest": " Women"
          },
          {
              "time": "Mondays From  1:00 PM to 2:00 PM ",
              "type": " OD = Open Discussion meeting"
          },
          {
              "time": " Tuesdays From  1:00 PM to 2:00 PM ",
              "type": " O = Open meeting"
          },
          {
              "time": " Wednesdays From  1:00 PM to 2:00 PM ",
              "type": " OD = Open Discussion meeting"
          },
          {
              "time": " Fridays From  1:00 PM to 2:00 PM ",
              "type": " BB = Big Book meeting"
          },
          {
              "time": " Sundays From  2:00 PM to 3:00 PM ",
              "type": " BB = Big Book meeting"
          },
          {
              "time": " Saturdays From  5:30 PM to 6:30 PM ",
              "type": " B = Beginners meeting"
          },
          {
              "time": " Wednesdays From  6:00 PM to 7:00 PM ",
              "type": " B = Beginners meeting ",
              "interest": " Beginners Workshop"
          },
          {
              "time": "Thursdays From  7:00 PM to 8:00 PM ",
              "type": " S = Step meeting"
          },
          {
              "time": " Tuesdays From  7:00 PM to 8:00 PM ",
              "type": " S = Step meeting ",
              "interest": " Fourth Step Workshop"
          }
      ]
  },
  {
      "address": "208 West 13th Street,(Betw. 7th & 8th Avenues) NY 10011",
      "time": [
          {
              "time": "Sundays From  6:45 PM to 7:45 PM ",
              "type": " S = Step meeting ",
              "interest": " Gay, Lesbian and Bisexual"
          },
          {
              "time": "Sundays From  8:00 PM to 9:00 PM ",
              "type": " O = Open meeting ",
              "interest": " Gay, Lesbian and Bisexual"
          }
      ]
  },
  {
      "address": "51 East 25th Street, Lower Level,(Betw. Madison & Park Avenues) NY 10010",
      "time": [
          {
              "time": "Wednesdays From  10:00 AM to 11:00 AM ",
              "type": " B = Beginners meeting"
          },
          {
              "time": " Thursdays From  5:30 PM to 6:30 PM ",
              "type": " B = Beginners meeting"
          }
      ]
  },
  {
      "address": "155 East 22nd Street, Basement,Btw 3rd & Lex Avenues NY 10010",
      "time": [
          {
              "time": "Tuesdays From  7:00 PM to 8:00 PM ",
              "type": " B = Beginners meeting"
          },
          {
              "time": " Fridays From  7:00 PM to 8:15 PM ",
              "type": " S = Step meeting"
          }
      ]
  },
  {
      "address": "7 East 10th Street, 2nd Floor (Note: A photo ID is required to enter the building.),(Betw 5th Avenue & University Place) NY 10003",
      "time": [
          {
              "time": "Fridays From  12:30 PM to 1:30 PM ",
              "type": " S = Step meeting"
          },
          {
              "time": " Mondays From  12:30 PM to 1:30 PM ",
              "type": " C = Closed Discussion meeting"
          },
          {
              "time": " Tuesdays From  12:30 PM to 1:30 PM ",
              "type": " BB = Big Book meeting"
          },
          {
              "time": " Wednesdays From  12:30 PM to 1:30 PM ",
              "type": " B = Beginners meeting"
          },
          {
              "time": " Thursdays From  12:30 PM to 1:30 PM ",
              "type": " C = Closed Discussion meeting"
          },
          {
              "time": " Fridays From  2:00 PM to 3:00 PM ",
              "type": " B = Beginners meeting"
          },
          {
              "time": " Mondays From  2:00 PM to 3:00 PM ",
              "type": " C = Closed Discussion meeting ",
              "interest": " Promises"
          },
          {
              "time": "Tuesdays From  2:00 PM to 3:00 PM ",
              "type": " S = Step meeting"
          },
          {
              "time": " Wednesdays From  2:00 PM to 3:00 PM ",
              "type": " BB = Big Book meeting"
          },
          {
              "time": " Thursdays From  2:00 PM to 3:00 PM ",
              "type": " C = Closed Discussion meeting"
          }
      ]
  },
  {
      "address": "315 West 22nd Street, 1st Floor,(Betw. 8th & 9th Avenues) NY 10011",
      "time": [
          {
              "time": "Thursdays From  8:00 PM to 9:00 PM ",
              "type": " OD = Open Discussion meeting ",
              "interest": " Young People"
          }
      ]
  },
  {
      "address": "15 Rutherford Place, Basement,(Betw 2nd & 3rd Avenues) NY 10003",
      "time": [
          {
              "time": "Fridays From  7:00 PM to 8:00 PM ",
              "type": " B = Beginners meeting"
          },
          {
              "time": " Mondays From  7:00 PM to 8:30 PM ",
              "type": " S = Step meeting"
          },
          {
              "time": " Fridays From  8:30 PM to 9:30 PM ",
              "type": " C = Closed Discussion meeting"
          }
      ]
  },
  {
      "address": "All meetings are non-smoking.25 East 15th- Conference Room H, 10003",
      "time": [
          {
              "time": "Wednesdays From  8:00 PM to 9:00 PM ",
              "type": " S = Step meeting"
          }
      ]
  },
  {
      "address": "175 9th Avenue, 1st and 2nd Floor,(Enter thru gate on 21st Street Betw. 9th & 10th Avenues) NY 10011",
      "time": [
          {
              "time": "Fridays From  6:00 PM to 7:00 PM ",
              "type": " B = Beginners meeting"
          },
          {
              "time": " Fridays From  6:00 PM to 7:00 PM ",
              "type": " C = Closed Discussion meeting"
          },
          {
              "time": " Fridays From  6:00 PM to 7:00 PM ",
              "type": " OD = Open Discussion meeting ",
              "interest": " Eleventh Step Meditation"
          },
          {
              "time": "Fridays From  7:15 PM to 8:15 PM ",
              "type": " BB = Big Book meeting"
          },
          {
              "time": " Fridays From  7:15 PM to 8:15 PM ",
              "type": " C = Closed Discussion meeting ",
              "interest": " H.I.V Positive"
          },
          {
              "time": "Fridays From  7:15 PM to 8:15 PM ",
              "type": " C = Closed Discussion meeting"
          },
          {
              "time": " Fridays From  7:15 PM to 8:15 PM ",
              "type": " O = Open meeting"
          },
          {
              "time": " Fridays From  8:30 PM to 9:30 PM ",
              "type": " C = Closed Discussion meeting"
          }
      ]
  },
  {
      "address": "19 Union Square West, 7th Floor, Conference Room B,(Betw. 5th Avenue & Broadway) 10003",
      "time": [
          {
              "time": "Tuesdays From  8:00 PM to 9:00 PM ",
              "type": " C = Closed Discussion meeting ",
              "interest": " Women"
          }
      ]
  },
  {
      "address": "155 East 22nd Street, 1st Floor,(Between Lexington & 3rd Avenues) NY 10010",
      "time": [
          {
              "time": "Mondays From  6:45 PM to 7:45 PM ",
              "type": " B = Beginners meeting ",
              "interest": " Men"
          },
          {
              "time": "Mondays From  6:45 PM to 7:45 PM ",
              "type": " BB = Big Book meeting ",
              "interest": " Men"
          },
          {
              "time": "Tuesdays From  6:45 PM to 7:45 PM ",
              "type": " S = Step meeting ",
              "interest": " Men"
          },
          {
              "time": "Thursdays From  6:45 PM to 7:45 PM ",
              "type": " C = Closed Discussion meeting ",
              "interest": " Men"
          },
          {
              "time": "Tuesdays From  6:45 PM to 7:45 PM ",
              "type": " C = Closed Discussion meeting ",
              "interest": " Men"
          }
      ]
  },
  {
      "address": "423 East 23rd Street, 3rd fl, Conference Room 3076 south,(@ Main entrance is East of 1st Avenue) 10010",
      "time": [
          {
              "time": "Saturdays From  9:00 PM to 10:00 PM ",
              "type": " OD = Open Discussion meeting"
          }
      ]
  },
  {
      "address": "209 East 16th Street, Olmstead Hall,(Betw 3rd Avenue & Rutherford Place) NY 10003",
      "time": [
          {
              "time": "Mondays From  6:00 PM to 6:00 PM ",
              "type": " O = Open meeting"
          },
          {
              "time": " Tuesdays From  6:00 PM to 7:00 PM ",
              "type": " S = Step meeting"
          },
          {
              "time": " Wednesdays From  6:00 PM to 7:00 PM ",
              "type": " BB = Big Book meeting"
          },
          {
              "time": " Thursdays From  6:00 PM to 7:00 PM ",
              "type": " C = Closed Discussion meeting"
          },
          {
              "time": " Fridays From  6:00 PM to 7:00 PM ",
              "type": " B = Beginners meeting"
          }
      ]
  },
  {
      "address": "411 East 12th Street,(Between 1st Avenue & Avenue A) 10009",
      "time": [
          {
              "time": "Sundays From  1:30 PM to 2:30 PM ",
              "type": " OD = Open Discussion meeting"
          }
      ]
  },
  {
      "address": "209 East 16th Street,(Betw 3rd Avenue & Rutherford Place NY 10003",
      "time": [
          {
              "time": "Saturdays From  10:30 AM to 11:30 AM ",
              "type": " B = Beginners meeting"
          },
          {
              "time": " Saturdays From  10:30 AM to 11:30 AM ",
              "type": " BB = Big Book meeting"
          }
      ]
  },
  {
      "address": "239 East 21st Street, Church Rectory,(Betw. 2nd & 3rd Avenues) 10009",
      "time": [
          {
              "time": "Saturdays From  10:00 AM to 11:00 AM ",
              "type": " C = Closed Discussion meeting"
          }
      ]
  },
  {
      "address": "12 West 12th Street, 6th Floor-Roof Level,(Betw. 5th & 6th Avenues) NY 10011",
      "time": [
          {
              "time": "Fridays From  6:30 PM to 7:45 PM ",
              "type": " B = Beginners meeting ",
              "interest": " Women"
          },
          {
              "time": "Tuesdays From  7:15 PM to 8:30 PM ",
              "type": " C = Closed Discussion meeting ",
              "interest": " Women"
          }
      ]
  },
  {
      "address": "44 2nd Avenue,(Betw. East 2nd & 3rd Streets) NY 10003",
      "time": [
          {
              "time": "Sundays From  5:00 PM to 6:00 PM ",
              "type": " C = Closed Discussion meeting"
          }
      ]
  },
  {
      "address": "208 West 13th Street,(Betw 7th & 8th Avenues) NY 10011",
      "time": [
          {
              "time": "Saturdays From  9:30 PM to 10:30 PM ",
              "type": " OD = Open Discussion meeting ",
              "interest": " Special Purpose Groups"
          }
      ]
  },
  {
      "address": "12 West 11th Street,  Ground Floor,(Betw 5th Avenue & Avenue of the Americas) NY 10011",
      "time": [
          {
              "time": "Mondays From  7:30 AM to 8:30 AM ",
              "type": " B = Beginners meeting"
          },
          {
              "time": " Tuesdays From  7:30 AM to 8:30 AM ",
              "type": " S = Step meeting"
          },
          {
              "time": " Wednesdays From  7:30 AM to 8:30 AM ",
              "type": " C = Closed Discussion meeting"
          },
          {
              "time": " Thursdays From  7:30 AM to 8:30 AM ",
              "type": " BB = Big Book meeting"
          },
          {
              "time": " Fridays From  7:30 AM to 8:30 AM ",
              "type": " OD = Open Discussion meeting"
          },
          {
              "time": " Saturdays From  7:30 AM to 8:30 AM ",
              "type": " S = Step meeting"
          }
      ]
  },
  {
      "address": "116 West 11th Street, 10011",
      "time": [
          {
              "time": "Fridays From  7:00 PM to 8:00 PM ",
              "type": " O = Open meeting"
          }
      ]
  },
  {
      "address": "80 5th Avenue, 14th Floor, Room #1408C,(@ 14th Street) 10011",
      "time": [
          {
              "time": "Saturdays From  6:15 PM to 7:15 PM ",
              "type": " C = Closed Discussion meeting"
          }
      ]
  },
  {
      "address": "116 W. 11th Street, Cafeteria,(Between 6th and 7th Avenues) NY 10011",
      "time": [
          {
              "time": "Sundays From  6:00 PM to 7:00 PM ",
              "type": " BB = Big Book meeting"
          }
      ]
  },
  {
      "address": "155 East 22nd Street,Between Lexington Avenue and Third Avenue 10010",
      "time": [
          {
              "time": "Sundays From  9:00 AM to 10:00 AM ",
              "type": " C = Closed Discussion meeting ",
              "interest": " Meditation"
          }
      ]
  },
  {
      "address": "319 Eastr 24th Street,Between First aqnd Second Avenues NY 10010",
      "time": [
          {
              "time": "Sundays From  12:30 PM to 1:30 PM ",
              "type": " OD = Open Discussion meeting"
          }
      ]
  },
  {
      "address": "10 East Union Square, 4th Floor, Conf.Rm.#4A18,(@14th Street) Enter thru Room 4A to go to #4A18 10003",
      "time": [
          {
              "time": "Tuesdays From  7:00 PM to 8:00 PM ",
              "type": " OD = Open Discussion meeting ",
              "interest": " Special Purpose Groups"
          }
      ]
  },
  {
      "address": "206-208 East 11th Street,(Btw. 2nd & 3rd Avenues), Ground Floor 10003",
      "time": [
          {
              "time": "Sundays From  7:00 PM to 8:00 PM ",
              "type": " C = Closed Discussion meeting ",
              "interest": " As Bill Sees It"
          },
          {
              "time": "Mondays From  7:00 PM to 8:15 PM ",
              "type": " B = Beginners meeting"
          },
          {
              "time": " Tuesdays From  9:00 PM to 10:00 PM ",
              "type": " OD = Open Discussion meeting"
          }
      ]
  },
  {
      "address": "123 East 15th Street, 2nd Floor,(@ Irving Place) NY 10003",
      "time": [
          {
              "time": "Fridays From  7:30 PM to 8:30 PM ",
              "type": " B = Beginners meeting"
          },
          {
              "time": " Fridays From  7:30 PM to 8:30 PM ",
              "type": " OD = Open Discussion meeting"
          },
          {
              "time": " Sundays From  8:30 PM to 9:30 PM ",
              "type": " O = Open meeting"
          },
          {
              "time": " Fridays From  8:45 PM to 9:45 PM ",
              "type": " S = Step meeting"
          }
      ]
  },
  {
      "address": "411 East 12th Street, Basement,(Betw 1st Avenue & Avenue A) 10009",
      "time": [
          {
              "time": "s From  12:00 AM to 12:00 AM"
          },
          {
              "time": " Wednesdays From  6:15 AM to 7:15 AM ",
              "type": " C = Closed Discussion meeting"
          },
          {
              "time": " Thursdays From  7:30 AM to 8:30 AM ",
              "type": " OD = Open Discussion meeting"
          },
          {
              "time": " Wednesdays From  7:30 AM to 8:30 AM ",
              "type": " S = Step meeting"
          },
          {
              "time": " Tuesdays From  7:30 AM to 8:30 AM ",
              "type": " OD = Open Discussion meeting"
          },
          {
              "time": " Mondays From  7:30 AM to 8:30 AM ",
              "type": " OD = Open Discussion meeting"
          },
          {
              "time": " Saturdays From  7:30 AM to 8:30 AM ",
              "type": " C = Closed Discussion meeting"
          },
          {
              "time": " Fridays From  7:30 AM to 8:30 AM ",
              "type": " OD = Open Discussion meeting"
          },
          {
              "time": " Sundays From  7:30 AM to 8:30 AM ",
              "type": " S = Step meeting"
          },
          {
              "time": " Saturdays From  9:00 AM to 10:00 AM ",
              "type": " OD = Open Discussion meeting"
          },
          {
              "time": " Sundays From  9:30 AM to 10:30 AM ",
              "type": " OD = Open Discussion meeting"
          },
          {
              "time": " Fridays From  10:00 AM to 11:00 AM ",
              "type": " OD = Open Discussion meeting"
          },
          {
              "time": " Thursdays From  10:00 AM to 11:00 AM ",
              "type": " BB = Big Book meeting"
          },
          {
              "time": " Wednesdays From  10:00 AM to 11:00 AM ",
              "type": " OD = Open Discussion meeting"
          },
          {
              "time": " Tuesdays From  10:00 AM to 11:00 AM ",
              "type": " OD = Open Discussion meeting"
          },
          {
              "time": " Mondays From  10:00 AM to 11:00 AM ",
              "type": " S = Step meeting ",
              "interest": " Steps 1-2-3"
          },
          {
              "time": "Saturdays From  10:30 AM to 11:30 AM ",
              "type": " S = Step meeting"
          },
          {
              "time": " Sundays From  11:00 AM to 12:00 PM ",
              "type": " BB = Big Book meeting"
          },
          {
              "time": " Mondays From  11:15 AM to 12:15 PM ",
              "type": " BB = Big Book meeting"
          },
          {
              "time": " Fridays From  12:30 PM to 1:30 PM ",
              "type": " OD = Open Discussion meeting"
          },
          {
              "time": " Thursdays From  12:30 PM to 1:30 PM ",
              "type": " B = Beginners meeting"
          },
          {
              "time": " Wednesdays From  12:30 PM to 1:30 PM ",
              "type": " B = Beginners meeting"
          },
          {
              "time": " Tuesdays From  12:30 PM to 1:30 PM ",
              "type": " BB = Big Book meeting"
          },
          {
              "time": " Mondays From  12:30 PM to 1:30 PM ",
              "type": " S = Step meeting"
          },
          {
              "time": " Saturdays From  1:15 PM to 2:15 PM ",
              "type": " C = Closed Discussion meeting ",
              "interest": " Sponsorship Workshop"
          },
          {
              "time": "Sundays From  1:30 PM to 2:30 PM ",
              "type": " OD = Open Discussion meeting"
          },
          {
              "time": " Mondays From  2:00 PM to 3:00 PM ",
              "type": " S = Step meeting"
          },
          {
              "time": " Fridays From  2:00 PM to 3:00 PM ",
              "type": " S = Step meeting"
          },
          {
              "time": " Thursdays From  2:00 PM to 3:00 PM ",
              "type": " OD = Open Discussion meeting"
          },
          {
              "time": " Wednesdays From  2:00 PM to 3:00 PM ",
              "type": " O = Open meeting"
          },
          {
              "time": " Tuesdays From  2:00 PM to 3:00 PM ",
              "type": " OD = Open Discussion meeting"
          },
          {
              "time": " Saturdays From  2:30 PM to 3:30 PM ",
              "type": " B = Beginners meeting"
          },
          {
              "time": " Sundays From  3:00 PM to 4:00 PM ",
              "type": " S = Step meeting ",
              "interest": " Fourth Step Workshop"
          },
          {
              "time": "Mondays From  4:00 PM to 5:00 PM ",
              "type": " OD = Open Discussion meeting"
          },
          {
              "time": " Fridays From  4:00 PM to 5:00 PM ",
              "type": " OD = Open Discussion meeting"
          },
          {
              "time": " Thursdays From  4:00 PM to 5:00 PM ",
              "type": " OD = Open Discussion meeting"
          },
          {
              "time": " Wednesdays From  4:00 PM to 5:00 PM ",
              "type": " OD = Open Discussion meeting"
          },
          {
              "time": " Tuesdays From  4:00 PM to 5:00 PM ",
              "type": " OD = Open Discussion meeting"
          },
          {
              "time": " Saturdays From  4:30 PM to 5:30 PM ",
              "type": " OD = Open Discussion meeting"
          },
          {
              "time": " Sundays From  4:30 PM to 5:30 PM ",
              "type": " OD = Open Discussion meeting"
          },
          {
              "time": " Mondays From  5:30 PM to 6:30 PM ",
              "type": " C = Closed Discussion meeting"
          },
          {
              "time": " Fridays From  5:30 PM to 6:30 PM ",
              "type": " S = Step meeting"
          },
          {
              "time": " Thursdays From  5:30 PM to 6:30 PM ",
              "type": " O = Open meeting"
          },
          {
              "time": " Wednesdays From  5:30 PM to 6:30 PM ",
              "type": " OD = Open Discussion meeting"
          },
          {
              "time": " Tuesdays From  5:30 PM to 6:30 PM ",
              "type": " S = Step meeting ",
              "interest": " First Step Workshop"
          },
          {
              "time": "Saturdays From  6:00 PM to 7:00 PM ",
              "type": " B = Beginners meeting"
          },
          {
              "time": " Sundays From  6:00 PM to 7:00 PM ",
              "type": " OD = Open Discussion meeting ",
              "interest": " Gay Men"
          },
          {
              "time": "Tuesdays From  7:00 PM to 8:00 AM ",
              "type": " S = Step meeting"
          },
          {
              "time": " Mondays From  7:00 PM to 8:00 PM ",
              "type": " T = Tradition meeting"
          },
          {
              "time": " Fridays From  7:00 PM to 8:00 PM ",
              "type": " S = Step meeting"
          },
          {
              "time": " Thursdays From  7:00 PM to 8:00 PM ",
              "type": " BB = Big Book meeting"
          },
          {
              "time": " Wednesdays From  7:00 PM to 8:00 PM ",
              "type": " C = Closed Discussion meeting"
          },
          {
              "time": " Sundays From  7:30 PM to 8:30 PM ",
              "type": " S = Step meeting"
          },
          {
              "time": " Saturdays From  8:00 PM to 9:00 PM ",
              "type": " C = Closed Discussion meeting ",
              "interest": " Promises"
          },
          {
              "time": "Mondays From  8:15 PM to 9:15 PM ",
              "type": " OD = Open Discussion meeting"
          },
          {
              "time": " Thursdays From  8:15 PM to 9:15 PM ",
              "type": " C = Closed Discussion meeting ",
              "interest": " Women"
          },
          {
              "time": "Wednesdays From  8:30 PM to 9:30 PM ",
              "type": " S = Step meeting"
          },
          {
              "time": " Tuesdays From  8:30 PM to 9:30 PM ",
              "type": " C = Closed Discussion meeting ",
              "interest": " Living Sober"
          },
          {
              "time": "Fridays From  8:30 PM to 9:30 PM ",
              "type": " B = Beginners meeting ",
              "interest": " First Step Workshop"
          }
      ]
  },
  {
      "address": "125 West 14th Street, 1st Floor Meeting Room,(Betw. 6th & 7th Avenues) NY 10011",
      "time": [
          {
              "time": "Fridays From  7:00 PM to 8:00 PM ",
              "type": " B = Beginners meeting"
          }
      ]
  },
  {
      "address": "208 West 13th Street,betw. 7th Ave and Greenwich Ave. 10011",
      "time": [
          {
              "time": "Sundays From  4:00 PM to 5:00 PM ",
              "type": " C = Closed Discussion meeting"
          }
      ]
  },
  {
      "address": "10 Union Square East, 2nd Floor, Conference Room #3,(Betw. 14th & 15th Streets @ 4th Avenue) NY 10003",
      "time": [
          {
              "time": "Fridays From  6:00 PM to 7:00 PM ",
              "type": " S = Step meeting"
          }
      ]
  },
  {
      "address": "155 West 22nd Street, 1st Floor,(Betw. 6th & 7th Avenues) 10011",
      "time": [
          {
              "time": "Sundays From  12:45 PM to 1:45 PM ",
              "type": " S = Step meeting ",
              "interest": " Eleventh Step"
          }
      ]
  },
  {
      "address": "208 West 13th Street,(Betw 7th & 8th Avenues) NY 10011",
      "time": [
          {
              "time": "Sundays From  4:00 PM to 5:00 PM ",
              "type": " C = Closed Discussion meeting ",
              "interest": " Agnostic"
          },
          {
              "time": "Sundays From  5:30 PM to 6:30 PM ",
              "type": " S = Step meeting ",
              "interest": " Agnostic"
          }
      ]
  },
  {
      "address": "12 West 12th Street, Third Floor,(at 5th Avenue between 11th and 12th Streets) NY 10011",
      "time": [
          {
              "time": "Tuesdays From  6:30 PM to 7:30 PM ",
              "type": " OD = Open Discussion meeting"
          }
      ]
  },
  {
      "address": "20 Washington Square North, 2nd Floor,5th Avenue & MacDougal Street 10011",
      "time": [
          {
              "time": "Thursdays From  3:30 PM to 4:30 PM ",
              "type": " C = Closed Discussion meeting"
          }
      ]
  },
  {
      "address": "344 East 14th Street,(Betw. 1st & 2nd Avenues) 10003",
      "time": [
          {
              "time": "Sundays From  10:00 AM to 11:00 AM ",
              "type": " S = Step meeting"
          }
      ]
  },
  {
      "address": "155 West 22nd Street, 1st Floor,(Off of 7th Avenue) NY 10011",
      "time": [
          {
              "time": "Tuesdays From  6:00 PM to 7:00 PM ",
              "type": " C = Closed Discussion meeting"
          }
      ]
  },
  {
      "address": "208 West 13th Street,(Betw. 7th & 8th Avenues) NY 10011",
      "time": [
          {
              "time": "Tuesdays From  7:30 PM to 8:30 PM ",
              "type": " OD = Open Discussion meeting ",
              "interest": " Gay, Lesbian and Bisexual"
          },
          {
              "time": "Thursdays From  9:00 PM to 10:00 PM ",
              "type": " OD = Open Discussion meeting ",
              "interest": " Gay, Lesbian and Bisexual"
          }
      ]
  },
  {
      "address": "602 East 9th Street, Ground Floor,(@ Avenue B) 10009",
      "time": [
          {
              "time": "Tuesdays From  7:30 PM to 8:30 PM ",
              "type": " BB = Big Book meeting"
          }
      ]
  },
  {
      "address": "208 West 13th Street,(Betw 7th & 8th Avenues) NY 10011",
      "time": [
          {
              "time": "Tuesdays From  6:00 PM to 7:00 PM ",
              "type": " C = Closed Discussion meeting"
          }
      ]
  },
  {
      "address": "208 West 13th Street,(Betw 7th & 8th Avenues) NY 10011",
      "time": [
          {
              "time": "Saturdays From  6:00 PM to 7:00 PM ",
              "type": " C = Closed Discussion meeting ",
              "interest": " Lesbian"
          }
      ]
  },
  {
      "address": "19 Union Square West, 7th Floor, Ask for room #.,(Enter on 15th Street) NY 10003",
      "time": [
          {
              "time": "Saturdays From  11:00 AM to 12:00 PM ",
              "type": " C = Closed Discussion meeting"
          }
      ]
  },
  {
      "address": "173 East 3rd Street- basement,between Avenues A and B 10009",
      "time": [
          {
              "time": "Mondays From  7:00 PM to 8:00 PM ",
              "type": " OD = Open Discussion meeting ",
              "interest": " AA Literature"
          }
      ]
  },
  {
      "address": "50 East 7th Street,(Betw 1st & 2nd Avenue) NY 10003",
      "time": [
          {
              "time": "Fridays From  8:00 PM to 9:30 PM ",
              "type": " C = Closed Discussion meeting ",
              "interest": " Young People"
          }
      ]
  },
  {
      "address": "207 West 96th Street, Basement,(Betw. Amsterdam Avenue & Bway.) NY 10025",
      "time": [
          {
              "time": "Mondays From  3:00 PM to 4:00 PM ",
              "type": " C = Closed Discussion meeting ",
              "interest": " As Bill Sees It"
          },
          {
              "time": "Wednesdays From  3:00 PM to 4:00 PM ",
              "type": " C = Closed Discussion meeting ",
              "interest": " Living Sober"
          }
      ]
  },
  {
      "address": "120 West 69th Street, Basement,(Betw Columbus Avenue & Bway) NY 10023",
      "time": [
          {
              "time": "Fridays From  7:45 PM to 8:45 PM ",
              "type": " OD = Open Discussion meeting"
          },
          {
              "time": " Fridays From  9:00 PM to 10:00 PM ",
              "type": " BB = Big Book meeting"
          }
      ]
  },
  {
      "address": "422 West 57th Street,(Betw 9th and 10th Ave) NY 10023",
      "time": [
          {
              "time": "Tuesdays From  6:30 PM to 7:45 PM ",
              "type": " C = Closed Discussion meeting"
          }
      ]
  },
  {
      "address": "The group's focus is on long-term sobriety; but all A.A. members are welcome.164 West 74th Street, 1st floor, 10023",
      "time": [
          {
              "time": "Thursdays From  6:30 PM to 7:30 PM ",
              "type": " C = Closed Discussion meeting ",
              "interest": " AA Literature"
          }
      ]
  },
  {
      "address": "207 West 96th Street, Little Room Basement,(Betw. Amsterdam Avenue & Bway.) NY 10025",
      "time": [
          {
              "time": "Fridays From  9:30 PM to 10:30 PM ",
              "type": " OD = Open Discussion meeting"
          }
      ]
  },
  {
      "address": "144 West 90th Street, Basement,(Betw. Columbus & Amsterdam Avenues) NY 10024",
      "time": [
          {
              "time": "Saturdays From  1:00 PM to 2:30 PM ",
              "type": " B = Beginners meeting"
          },
          {
              "time": " Saturdays From  2:30 PM to 4:00 PM ",
              "type": " O = Open meeting"
          },
          {
              "time": " Mondays From  4:00 PM to 5:30 PM ",
              "type": " BB = Big Book meeting"
          },
          {
              "time": " Tuesdays From  4:00 PM to 5:30 PM ",
              "type": " OD = Open Discussion meeting"
          },
          {
              "time": " Wednesdays From  4:00 PM to 5:30 PM ",
              "type": " O = Open meeting ",
              "interest": " Living Sober"
          },
          {
              "time": "Fridays From  4:00 PM to 5:30 PM ",
              "type": " S = Step meeting"
          }
      ]
  },
  {
      "address": "141 West 73rd Street,(Betw Columbus & Amsterdam Avenues) NY 10023",
      "time": [
          {
              "time": "Mondays From  7:00 PM to 8:00 PM ",
              "type": " C = Closed Discussion meeting"
          }
      ]
  },
  {
      "address": "4 West 76th Street. Meeting in the gym.,(Between Central Park West & Columbus Avenue) NY 10023",
      "time": [
          {
              "time": "Fridays From  7:00 PM to 8:00 PM ",
              "type": " S = Step meeting"
          }
      ]
  },
  {
      "address": "221 West 107th Street, Basement,(Betw. Amsterdam Avenue & Bway ) NY 10025",
      "time": [
          {
              "time": "Tuesdays From  6:15 PM to 7:15 PM ",
              "type": " S = Step meeting"
          },
          {
              "time": " Tuesdays From  7:30 PM to 8:30 PM ",
              "type": " B = Beginners meeting"
          }
      ]
  },
  {
      "address": "207 West 96th Street, Basement, Little Room,(Btw. Amsterdam & Broadway) NY 10025",
      "time": [
          {
              "time": "Mondays From  7:30 PM to 8:30 PM ",
              "type": " BB = Big Book meeting"
          },
          {
              "time": " Fridays From  7:30 PM to 8:30 PM ",
              "type": " O = Open meeting"
          }
      ]
  },
  {
      "address": "215 West 82nd Street,(Betw Amsterdam Avenue & Bway) NY 10024",
      "time": [
          {
              "time": "Thursdays From  7:00 PM to 8:00 PM ",
              "type": " OD = Open Discussion meeting ",
              "interest": " Men"
          }
      ]
  },
  {
      "address": "601 West 114th Street, (2nd Red Door), NY 10025",
      "time": [
          {
              "time": "Tuesdays From  12:30 PM to 1:30 PM ",
              "type": " C = Closed Discussion meeting"
          },
          {
              "time": " Thursdays From  12:30 PM to 1:30 PM ",
              "type": " C = Closed Discussion meeting"
          }
      ]
  },
  {
      "address": "Central Park West & 76th Street - basement gymnasium,enter on 76th Street NY 10023",
      "time": [
          {
              "time": "Tuesdays From  8:15 PM to 9:30 PM ",
              "type": " C = Closed Discussion meeting"
          }
      ]
  },
  {
      "address": "5 West 63rd Street, Downstairs in large meeting room.,(Betw. Central Park West & Broadway) 10023",
      "time": [
          {
              "time": "Mondays From  7:30 PM to 8:45 PM ",
              "type": " O = Open meeting"
          },
          {
              "time": " Mondays From  9:00 PM to 10:00 PM ",
              "type": " B = Beginners meeting"
          },
          {
              "time": " Mondays From  10:15 PM to 11:15 PM ",
              "type": " C = Closed Discussion meeting ",
              "interest": " Topic"
          }
      ]
  },
  {
      "address": "4 West 76th Street, (In the gym),(Betw Columbus Avenue & Central Park West 10023",
      "time": [
          {
              "time": "Fridays From  6:30 PM to 7:30 PM ",
              "type": " C = Closed Discussion meeting"
          }
      ]
  },
  {
      "address": "160 Central Park West, Gym basement.,(@ 76th Street) NY 10023",
      "time": [
          {
              "time": "Sundays From  6:00 PM to 7:00 PM ",
              "type": " B = Beginners meeting"
          }
      ]
  },
  {
      "address": "152 West 66th Street, Basement Level Chapel,(Betw. Broadway & Amsterdam Avenue) NY 10023",
      "time": [
          {
              "time": "Sundays From  6:15 PM to 7:45 PM ",
              "type": " S = Step meeting ",
              "interest": " Twelve Steps"
          }
      ]
  },
  {
      "address": "3 West 95th Street, Lower Level Auditorium,(Betw Central Park West & Columbus Avenue) NY 10025",
      "time": [
          {
              "time": "Saturdays From  5:00 PM to 6:00 PM ",
              "type": " C = Closed Discussion meeting ",
              "interest": " Children Welcome"
          },
          {
              "time": "Sundays From  5:00 PM to 6:00 PM ",
              "type": " C = Closed Discussion meeting ",
              "interest": " Children Welcome"
          },
          {
              "time": "Fridays From  7:00 PM to 8:00 PM ",
              "type": " C = Closed Discussion meeting ",
              "interest": " Topic"
          }
      ]
  },
  {
      "address": "All meetings are non-smoking.251 West 80th Street, 10024",
      "time": [
          {
              "time": "Fridays From  7:30 PM to 8:45 PM ",
              "type": " C = Closed Discussion meeting"
          }
      ]
  },
  {
      "address": "111 West 71st Street,@ Columbus Avenue NY 10023",
      "time": [
          {
              "time": "Fridays From  7:00 AM to 8:00 AM ",
              "type": " C = Closed Discussion meeting"
          },
          {
              "time": " Mondays From  7:00 AM to 8:00 AM ",
              "type": " C = Closed Discussion meeting"
          },
          {
              "time": " Tuesdays From  7:00 AM to 8:00 AM ",
              "type": " C = Closed Discussion meeting"
          },
          {
              "time": " Wednesdays From  7:00 AM to 8:00 AM ",
              "type": " C = Closed Discussion meeting"
          },
          {
              "time": " Thursdays From  7:00 AM to 8:00 AM ",
              "type": " S = Step meeting"
          },
          {
              "time": " Fridays From  8:15 AM to 9:15 AM ",
              "type": " C = Closed Discussion meeting"
          },
          {
              "time": " Mondays From  8:15 AM to 9:15 AM ",
              "type": " C = Closed Discussion meeting"
          },
          {
              "time": " Tuesdays From  8:15 AM to 9:15 AM ",
              "type": " C = Closed Discussion meeting"
          },
          {
              "time": " Wednesdays From  8:15 AM to 9:15 AM ",
              "type": " C = Closed Discussion meeting"
          },
          {
              "time": " Thursdays From  8:15 AM to 9:15 AM ",
              "type": " C = Closed Discussion meeting"
          }
      ]
  },
  {
      "address": "5 West 63rd Street, 1st Floor,(Betw CPW & Bway) 10023",
      "time": [
          {
              "time": "Sundays From  8:00 AM to 9:00 AM ",
              "type": " C = Closed Discussion meeting"
          },
          {
              "time": " Saturdays From  8:00 AM to 9:00 AM ",
              "type": " C = Closed Discussion meeting"
          }
      ]
  },
  {
      "address": "5 West 63rd Street,(Betw Central Park West & Broadway) 10023",
      "time": [
          {
              "time": "Saturdays From  10:30 AM to 11:30 AM ",
              "type": " S = Step meeting ",
              "interest": " First Step Workshop"
          },
          {
              "time": "Sundays From  12:30 PM to 1:30 PM ",
              "type": " B = Beginners meeting"
          },
          {
              "time": " Saturdays From  12:30 PM to 1:30 PM ",
              "type": " S = Step meeting"
          }
      ]
  },
  {
      "address": "207 West 96th Street, Basement, Little Room,(Betw. Amsterdam Avenue & Broadway) NY 10025",
      "time": [
          {
              "time": "Mondays From  6:00 AM to 7:00 AM ",
              "type": " OD = Open Discussion meeting ",
              "interest": " As Bill Sees It"
          },
          {
              "time": "Wednesdays From  6:00 AM to 7:00 AM ",
              "type": " OD = Open Discussion meeting"
          },
          {
              "time": " Saturdays From  6:00 AM to 7:00 AM ",
              "type": " OD = Open Discussion meeting ",
              "interest": " As Bill Sees It"
          },
          {
              "time": "Thursdays From  6:00 AM to 7:00 AM ",
              "type": " S = Step meeting ",
              "interest": " As Bill Sees It"
          },
          {
              "time": "Sundays From  6:00 AM to 7:00 AM ",
              "type": " OD = Open Discussion meeting ",
              "interest": " As Bill Sees It"
          },
          {
              "time": "Tuesdays From  6:00 AM to 7:00 AM ",
              "type": " OD = Open Discussion meeting ",
              "interest": " As Bill Sees It"
          },
          {
              "time": "Fridays From  6:00 AM to 7:00 AM ",
              "type": " BB = Big Book meeting"
          },
          {
              "time": " Fridays From  7:15 AM to 8:15 AM ",
              "type": " C = Closed Discussion meeting"
          },
          {
              "time": " Wednesdays From  7:15 AM to 8:15 AM ",
              "type": " C = Closed Discussion meeting"
          },
          {
              "time": " Saturdays From  7:15 AM to 8:15 AM ",
              "type": " S = Step meeting"
          },
          {
              "time": " Mondays From  7:15 AM to 8:15 AM ",
              "type": " C = Closed Discussion meeting"
          },
          {
              "time": " Thursdays From  7:15 AM to 8:15 AM ",
              "type": " C = Closed Discussion meeting"
          },
          {
              "time": " Sundays From  7:15 AM to 8:15 AM ",
              "type": " C = Closed Discussion meeting"
          },
          {
              "time": " Tuesdays From  7:15 AM to 8:15 AM ",
              "type": " C = Closed Discussion meeting"
          },
          {
              "time": " Fridays From  8:45 AM to 9:45 AM ",
              "type": " B = Beginners meeting"
          },
          {
              "time": " Wednesdays From  8:45 AM to 9:45 AM ",
              "type": " B = Beginners meeting"
          },
          {
              "time": " Saturdays From  8:45 AM to 9:45 AM ",
              "type": " B = Beginners meeting"
          },
          {
              "time": " Mondays From  8:45 AM to 9:45 AM ",
              "type": " B = Beginners meeting"
          },
          {
              "time": " Thursdays From  8:45 AM to 9:45 AM ",
              "type": " B = Beginners meeting"
          },
          {
              "time": " Sundays From  8:45 AM to 9:45 AM ",
              "type": " B = Beginners meeting"
          },
          {
              "time": " Tuesdays From  8:45 AM to 9:45 AM ",
              "type": " B = Beginners meeting"
          },
          {
              "time": " Tuesdays From  10:15 AM to 11:15 AM ",
              "type": " C = Closed Discussion meeting ",
              "interest": " Living Sober"
          },
          {
              "time": "Fridays From  10:15 AM to 11:15 AM ",
              "type": " BB = Big Book meeting"
          },
          {
              "time": " Wednesdays From  10:15 AM to 11:15 AM ",
              "type": " S = Step meeting"
          },
          {
              "time": " Saturdays From  10:15 AM to 11:15 AM ",
              "type": " S = Step meeting"
          },
          {
              "time": " Mondays From  10:15 AM to 11:15 AM ",
              "type": " C = Closed Discussion meeting ",
              "interest": " Promises"
          },
          {
              "time": "Thursdays From  10:15 AM to 11:15 AM ",
              "type": " OD = Open Discussion meeting"
          },
          {
              "time": " Sundays From  10:15 AM to 11:15 AM ",
              "type": " T = Tradition meeting"
          }
      ]
  },
  {
      "address": "26 West 84th Street,Betw. Columbus Avenue and Central Park West 10024",
      "time": [
          {
              "time": "Fridays From  6:30 PM to 7:45 PM ",
              "type": " S = Step meeting"
          }
      ]
  },
  {
      "address": "200 West 97th Street, Basement,(@ Amsterdam Avenue) NY 10025",
      "time": [
          {
              "time": "Sundays From  4:30 PM to 5:30 PM ",
              "type": " OD = Open Discussion meeting"
          },
          {
              "time": " Thursdays From  7:00 PM to 8:00 PM ",
              "type": " C = Closed Discussion meeting"
          }
      ]
  },
  {
      "address": "218 West 108th Street, Main Floor,(Betw. Amsterdam Avenue & Broadway) NY 10025",
      "time": [
          {
              "time": "Mondays From  7:30 PM to 8:30 PM ",
              "type": " OD = Open Discussion meeting"
          },
          {
              "time": " Wednesdays From  7:30 PM to 8:30 PM ",
              "type": " C = Closed Discussion meeting"
          },
          {
              "time": " Fridays From  7:30 PM to 8:30 PM ",
              "type": " OD = Open Discussion meeting"
          },
          {
              "time": " Sundays From  7:30 PM to 8:30 PM ",
              "type": " O = Open meeting"
          }
      ]
  },
  {
      "address": "125 West 104th Street, 1st Floor,(Betw. Columbus & Amsterdam Avenues) 10025",
      "time": [
          {
              "time": "Tuesdays From  7:30 PM to 8:30 PM ",
              "type": " O = Open meeting"
          }
      ]
  },
  {
      "address": "141 West 73rd Street,between Columbus and AAvenue) NY 10023",
      "time": [
          {
              "time": "Thursdays From  7:00 PM to 8:00 PM ",
              "type": " B = Beginners meeting"
          },
          {
              "time": " Fridays From  7:00 PM to 8:00 PM ",
              "type": " B = Beginners meeting"
          },
          {
              "time": " Thursdays From  8:15 PM to 9:15 PM ",
              "type": " C = Closed Discussion meeting"
          }
      ]
  },
  {
      "address": "236 West 73rd Street,  5th Floor,(West of Broadway) NY 10023",
      "time": [
          {
              "time": "Saturdays From  6:00 PM to 7:00 PM ",
              "type": " S = Step meeting ",
              "interest": " Gay, Lesbian and Bisexual"
          },
          {
              "time": "Wednesdays From  6:00 PM to 7:00 PM ",
              "type": " OD = Open Discussion meeting ",
              "interest": " Interpreted for the Deaf"
          },
          {
              "time": "Wednesdays From  7:15 PM to 8:15 PM ",
              "type": " B = Beginners meeting ",
              "interest": " Gay, Lesbian and Bisexual"
          },
          {
              "time": "Wednesdays From  8:30 PM to 9:30 PM ",
              "type": " C = Closed Discussion meeting ",
              "interest": " Gay, Lesbian and Bisexual"
          }
      ]
  },
  {
      "address": "165 West 105th Street, Basement,(@ Amsterdam Avenue) NY 10025",
      "time": [
          {
              "time": "Wednesdays From  7:00 PM to 8:00 PM ",
              "type": " B = Beginners meeting"
          }
      ]
  },
  {
      "address": "207 West 96th Street,(Btwn. Amsterdam Avenue and Broadway) 10025",
      "time": [
          {
              "time": "Sundays From  5:45 PM to 7:00 PM ",
              "type": " C = Closed Discussion meeting"
          }
      ]
  },
  {
      "address": "207 West 96th Street, Basement, Little Room,(Betw Amsterdam & Broadway) NY 10025",
      "time": [
          {
              "time": "Fridays From  1:00 PM to 2:00 PM ",
              "type": " S = Step meeting"
          },
          {
              "time": " Mondays From  1:00 PM to 2:15 PM ",
              "type": " S = Step meeting ",
              "interest": " Meditation"
          },
          {
              "time": "Tuesdays From  1:00 PM to 2:15 PM ",
              "type": " BB = Big Book meeting"
          },
          {
              "time": " Wednesdays From  1:00 PM to 2:15 PM ",
              "type": " OD = Open Discussion meeting"
          },
          {
              "time": " Thursdays From  1:00 PM to 2:15 PM ",
              "type": " C = Closed Discussion meeting ",
              "interest": " Women"
          }
      ]
  },
  {
      "address": "2504 Broadway,  Basement,(@ 93rd Street) NY 10025",
      "time": [
          {
              "time": "Saturdays From  6:30 PM to 7:30 PM ",
              "type": " B = Beginners meeting"
          },
          {
              "time": " Saturdays From  8:00 PM to 9:00 PM ",
              "type": " OD = Open Discussion meeting"
          },
          {
              "time": " Saturdays From  8:00 PM to 9:00 PM ",
              "type": " S = Step meeting"
          },
          {
              "time": " Saturdays From  9:15 PM to 10:15 PM ",
              "type": " OD = Open Discussion meeting"
          }
      ]
  },
  {
      "address": "405 West 114th Street, Merton Room,(1 Block East of  Amsterdam Avenue) 10025",
      "time": [
          {
              "time": "Wednesdays From  6:30 PM to 7:30 PM ",
              "type": " B = Beginners meeting"
          },
          {
              "time": " Fridays From  6:30 PM to 7:30 PM ",
              "type": " B = Beginners meeting"
          }
      ]
  },
  {
      "address": "368 West End Ave, 1st floor,@77th Street NY 10024",
      "time": [
          {
              "time": "Tuesdays From  7:30 PM to 8:30 PM ",
              "type": " C = Closed Discussion meeting"
          }
      ]
  },
  {
      "address": "225 West 99th Street, 1st Floor,(Betw. Amsterdam Avenue & Broadway) NY 10025",
      "time": [
          {
              "time": "Mondays From  6:30 PM to 7:30 PM ",
              "type": " S = Step meeting"
          }
      ]
  },
  {
      "address": "251 West 100th Street,(@ West End Avenue NY 10025",
      "time": [
          {
              "time": "Thursdays From  6:00 PM to 7:00 PM ",
              "type": " B = Beginners meeting"
          }
      ]
  },
  {
      "address": "207 West 96th Street, Basement, Little Room,(Betw Amsterdam & Broadway) NY 10025",
      "time": [
          {
              "time": "Sundays From  10:00 PM to 11:00 PM ",
              "type": " T = Tradition meeting"
          },
          {
              "time": " Mondays From  10:00 PM to 11:00 PM ",
              "type": " BB = Big Book meeting"
          },
          {
              "time": " Tuesdays From  10:00 PM to 11:00 PM ",
              "type": " S = Step meeting"
          },
          {
              "time": " Wednesdays From  10:00 PM to 11:00 PM ",
              "type": " BB = Big Book meeting"
          },
          {
              "time": " Thursdays From  10:00 PM to 11:00 PM ",
              "type": " B = Beginners meeting"
          },
          {
              "time": " Saturdays From  10:00 PM to 11:00 PM ",
              "type": " C = Closed Discussion meeting ",
              "interest": " As Bill Sees It"
          },
          {
              "time": "Fridays From  11:00 PM to 12:00 AM ",
              "type": " C = Closed Discussion meeting ",
              "interest": " Promises"
          }
      ]
  },
  {
      "address": "26 West 84th Street,(Betw. Central Park West & Columbus Avenue) NY 10024",
      "time": [
          {
              "time": "s From  12:00 AM to 12:00 AM"
          },
          {
              "time": " Mondays From  7:30 PM to 8:30 PM ",
              "type": " C = Closed Discussion meeting ",
              "interest": " Interpreted for the Deaf"
          },
          {
              "time": "Wednesdays From  7:30 PM to 8:30 PM ",
              "type": " O = Open meeting ",
              "interest": " Interpreted for the Deaf"
          },
          {
              "time": "Thursdays From  7:30 PM to 8:30 PM ",
              "type": " BB = Big Book meeting"
          }
      ]
  },
  {
      "address": "5 West 63rd Street, Basement, Room D,(Betw. CPW & Bway ) NY 10023",
      "time": [
          {
              "time": "Saturdays From  6:30 PM to 7:30 PM ",
              "type": " C = Closed Discussion meeting"
          }
      ]
  },
  {
      "address": "552 West End Avenue, Basement,(Betw. Broadway & West End Avenue, Enter on 87th Street) NY 10024",
      "time": [
          {
              "time": "Sundays From  7:00 PM to 8:00 PM ",
              "type": " B = Beginners meeting"
          }
      ]
  },
  {
      "address": "164 West 74 Street, 1st Floor, (ask at Front Desk),(Betw. Columbus and Amsterdam Avenues) 10024",
      "time": [
          {
              "time": "Saturdays From  6:00 PM to 7:00 PM ",
              "type": " B = Beginners meeting"
          },
          {
              "time": " Tuesdays From  7:00 PM to 8:00 PM ",
              "type": " B = Beginners meeting"
          }
      ]
  },
  {
      "address": "340 West 85th Street, Basement,(Betw. West End Avenue & Riverside Drive) NY 10024",
      "time": [
          {
              "time": "Wednesdays From  8:30 PM to 9:30 PM ",
              "type": " C = Closed Discussion meeting ",
              "interest": " Living Sober"
          }
      ]
  },
  {
      "address": "368 West End Avenue, 1st Floor,(@ West 77th Street) NY 10024",
      "time": [
          {
              "time": "Wednesdays From  7:00 PM to 8:00 PM ",
              "type": " B = Beginners meeting"
          },
          {
              "time": " Wednesdays From  8:15 PM to 9:15 PM ",
              "type": " S = Step meeting"
          }
      ]
  },
  {
      "address": "152 West 71st Street,(Betw Columbus Avenue & Broadway) NY 10023",
      "time": [
          {
              "time": "Saturdays From  6:30 PM to 7:30 PM ",
              "type": " S = Step meeting ",
              "interest": " Promises"
          }
      ]
  },
  {
      "address": "5 West 63rd Street,(Betw. Central Park West & Broadway) NY 10023",
      "time": [
          {
              "time": "Sundays From  10:30 AM to 11:30 AM ",
              "type": " C = Closed Discussion meeting ",
              "interest": " Men"
          }
      ]
  },
  {
      "address": "131 West 72nd Street, 3rd Floor, Room #2F,(Betw. Columbus & Amsterdam Avenues) NY 10023",
      "time": [
          {
              "time": "Sundays From  12:00 PM to 1:00 PM ",
              "type": " C = Closed Discussion meeting"
          }
      ]
  },
  {
      "address": "207 West 96th Street, Basement, Little Room,(Betw Amsterdam Avenue & Broadway) NY 10025",
      "time": [
          {
              "time": "Thursdays From  3:30 PM to 4:30 PM ",
              "type": " B = Beginners meeting"
          },
          {
              "time": " Tuesdays From  3:30 PM to 4:30 PM ",
              "type": " B = Beginners meeting"
          },
          {
              "time": " Tuesdays From  4:30 PM to 5:30 PM ",
              "type": " C = Closed Discussion meeting"
          },
          {
              "time": " Thursdays From  4:30 PM to 5:30 PM ",
              "type": " C = Closed Discussion meeting"
          },
          {
              "time": " Fridays From  4:30 PM to 5:30 PM ",
              "type": " S = Step meeting"
          }
      ]
  },
  {
      "address": "152 West 71st Street, Ring Bell,(Betw. Columbus Avenue & Broadway) NY 10023",
      "time": [
          {
              "time": "Saturdays From  10:00 AM to 11:00 AM ",
              "type": " C = Closed Discussion meeting ",
              "interest": " As Bill Sees It"
          },
          {
              "time": "Saturdays From  11:15 AM to 12:15 PM ",
              "type": " C = Closed Discussion meeting"
          }
      ]
  },
  {
      "address": "30 West 68th Street,  Check security desk for Room #,(Betw Central Park West & Columbus Avenue) NY 10023",
      "time": [
          {
              "time": "Thursdays From  6:15 PM to 7:15 PM ",
              "type": " C = Closed Discussion meeting ",
              "interest": " Agnostic"
          }
      ]
  },
  {
      "address": "207 West 96th Street, Basement, Little Room, 10025",
      "time": [
          {
              "time": "Wednesdays From  4:45 PM to 5:45 PM ",
              "type": " OD = Open Discussion meeting ",
              "interest": " Medication"
          }
      ]
  },
  {
      "address": "263 West 86th Street,  1st Floor,@Corner of West End Avenue & 86th Street NY 10024",
      "time": [
          {
              "time": "Thursdays From  7:00 PM to 8:00 PM ",
              "type": " B = Beginners meeting"
          },
          {
              "time": " Thursdays From  7:00 PM to 8:00 PM ",
              "type": " S = Step meeting"
          },
          {
              "time": " Tuesdays From  7:00 PM to 8:00 PM ",
              "type": " B = Beginners meeting"
          },
          {
              "time": " Tuesdays From  7:00 PM to 8:00 PM ",
              "type": " BB = Big Book meeting"
          }
      ]
  },
  {
      "address": "306 West 102nd Street, 2nd Floor,(Betw West End Avenue & Riverside Drive) NY 10025",
      "time": [
          {
              "time": "Wednesdays From  7:00 PM to 8:00 PM ",
              "type": " C = Closed Discussion meeting"
          }
      ]
  },
  {
      "address": "152 West 71st Street, NY 10023",
      "time": [
          {
              "time": "Fridays From  7:00 PM to 8:00 PM ",
              "type": " S = Step meeting"
          }
      ]
  },
  {
      "address": "26 West 84th Street, Stanford Room (blue door),(Betw. Columbus Avenue & Central Park West) NY 10024",
      "time": [
          {
              "time": "Saturdays From  7:00 PM to 8:00 PM ",
              "type": " B = Beginners meeting ",
              "interest": " Young People"
          }
      ]
  },
  {
      "address": "595 Columbus Avenue,88th Street,Ground Level, Art Room 10024",
      "time": [
          {
              "time": "Saturdays From  5:00 PM to 6:00 PM ",
              "type": " OD = Open Discussion meeting ",
              "interest": " Agnostic"
          }
      ]
  },
  {
      "address": "306 West 102nd Street, 2nd Floor,(Betw. Riverside Drive & West End Avenue) NY 10025",
      "time": [
          {
              "time": "Wednesdays From  9:00 AM to 10:00 AM ",
              "type": " C = Closed Discussion meeting ",
              "interest": " Women"
          },
          {
              "time": "Saturdays From  9:00 AM to 10:00 AM ",
              "type": " C = Closed Discussion meeting ",
              "interest": " Women"
          }
      ]
  },
  {
      "address": "213 West 82nd Street,(Betw. Amsterdam Avenue & Bway) NY 10024",
      "time": [
          {
              "time": "Fridays From  7:00 PM to 8:00 PM ",
              "type": " C = Closed Discussion meeting ",
              "interest": " Women"
          }
      ]
  },
  {
      "address": "152 West 71st Street,(Between Broadway and Columbus Avenue) 10023",
      "time": [
          {
              "time": "Thursdays From  12:00 PM to 1:00 PM ",
              "type": " C = Closed Discussion meeting ",
              "interest": " Women"
          },
          {
              "time": "Mondays From  12:00 PM to 1:15 PM ",
              "type": " C = Closed Discussion meeting ",
              "interest": " Women"
          },
          {
              "time": "Wednesdays From  12:30 PM to 1:30 PM ",
              "type": " B = Beginners meeting ",
              "interest": " Women"
          }
      ]
  },
  {
      "address": "152 West 71st Street,Between Broadway and Columbus Avenues) NY 10023",
      "time": [
          {
              "time": "Mondays From  12:00 PM to 1:00 PM ",
              "type": " OD = Open Discussion meeting ",
              "interest": " Women"
          }
      ]
  },
  {
      "address": "160 Central Park West, Downstairs,(Enter through side door on 76th Street) NY 10023",
      "time": [
          {
              "time": "Mondays From  12:00 PM to 1:15 PM ",
              "type": " C = Closed Discussion meeting ",
              "interest": " Women"
          }
      ]
  },
  {
      "address": "207 West 96th Street, Basement, Little Room,(Betw. Amsterdam Avenue & Bway ) NY 10025",
      "time": [
          {
              "time": "Tuesdays From  6:30 PM to 7:30 PM ",
              "type": " C = Closed Discussion meeting ",
              "interest": " Women"
          }
      ]
  },
  {
      "address": "109 West 129th Street,  Basement,(@ Lenox Avenue) NY 10027",
      "time": [
          {
              "time": "Wednesdays From  6:00 PM to 7:00 PM ",
              "type": " BB = Big Book meeting"
          },
          {
              "time": " Mondays From  7:00 PM to 8:00 PM ",
              "type": " B = Beginners meeting"
          }
      ]
  },
  {
      "address": "240 West 145th Street,(Betw 7th & 8th Avenues) NY 10039",
      "time": [
          {
              "time": "Wednesdays From  10:00 AM to 11:00 AM ",
              "type": " B = Beginners meeting"
          },
          {
              "time": " Thursdays From  10:00 AM to 11:00 AM ",
              "type": " BB = Big Book meeting"
          },
          {
              "time": " Fridays From  10:00 AM to 11:00 AM ",
              "type": " S = Step meeting"
          },
          {
              "time": " Tuesdays From  10:00 AM to 11:00 AM ",
              "type": " OD = Open Discussion meeting"
          }
      ]
  },
  {
      "address": "469 West 142nd Street, Basement,(Betw Convent & Amsterdam Avenues) NY 10031",
      "time": [
          {
              "time": "Saturdays From  7:30 AM to 8:30 AM ",
              "type": " OD = Open Discussion meeting"
          }
      ]
  },
  {
      "address": "204 West 134th Street, 1st Floor,(Betw 7th & 8th Avenues) 10030",
      "time": [
          {
              "time": "Saturdays From  11:30 AM to 1:00 PM ",
              "type": " OD = Open Discussion meeting"
          }
      ]
  },
  {
      "address": "2044 Adam Clayton Powell Blvd.,(@ 122nd Street) NY 10027",
      "time": [
          {
              "time": "Mondays From  12:15 PM to 1:15 PM ",
              "type": " B = Beginners meeting"
          },
          {
              "time": " Wednesdays From  12:15 PM to 1:15 PM ",
              "type": " S = Step meeting"
          },
          {
              "time": " Fridays From  12:15 PM to 1:15 PM ",
              "type": " OD = Open Discussion meeting"
          }
      ]
  },
  {
      "address": "469 West 142nd Street, 1st Floor,(Betw. Amsterdam & Convent Avenues) 10031",
      "time": [
          {
              "time": "Thursdays From  8:00 PM to 9:00 PM ",
              "type": " B = Beginners meeting"
          }
      ]
  },
  {
      "address": "521 W 126th St,Amsterdam & Old Broadway 10027",
      "time": [
          {
              "time": "Mondays From  12:00 PM to 1:00 PM ",
              "type": " O = Open meeting ",
              "interest": " Agnostic"
          }
      ]
  },
  {
      "address": "109 West 129th Street, Basement,(Betw Lenox Avenue & Adam Clayton Powell Blvd) NY 10027",
      "time": [
          {
              "time": "Sundays From  5:30 PM to 6:30 PM ",
              "type": " S = Step meeting"
          },
          {
              "time": " Sundays From  7:00 PM to 8:00 PM ",
              "type": " B = Beginners meeting"
          }
      ]
  },
  {
      "address": "469 West 142nd Street, Basement,(Betw Convent & Amsterdam Avenues) NY 10031",
      "time": [
          {
              "time": "Thursdays From  6:00 PM to 7:00 PM ",
              "type": " BB = Big Book meeting"
          }
      ]
  },
  {
      "address": "2044 Seventh Avenue, NY 10027",
      "time": [
          {
              "time": "Sundays From  6:00 PM to 7:30 PM ",
              "type": " B = Beginners meeting"
          }
      ]
  },
  {
      "address": "127 West 127th Street,(Betw. 7th and Lenox) NY 10027",
      "time": [
          {
              "time": "Mondays From  4:30 PM to 5:30 PM ",
              "type": " C = Closed Discussion meeting"
          }
      ]
  },
  {
      "address": "310 West 139th Street, Basement,(Betw Eighth & Edgecombe Avenues) NY 10037",
      "time": [
          {
              "time": "Mondays From  7:00 PM to 8:00 PM ",
              "type": " S = Step meeting"
          },
          {
              "time": " Fridays From  7:00 PM to 8:00 PM ",
              "type": " B = Beginners meeting"
          },
          {
              "time": " Fridays From  8:00 PM to 9:00 PM ",
              "type": " O = Open meeting"
          }
      ]
  },
  {
      "address": "409 West 141st Street,  Basement,(@ St. Nicholas Avenue) NY 10031",
      "time": [
          {
              "time": "Mondays From  7:00 PM to 8:00 PM ",
              "type": " B = Beginners meeting"
          }
      ]
  },
  {
      "address": "91 Claremont Avenue,  4th Floor, Room 414,(Betw. Broadway & Riverside Drive)) NY 10027",
      "time": [
          {
              "time": "Sundays From  3:00 PM to 4:00 PM ",
              "type": " OD = Open Discussion meeting"
          }
      ]
  },
  {
      "address": "1727 Amsterdam Avenue, 1st Floor in the rear.,(@ 145th Street) NY 10031",
      "time": [
          {
              "time": "Sundays From  9:30 AM to 10:30 AM ",
              "type": " B = Beginners meeting"
          },
          {
              "time": " Sundays From  11:00 AM to 12:00 PM ",
              "type": " C = Closed Discussion meeting"
          }
      ]
  },
  {
      "address": "469 West 142nd Street, Basement,(Betw Convent & Amsterdam Avenues) NY 10037",
      "time": [
          {
              "time": "Saturdays From  5:00 PM to 6:00 PM ",
              "type": " OD = Open Discussion meeting ",
              "interest": " Men"
          }
      ]
  },
  {
      "address": "91 Claremont Avenue,  @ The Cloisters Club Room,(1 Block West of Broadway & 1/2 Block North of 120th Street) NY 10027",
      "time": [
          {
              "time": "Mondays From  7:00 PM to 8:00 PM ",
              "type": " C = Closed Discussion meeting"
          }
      ]
  },
  {
      "address": "219 West 132nd Street, Cafeteria,(Betw. Adam Clayton Powell Blvd. & F. Douglass Blvd.) NY 10027",
      "time": [
          {
              "time": "Saturdays From  3:00 PM to 4:00 PM ",
              "type": " B = Beginners meeting"
          },
          {
              "time": " Saturdays From  6:00 PM to 7:00 PM ",
              "type": " O = Open meeting"
          },
          {
              "time": " Tuesdays From  8:00 PM to 9:00 PM"
          }
      ]
  },
  {
      "address": "211 West 129th Street, Downstairs in the Gym,(@ Adam Clayton Powell Blvd.) NY 10027",
      "time": [
          {
              "time": "Wednesdays From  7:30 PM to 8:30 PM ",
              "type": " C = Closed Discussion meeting"
          }
      ]
  },
  {
      "address": "425 West 144th Street, 1st Floor,(Betw. Convent Avenue & Hamilton Terrace) NY 10031",
      "time": [
          {
              "time": "Wednesdays From  7:00 PM to 8:00 PM ",
              "type": " C = Closed Discussion meeting ",
              "interest": " Men"
          }
      ]
  },
  {
      "address": "204 West 134th Street,  Basement,(Betw Adam C. Powell & Frederick Douglas Blvds) NY 10030",
      "time": [
          {
              "time": "Sundays From  4:00 PM to 5:00 PM ",
              "type": " O = Open meeting"
          },
          {
              "time": " Thursdays From  7:00 PM to 8:00 PM ",
              "type": " B = Beginners meeting"
          }
      ]
  },
  {
      "address": "506 Lenox Avenue,  Room #3101, 3rd Floor,(@ 135 Street) NY 10037",
      "time": [
          {
              "time": "Sundays From  2:00 PM to 3:00 PM ",
              "type": " B = Beginners meeting"
          }
      ]
  },
  {
      "address": "1727 Amsterdam Avenue, 1st floor in the rear,@ 145th St. 10031",
      "time": [
          {
              "time": "Fridays From  5:30 PM to 6:30 PM ",
              "type": " B = Beginners meeting"
          }
      ]
  },
  {
      "address": "1854 Amsterdam Avenue, Basment,(Corner of 152nd Street) NY 10031",
      "time": [
          {
              "time": "Tuesdays From  6:00 PM to 7:00 PM ",
              "type": " BB = Big Book meeting"
          }
      ]
  },
  {
      "address": "469 West 142nd Street, Basement,(Betw. Convent & Amsterdam Avenues 10031",
      "time": [
          {
              "time": "Saturdays From  9:30 AM to 11:00 AM ",
              "type": " BB = Big Book meeting ",
              "interest": " Big Book Workshop"
          }
      ]
  },
  {
      "address": "58-66 West 135th Street,(Betw Malcolm X Boulevard & 5th Avenue) NY 10037",
      "time": [
          {
              "time": "Tuesdays From  6:30 PM to 7:30 PM ",
              "type": " S = Step meeting"
          }
      ]
  },
  {
      "address": "122 East 37th Street, Basement,(Betw Park & Lexington Avenues) NY 10016",
      "time": [
          {
              "time": "Sundays From  6:15 PM to 7:15 PM ",
              "type": " C = Closed Discussion meeting"
          }
      ]
  },
  {
      "address": "30 East 35th Street,(Betw Madison & Park Avenues) NY 10016",
      "time": [
          {
              "time": "Tuesdays From  7:30 AM to 8:30 AM ",
              "type": " S = Step meeting"
          },
          {
              "time": " Wednesdays From  7:30 AM to 8:30 AM ",
              "type": " OD = Open Discussion meeting"
          },
          {
              "time": " Thursdays From  7:30 AM to 8:30 AM ",
              "type": " O = Open meeting"
          },
          {
              "time": " Fridays From  7:30 AM to 8:30 AM ",
              "type": " OD = Open Discussion meeting"
          },
          {
              "time": " Mondays From  7:30 AM to 8:30 AM ",
              "type": " OD = Open Discussion meeting"
          }
      ]
  },
  {
      "address": "350 East 56th Street,(Betw 1st  & 2nd Avenues) NY 10022",
      "time": [
          {
              "time": "Mondays From  5:45 PM to 6:45 PM ",
              "type": " B = Beginners meeting"
          },
          {
              "time": " Wednesdays From  5:45 PM to 6:45 PM ",
              "type": " B = Beginners meeting"
          }
      ]
  },
  {
      "address": "619 Lexington Avenue, Lower Level Music Rooms,(Enter on 54th Street, Betw. Lexington & 3rd Avenues) NY 10022",
      "time": [
          {
              "time": "Thursdays From  7:30 AM to 8:30 AM ",
              "type": " OD = Open Discussion meeting"
          },
          {
              "time": " Mondays From  7:30 AM to 8:30 AM ",
              "type": " S = Step meeting"
          },
          {
              "time": " Wednesdays From  7:30 AM to 8:30 AM ",
              "type": " OD = Open Discussion meeting"
          },
          {
              "time": " Fridays From  7:45 AM to 8:45 AM ",
              "type": " B = Beginners meeting"
          },
          {
              "time": " Mondays From  12:30 PM to 1:30 PM ",
              "type": " B = Beginners meeting"
          },
          {
              "time": " Mondays From  12:30 PM to 1:30 PM ",
              "type": " S = Step meeting"
          },
          {
              "time": " Tuesdays From  12:30 PM to 1:30 PM ",
              "type": " B = Beginners meeting"
          },
          {
              "time": " Thursdays From  12:30 PM to 1:30 PM ",
              "type": " O = Open meeting"
          },
          {
              "time": " Wednesdays From  12:30 PM to 1:30 PM ",
              "type": " B = Beginners meeting"
          },
          {
              "time": " Wednesdays From  12:30 PM to 1:30 PM ",
              "type": " S = Step meeting"
          },
          {
              "time": " Thursdays From  12:30 PM to 1:30 PM ",
              "type": " B = Beginners meeting"
          },
          {
              "time": " Fridays From  12:30 PM to 1:30 PM ",
              "type": " B = Beginners meeting"
          },
          {
              "time": " Fridays From  12:30 PM to 1:30 PM ",
              "type": " BB = Big Book meeting"
          },
          {
              "time": " Tuesdays From  12:30 PM to 1:30 PM ",
              "type": " S = Step meeting"
          }
      ]
  },
  {
      "address": "122 East 37th Street, Basement,(Betw. Park & Lexington Avenues ) NY 10016",
      "time": [
          {
              "time": "Sundays From  12:45 PM to 1:45 PM ",
              "type": " S = Step meeting ",
              "interest": " First Step Workshop"
          },
          {
              "time": "Sundays From  6:15 PM to 7:15 PM ",
              "type": " B = Beginners meeting"
          },
          {
              "time": " Sundays From  6:15 PM to 7:15 PM ",
              "type": " C = Closed Discussion meeting ",
              "interest": " Promises"
          },
          {
              "time": "Mondays From  6:15 PM to 7:15 PM ",
              "type": " B = Beginners meeting"
          },
          {
              "time": " Tuesdays From  6:15 PM to 7:15 PM ",
              "type": " B = Beginners meeting"
          },
          {
              "time": " Tuesdays From  6:15 PM to 7:15 PM ",
              "type": " S = Step meeting"
          },
          {
              "time": " Wednesdays From  6:15 PM to 7:15 PM ",
              "type": " BB = Big Book meeting"
          },
          {
              "time": " Wednesdays From  6:15 PM to 7:15 PM ",
              "type": " C = Closed Discussion meeting"
          },
          {
              "time": " Thursdays From  6:15 PM to 7:15 PM ",
              "type": " C = Closed Discussion meeting"
          },
          {
              "time": " Fridays From  6:15 PM to 7:15 PM ",
              "type": " B = Beginners meeting"
          },
          {
              "time": " Fridays From  7:30 PM to 8:30 PM ",
              "type": " OD = Open Discussion meeting"
          }
      ]
  },
  {
      "address": "28 East 35th Street,upstairs, through red door, 1st room on right NY 10016",
      "time": [
          {
              "time": "Mondays From  12:15 PM to 1:15 PM ",
              "type": " C = Closed Discussion meeting"
          },
          {
              "time": " Wednesdays From  12:15 PM to 1:15 PM ",
              "type": " S = Step meeting"
          },
          {
              "time": " Fridays From  12:15 PM to 1:15 PM ",
              "type": " B = Beginners meeting"
          }
      ]
  },
  {
      "address": "350 East 56th Street ,56th Street & First Avenue, 3rd Floor Library NY 10022",
      "time": [
          {
              "time": "Sundays From  5:30 PM to 6:30 PM ",
              "type": " B = Beginners meeting"
          },
          {
              "time": " Sundays From  5:30 PM to 6:30 PM ",
              "type": " S = Step meeting"
          },
          {
              "time": " Tuesdays From  5:45 PM to 6:45 PM ",
              "type": " OD = Open Discussion meeting"
          }
      ]
  },
  {
      "address": "283 Lexington Avenue, 2nd Floor,(Betw 36th & 37th Streets) NY 10016",
      "time": [
          {
              "time": "Mondays From  5:30 PM to 6:30 PM ",
              "type": " B = Beginners meeting"
          },
          {
              "time": " Tuesdays From  5:30 PM to 6:30 PM ",
              "type": " S = Step meeting"
          },
          {
              "time": " Fridays From  5:30 PM to 6:30 PM ",
              "type": " C = Closed Discussion meeting ",
              "interest": " First Step Workshop"
          },
          {
              "time": "Wednesdays From  5:30 PM to 6:30 PM ",
              "type": " BB = Big Book meeting"
          },
          {
              "time": " Thursdays From  5:30 PM to 6:30 PM ",
              "type": " OD = Open Discussion meeting"
          }
      ]
  },
  {
      "address": "122 East 37th Street, Basement,(Betw. Park & Lexington Avenues) 10016",
      "time": [
          {
              "time": "Wednesdays From  8:00 PM to 9:00 PM ",
              "type": " S = Step meeting"
          },
          {
              "time": " Fridays From  8:00 PM to 9:00 PM ",
              "type": " OD = Open Discussion meeting"
          }
      ]
  },
  {
      "address": "619 Lexington Avenue, Lower Level 2 in The Studio,(Enter on 54th Street, Betw. Lexington & 3rd Avenues) NY 10022",
      "time": [
          {
              "time": "Mondays From  5:30 PM to 6:30 PM ",
              "type": " B = Beginners meeting"
          },
          {
              "time": " Fridays From  5:30 PM to 6:30 PM ",
              "type": " OD = Open Discussion meeting"
          }
      ]
  },
  {
      "address": "141 East 43rd Street, Basement Hall, elevator is available.,(Betw. Lexington & 3rd Avenues) NY 10017",
      "time": [
          {
              "time": "Mondays From  12:30 PM to 1:30 PM ",
              "type": " B = Beginners meeting"
          },
          {
              "time": " Tuesdays From  12:30 PM to 1:30 PM ",
              "type": " C = Closed Discussion meeting"
          },
          {
              "time": " Wednesdays From  12:30 PM to 1:30 PM ",
              "type": " S = Step meeting"
          },
          {
              "time": " Thursdays From  12:30 PM to 1:30 PM ",
              "type": " C = Closed Discussion meeting"
          },
          {
              "time": " Fridays From  12:30 PM to 1:30 PM ",
              "type": " B = Beginners meeting"
          }
      ]
  },
  {
      "address": "122 E 37TH St.,Btw. Park and Lexington 10016",
      "time": [
          {
              "time": "Wednesdays From  12:30 PM to 1:15 PM ",
              "type": " O = Open meeting"
          }
      ]
  },
  {
      "address": "122 East 37th Street,(Betw. Park & Lexington Avenues) NY 10016",
      "time": [
          {
              "time": "Saturdays From  7:30 PM to 8:30 PM ",
              "type": " Eleventh Step Meditation"
          }
      ]
  },
  {
      "address": "141 East 43rd Street,(Betw. Lexington & 3rd Avenues) NY 10017",
      "time": [
          {
              "time": "Mondays From  6:15 PM to 7:15 PM ",
              "type": " B = Beginners meeting"
          },
          {
              "time": " Thursdays From  6:15 PM to 7:15 PM ",
              "type": " S = Step meeting"
          },
          {
              "time": " Mondays From  7:15 PM to 8:15 PM ",
              "type": " C = Closed Discussion meeting"
          }
      ]
  },
  {
      "address": "209 Madison Avenue, 2nd Floor,(Enter through side door @ 35th Street NY 10016",
      "time": [
          {
              "time": "Mondays From  6:15 PM to 7:15 PM ",
              "type": " B = Beginners meeting"
          }
      ]
  },
  {
      "address": "122 East 37th Street,  Basement,(Betw Park & Lexington Avenues) NY 10016",
      "time": [
          {
              "time": "Tuesdays From  6:15 AM to 7:15 AM ",
              "type": " BB = Big Book meeting"
          },
          {
              "time": " Thursdays From  7:30 AM to 8:30 AM ",
              "type": " C = Closed Discussion meeting"
          },
          {
              "time": " Wednesdays From  7:30 AM to 8:30 AM ",
              "type": " C = Closed Discussion meeting"
          },
          {
              "time": " Thursdays From  7:30 AM to 8:30 AM ",
              "type": " C = Closed Discussion meeting"
          },
          {
              "time": " Wednesdays From  7:30 AM to 8:30 AM ",
              "type": " C = Closed Discussion meeting"
          },
          {
              "time": " Tuesdays From  7:30 AM to 8:30 AM ",
              "type": " C = Closed Discussion meeting"
          },
          {
              "time": " Mondays From  7:30 AM to 8:30 AM ",
              "type": " C = Closed Discussion meeting"
          },
          {
              "time": " Tuesdays From  7:30 AM to 8:30 AM ",
              "type": " C = Closed Discussion meeting"
          },
          {
              "time": " Sundays From  7:30 AM to 8:30 AM ",
              "type": " C = Closed Discussion meeting"
          },
          {
              "time": " Mondays From  7:30 AM to 8:30 AM ",
              "type": " C = Closed Discussion meeting"
          },
          {
              "time": " Fridays From  7:30 AM to 8:30 AM ",
              "type": " C = Closed Discussion meeting"
          },
          {
              "time": " Thursdays From  7:30 AM to 8:30 AM ",
              "type": " C = Closed Discussion meeting"
          },
          {
              "time": " Saturdays From  8:00 AM to 9:00 AM ",
              "type": " C = Closed Discussion meeting"
          },
          {
              "time": " Saturdays From  8:00 AM to 9:00 AM ",
              "type": " C = Closed Discussion meeting"
          },
          {
              "time": " Thursdays From  8:00 AM to 9:00 AM ",
              "type": " C = Closed Discussion meeting"
          },
          {
              "time": " Sundays From  8:15 AM to 9:15 AM ",
              "type": " C = Closed Discussion meeting"
          },
          {
              "time": " Thursdays From  9:30 AM to 10:30 AM ",
              "type": " C = Closed Discussion meeting ",
              "interest": " Daily Reflections"
          },
          {
              "time": "Wednesdays From  9:30 AM to 10:30 AM ",
              "type": " C = Closed Discussion meeting ",
              "interest": " Daily Reflections"
          },
          {
              "time": "Tuesdays From  9:30 AM to 10:30 AM ",
              "type": " C = Closed Discussion meeting ",
              "interest": " Daily Reflections"
          },
          {
              "time": "Mondays From  9:30 AM to 10:30 AM ",
              "type": " C = Closed Discussion meeting ",
              "interest": " Daily Reflections"
          },
          {
              "time": "Sundays From  9:30 AM to 10:30 AM ",
              "type": " C = Closed Discussion meeting"
          },
          {
              "time": " Sundays From  9:30 AM to 10:30 AM ",
              "type": " S = Step meeting"
          },
          {
              "time": " Saturdays From  9:30 AM to 10:30 AM ",
              "type": " C = Closed Discussion meeting"
          },
          {
              "time": " Fridays From  9:30 AM to 10:30 AM ",
              "type": " C = Closed Discussion meeting ",
              "interest": " Daily Reflections"
          },
          {
              "time": "Saturdays From  10:00 AM to 11:00 AM ",
              "type": " BB = Big Book meeting"
          },
          {
              "time": " Sundays From  11:00 AM to 12:00 PM ",
              "type": " BB = Big Book meeting"
          },
          {
              "time": " Fridays From  11:30 AM to 12:30 PM ",
              "type": " C = Closed Discussion meeting"
          },
          {
              "time": " Thursdays From  11:30 AM to 12:30 PM ",
              "type": " C = Closed Discussion meeting"
          },
          {
              "time": " Wednesdays From  11:30 AM to 12:30 PM ",
              "type": " C = Closed Discussion meeting"
          },
          {
              "time": " Tuesdays From  11:30 AM to 12:30 PM ",
              "type": " C = Closed Discussion meeting"
          },
          {
              "time": " Mondays From  11:30 AM to 12:30 PM ",
              "type": " C = Closed Discussion meeting"
          },
          {
              "time": " Saturdays From  12:45 PM to 1:45 PM ",
              "type": " C = Closed Discussion meeting"
          },
          {
              "time": " Fridays From  12:45 PM to 1:45 PM ",
              "type": " C = Closed Discussion meeting"
          },
          {
              "time": " Thursdays From  12:45 PM to 1:45 PM ",
              "type": " C = Closed Discussion meeting"
          },
          {
              "time": " Wednesdays From  12:45 PM to 1:45 PM ",
              "type": " C = Closed Discussion meeting"
          },
          {
              "time": " Tuesdays From  12:45 PM to 1:45 PM ",
              "type": " C = Closed Discussion meeting"
          },
          {
              "time": " Mondays From  12:45 PM to 1:45 PM ",
              "type": " C = Closed Discussion meeting"
          },
          {
              "time": " Sundays From  12:45 PM to 1:45 PM ",
              "type": " S = Step meeting ",
              "interest": " First Step Workshop"
          },
          {
              "time": "Sundays From  3:00 PM to 4:00 PM ",
              "type": " C = Closed Discussion meeting ",
              "interest": " Women"
          },
          {
              "time": "Fridays From  3:15 PM to 4:15 PM ",
              "type": " C = Closed Discussion meeting"
          },
          {
              "time": " Thursdays From  3:15 PM to 4:15 PM ",
              "type": " C = Closed Discussion meeting"
          },
          {
              "time": " Wednesdays From  3:15 PM to 4:15 PM ",
              "type": " C = Closed Discussion meeting"
          },
          {
              "time": " Tuesdays From  3:15 PM to 4:15 PM ",
              "type": " C = Closed Discussion meeting"
          },
          {
              "time": " Mondays From  3:15 PM to 4:15 PM ",
              "type": " C = Closed Discussion meeting"
          },
          {
              "time": " Saturdays From  5:30 PM to 6:30 PM ",
              "type": " B = Beginners meeting"
          },
          {
              "time": " Sundays From  6:15 PM to 7:00 PM ",
              "type": " B = Beginners meeting"
          },
          {
              "time": " Fridays From  6:15 PM to 7:15 PM ",
              "type": " B = Beginners meeting"
          },
          {
              "time": " Thursdays From  6:15 PM to 7:15 PM ",
              "type": " C = Closed Discussion meeting"
          },
          {
              "time": " Wednesdays From  6:15 PM to 7:15 PM ",
              "type": " C = Closed Discussion meeting"
          },
          {
              "time": " Tuesdays From  6:15 PM to 7:15 PM ",
              "type": " B = Beginners meeting"
          },
          {
              "time": " Wednesdays From  6:15 PM to 7:15 PM ",
              "type": " BB = Big Book meeting"
          },
          {
              "time": " Mondays From  6:15 PM to 7:15 PM ",
              "type": " B = Beginners meeting"
          },
          {
              "time": " Tuesdays From  6:15 PM to 7:15 PM ",
              "type": " S = Step meeting"
          },
          {
              "time": " Fridays From  7:30 PM to 8:30 PM ",
              "type": " OD = Open Discussion meeting"
          },
          {
              "time": " Saturdays From  7:30 PM to 8:30 PM ",
              "type": " Meditation"
          },
          {
              "time": "Tuesdays From  8:00 PM to 9:00 PM ",
              "type": " C = Closed Discussion meeting"
          },
          {
              "time": " Sundays From  8:00 PM to 9:00 PM ",
              "type": " B = Beginners meeting"
          },
          {
              "time": " Thursdays From  8:00 PM to 9:00 PM ",
              "type": " C = Closed Discussion meeting ",
              "interest": " Men"
          },
          {
              "time": "Wednesdays From  8:00 PM to 9:00 PM ",
              "type": " S = Step meeting"
          },
          {
              "time": " Mondays From  8:00 PM to 9:00 PM ",
              "type": " B = Beginners meeting ",
              "interest": " Women"
          },
          {
              "time": "Fridays From  10:00 PM to 11:00 PM ",
              "type": " OD = Open Discussion meeting"
          }
      ]
  },
  {
      "address": "619 Lexington Avenue, Lower Level,(Enter on 54th Street, Betw. Lexington & 3rd Avenues) 10022",
      "time": [
          {
              "time": "Tuesdays From  7:30 AM to 8:30 AM ",
              "type": " C = Closed Discussion meeting ",
              "interest": " Living Sober"
          }
      ]
  },
  {
      "address": "240 East 31st Street, NY 10016",
      "time": [
          {
              "time": "Saturdays From  4:00 PM to 5:00 PM ",
              "type": " C = Closed Discussion meeting"
          }
      ]
  },
  {
      "address": "114 East 35th Street, 2nd Floor,(Betw. Park & Lexington Avenues) NY 10016",
      "time": [
          {
              "time": "Saturdays From  10:00 AM to 11:00 AM ",
              "type": " S = Step meeting"
          }
      ]
  },
  {
      "address": "230 East 60th Street (Basement) ,(Betw 2nd & 3rd Avenues) NY 10022",
      "time": [
          {
              "time": "Tuesdays From  7:30 AM to 8:30 AM ",
              "type": " BB = Big Book meeting"
          },
          {
              "time": " Fridays From  6:30 PM to 7:30 PM ",
              "type": " S = Step meeting"
          },
          {
              "time": " Fridays From  8:00 PM to 9:00 PM ",
              "type": " B = Beginners meeting"
          }
      ]
  },
  {
      "address": "244 East 58th Street,(Between 2nd and 3rd Avenues) 10022",
      "time": [
          {
              "time": "Tuesdays From  5:30 PM to 6:30 PM ",
              "type": " BB = Big Book meeting"
          }
      ]
  },
  {
      "address": "619 Lexington Avenue, Lower Level,(Enter on 54th Street, Betw. Lexington & 3rd Avenues) NY 10022",
      "time": [
          {
              "time": "Thursdays From  12:30 PM to 1:30 PM ",
              "type": " C = Closed Discussion meeting ",
              "interest": " Women"
          }
      ]
  },
  {
      "address": "325 Park Avenue,(Betw. East 50th & 51st Streets) NY 10022",
      "time": [
          {
              "time": "Fridays From  12:30 PM to 1:30 PM ",
              "type": " BB = Big Book meeting"
          },
          {
              "time": " Mondays From  12:30 PM to 1:30 PM ",
              "type": " C = Closed Discussion meeting"
          },
          {
              "time": " Wednesdays From  12:30 PM to 1:30 PM ",
              "type": " S = Step meeting"
          }
      ]
  },
  {
      "address": "236 EAST 31st STREET ,basement,BETWEEN 2nd and 3rd AVENUES 10016",
      "time": [
          {
              "time": "Saturdays From  6:00 PM to 7:00 PM ",
              "type": " C = Closed Discussion meeting ",
              "interest": " Promises"
          },
          {
              "time": "Saturdays From  7:15 PM to 8:15 PM ",
              "type": " B = Beginners meeting"
          },
          {
              "time": " Saturdays From  8:30 PM to 9:30 PM ",
              "type": " OD = Open Discussion meeting"
          }
      ]
  },
  {
      "address": "308 East 55th Street,(Betw 1st & 2nd Avenues) NY 10022",
      "time": [
          {
              "time": "Wednesdays From  6:15 PM to 7:15 PM ",
              "type": " OD = Open Discussion meeting"
          }
      ]
  },
  {
      "address": "244 East 58th Street,(Betw. 2nd & 3rd Avenues) NY 10022",
      "time": [
          {
              "time": "Tuesdays From  6:45 PM to 7:45 PM ",
              "type": " OD = Open Discussion meeting"
          }
      ]
  },
  {
      "address": "244 East 58th Street, Lower Level,(Betw. 2nd & 3rd Avenues) NY 10022",
      "time": [
          {
              "time": "Thursdays From  6:15 PM to 7:15 PM ",
              "type": " OD = Open Discussion meeting"
          }
      ]
  },
  {
      "address": "109 East 50th Street,(Between Park & Lexington) NY 10022",
      "time": [
          {
              "time": "Wednesdays From  5:45 PM to 7:15 PM ",
              "type": " S = Step meeting"
          }
      ]
  },
  {
      "address": "351 East 74th Street,  2nd Floor,(Betw 1st & 2nd Avenues) 10021",
      "time": [
          {
              "time": "Saturdays From  7:30 AM to 8:30 AM ",
              "type": " OD = Open Discussion meeting"
          }
      ]
  },
  {
      "address": "48 East 80th Street, 2nd Floor Library, Ring Bell Next to Sign.,(Betw Park & Madison Avenues) 10021",
      "time": [
          {
              "time": "Tuesdays From  7:00 PM to 8:00 PM ",
              "type": " T = Tradition meeting"
          }
      ]
  },
  {
      "address": "184 East 76th Street, Basement,(Betw Lexington & 3rd Avenues - Ring Bell) NY 10021",
      "time": [
          {
              "time": "Wednesdays From  6:00 PM to 7:00 PM ",
              "type": " S = Step meeting"
          }
      ]
  },
  {
      "address": "351 East 74th Street, 2nd Floor,(Betw. 1st & 2nd Avenues) 10021",
      "time": [
          {
              "time": "Mondays From  2:30 PM to 3:30 PM ",
              "type": " B = Beginners meeting ",
              "interest": " Living Sober"
          },
          {
              "time": "Tuesdays From  2:30 PM to 3:30 PM ",
              "type": " S = Step meeting"
          },
          {
              "time": " Wednesdays From  2:30 PM to 3:30 PM ",
              "type": " BB = Big Book meeting"
          },
          {
              "time": " Thursdays From  2:30 PM to 3:30 PM ",
              "type": " S = Step meeting"
          },
          {
              "time": " Fridays From  2:30 PM to 3:30 PM ",
              "type": " S = Step meeting"
          }
      ]
  },
  {
      "address": "1393 York Avenue,(@ 74th Street) 10021",
      "time": [
          {
              "time": "Mondays From  7:15 PM to 8:15 PM ",
              "type": " S = Step meeting"
          }
      ]
  },
  {
      "address": "520 Park Avenue,(@ 60th Street) NY 10021",
      "time": [
          {
              "time": "Tuesdays From  7:00 PM to 8:00 PM ",
              "type": " O = Open meeting"
          }
      ]
  },
  {
      "address": "337 E. 74th St.,(Between First and Second Avenues) 10021",
      "time": [
          {
              "time": "Thursdays From  7:00 PM to 8:00 PM ",
              "type": " B = Beginners meeting"
          }
      ]
  },
  {
      "address": "1157 Lexington Avenue,(between 79th and 80th Streets) 10075",
      "time": [
          {
              "time": "Saturdays From  6:00 PM to 7:00 PM ",
              "type": " O = Open meeting"
          }
      ]
  },
  {
      "address": "420 East 76th Street,(Betw 1st & York Avenues) NY 10021",
      "time": [
          {
              "time": "Fridays From  6:30 PM to 7:30 PM ",
              "type": " B = Beginners meeting"
          }
      ]
  },
  {
      "address": "230 East 90th Street, Downstairs,(Betw 2nd & 3rd Avenues) NY 10128",
      "time": [
          {
              "time": "Sundays From  3:30 PM to 4:30 PM ",
              "type": " B = Beginners meeting"
          }
      ]
  },
  {
      "address": "65 East 89th Street, Basement,(@ Park & Madison Avenues) NY 10128",
      "time": [
          {
              "time": "Tuesdays From  6:15 PM to 7:15 PM ",
              "type": " C = Closed Discussion meeting"
          }
      ]
  },
  {
      "address": "865 Madison Avenue, Basement,(@ East 71st Street) NY 10021",
      "time": [
          {
              "time": "Sundays From  5:00 PM to 5:45 PM ",
              "type": " O = Open meeting ",
              "interest": " Meditation"
          },
          {
              "time": "Sundays From  6:00 PM to 7:00 PM ",
              "type": " S = Step meeting"
          },
          {
              "time": " Sundays From  6:00 PM to 7:00 PM ",
              "type": " OD = Open Discussion meeting"
          },
          {
              "time": " Sundays From  7:15 PM to 8:15 PM ",
              "type": " B = Beginners meeting"
          }
      ]
  },
  {
      "address": "1296 Lexington Avenue, Basement,(Enter through red door on Lexington Avenue, Betw 87th & 88th Streets) NY 10128",
      "time": [
          {
              "time": "Mondays From  7:15 AM to 8:15 AM ",
              "type": " BB = Big Book meeting"
          },
          {
              "time": " Tuesdays From  7:15 AM to 8:15 AM ",
              "type": " OD = Open Discussion meeting"
          },
          {
              "time": " Wednesdays From  7:15 AM to 8:15 AM ",
              "type": " S = Step meeting"
          },
          {
              "time": " Thursdays From  7:15 AM to 8:15 AM ",
              "type": " OD = Open Discussion meeting"
          },
          {
              "time": " Fridays From  7:15 AM to 8:15 AM ",
              "type": " OD = Open Discussion meeting"
          },
          {
              "time": " Sundays From  8:00 AM to 9:00 AM ",
              "type": " OD = Open Discussion meeting"
          },
          {
              "time": " Saturdays From  8:00 AM to 9:00 AM ",
              "type": " OD = Open Discussion meeting"
          },
          {
              "time": " Fridays From  6:15 PM to 7:30 PM ",
              "type": " S = Step meeting ",
              "interest": " Women"
          },
          {
              "time": "Sundays From  7:00 PM to 8:00 PM ",
              "type": " C = Closed Discussion meeting"
          },
          {
              "time": " Wednesdays From  7:30 PM to 9:00 PM ",
              "type": " B = Beginners meeting"
          },
          {
              "time": " Thursdays From  8:00 PM to 9:15 PM ",
              "type": " BB = Big Book meeting"
          }
      ]
  },
  {
      "address": "351 East 74th Street, Mazaryk Room,(Betw. 1st & 2nd Avenues) NY 10021",
      "time": [
          {
              "time": "Sundays From  9:00 AM to 10:00 AM ",
              "type": " S = Step meeting"
          }
      ]
  },
  {
      "address": "1157 Lexington Avenue, 1st Floor,(@ East 80th Street) 10028",
      "time": [
          {
              "time": "Fridays From  7:30 PM to 8:30 PM ",
              "type": " C = Closed Discussion meeting"
          }
      ]
  },
  {
      "address": "351 East 74th Street, Mazaryk Room,(Betw. 1st & 2nd Avenues) 10021",
      "time": [
          {
              "time": "Fridays From  6:30 PM to 7:30 PM ",
              "type": " C = Closed Discussion meeting"
          }
      ]
  },
  {
      "address": "351 East 74th Street, 2nd Floor,(Betw. 1st & 2nd Avenues) NY 10021",
      "time": [
          {
              "time": "Fridays From  8:00 PM to 9:00 PM ",
              "type": " S = Step meeting ",
              "interest": " Gay, Lesbian and Bisexual"
          }
      ]
  },
  {
      "address": "65 East 89th Street,(Betw Madison & Park Avenues) NY 10128",
      "time": [
          {
              "time": "Fridays From  6:15 PM to 7:15 PM ",
              "type": " S = Step meeting ",
              "interest": " Men"
          }
      ]
  },
  {
      "address": "65 East 89th Street - Rectory basement, 10128",
      "time": [
          {
              "time": "Mondays From  6:15 PM to 7:15 PM ",
              "type": " Agnostic"
          }
      ]
  },
  {
      "address": "351 East 74th Street, 2nd Floor,(Betw. 1st & 2nd Avenues ) 10021",
      "time": [
          {
              "time": "Tuesdays From  12:30 PM to 1:30 PM ",
              "type": " B = Beginners meeting"
          },
          {
              "time": " Wednesdays From  12:30 PM to 1:30 PM ",
              "type": " B = Beginners meeting"
          },
          {
              "time": " Thursdays From  12:30 PM to 1:30 PM ",
              "type": " B = Beginners meeting"
          },
          {
              "time": " Fridays From  12:30 PM to 1:30 PM ",
              "type": " B = Beginners meeting"
          },
          {
              "time": " Saturdays From  12:30 PM to 1:30 PM ",
              "type": " B = Beginners meeting"
          },
          {
              "time": " Mondays From  12:30 PM to 1:30 PM ",
              "type": " B = Beginners meeting"
          }
      ]
  },
  {
      "address": "135 East 96th Street,(between Lexington and Park Avenues) NY 10128",
      "time": [
          {
              "time": "Wednesdays From  6:30 PM to 7:30 PM ",
              "type": " S = Step meeting ",
              "interest": " Big Book Workshop"
          }
      ]
  },
  {
      "address": "351 East 74th Street, 2nd Floor Kitchen,(Betw. 1st & 2nd Avenues) 10021",
      "time": [
          {
              "time": "Saturdays From  11:00 AM to 12:00 PM ",
              "type": " C = Closed Discussion meeting"
          }
      ]
  },
  {
      "address": "2 East 90th Street,(Betw 5th & Madison Avenues) NY 10128",
      "time": [
          {
              "time": "Mondays From  7:00 PM to 8:00 PM ",
              "type": " B = Beginners meeting"
          },
          {
              "time": " Mondays From  7:00 PM to 8:00 PM ",
              "type": " S = Step meeting"
          },
          {
              "time": " Thursdays From  7:00 PM to 8:00 PM ",
              "type": " O = Open meeting"
          },
          {
              "time": " Thursdays From  8:15 PM to 9:00 PM ",
              "type": " B = Beginners meeting"
          },
          {
              "time": " Mondays From  8:15 PM to 9:00 PM ",
              "type": " C = Closed Discussion meeting"
          }
      ]
  },
  {
      "address": "1157 Lexington Avenue,(Betw. 79th & 80th Streets) 10028",
      "time": [
          {
              "time": "Wednesdays From  6:30 PM to 7:30 PM ",
              "type": " S = Step meeting ",
              "interest": " Twelve Steps"
          }
      ]
  },
  {
      "address": "420 East 76th Street,(Betw. 1st & York  Avenues) NY 10021",
      "time": [
          {
              "time": "Tuesdays From  7:00 PM to 8:00 PM ",
              "type": " B = Beginners meeting ",
              "interest": " Gay, Lesbian and Bisexual"
          },
          {
              "time": "Thursdays From  7:00 PM to 8:00 PM ",
              "type": " OD = Open Discussion meeting ",
              "interest": " Gay, Lesbian and Bisexual"
          },
          {
              "time": "Tuesdays From  8:30 PM to 9:30 PM ",
              "type": " C = Closed Discussion meeting ",
              "interest": " Gay, Lesbian and Bisexual"
          }
      ]
  },
  {
      "address": "351 East 74th Street, 2nd Floor,(Betw.1st & 2nd Avenues) NY 10021",
      "time": [
          {
              "time": "Saturdays From  7:00 PM to 8:00 PM ",
              "type": " B = Beginners meeting"
          },
          {
              "time": " Saturdays From  7:00 PM to 8:00 PM ",
              "type": " S = Step meeting"
          }
      ]
  },
  {
      "address": "351 East 74th Street, 2nd Floor Chapel Room,(Betw. 1st & 2nd Avenues) NY 10021",
      "time": [
          {
              "time": "Thursdays From  11:00 AM to 12:00 PM ",
              "type": " OD = Open Discussion meeting"
          },
          {
              "time": " Fridays From  11:00 AM to 12:00 PM ",
              "type": " OD = Open Discussion meeting"
          },
          {
              "time": " Mondays From  11:00 AM to 12:00 PM ",
              "type": " OD = Open Discussion meeting"
          },
          {
              "time": " Tuesdays From  11:00 AM to 12:00 PM ",
              "type": " OD = Open Discussion meeting"
          },
          {
              "time": " Wednesdays From  11:00 AM to 12:00 PM ",
              "type": " OD = Open Discussion meeting"
          },
          {
              "time": " Wednesdays From  8:00 PM to 9:00 PM ",
              "type": " OD = Open Discussion meeting"
          }
      ]
  },
  {
      "address": "1285 Madison Avenue, 10128",
      "time": [
          {
              "time": "Wednesdays From  7:00 PM to 8:30 PM ",
              "type": " BB = Big Book meeting"
          }
      ]
  },
  {
      "address": "48 East 84th Street,(Betw Madison & Park Avenues, On Saturday enter via Park Avenue Entrance) NY 10028",
      "time": [
          {
              "time": "Saturdays From  3:15 PM to 4:15 PM ",
              "type": " S = Step meeting ",
              "interest": " First Step Workshop"
          },
          {
              "time": "Sundays From  6:15 PM to 7:15 PM ",
              "type": " B = Beginners meeting"
          },
          {
              "time": " Tuesdays From  6:30 PM to 7:30 PM"
          },
          {
              "time": " Sundays From  7:30 PM to 8:30 PM ",
              "type": " S = Step meeting"
          },
          {
              "time": " Tuesdays From  7:45 PM to 8:45 PM ",
              "type": " B = Beginners meeting"
          }
      ]
  },
  {
      "address": "408 East 82nd Street,  Rectory,(Betw 1st & York Avenues) NY 10028",
      "time": [
          {
              "time": "Mondays From  7:00 PM to 8:00 PM ",
              "type": " C = Closed Discussion meeting"
          }
      ]
  },
  {
      "address": "351 East 74th Street, 2nd Floor Front Room,(Betw. 1st & 2nd Avenues) 10021",
      "time": [
          {
              "time": "Mondays From  7:15 PM to 8:15 PM ",
              "type": " C = Closed Discussion meeting ",
              "interest": " Women"
          }
      ]
  },
  {
      "address": "351 East 74th Street,  2nd Floor - Front Room,(Betw 1st & 2nd Avenues) 10021",
      "time": [
          {
              "time": "Wednesdays From  9:30 AM to 10:30 AM ",
              "type": " OD = Open Discussion meeting ",
              "interest": " Daily Reflections"
          },
          {
              "time": "Thursdays From  9:30 AM to 10:30 AM ",
              "type": " OD = Open Discussion meeting ",
              "interest": " Daily Reflections"
          },
          {
              "time": "Fridays From  9:30 AM to 10:30 AM ",
              "type": " OD = Open Discussion meeting ",
              "interest": " Daily Reflections"
          },
          {
              "time": "Mondays From  9:30 AM to 10:30 AM ",
              "type": " OD = Open Discussion meeting ",
              "interest": " Daily Reflections"
          },
          {
              "time": "Tuesdays From  9:30 AM to 10:30 AM ",
              "type": " OD = Open Discussion meeting ",
              "interest": " Daily Reflections"
          }
      ]
  },
  {
      "address": "125 East 85th Street, Ramaz School Entrance,(@ Lexington Avenue) NY 10028",
      "time": [
          {
              "time": "Mondays From  6:30 PM to 7:30 PM ",
              "type": " C = Closed Discussion meeting"
          },
          {
              "time": " Wednesdays From  6:30 PM to 7:30 PM ",
              "type": " S = Step meeting"
          }
      ]
  },
  {
      "address": "351 East 74th Street,  2nd Floor, Library Room,(Betw. 1st & 2nd Avenues) 10021",
      "time": [
          {
              "time": "Mondays From  7:15 PM to 8:15 PM ",
              "type": " BB = Big Book meeting"
          }
      ]
  },
  {
      "address": "351 East 74th Street, 2nd Floor Kitchen,(Betw. 1st & 2nd Avenues) 10021",
      "time": [
          {
              "time": "Saturdays From  9:30 AM to 10:30 AM ",
              "type": " S = Step meeting ",
              "interest": " Women"
          }
      ]
  },
  {
      "address": "865 Madison Avenue, 3rd Floor,(Betw. 71st & 72nd Streets) 10021",
      "time": [
          {
              "time": "Wednesdays From  12:30 PM to 1:30 PM ",
              "type": " C = Closed Discussion meeting"
          },
          {
              "time": " Thursdays From  12:30 PM to 1:30 PM ",
              "type": " C = Closed Discussion meeting"
          }
      ]
  },
  {
      "address": "62 East 92nd Street, Basement,(Betw Madison & Park Avenues) NY 10128",
      "time": [
          {
              "time": "Fridays From  6:45 PM to 7:45 PM ",
              "type": " C = Closed Discussion meeting"
          },
          {
              "time": " Tuesdays From  6:45 PM to 7:45 PM ",
              "type": " B = Beginners meeting"
          },
          {
              "time": " Tuesdays From  8:00 PM to 9:00 PM ",
              "type": " C = Closed Discussion meeting"
          },
          {
              "time": " Fridays From  8:00 PM to 9:00 PM ",
              "type": " S = Step meeting"
          }
      ]
  },
  {
      "address": "351 East 74th Street, 2nd Floor Front Room,(Betw. 1st & 2nd Avenues) NY 10021",
      "time": [
          {
              "time": "Saturdays From  11:00 AM to 12:00 PM ",
              "type": " OD = Open Discussion meeting"
          }
      ]
  },
  {
      "address": "420 East 87th Street, Basement,(Betw 1st & York Avenues) Enter thru Red Door NY 10128",
      "time": [
          {
              "time": "Wednesdays From  7:00 PM to 8:00 PM ",
              "type": " B = Beginners meeting"
          }
      ]
  },
  {
      "address": "593 Park Avenue,  5th Floor Library,(@ 64th Street) 10128",
      "time": [
          {
              "time": "Wednesdays From  6:30 PM to 7:30 PM ",
              "type": " C = Closed Discussion meeting"
          }
      ]
  },
  {
      "address": "65 East 89th Street, Ring Red Buzzer, Chelsea Room,(Betw. Park & Madison Avenues) 10128",
      "time": [
          {
              "time": "Thursdays From  6:30 PM to 7:30 PM ",
              "type": " OD = Open Discussion meeting"
          }
      ]
  },
  {
      "address": "865 Madison Avenue,  Basement,(@ East 71st Street) NY 10021",
      "time": [
          {
              "time": "Mondays From  6:00 PM to 7:00 PM ",
              "type": " OD = Open Discussion meeting"
          },
          {
              "time": " Thursdays From  6:00 PM to 7:00 PM ",
              "type": " S = Step meeting"
          },
          {
              "time": " Thursdays From  7:00 PM to 8:00 PM ",
              "type": " B = Beginners meeting"
          },
          {
              "time": " Mondays From  7:00 PM to 8:00 PM ",
              "type": " B = Beginners meeting"
          }
      ]
  },
  {
      "address": "543 Main St., Basement 10044,",
      "time": [
          {
              "time": "Saturdays From  6:30 PM to 7:30 PM ",
              "type": " C = Closed Discussion meeting"
          }
      ]
  },
  {
      "address": "413 East 79th Street,  Basement,(Betw 1st & York Avenues) NY 10021",
      "time": [
          {
              "time": "Tuesdays From  6:00 AM to 7:00 AM ",
              "type": " C = Closed Discussion meeting"
          },
          {
              "time": " Mondays From  6:00 AM to 7:00 AM ",
              "type": " C = Closed Discussion meeting ",
              "interest": " Daily Reflections"
          },
          {
              "time": "Fridays From  6:00 AM to 7:00 AM ",
              "type": " BB = Big Book meeting"
          },
          {
              "time": " Thursdays From  6:00 AM to 7:00 AM ",
              "type": " S = Step meeting"
          },
          {
              "time": " Wednesdays From  6:00 AM to 7:00 AM ",
              "type": " C = Closed Discussion meeting ",
              "interest": " As Bill Sees It"
          },
          {
              "time": "Tuesdays From  7:15 AM to 8:15 AM ",
              "type": " C = Closed Discussion meeting"
          },
          {
              "time": " Mondays From  7:15 AM to 8:15 AM ",
              "type": " C = Closed Discussion meeting"
          },
          {
              "time": " Fridays From  7:15 AM to 8:15 AM ",
              "type": " C = Closed Discussion meeting"
          },
          {
              "time": " Thursdays From  7:15 AM to 8:15 AM ",
              "type": " C = Closed Discussion meeting"
          },
          {
              "time": " Wednesdays From  7:15 AM to 8:15 AM ",
              "type": " C = Closed Discussion meeting"
          },
          {
              "time": " Saturdays From  8:00 AM to 9:00 AM ",
              "type": " C = Closed Discussion meeting"
          },
          {
              "time": " Sundays From  8:00 AM to 9:00 AM ",
              "type": " C = Closed Discussion meeting"
          },
          {
              "time": " Wednesdays From  8:30 AM to 9:30 AM ",
              "type": " T = Tradition meeting"
          },
          {
              "time": " Tuesdays From  8:30 AM to 9:30 AM ",
              "type": " C = Closed Discussion meeting ",
              "interest": " Promises"
          },
          {
              "time": "Mondays From  8:30 AM to 9:30 AM ",
              "type": " C = Closed Discussion meeting"
          },
          {
              "time": " Fridays From  8:30 AM to 9:30 AM ",
              "type": " S = Step meeting"
          },
          {
              "time": " Thursdays From  8:30 AM to 9:30 AM ",
              "type": " BB = Big Book meeting"
          },
          {
              "time": " Thursdays From  10:00 AM to 11:00 AM ",
              "type": " T = Tradition meeting"
          },
          {
              "time": " Wednesdays From  10:00 AM to 11:00 AM ",
              "type": " C = Closed Discussion meeting"
          },
          {
              "time": " Tuesdays From  10:00 AM to 11:00 AM ",
              "type": " S = Step meeting"
          },
          {
              "time": " Mondays From  10:00 AM to 11:00 AM ",
              "type": " B = Beginners meeting"
          },
          {
              "time": " Saturdays From  10:00 AM to 11:00 AM ",
              "type": " C = Closed Discussion meeting ",
              "interest": " Children Welcome"
          },
          {
              "time": "Sundays From  10:00 AM to 11:00 AM ",
              "type": " S = Step meeting"
          },
          {
              "time": " Fridays From  10:00 AM to 11:00 AM ",
              "type": " BB = Big Book meeting"
          },
          {
              "time": " Thursdays From  12:30 PM to 1:30 PM ",
              "type": " C = Closed Discussion meeting"
          },
          {
              "time": " Wednesdays From  12:30 PM to 1:30 PM ",
              "type": " S = Step meeting"
          },
          {
              "time": " Tuesdays From  12:30 PM to 1:30 PM ",
              "type": " C = Closed Discussion meeting"
          },
          {
              "time": " Mondays From  12:30 PM to 1:30 PM ",
              "type": " B = Beginners meeting"
          },
          {
              "time": " Saturdays From  12:30 PM to 1:30 PM ",
              "type": " C = Closed Discussion meeting"
          },
          {
              "time": " Sundays From  12:30 PM to 1:30 PM ",
              "type": " C = Closed Discussion meeting"
          },
          {
              "time": " Fridays From  12:30 PM to 1:30 PM ",
              "type": " C = Closed Discussion meeting"
          },
          {
              "time": " Saturdays From  2:00 PM to 3:00 PM ",
              "type": " C = Closed Discussion meeting ",
              "interest": " Women"
          },
          {
              "time": "Sundays From  2:00 PM to 3:00 PM ",
              "type": " C = Closed Discussion meeting ",
              "interest": " Men"
          },
          {
              "time": "Fridays From  4:00 PM to 5:00 PM ",
              "type": " S = Step meeting ",
              "interest": " First Step Workshop"
          },
          {
              "time": "Thursdays From  4:00 PM to 5:00 PM ",
              "type": " C = Closed Discussion meeting"
          },
          {
              "time": " Wednesdays From  4:00 PM to 5:00 PM ",
              "type": " B = Beginners meeting"
          },
          {
              "time": " Tuesdays From  4:00 PM to 5:00 PM ",
              "type": " BB = Big Book meeting"
          },
          {
              "time": " Mondays From  4:00 PM to 5:00 PM ",
              "type": " B = Beginners meeting"
          },
          {
              "time": " Saturdays From  4:00 PM to 5:00 PM ",
              "type": " S = Step meeting ",
              "interest": " Steps 1-2-3"
          },
          {
              "time": "Sundays From  4:00 PM to 5:00 PM ",
              "type": " C = Closed Discussion meeting ",
              "interest": " As Bill Sees It"
          },
          {
              "time": "Fridays From  6:15 PM to 7:15 PM ",
              "type": " C = Closed Discussion meeting ",
              "interest": " Children Welcome"
          },
          {
              "time": "Thursdays From  6:15 PM to 7:15 PM ",
              "type": " O = Open meeting"
          },
          {
              "time": " Wednesdays From  6:15 PM to 7:15 PM ",
              "type": " B = Beginners meeting"
          },
          {
              "time": " Tuesdays From  6:15 PM to 7:15 PM ",
              "type": " S = Step meeting"
          },
          {
              "time": " Mondays From  6:15 PM to 7:15 PM ",
              "type": " T = Tradition meeting"
          },
          {
              "time": " Saturdays From  6:15 PM to 7:15 PM ",
              "type": " B = Beginners meeting"
          },
          {
              "time": " Sundays From  6:15 PM to 7:15 PM ",
              "type": " OD = Open Discussion meeting"
          },
          {
              "time": " Sundays From  8:00 PM to 9:00 PM ",
              "type": " C = Closed Discussion meeting ",
              "interest": " Promises"
          },
          {
              "time": "Fridays From  8:00 PM to 9:00 PM ",
              "type": " B = Beginners meeting"
          },
          {
              "time": " Wednesdays From  8:00 PM to 9:00 PM ",
              "type": " BB = Big Book meeting"
          },
          {
              "time": " Tuesdays From  8:00 PM to 9:00 PM ",
              "type": " C = Closed Discussion meeting ",
              "interest": " Sponsorship Workshop"
          },
          {
              "time": "Saturdays From  8:00 PM to 9:00 PM ",
              "type": " O = Open meeting"
          },
          {
              "time": " Saturdays From  10:00 PM to 11:00 PM ",
              "type": " C = Closed Discussion meeting"
          },
          {
              "time": " Sundays From  10:00 PM to 11:00 PM ",
              "type": " C = Closed Discussion meeting"
          },
          {
              "time": " Fridays From  10:00 PM to 11:00 PM ",
              "type": " C = Closed Discussion meeting"
          },
          {
              "time": " Thursdays From  10:00 PM to 11:00 PM ",
              "type": " S = Step meeting"
          },
          {
              "time": " Tuesdays From  10:00 PM to 11:00 PM ",
              "type": " C = Closed Discussion meeting"
          },
          {
              "time": " Mondays From  10:00 PM to 11:00 PM ",
              "type": " B = Beginners meeting"
          },
          {
              "time": " Wednesdays From  10:00 PM to 11:00 PM ",
              "type": " C = Closed Discussion meeting"
          }
      ]
  },
  {
      "address": "351 East 74th Street, Sanctuary,(Betw. 1st & 2nd Avenues) NY 10021",
      "time": [
          {
              "time": "Saturdays From  9:15 AM to 10:15 AM ",
              "type": " C = Closed Discussion meeting ",
              "interest": " Women"
          }
      ]
  },
  {
      "address": "310 East 67th Street, Auditorium,(Betw. 1st & 2nd Avenues) NY 10065",
      "time": [
          {
              "time": "Saturdays From  10:00 AM to 11:00 AM ",
              "type": " S = Step meeting"
          }
      ]
  },
  {
      "address": "331 E 70th St,(Betw 1st & 2nd Avenues) NY 10021",
      "time": [
          {
              "time": "Sundays From  10:00 AM to 11:00 AM ",
              "type": " B = Beginners meeting"
          }
      ]
  },
  {
      "address": "411 East 68th Street,(Betw. York & 1st Avenues) NY 10021",
      "time": [
          {
              "time": "Saturdays From  6:30 PM to 7:30 PM ",
              "type": " OD = Open Discussion meeting"
          }
      ]
  },
  {
      "address": "2 East 90th Street, Basement,(Enter thru the Family Chapel on 5th Avenue) NY 10128",
      "time": [
          {
              "time": "Tuesdays From  12:00 PM to 1:00 PM ",
              "type": " C = Closed Discussion meeting"
          },
          {
              "time": " Thursdays From  12:00 PM to 1:00 PM ",
              "type": " C = Closed Discussion meeting"
          }
      ]
  },
  {
      "address": "341 East 87th Street,  Choir Room (Ring Bell),(Btw. 1st & 2nd Avenues) NY 10128",
      "time": [
          {
              "time": "Fridays From  7:00 PM to 8:00 PM ",
              "type": " S = Step meeting"
          },
          {
              "time": " Tuesdays From  7:15 PM to 8:15 PM ",
              "type": " B = Beginners meeting"
          },
          {
              "time": " Fridays From  8:30 PM to 9:30 PM ",
              "type": " B = Beginners meeting"
          },
          {
              "time": " Tuesdays From  8:30 PM to 9:30 PM ",
              "type": " C = Closed Discussion meeting"
          }
      ]
  },
  {
      "address": "351 East 74th Street,  2nd Floor Museum Room,(Betw 1st & 2nd Avenues) NY 10021",
      "time": [
          {
              "time": "Wednesdays From  6:15 PM to 7:15 PM ",
              "type": " C = Closed Discussion meeting ",
              "interest": " Agnostic"
          }
      ]
  },
  {
      "address": "351 East 74th Street, 2nd Floor Kitchen,(Betw. 1st & 2nd Avenues) NY 10021",
      "time": [
          {
              "time": "Thursdays From  8:00 PM to 9:00 PM ",
              "type": " C = Closed Discussion meeting"
          }
      ]
  },
  {
      "address": "351 East 74th Street,  2nd Floor,  Masaryk Room,(Betw 1st & 2nd Avenues) NY 10021",
      "time": [
          {
              "time": "Thursdays From  8:00 PM to 9:00 PM ",
              "type": " C = Closed Discussion meeting"
          }
      ]
  }
].map(o => o.address.split(',')[0])

// console.log(addresses)
// eachSeries in the async module iterates over an array and operates on each item in the array in series
async.map(addresses, async function(value, callback) {
  // console.log(callback.toString())
    let query = {
        streetAddress: value,
        city: "New York",
        state: "NY",
        apikey: API_KEY,
        format: "json",
        version: "4.01"
    };

    // // construct a querystring from the `query` object's values and append it to the api URL
    let apiRequest = API_URL + '?' + querystring.stringify(query);
    console.log('hello')
    // callback()
    console.log(query)
    // callback()
    // (async () => {
    // 	try {
    // 		const response = await got(apiRequest);
    //     var resBody = JSON.parse(response.body)

    //     let obj = {
    //       address: value + ', New York, NY',
    //       latLong: {
    //         lat: resBody.OutputGeocodes[0].OutputGeocode.Latitude,
    //         long: resBody.OutputGeocodes[0].OutputGeocode.Longitude
    //       }
    //     }
    // 		meetingsData.push(obj);
    // 	} catch (error) {
    // 		console.log(error.response.body);
    // 	}
    // })();

    // (async () => {
    //   console.log('trying')
    // 	try {
    	  const response = await got(apiRequest);
        var resBody = JSON.parse(response.body)
        console.log(resBody)

        let obj = {
          address: value + ', New York, NY',
          latLong: {
            lat: resBody.OutputGeocodes[0].OutputGeocode.Latitude,
            long: resBody.OutputGeocodes[0].OutputGeocode.Longitude
          }
        }

        return obj
        
    	//   meetingsData.push(obj);
    	// } catch (error) {
    	//   console.log(error.response.body);
    	// }
    // })();

    // sleep for a couple seconds before making the next request
    // setTimeout(callback, 2000);
}, function(err, results) {
  console.log(err, results)
    // console.log('*** *** *** *** ***');
    // console.log(`Number of meetings in this zone: ${meetingsData.length}`);
    fs.writeFileSync('./full-geocodes.txt', JSON.stringify(results))
});
// async.eachSeries(addresses, async function(value, callback) {
//   // console.log(callback.toString())
//     let query = {
//         streetAddress: value,
//         city: "New York",
//         state: "NY",
//         apikey: API_KEY,
//         format: "json",
//         version: "4.01"
//     };

//     // // construct a querystring from the `query` object's values and append it to the api URL
//     let apiRequest = API_URL + '?' + querystring.stringify(query);
//     console.log('hello')
//     callback()
//     console.log(query)
//     // callback()
//     // (async () => {
//     // 	try {
//     // 		const response = await got(apiRequest);
//     //     var resBody = JSON.parse(response.body)

//     //     let obj = {
//     //       address: value + ', New York, NY',
//     //       latLong: {
//     //         lat: resBody.OutputGeocodes[0].OutputGeocode.Latitude,
//     //         long: resBody.OutputGeocodes[0].OutputGeocode.Longitude
//     //       }
//     //     }
//     // 		meetingsData.push(obj);
//     // 	} catch (error) {
//     // 		console.log(error.response.body);
//     // 	}
//     // })();

//     (async () => {
//       console.log('trying')
//     	try {
//     	  const response = await got(apiRequest);
//         var resBody = JSON.parse(response.body)
//         console.log(resBody)

//         let obj = {
//           address: value + ', New York, NY',
//           latLong: {
//             lat: resBody.OutputGeocodes[0].OutputGeocode.Latitude,
//             long: resBody.OutputGeocodes[0].OutputGeocode.Longitude
//           }
//         }
        
//     	  meetingsData.push(obj);
//     	} catch (error) {
//     	  console.log(error.response.body);
//     	}
//     })();

//     // sleep for a couple seconds before making the next request
//     setTimeout(callback, 2000);
// }, function() {
//     console.log('*** *** *** *** ***');
//     console.log(`Number of meetings in this zone: ${meetingsData.length}`);
//     fs.writeFileSync('./full-geocodes.txt', JSON.stringify(meetingsData))
// });
