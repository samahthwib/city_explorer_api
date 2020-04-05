'use strict';


//These line to use express,cors,dotenv
require('dotenv').config();
const express = require('express');
const cors = require('cors'); //To give the permission for who can touch my server



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



//----------------------------------------------------------------------------



//http://localhost:3000/location?city=Lynnwood
//The URL like I send request to the express server
//So I will built this URL
server.get('/location', (req,res)=>{

  const data=require('./data/geo.json'); //To get the data from the data Json file
  const city=req.query.city; //I'm requesting the data from the URL
  const locData=new Locations(city,data);
  res.send(locData); //This is my response
});


function Locations (city , data){
  this.search_query =city;
  this.formatted_query = data[0].display_name;
  this.latitiude= data[0].lat;
  this.longitude= data[0].lon;
}



//----------------------------------------------------------------------


//http://localhost:3000/weather
//The URL like I send request to the express server
//So I will built this URL

server.get('/weather', (request, response) => {
  const weatherAll = []; //this arr will contain what i want the description and the date
  const weatherFile = require('./data/weather.json');//To get the data from the data Json file
  //console.log(weatherData); //will give me all the object in the json file

  //for loop through the data obj so will show all the properties inside it
  for (let i = 0; i < weatherFile.data.length; i++) {
    //console.log(weatherFile.data);
    const data = new Weather(weatherFile, i);
    //console.log(data) //will give me just the description and the date
    weatherAll.push(data);
  }

  response.send(weatherAll);
}
);


//Weather Constructor
function Weather(weatherData,i) {
  this.description = weatherData.data[i].weather.description;
  //console.log(this.description);
  this.time = weatherData.data[i].valid_date;
  //console.log(this.time);
}

//------------------------------------------------------------------------------


//http://localhost:3000/anything
server.use('*' , (req,res)=>{
  res.status(404).send('Not Found');
});

//This function for any error
server.use((error,req,res)=>{
  res.status(500).send('ERROR');
});

