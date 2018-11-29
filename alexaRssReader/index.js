// RSS parsing script for Lambda + Alexa skill
// ==============================================================================
'use strict';

// Load any required config (currently unused).
// const config = require('./configuration');

// Config Alexa SDK and required libraries.
const Alexa = require('alexa-sdk');
const AWS = require('aws-sdk');
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

// Get slot value for this intent.
const getSlotValue = (intent) => {
  switch(intent) {
    case 'fetchHeadlines':
      // Must be a string.
      if (typeof intent.slotname.newsType.value === 'string') {
        return slotValue; 
      }
      else {
        return false;
      }
    break;

    default:

    break;
  }

  var slotValues = intent.slots;

  //TODO: Iterate through intent.slots and get the name and values of each.
  // It'll be intent.slots.slotname.value

  

  // No slot for the intent, or bad value.
  return false;
}

// Return the correct opening phrase for the request.
const getPhrase = (slotValue) => {
  switch (intent) {
    case 'latest':
      return {'phrase':'the top 10 stories'};
    break;

    case 'australian':
      return {'phrase':'the top 10 Australian stories'};
    break;

    default:

    break;
  }
}

// Return correct RSS endpoint based on slot value (if passed in);
const getEndPoint = (slotValue) => {
  switch(feedType) {
    case 'global':
      return 'latestEndpoint';
      break;

    case 'australian':
      return 'latestAusEndpoint';
      break;
    
    default:
      return 'latestEndpoint';
      break;
    break;
  }
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
  'fetchHeadlines': function() {
    // Get the feed type based on intent.
    let intent = this.event.request.intent;
    let feedType = getSlotValue(intent);

    // Get opening speech string phrase and RSS endpoint name.
    let openingPhrase = getPhrase(feedType);

    // TODO: Dynamically fetch correct endpoint based on slot value.
    // var envValue = process.env[rssEndpoint];

    // Make emit method available within the scope of request.
    var emitMethod = this.emit;

    Feed.load(process.env.latestEndpoint, function(err, rss) {  
        // Initialise speech array, which will eventually be converted to append to the speech string.
      var speechArray = [];
      var speechString = '';

      // Set intro.
      speechString += 'Ok, here are the top 10 stories on ' + process.env.siteName + ' right now. ';
      var rssItems = rss.items;

      // Loop through each item, adding the article timestamp before each title.
      for (var i = 0; i < 10; i++) {       
        speechString += moment(rssItems[i].created).format('h:mm A') + ', ' + rssItems[i].title + '. ';
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
