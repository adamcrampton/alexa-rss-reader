// RSS parsing script for Lambda + Alexa skill
// ==============================================================================
'use strict';

// Load any required config (currently unused).
// const config = require('./configuration');

// Config Alexa SDK and required libraries.
const Alexa = require('alexa-sdk');
const moment = require('moment');
const request = require('request');
const Feed = require('rss-to-json');
const _ = require('lodash');

// Define helper functions.

// Build properly formatted comma separated string for speech.
const commaStringFormatter = (speechArray) => {
  var formattedString = [speechArray.slice(0, -1).join(', '), speechArray.slice(-1)[0]].join(speechArray.length < 2 ? '' : ', and ');

  return formattedString;
}

// Define handlers.
const handlers = {
  'LaunchRequest': function() {
    this.emit(':ask', 'What would you like to do?', 'Please say that again?');
  },
  'SessionEndedRequest': function() {
    console.log('session ended.');
    this.emit(':saveState', true);
  },
  'Unhandled': function() {
    this.emit(':ask', 'What would you like to do?', 'Please say that again?');
  },
  'getTrending': function() {
    // Make emit method available within the scope of request.
    var emitMethod = this.emit;

    request('https://files.alluremedia.com.au/lambda/stan_trending.json', function(err, res, body) {  
      // Parse the entire JSON body
      var bodyObject = JSON.parse(body);

      // Initialise speech array, which will eventually be converted to append to the speech string.
      var speechArray = [];
      var speechString = '';

      speechString += "Ok, here are trending shows on Stan right now. ";

      for (var key in bodyObject.entries) {
          if (bodyObject.entries.hasOwnProperty(key)) {
            speechArray.push(bodyObject.entries[key].title);
        }
      }

      speechString += commaStringFormatter(speechArray);

      speechString = speechString.replace('&', 'and');

      emitMethod(':tell', speechString);
    });
  },

  'getTrendingTitles': function() {
    // Not used here, but may be useful later (will remove if not).
    let intent = this.event.request.intent;

    // Initialise speech array, which will eventually be converted to append to the speech string.
    var speechArray = [];
    var speechString = '';

    // Make emit method available within the scope of request.
    var emitMethod = this.emit;

    Feed.load('http://feeds.businessinsider.com.au/businessinsideraustralia', function(err, rss){  
      // Set intro.
      var speechString += 'Ok, here are the trending stories on Business Insider Australia right now. ';
      var rssItems = rss.items;

      for (var key in rssItems) {
            if (rssItems.hasOwnProperty(key)) {
            speechString += 'Story ' + key + ', ' + rssItems[key].title + '. ';
        }
      }

      speechString += commaStringFormatter(speechArray);

      // Alexa does not like ampersands.
      speechString = speechString.replace('&', 'and');

      emitMethod(':tell', speechString);
    });
  }
}

// Do the Lambda/Alexa magic.
exports.handler = function(event, context, callback) {
  const alexa = Alexa.handler(event, context, callback);
  alexa.appId = process.env.APP_ID;
  alexa.registerHandlers(handlers);
  alexa.execute();
};


// Uncomment to fire up local Node server
// const http = require('http');

// const hostname = '127.0.0.1';
// const port = 3000;

// const server = http.createServer((req, res) => {
//   res.statusCode = 200;
//   res.setHeader('Content-Type', 'text/plain');
//   res.end('Test Page\n');
// });

// server.listen(port, hostname, () => {
//   console.log(`Server running at http://${hostname}:${port}/`);
// });