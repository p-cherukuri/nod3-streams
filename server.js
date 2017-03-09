// server.js

const express       = require('express');
const MongoClient   = require('mongodb').MongoClient;
const bodyParser    = require('body-parser');

const app           = express();
const portNum          = 8000;

app.listen(portNum, () => {
    console.log('Hooked up to port number ' + portNum);
});
