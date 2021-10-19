var blogEntries = [];

class DateEntry {
  constructor(primaryKey, date, workouts) {
    this.pk = {};
    this.pk.N = primaryKey.toString();
    this.date = {}; 
    this.date.S = new Date(date).toDateString();
    this.workouts = {}
    this.workouts.S = JSON.stringify(workouts)
  }
}

class Workout {
  constructor(primaryKey, len, type, movements) {
    this.pk = {};
    this.pk.N = primaryKey.toString();
    this.len = {}
    this.len.N = len
    this.type = {}
    this.type.S = type
    this.movements = {}
    this.movements.S = JSON.stringify(movements)
  }
}

class Movement {
  constructor(primaryKey, name, muscle, weight, sets, reps) {
    this.pk = {}
    this.pk.N = primaryKey.toString();
    this.name = {}
    if (muscle != null) {
      this.muscle = {}
      this.muscle.S = muscle
    } 
    if (weight != null) {
      this.weight = {}
      this.weight.S = weight
    } 
    if (sets != null) {
      this.sets = {}
      this.sets.S = sets
    } 
    if (reps != null) {
      this.reps = {}
      this.reps.S = reps
    } 
  }
}

// variables
const stair = new Movement(0, 'Stair Climber')

// Oct 17
var mvts17 = []
var wrkts17 = []
var dates17 = []

// Stair climber 35mins
mvts17.push(stair)
wrkts17.push(new Workout(0, 35, 'Cardio', mvts17))
dates17.push(new DateEntry(0, 'October 17 2021', wrkts17))

// Oct 18
var mvts18 = []
var wrkts18 = []
var dates18 = []
// Bench press
// 95 1x6
// 105 3x5 (focus on BALANCE)
// Neutral grip pull-ups
// 5x6 (focus on LATS)
// Machine flies
// 60 1x10 (raise chair cuz of shoulder pain)
// 70 3x10 (focus on PECS)
// Face pulls
// 30 3x15
mvts18.push(new Movement(1, 'Bench Press'), 'Chest', 105, 3, 5)
mvts18.push(new Movement(2, 'Pull Ups'), 'Back', null, 5, 6)
wrkts18.push(new Workout(1, 60, mvts18))
dates18.push(new DateEntry(1, 'October 18 2021', wrkts18))


// Oct 14
var mvts14 = []
var wrkts14 = []
var dates14 = []

// Stair climber 35mins
mvts14.push(stair)
wrkts14.push(new Workout(0, 30, 'Cardio', mvts14))
dates14.push(new DateEntry(2, 'October 14 2021', wrkts14))
// blogEntries.push(new BlogEntry(0, 'August 28 2019', "Yay, first day of class!", true, ["Cheez-Its", "M&Ms"]));
// blogEntries.push(new BlogEntry(1, 'October 31, 2015', "I piloted my first solo flight!", true, ["pancakes"]));
// blogEntries.push(new BlogEntry(2, 8675309, "867-5309?", false));
// blogEntries.push(new BlogEntry(3, 'September 25, 2019', "I taught my favorite students.", true, ["peas", "carrots"]));

console.log(dates17);
var AWS = require('aws-sdk');
AWS.config = new AWS.Config();
AWS.config.region = "us-east-1";

var dynamodb = new AWS.DynamoDB();

var params = {};
params.Item = dates18[0]; 
params.TableName = "processblog";

dynamodb.putItem(params, function (err, data) {
  if (err) console.log(err, err.stack); // an error occurred
  else     console.log(data);           // successful response
});
