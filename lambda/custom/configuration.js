let config = {

    welcome_message : 'Welcome to Business Insider Australia',

    number_feeds_per_prompt : 3,
    speak_only_feed_title : true,
    display_only_title_in_card : true,

    feeds : {
        'Business Insider Global Stories' : 'http://feeds.businessinsider.com.au/businessinsideraustralia',
        'Business Insider Australian Stories' : 'http://feeds.businessinsider.com.au/businessinsideraustraliaau',
    },

    speech_style_for_numbering_feeds : 'Item',
};

module.exports = config;
