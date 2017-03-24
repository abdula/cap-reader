var FeedReader = require('./feed/reader');

exports.readfeed = function(options) {
  var reader = new FeedReader(options);
  return reader();
};

exports.Alert = require('./alert/index');