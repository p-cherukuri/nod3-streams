// server.js

const express       = require('express');
const MongoClient   = require('mongodb').MongoClient;
const bodyParser    = require('body-parser');
const db            = require('./config/db');

const app           = express();
const portNum          = 8000;

// use body-parser for processing URL encoded forms
app.use(bodyParser.urlencoded({ extended: true }));

// connecting to MongoDB through MongoClient
MongoClient.connect(db.url, (err, database) => {
  if (err) return console.log(err)

  require('./app/routes') (app, database);
  // Listening on port 8000
  app.listen(portNum, () => {
      console.log('Hooked up to port number ' + portNum);
  });
})
