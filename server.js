'use strict';


//These line to use express,cors,dotenv,superagent and pg
require('dotenv').config();
const express = require('express');
const cors = require('cors'); //To give the permission for who can touch my server
const superagent = require('superagent');
const pg = require('pg');//prepare the connection between postgres DB and the server


const PORT = process.env.PORT || 3000;
const client = new pg.Client(process.env.DATABASE_URL);//


const app = express(); //initialize the express to use the functions come up with express lib
app.use(cors());


client.connect() //this is a promise fn
  .then(() => {
    app.listen(PORT, () =>
      console.log(`listening on ${PORT}`)
    );
  });



//to handle any route so if the user have this route then send DONE
//http://localhost:3000/
app.get('/', (req, res) => {
  res.status(200).send('DONE');
});

//---------------------------LOCATIONS----------------------------------//


//http://localhost:3000/location?city=amman
app.get('/location', getTheLocations); //This is the route definition

function getTheLocations(req,res){
  let city = city = req.query.city;
  let SQL = 'INSERT INTO locations VALUES($1)';
  let safeValues = [city];

  client.query(SQL,safeValues)
    .then( results => {
      if (results.rows>0){
        res.send(results.rows);
      }
    })
    .catch (error => errorHandler(error));
}


// function getTheLocations(city) {

//   //To get the data from the actual API I need KEY and URL
//   let key = process.env.LOCATION_API_KEY; //I got the KEY from LocationIQ API
//   const url = `https://eu1.locationiq.com/v1/search.php?key=${key}&q=${city}&format=json`; //when I use this url I have to follow the protocols

//   return superagent.get(url) //superagent it's a library, we call it promise fn  and here it will go to the url and return all the data
//     .then(data => { //all the data that i got it will store in data
//       // console.log('show me the data' , data);
//       const locData = new Locations(city, data.body); //when we use the superagent will store everything inside body
//       return locData; // will returned to the superagent
//     });
// }



function Locations(city, data) {
  this.search_query = city;
  this.formatted_query = data[0].display_name;
  this.latitude = data[0].lat;
  this.longitude = data[0].lon;
}




//-------------------------WEATHER----------------------------------//

app.get('/weather', weatherHandler);

function weatherHandler(req, res) {

  const city = req.query.search_query;//I'm requesting the data from the URL so we get this one from the link itself
  //like this http://localhost:3000/weather?city=amman and i have to pay attention
  //that the protocol said to send a search-query
  console.log('the city is ------------------->', city);
  getTheWeather(city)
    .then(weatherData => res.send(weatherData));
}

// const allWeather = [];

function getTheWeather(city) {

  let key = process.env.WEATHER_API_KEY; //I stored my key in the variable
  const url = `https://api.weatherbit.io/v2.0/forecast/daily?city=${city}&key=${key}`;
  console.log('The url is -------------> ', url);
  return superagent.get(url) //superagent it's a library, we call it promise fn  and here it will go to the url and return all the data
    .then(weatherData => { //all the data that i got it will store in data
      let a = weatherData.body;
      return a.data.map(val => {
        // var weatherData = new Weather(val);
        // allWeather.push(weatherData);
        return new Weather(val);
      });
      // return allWeather;

    });

}
function Weather(data) {
  this.forecast = data.weather.description;
  this.time = data.valid_date;
}
//----------------------------------TRAIL------------------------------------------//

//set trails route
app.get('/trails', trailsHandler);

function trailsHandler(req, res) {
  //I'm requesting the data from the URL s
  const lat = req.query.lat;
  const lon = req.query.lon;
  console.log('the lat is ------------------->', lat);
  getTheTrails(lat, lon)
    .then(trailsData => res.send(trailsData));
}

const allTrails = [];

function getTheTrails(lat, lon) {

  let key = process.env.TRAIL_API_KEY; //I stored my key in the variable

  const url = `https://www.hikingproject.com/data/get-trails?lat=${lat}&lon=${lon}&maxDistance=10&key=${key}`;

  //console.log('The url is -------------> ',url);

  return superagent.get(url) //superagent it's a library, we call it promise fn  and here it will go to the url and return all the data
    .then(trailsData => { //all the data that i got it will store in data
      trailsData.body.trails.forEach(val => {
        var trailsData = new Trails(val);
        allTrails.push(trailsData);
      });
      return allTrails;

    });

}

function Trails(trails) {
  this.name = trails.name;
  this.location = trails.location;
  this.length = trails.length;
  this.stars = trails.stars;
  this.star_votes = trails.starVotes;
  this.summary = trails.summary;
  this.trail_url = trails.url;
  this.conditions = trails.conditionStatus;
  this.condition_date = new Date(trails.conditionDate).toString().slice(0, 15);
  // this.condition_time=trails.conditionDate;
}

//---------------------------------------------------------------------------------//


//http://localhost:3000/anything
app.use('*', (req, res) => {
  res.status(404).send('Not Found');
});

//This function for any error
function errorHandler(error, req, res){
  res.status(500).send('ERROR');

}


