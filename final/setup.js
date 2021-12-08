const { Client } = require('pg');
var async = require('async');  

const dotenv = require('dotenv');
dotenv.config();  


const data = require('./full-times.json')


// AWS RDS POSTGRESQL INSTANCE
var db_credentials = new Object();
db_credentials.user = 'postgres';
db_credentials.host = 'data-structures.chboz4qf98nw.us-east-1.rds.amazonaws.com';
db_credentials.database = 'aa';
db_credentials.password = process.env.AWSRDS_PW;
db_credentials.port = 5432;

// Connect to the AWS RDS Postgres database
const client = new Client(db_credentials);
client.connect();
// time
// type
// interest
// Sample SQL statement to create a table: 
// var thisQuery = "CREATE TABLE aafull (address varchar(100), time varchar(100), type varchar(100), interest varchar(100), lat double precision, long double precision);";
// Sample SQL statement to delete a table: 
// var thisQuery = "DROP TABLE aalocations;"; 
async.eachSeries(data, function(value, callback) {
    const client = new Client(db_credentials);
    client.connect();
    var thisQuery = "INSERT INTO aafull VALUES (E'" + value.address + "', '" + value.time + "', '" + value.type + "', '" + value.interest + "', " + value.lat + ", " + value.long + ");";
    console.log(thisQuery)
    client.query(thisQuery, (err, res) => {
        console.log(err, res);
        client.end();
    });
    setTimeout(callback, 1000); 
}); 