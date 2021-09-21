# Week 3 Documentation

## Formatting the Data
In my work as a software engineer, I realized that there is nothing wrong with doing some minor data manipulation by hand. For the last assignment I left the auxiliary information like zipcode and location instructions, which I knew might be a problem for the goelocation API.
To solve for this I copied my original data file and deleted everything to the right of the first comma in each line, like this:
![image](https://user-images.githubusercontent.com/20379698/134233861-33f977ce-d19d-413e-bf2a-ab31c4a126ec.png)

After this I surrounded every line with quotes and added a comma to the end of every line. Again, I did this with multiline editing. I wrap all this lines between brackets, and I now have something that javascript can actually use. Like this:
![image](https://user-images.githubusercontent.com/20379698/134234205-c3d1e4d2-1a3d-4dba-83eb-0b90f35c8ae5.png)


## Adding the .env file
All one really needs to do for this step is to create a file called `.env`, and add it to the same directory as your js file. I noticed that the starter code had this line: `const API_KEY = process.env.TAMU_KEY;`, so my .env file only needed to have `TAMU_KEY=MyFakeAPIKeyHere1234567890` in it.

## Modifying the example script

The example script needed minimal changes this time around. In fact, all I really needed to do was to add my own list of addresses to the file, for `addresses` and then create an array where I aggregate the outputted Geocodes. I shape the data like this:
```
  let obj = {
    address: value + ', New York, NY',
    latLong: {
      lat: resBody.OutputGeocodes[0].OutputGeocode.Latitude,
      long: resBody.OutputGeocodes[0].OutputGeocode.Longitude
    }
  }
```
And then push it to my aggregator array on every iteration.

From here I just stringify my javascript array and write it to a new file! Like this: `fs.writeFileSync('./geocoded-addresses.txt', JSON.stringify(meetingsData))`
