/**
 * Server functions:
 * Opens real-time data stream from Twitter client to receive tweets.
 * Posts all tweets with geotags to a Socket.io socket.
 */

/**
 * Express.js setup
 */
var express = require('express'),
    app = express(),
    http = require('http').Server(app);

// Serving 'index.html'
app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

// Static files served in 'public' directory
app.use(express.static('public'));

// Running on port 3000.
http.listen(3000, function() {
  console.log('listening on 3000');
});

/**
 * Decouple Twitter listener and Socket.io socket by creating EventEmitter
 *
 */
var EventEmitter = require('events'),
    util = require('util');

function TweetEmitter() {
  EventEmitter.call(this);
}
util.inherits(TweetEmitter, EventEmitter);

var tweetEmitter = new TweetEmitter();

/**
 * Socket.io setup
 */

var io = require('socket.io')(http);

tweetEmitter.on('tweet', function(tweet) {
  console.log(tweet);
  io.emit('tweet', tweet);
});

// a helper function to average coordinate pairs
function average(coordinates) {
  var n = 0, lon = 0.0, lat = 0.0;
  coordinates.forEach(function(latLongs) {
    latLongs.forEach(function(latLong) {
      lon += latLong[0];
      lat += latLong[1];
      n += 1;
    })
  });
  return [lon / n, lat / n];
}

// Twitter client setup

var Twitter = require('twitter'),
    credentials = require('./credentials.js'),
    client = new Twitter(credentials);
// Twitter keyword to filter tweets entered here
// TODO - add a way for user to enter this search keyword themselves
var query = process.argv[2] || 'trump';

client.stream('statuses/filter', {track: query}, function(stream) {
  // Every a tweet is received
  stream.on('data', function(tweet) {
    // And the tweet has 'place' field populated
    if (tweet.place) {
      // Extract necessary fields from client
      var tweetSmall = {
        id: tweet.id_str,
        user: tweet.user.screen_name,
        text: tweet.text,
        placeName: tweet.place.full_name,
        latLong: average(tweet.place.bounding_box.coordinates),
      }
      // Notify tweetEmitter
      tweetEmitter.emit('tweet', tweetSmall);
    }
  });
});
