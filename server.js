/* eslint-disable indent */
'use strict';


//These line to use express,cors,dotenv
require('dotenv').config();
const express = require('express');
const cors = require('cors'); //To give the permission for who can touch my server
const superagent = require('superagent');


const PORT=process.env.PORT || 3000;

const server=express(); //initialize the express to use the functions come up with express lib
server.use(cors());


server.listen(PORT,()=>{
  console.log(`listening on port ${PORT}`);
});


//to handle any route so if the user have this route then send DONE
//http://localhost:3000/
server.get('/',(req,res)=>{
  res.status(200).send('DONE');
});

//---------------------------LOCATIONS----------------------------------//



server.get('/location', myLocations); //This is the route definition


function myLocations(req, res) {

  const city = req.query.city; //I'm requesting the data from the URL so we get this one from the link itself like this http://localhost:3000/location?city=amman

  //The superagent will return the data to the locData , if we want return data from a superagent
  // the reciever should be a promise fn so we wrote it like this
  getTheLocations(city)//This is a reciever
    .then(locData=> {
      res.send(locData);//This is my response

    });
}
function getTheLocations(city) {

  //To get the data from the actual API I need KEY and URL
  let key = process.env.LOCATION_API_KEY; //I got the KEY from LocationIQ API
  const url = `https://eu1.locationiq.com/v1/search.php?key=${key}&q=${city}&format=json`; //when I use this url I have to follow the protocols

  return superagent.get(url) //superagent it's a library, we call it promise fn  and here it will go to the url and return all the data
    .then(data =>{ //all the data that i got it will store in data
      // console.log('show me the data' , data);
      const locData = new Locations(city, data.body); //when we use the superagent will store everything inside body
      return locData; // will returned to the superagent
    });
}

function Locations(city, data) {
  this.search_query = city;
  this.formatted_query = data[0].display_name;
  this.latitude = data[0].lat;
  this.longitude = data[0].lon;
}


//------------------------------WEATHER---------------------------------//


server.get('/weather', theWeather);

function theWeather(req, res) {
 
  const city = req.query.city;//I'm requesting the data from the URL so we get this one from the link itself 
                             //like this http://localhost:3000/weather?city=amman and i have to pay attention
                            //that the protocol said to send a search-query
  //console.log('the city is ------------------->' , city);
  getTheWeather(city)
    .then (weatherData => res.send(weatherData));
}

const allWeather = [];

function getTheWeather(city) {

  let key = process.env.WEATHER_API_KEY; //I stored my key in the variable
  const url = `https://api.weatherbit.io/v2.0/forecast/daily?city=${city}&key=${key}`; 

  console.log('The url is -------------> ',url);

  return superagent.get(url) //superagent it's a library, we call it promise fn  and here it will go to the url and return all the data
  .then(weatherData =>{ //all the data that i got it will store in data
    weatherData.body.data.map(val => {
      var weatherData = new Weather(val);
      allWeather.push(weatherData);
    });
    return allWeather;

  });

}

function Weather(data) {
   this.forecast = data.weather.description;
   this.time = data.valid_date;
}

//------------------------------------------------------------------------------//


//http://localhost:3000/anything
server.use('*' , (req,res)=>{
  res.status(404).send('Not Found');
});

//This function for any error
server.use((error,req,res)=>{
  res.status(500).send('ERROR');
});

