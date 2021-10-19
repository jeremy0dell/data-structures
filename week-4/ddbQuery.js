// npm install aws-sdk
var AWS = require('aws-sdk');
AWS.config = new AWS.Config();
AWS.config.region = "us-east-1";

var dynamodb = new AWS.DynamoDB();

// I have to admit, I'm still not quite sure how to query items by anything other than the primary key.
// Still I'm at least happy to have to most basic query syntax down.
// DynamoDB is a monster compared to MongoDB (the only NoSQL DB i've extensively queried)
// Also apparently it's based on Java primitive types?? Wild
var params = {
    TableName : "processblog",
    KeyConditionExpression: "pk = :minKey", // the query expression
    ExpressionAttributeValues: { // the query values
        ":minKey": {N: '0'},
    }
};

dynamodb.query(params, function(err, data) {
    if (err) {
        console.error("Unable to query. Error:", JSON.stringify(err, null, 2));
    } else {
        console.log("Query succeeded.");
        data.Items.forEach(function(item) {
            console.log("***** ***** ***** ***** ***** \n", item);
        });
    }
});