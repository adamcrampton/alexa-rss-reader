// var https = require('https')

// 'use strict';

var xml2js = require('xml2js');

var options = {  // options passed to xml2js parser
  explicitCharkey: false, // undocumented
  trim: false,            // trim the leading/trailing whitespace from text nodes
  normalize: false,       // trim interior whitespace inside text nodes
  explicitRoot: false,    // return the root node in the resulting object?
  emptyTag: null,         // the default value for empty nodes
  explicitArray: true,    // always put child nodes in an array
  ignoreAttrs: false,     // ignore attributes, only create text nodes
  mergeAttrs: false,      // merge attributes and child elements
  validator: null         // a callable validator
};

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
      return 'here are your headlines'
    break;

    default:
      return 'Sorry not a valid request'
  }

}