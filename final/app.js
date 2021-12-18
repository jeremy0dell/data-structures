var express = require('express'), 
    app = express();
const { Pool } = require('pg');
var AWS = require('aws-sdk');
const moment = require('moment-timezone');
const handlebars = require('handlebars');
var fs = require('fs');
const { initializeApp } = require("firebase/app");
const { getFirestore, addDoc, collection, query, where, getDocs } = require("firebase/firestore")

const dotenv = require('dotenv');
dotenv.config();


// Import the functions you need from the SDKs you need
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: process.env.FIREBASE_API,
  authDomain: "processblog-ce6c8.firebaseapp.com",
  databaseURL: "https://processblog-ce6c8-default-rtdb.firebaseio.com",
  projectId: "processblog-ce6c8",
  storageBucket: "processblog-ce6c8.appspot.com",
  messagingSenderId: "865820007402",
  appId: "1:865820007402:web:dc26145e50e1e901d43093"
};

// Initialize Firebase
const fbApp = initializeApp(firebaseConfig);

const db = getFirestore();

// const indexSource = fs.readFileSync("templates/sensor.txt").toString();
// var template = handlebars.compile(indexSource, { strict: true });

// const pbSource = fs.readFileSync("templates/pb.txt").toString();
// var pbtemplate = handlebars.compile(pbSource, { strict: true });

// AWS RDS credentials
var db_credentials = new Object();
db_credentials.user = 'postgres';
db_credentials.host = 'data-structures.chboz4qf98nw.us-east-1.rds.amazonaws.com';
db_credentials.database = 'aa';
db_credentials.password = process.env.AWSRDS_PW;
db_credentials.port = 5432;

// create templates
var hx = `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>AA Meetings</title>
  <meta name="description" content="Meetings of AA in Manhattan">
  <meta name="author" content="AA">
  <link rel="stylesheet" href="./styles.css">
    <link rel="stylesheet" href="https://unpkg.com/leaflet@1.6.0/dist/leaflet.css"
       integrity="sha512-xwE/Az9zrjBIphAcBb3F6JVqxf46+CDLwfLMHloNu6KEQCAWi6HcDUbeOfBIptF7tcCzusKFjFw2yuvEpDL9wQ=="
       crossorigin=""/>
</head>
<body>
<h1>Jeremy Odell's AA Map</h1>
<div id="mapid"></div>
<script src="https://unpkg.com/leaflet@1.6.0/dist/leaflet.js"
   integrity="sha512-gZwIG9x3wUXg2hdXF6+rVkLF/0Vi9U8D2Ntg4Ga5I5BZpVkVxlJWbSQtXPSiUTtC0TjtGOmxa1AJPuV0CPthew=="
   crossorigin=""></script>
  <script>
  var data = 
  `;
  
var jx = `;
    var mymap = L.map('mapid').setView([40.734636,-73.994997], 13);
    L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
    attribution: '© <a href="https://www.mapbox.com/about/maps/">Mapbox</a> © <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> <strong><a href="https://www.mapbox.com/map-feedback/" target="_blank">Improve this map</a></strong>',
    tileSize: 512,
    maxZoom: 18,
    zoomOffset: -1,
    id: 'mapbox/streets-v11',
        accessToken: 'pk.eyJ1Ijoidm9ucmFtc3kiLCJhIjoiY2pveGF1MmxoMjZnazNwbW8ya2dsZTRtNyJ9.mJ1kRVrVnwTFNdoKlQu_Cw'
    }).addTo(mymap);
    for (var i=0; i<data.length; i++) {
        L.marker( [data[i].lat, data[i].long] ).bindPopup(data[i].address +' - '+ data[i].time).addTo(mymap);
    }
    </script>
    </body>
    </html>`;


// create templates
var blogStart = `<!doctype html>
<html lang="en">
    <head>
    <meta charset="utf-8">
    <title>AA Meetings</title>
    <meta name="description" content="Meetings of AA in Manhattan">
    <meta name="author" content="AA">
    <link rel="stylesheet" href="./styles.css">
        <link rel="stylesheet" href="https://unpkg.com/leaflet@1.6.0/dist/leaflet.css"
        integrity="sha512-xwE/Az9zrjBIphAcBb3F6JVqxf46+CDLwfLMHloNu6KEQCAWi6HcDUbeOfBIptF7tcCzusKFjFw2yuvEpDL9wQ=="
        crossorigin=""/>
    </head>
    <body style="background-color: black; color: white;">
        <h1>Jeremy Odell's Process Blog!!</h1>
        <select id="exercise" name="exercise">
            <option value="">None</option>
            <option value="lifting">Lifting</option>
            <option value="cardio">Cardio</option>
        </select>
        <div id="items"></div>
  `;

