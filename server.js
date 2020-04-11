
'use strict';


//These line to use express,cors,dotenv,superagent and pg
require('dotenv').config();
const express = require('express');
const cors = require('cors'); //To give the permission for who can touch my server
const superagent = require('superagent');
const pg = require('pg');//prepare the connection between postgres DB and the server


const PORT = process.env.PORT || 3000;

const server = express(); //initialize the express to use the functions come up with express lib
server.use(cors());

const client = new pg.Client(process.env.DATABASE_URL);//

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

//---------------------------------LOCATIONS----------------------------------//


//http://localhost:3000/location?city=amman
app.get('/location', locationHandler); //This is the route definition

function locationHandler(req, res) {
  let city= req.query.city;
  let SQL = 'SELECT * FROM locations WHERE search_query=$1;';
  let safeValues = [city];

  return client.query(SQL, safeValues)
    .then(results => {
      if (results.rows.length) { //I want to check if the result is empty or not
        res.send(results.rows[0]);
      } else {
        getTheLocations(city);
      }
    })
    .catch(error => errorHandler(error));
}

function myLocations(req, res) {

  const city = req.query.city; //I'm requesting the data from the URL so we get this one from the link itself like this http://localhost:3000/location?city=amman
  //The superagent will return the data to the locData , if we want return data from a superagent
  // the reciever should be a promise fn so we wrote it like this
  getTheLocations(city)//This is a reciever
    .then(locData => {
      res.send(locData);//This is my response

function getTheLocations(city) {

  //To get the data from the actual API I need KEY and URL
  let key = process.env.LOCATION_API_KEY; //I got the KEY from LocationIQ API
  const url = `https://eu1.locationiq.com/v1/search.php?key=${key}&q=${city}&format=json`; //when I use this url I have to follow the protocols

  return superagent.get(url) //superagent it's a library, we call it promise fn  and here it will go to the url and return all the data
    .then(data => { //all the data that i got it will store in data
      // console.log('show me the data' , data);
      const locData = new Locations(city, data.body);
      let query = locData.formatted_query;
      let lat = locData.latitude;
      let lon = locData.longitude;

      let SQL = 'INSERT INTO locations (search_query,formatted_query,latitude,longitude) VALUES ($1,$2,$3,$4);';
      let safeValues = [city, query, lat, lon];
      client.query(SQL, safeValues)
        .then(results => {
          results.rows[0];
        });
    });
}



function Locations(city, data) {
  this.search_query = city;
  this.formatted_query = data[0].display_name;
  this.latitude = data[0].lat;
  this.longitude = data[0].lon;
}




// //-------------------------WEATHER----------------------------------//

app.get('/weather', weatherHandler);

function weatherHandler(req, res) {

  const city = req.query.search_query;//I'm requesting the data from the URL so we get this one from the link itself
  //like this http://localhost:3000/weather?city=amman and i have to pay attention
  //that the protocol said to send a search-query
  console.log('the city is ------------------->', city);
  getTheWeather(city)
    .then(weatherData => res.send(weatherData));
}



function getTheWeather(city) {

  let key = process.env.WEATHER_API_KEY; //I stored my key in the variable
  const url = `https://api.weatherbit.io/v2.0/forecast/daily?city=${city}&key=${key}`;
  console.log('The url is -------------> ', url);
  return superagent.get(url) //superagent it's a library, we call it promise fn  and here it will go to the url and return all the data
    .then(weatherData => { //all the data that i got it will store in data
      let a = weatherData.body;
      return a.data.map(val => {
        return new Weather(val);
      });
    });

}
function Weather(data) {
  this.forecast = data.weather.description;
  this.time = data.valid_date;
}

// //----------------------------------TRAIL------------------------------------------//

// //set trails route
app.get('/trails', trailsHandler);


function trailsHandler(req, res) {
  //I'm requesting the data from the URL s
  const lat = req.query.latitude;
  const lon = req.query.longitude;
  getTheTrails(lat, lon)
    .then(trailsData => res.send(trailsData));
}

function getTheTrails(lat, lon) {

  let key = process.env.TRAIL_API_KEY; //I stored my key in the variable

  const url = `https://www.hikingproject.com/data/get-trails?lat=${lat}&lon=${lon}&maxDistance=10&key=${key}`;
  return superagent.get(url) //superagent it's a library, we call it promise fn  and here it will go to the url and return all the data
    .then(trailsData => { //all the data that i got it will store in data

     let a=trailsData.body;
      return a.trails.map(val => {
      return new Trails(val);
      });
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
  this.condition_time = trails.conditionDate.split(" ")[1];

}

//---------------------------------------------------------------------------------//


// //set movies route
app.get('/movies', movieHandler);

function movieHandler(req, res) {
  //I'm requesting the data from the URL s
  const city = req.query.city;
  // const lat = req.query.lat;
  // const lon = req.query.lon;

  getTheMovies(city)
    .then(moviesData => res.send(moviesData));
}

let allMovies=[];

function getTheMovies(city) {

  let key = process.env.MOVIE_API_KEY; //I stored my key in the variable
  const url = `https://api.themoviedb.org/3/search/movie?api_key=${key}&query=${city}`;
  console.log('The url is -------------> ', url);
  return superagent.get(url) //superagent it's a library, we call it promise fn  and here it will go to the url and return all the data
    .then(moviesData => { //all the data that i got it will store in data
      moviesData.body.results.forEach(val => {
        var moviesData = new Movie(val);
        allMovies.push(moviesData);
      });
      return allMovies;

    });

  function Movie (data) {
    this.title = data.title,
    this.overview = data.overview,
    this.vote_average = data.vote_average,
    this.total_votes = data.vote_count,
    this.image_url = `https://image.tmdb.org/t/p/w200_and_h300_bestv2/${data.poster_path}`,
    this.popularity = data.popularity,
    this.release_date = data.release_date;
  }
}
//----------------------------------YELP----------------------------------------//


app.get('/yelp', restHandler);

function restHandler(req, res) {
  const city = req.query.city;

  getTheRestourant(city)
    .then(restData => res.send(restData));
}

let allRestaurant=[];

function getTheRestourant(city) {

  let key = process.env.MOVIE_API_KEY; //I stored my key in the variable
  const url = ``;
  console.log('The url is -------------> ', url);
  return superagent.get(url) //superagent it's a library, we call it promise fn  and here it will go to the url and return all the data
    .then(restData => { //all the data that i got it will store in data
      restData.body.results.forEach(val => {
        var restData = new Restaurant(val);
        allRestaurant.push(restData);
      });
      return allRestaurant;

    });
  }

function Restaurant (data) {
  this.name = data.name;
  this.image_url = data.image_url;
  this.price = data.price;
  this.rating = data.rating;
  this.url = data.url;
}
//------------------------------------------------------------------------------//
//http://localhost:3000/anything

app.use('*', (req, res) => {

  res.status(404).send('Not Found');
});

//This function for any error

function errorHandler(error, req, res) {
res.status(500).send('ERROR');

}


