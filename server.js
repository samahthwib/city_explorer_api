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

//http://localhost:3000/anything
server.use('*' , (req,res)=>{
  res.status(404).send('Not Found');
});

//This function for any error
server.use((error,req,res)=>{
  res.status(500).send('ERROR');
});

