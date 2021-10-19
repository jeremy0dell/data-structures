const { Client } = require('pg');
const dotenv = require('dotenv');
dotenv.config();  

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

// Sample SQL statement to create a table: 
// var thisQuery = "CREATE TABLE aalocations (address varchar(100), lat double precision, long double precision);";
// Sample SQL statement to delete a table: 
// var thisQuery = "DROP TABLE aalocations;"; 

var addresses = [
    {"address":"109 West 129th Street, New York, NY","latLong":{"lat":"40.8105033439451","long":"-73.9438349756133"}},
    {"address":"240 West 145th Street, New York, NY","latLong":{"lat":"40.8220449603096","long":"-73.9402738669626"}},
    {"address":"469 West 142nd Street, New York, NY","latLong":{"lat":"40.8232200234845","long":"-73.9485449135295"}},
    {"address":"204 West 134th Street, New York, NY","latLong":{"lat":"40.8146053686072","long":"-73.9443570754889"}},
    {"address":"2044 Adam Clayton Powell Blvd., New York, NY","latLong":{"lat":"40.8072665297278","long":"-73.9499061022154"}},
    {"address":"469 West 142nd Street, New York, NY","latLong":{"lat":"40.8232200234845","long":"-73.9485449135295"}},
    {"address":"521 W 126th St, New York, NY","latLong":{"lat":"40.8144929933342","long":"-73.9558896362264"}},
    {"address":"109 West 129th Street, New York, NY","latLong":{"lat":"40.8105033439451","long":"-73.9438349756133"}},
    {"address":"469 West 142nd Street, New York, NY","latLong":{"lat":"40.8232200234845","long":"-73.9485449135295"}},
    {"address":"2044 Seventh Avenue, New York, NY","latLong":{"lat":"40.8071759186691","long":"-73.9497519327616"}},
    {"address":"127 West 127th Street, New York, NY","latLong":{"lat":"40.8094766772235","long":"-73.9452613355488"}},
    {"address":"310 West 139th Street, New York, NY","latLong":{"lat":"40.8190256453939","long":"-73.9448681362397"}},
    {"address":"409 West 141st Street, New York, NY","latLong":{"lat":"40.8215326572652","long":"-73.9464830279892"}},
    {"address":"91 Claremont Avenue, New York, NY","latLong":{"lat":"40.812","long":"-73.9625"}},
    {"address":"1727 Amsterdam Avenue, New York, NY","latLong":{"lat":"40.8255371320577","long":"-73.9471630832303"}},
    {"address":"469 West 142nd Street, New York, NY","latLong":{"lat":"40.8232200234845","long":"-73.9485449135295"}},
    {"address":"91 Claremont Avenue, New York, NY","latLong":{"lat":"40.8119642222478","long":"-73.9625130600971"}},
    {"address":"219 West 132nd Street, New York, NY","latLong":{"lat":"40.8136938017217","long":"-73.9455988432903"}},
    {"address":"211 West 129th Street, New York, NY","latLong":{"lat":"40.811646918986","long":"-73.9465692736586"}},
    {"address":"425 West 144th Street, New York, NY","latLong":{"lat":"40.8238859925299","long":"-73.9462723904462"}},
    {"address":"204 West 134th Street, New York, NY","latLong":{"lat":"40.8146053686072","long":"-73.9443570754889"}},
    {"address":"506 Lenox Avenue, New York, NY","latLong":{"lat":"40.8143","long":"-73.9403"}},
    {"address":"1727 Amsterdam Avenue, New York, NY","latLong":{"lat":"40.8255","long":"-73.9472"}},
    {"address":"1854 Amsterdam Avenue, New York, NY","latLong":{"lat":"40.8295984557205","long":"-73.9446555334471"}},
    {"address":"469 West 142nd Street, New York, NY","latLong":{"lat":"40.8232200234845","long":"-73.9485449135295"}},
    {"address":"58-66 West 135th Street, New York, NY","latLong":{"lat":"40.6639307188879","long":"-73.9382749875207"}}
]

/*
I use this code to run the asynchronous client.query on every member of the addresses Array
Promise.all works by executing an arbitrary number of async actions simultaneously!

To be more precise, I change the array with .map() by taking each address, running the query on said address, and replacing it with the resulting Promise
*/

// Promise.all(addresses.map((a) => {
//     var thisQuery = "INSERT INTO aalocations VALUES (E'" + a.address + "', " + a.latLong.lat + ", " + a.latLong.long + ");";
//     return client.query(thisQuery, (err, res) => {
//         console.log(err, res);
//         client.end();
//     });
// })).then(console.log)


client.query("SELECT * FROM aalocations WHERE address LIKE '%Avenue%';", (err, res) => {
    console.log(err, res);
    client.end();
});

// client.query(thisQuery, (err, res) => {
//     console.log(err, res);
//     client.end();
// });
