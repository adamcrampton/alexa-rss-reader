// Dependencies
const FeedParser = require('feedparser');
const entities = require('html-entities').AllHtmlEntities;
const request = require('request');
const striptags = require('striptags');

// Config
const config = require('./configuration');

// Parse feed for specified category.
const feedParser = function () {
    return {
        getFeed : function (category, callback) {
            let url = config.feeds[category];
            let req = request(url);
            let feedparser = new FeedParser(null);
            let items = [];

            req.on('response', function (res) {
                let stream = this;
                if (res.statusCode === 200) {
                    stream.pipe(feedparser);
                } else {
                    return stream.emit('error', new Error('Bad status code'));
                }
            });

            req.on('error', function (err) {
                return callback(err, null);
            });

            // Received stream. Parse through the stream and create JSON Objects for each item.
            feedparser.on('readable', function() {
                let stream = this;
                let item;
                while (item = stream.read()) {
                    let feedItem = {};
                    // Process feedItem item and push it to items data if it exists.
                    if (item['title'] && item['date']) {
                        feedItem['title'] = item['title'];
                        feedItem['title'] = entities.decode(striptags(feedItem['title']));
                        feedItem['title'] = feedItem['title'].trim();
                        feedItem['title'] = feedItem['title'].replace(/[&]/g,'and').replace(/[<>]/g,'');

                        feedItem['date'] = new Date(item['date']).toUTCString();

                        if (item['description']) {
                            feedItem['description'] = item['description'];
                            feedItem['description'] = entities.decode(striptags(feedItem['description']));
                            feedItem['description'] = feedItem['description'].trim();
                            feedItem['description'] = feedItem['description'].replace(/[&]/g,'and').replace(/[<>]/g,'');
                        }

                        if (item['link']) {
                            feedItem['link'] = item['link'];
                        }

                        if (item['image'] && item['image'].url) {
                            feedItem['imageUrl'] = item['image'].url;
                        }
                        items.push(feedItem);
                    }
                }
            });

            // All items parsed. 
            feedparser.on('end', function () {
                // Put some logging here if required.
            });

            // Return error if it failed.
            feedparser.on('error', function(err) {
                callback(err, null);
            });
        },
        stringifyItems : function (items, callback) {
            stringifyFeeds(items, function (feedData) {
                callback(feedData);
            })
        }
    };
}();

function stringifyFeeds(items, callback) {
    // Structure items before storing into S3 file.
    let feedData = '[';
    for (let i = 0; i < items.length; i++) {
        feedData += JSON.stringify(items[i]) + ', ';
    }
    let dataLength = feedData.length;
    feedData = feedData.substring(0, dataLength-2) + ']';
    callback(feedData);
}

module.exports = feedParser;
