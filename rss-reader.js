var https = require('https')

exports.handler = (event, context) => {

  try {

    if (event.session.new) {
      // New Session
      console.log('NEW SESSION')
    }

    switch (event.request.type) {

      case 'LaunchRequest':
        // Launch Request
        console.log(`LAUNCH REQUEST`)
        context.succeed(
          generateResponse(
            buildSpeechletResponse('Thank you, I have been invoked', true),
            {}
          )
        )
        break;

      case 'IntentRequest':
        // Intent Request
        console.log(`INTENT REQUEST`)

        switch(event.request.intent.name) {
          case 'testResponse':
             context.succeed(
              generateResponse(
                buildSpeechletResponse('Intent request worked', true),
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
        console.log(`SESSION ENDED REQUEST`)
        break;

      default:
        context.fail(`INVALID REQUEST TYPE: ${event.request.type}`)

    }

  } catch(error) { context.fail(`Exception: ${error}`) }

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