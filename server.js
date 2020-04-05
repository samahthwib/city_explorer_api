'use strict';


//These line to use express,cors,dotenv
const express = require('express');
const cors = require('cors'); //To give the permission for who can touch my server
require('dotenv').config();


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


//http://localhost:3000/location?city=Lynnwood
//The URL like I send request to the express server
//So I will built this URL
server.get('/location', (req,res)=>{
  
  const data=require('./data/geo.json'); //To get the data from the Json file
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


//http://localhost:3000/anything
server.use('*' , (req,res)=>{
  res.status(404).send('Not Found');
});

//This function for any error
server.use((error,req,res)=>{
  res.status(500).send('ERROR');
});

