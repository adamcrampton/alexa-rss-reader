// RSS parsing script for Lambda + Alexa skill
// This is all loosely based on https://github.com/alexa/skill-sample-nodejs-feed
// ==============================================================================

const config = require('./configuration');
const feedHelper = require('./feedHelper');

exports.handler = (event, context) => {

  try {

    if (event.session.new) {
      // New Session
      console.log('NEW SESSION')
    }

    switch (event.request.type) {

      case 'LaunchRequest':
        context.succeed(
          generateResponse(
            buildSpeechletResponse('Hello, what would you like to ask me?', true),
            {}
          )
        )
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
             context.succeed(
              generateResponse(
                buildSpeechletResponse(getRSSData('headlines'), true),
                {}
              )
            )
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

getRSSData = (RSSDataType) => {

  switch (RSSDataType) {
    case 'headlines':
      //TODO: Actually provide headlines
      return 'here are your headlines'
    break;

    default:
      return 'Sorry not a valid request'
  }

}