var blogEnd = `
        <script>
            console.log('i work')
            const selectElement = document.querySelector('#exercise');
            console.log(selectElement)

            selectElement.addEventListener('change', (event) => {
                console.log(event.target.value)
                window.location.href = window.location.pathname+"?"+'exercise='+event.target.value
            });
        </script>
    </body>
</html>
`

  
app.get('/', function(req, res) {
    res.send('<h3>Code demo site</h3><ul><li><a href="/aa">aa meetings</a></li><li><a href="/temperature">temp sensor</a></li><li><a href="/processblog">process blog</a></li></ul>');
}); 

// respond to requests for /aa
app.get('/aa', function(req, res) {


    var now = moment.tz(Date.now(), "America/New_York"); 
    var dayy = now.day().toString(); 
    var hourr = now.hour().toString(); 

    // Connect to the AWS RDS Postgres database
    const client = new Pool(db_credentials);

    // SQL query 
    var thisQuery = `SELECT * FROM aafull WHERE address LIKE '%Avenue%';`;

    console.log(thisQuery)

    client.query(thisQuery, (qerr, qres) => {
        if (qerr) {
            console.log('err')
        } else {
            console.log('ok', qres)
            resp = hx + JSON.stringify(qres.rows) + jx;
            res.send(resp);
            client.end();
            console
            // res.send('hello' + JSON.stringify(qres.rows))
        }
        console.log('ehllo', qerr, qres)
    });
});

app.get('/processblog', async function(req, res) {
    // console.log(db)
    // try {
    //     const docRef = await addDoc(collection(db, "workouts"), {
    //         "time": 53,
    //         "date": "2021-11-24",
    //         "exercise": "lifting",
    //         "type": "legs"
    //     });
      
    //     console.log("Document written with ID: ", docRef.id);
    //   } catch (e) {
    //     console.error("Error adding document: ", e);
    //   }

    if (req.query.exercise) {
        let exercise = req.query.exercise
      
        const coll = collection(db, "workouts");
    
        const q = query(coll, where("exercise", "==", exercise));
    
        const querySnapshot = await getDocs(q);
    
        const myWorkouts = querySnapshot.docs.map(doc => doc.data())
    
        
        console.log(myWorkouts.map(workout => ({...workout, date: new Date(workout.date)})))
        // querySnapshot.forEach((doc) => {
        //   console.log(doc);
        // });
        res.send(blogStart + myWorkouts.map(w => `<div>
            <div>Type: ${w.exercise}</div>
            <div>Exercise: ${w.type}</div>
            <div>Time Spent: ${w.time}</div>
            <div>Date: ${moment(new Date(w.date)).format('MM-YYYY')}</div>
        </div>`) + blogEnd)
    
    } else {
        res.send(blogStart + blogEnd)
    }
    // let exercise = req.query.exercise
      
    // const coll = collection(db, "workouts");

    // const q = query(coll, where("exercise", "==", exercise));

    // const querySnapshot = await getDocs(q);

    // const myWorkouts = querySnapshot.docs.map(doc => doc.data())

    
    // console.log(myWorkouts.map(workout => ({...workout, date: new Date(workout.date)})))
    // // querySnapshot.forEach((doc) => {
    // //   console.log(doc);
    // // });
    // res.send(blogStart + myWorkouts.map(w => `<div>
    //     <div>Type: ${w.exercise}</div>
    //     <div>Exercise: ${w.type}</div>
    //     <div>Time Spent: ${w.time}</div>
    //     <div>Date: ${moment(new Date(w.date)).format('MM-YYYY')}</div>
    // </div>`) + blogEnd)
    
    // AWS DynamoDB credentials
    // AWS.config = new AWS.Config();
    // AWS.config.region = "us-east-1";
    // console.log(req.query.type);
    // var topic = "cats";
    // if (["cats", "personal", "work"].includes(req.query.type)) {
    //     topic = req.query.type;
    // }

    // // Connect to the AWS DynamoDB database
    // var dynamodb = new AWS.DynamoDB();

    // // DynamoDB (NoSQL) query
    // var params = {
    //     TableName : "aaronprocessblog",
    //     KeyConditionExpression: "topic = :topic", // the query expression
    //     ExpressionAttributeValues: { // the query values
    //         ":topic": {S: topic}
    //     }
    // };

    // dynamodb.query(params, function(err, data) {
    //     if (err) {
    //         console.error("Unable to query. Error:", JSON.stringify(err, null, 2));
    //         throw (err);
    //     }
    //     else {
    //         console.log(data.Items)
    //         res.end(pbtemplate({ pbdata: JSON.stringify(data.Items)}));
    //         console.log('3) responded to request for process blog data');
    //     }
    // });
});

// serve static files in /public
app.use(express.static('public'));

app.use(function (req, res, next) {
  res.status(404).send("Sorry can't find that!");
});

// listen on port 8080
var port = process.env.PORT || 8080;

app.listen(port, function() {
    console.log('Server listening on 8080...');
});