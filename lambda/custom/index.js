// RSS parsing script for Lambda + Alexa skill
// This is all loosely based on https://github.com/alexa/skill-sample-nodejs-feed
// ==============================================================================

// const config = require('./configuration');
// const feedHelper = require('./feedHelper');

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

exports.handler = (event, context) => {

  try {

    if (event.session.new) {
      // New Session
      console.log('NEW SESSION')
    }

    switch (event.request.type) {

      case 'LaunchRequest':
        processLaunchRequest(context);
        break;

      case 'IntentRequest':
        switch(event.request.intent.name) {
          case 'testResponse':
             context.succeed(
              generateResponse(
                buildSpeechletResponse('Intent request worked', true),
                {}
              )
            )
            break;

          case 'fetchHeadlines':
            getRSSData(context, 'headlines');
            break;

          default:
            throw 'Invalid intent'
        }
        break;

      case 'SessionEndedRequest':
        // Session Ended Request
        console.log('SESSION ENDED REQUEST')
        break;

      default:
        context.fail('INVALID REQUEST TYPE: ${event.request.type}')

    }

  } catch(error) { context.fail('Exception: ${error}') }

}

// Helpers
buildSpeechletResponse = (outputText, shouldEndSession) => {
  return {
    outputSpeech: {
      type: 'PlainText',
      text: outputText
    },
    shouldEndSession: shouldEndSession
  }

}

generateResponse = (speechletResponse, sessionAttributes) => {
  return {
    version: '1.0',
    sessionAttributes: sessionAttributes,
    response: speechletResponse
  }

}

// Request handlers
processLaunchRequest = (context) => {

  context.succeed(
    generateResponse(
      buildSpeechletResponse('Hello there, what would you like to ask me?', true),
      {}
    )
  )
}

// RSS functions
getRSSData = (context, RSSDataType) => {

  switch (RSSDataType) {
    case 'headlines':
      var Feed = require('rss-to-json');

      Feed.load('http://feeds.businessinsider.com.au/businessinsideraustralia', function(err, rss){
          
          var speechString = '';
          var rssItems = rss.items;

          for (var key in rssItems) {
                if (rssItems.hasOwnProperty(key)) {
                speechString += 'Story ' + key + ', ' + rssItems[key].title + '. ';
            }
          }
          context.succeed(
            generateResponse(
              buildSpeechletResponse(speechString, true),
              {}
            )
          );

        });
    break;

    default:
      return 'Sorry not a valid request'
  }

}