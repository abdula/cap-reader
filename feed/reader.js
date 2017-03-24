'use strict';

var Alert = require('../alert');
var es = require('event-stream');
var request = require('request');
var FeedParser = require('feedparser');
var FeedEntry = require('./entry');

function parse(options) {
  var capType = 'application/cap+xml';

  function getCapLink(val) {
    if (!val) {
      return false;
    }
    if (Array.isArray(val)) {
      for (var i = 0; i < val.length; i++) {
        var item = val[i]['@'];
        if (item.type === capType) {
          return item.href;
        }
      }
    }

    if (typeof val === 'object') {
      val = val['@'];
      if (!val.type || val.type === capType) {
        return val.href;
      }
    }

    return false;
  }

  return es.map(function(obj, cb) {
    var content = obj['atom:content'];
    if (content && content.alert) { //embed alert
      var entry = new FeedEntry(obj);
      try {
        cb(null, entry.getAlert());
      } catch (e) {
        cb(e);
      }
    } else {
      var link = getCapLink(obj['atom:link']);
      if (!link) {
        if (obj['atom:id']) {
          link = obj['atom:id']['#'];
          if (link.indexOf('http') !== 0) {
            link = false;
          }
        }
      }

      if (!link) {
        return cb();
      }

      request({
        uri: link,
        headers: {
          'User-Agent': 'request',
          'Accept': 'application/cap+xml'
        }
      }, function(error, response, body) {
        if (error) {
          return cb(error);
        }

        if (response.statusCode !== 200) {
          var err = new Error('Failed to obtain alert. Code: ' + response.statusCode);
          err.body = body;
          err.name = 'HttpError';

          return cb(err);
        }
        Alert.parseXML(body, function(err, alert) {
          cb(err, alert);
        });
      });
    }
  });
}

function read(url, options) {
  if (!options) {
    options = {};
  }
  if (!options.headers) {
    options.headers = {};
  }
  options.headers['User-Agent'] = 'request';
  options.headers['Accept'] = 'application/atom+xml';

  var parser = parse(options);
  var req = request(url, options);
  var feedparser = new FeedParser({ addmeta: true, normalize: true }); //,

  return req.pipe(feedparser).pipe(parser);
}

module.exports = read;