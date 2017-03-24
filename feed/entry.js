'use strict';

var Alert = require('../alert');
//var _ = require('lodash');

function FeedEntry(entry) {
  this.entry = entry;
}

FeedEntry.prototype.prepareAlertData = (function() {
  //function SaxObj(o) {}

  function getVal(key, obj, def) {
    if (obj.hasOwnProperty(key)) {
      var result = obj[key];
      if (Array.isArray(result)) {
        return result.map(function(item) {
          return item['#'];
        });
      }
      return result['#'];
    }
    return def;
  }

  function parseValues(data) {
    if (!data) {
      return {};
    }

    if (!Array.isArray(data)) {
      data = [data];
    }

    return data.reduce(function(prev, item) {
      var key = getVal('valuename', item, '', true);
      var val = getVal('value', item, '');
      if (!prev[key]) {
        prev[key] = val;
      } else {
        if (!Array.isArray(prev[key])) {
          prev[key] = [prev[key]];
        }
        prev[key].push(val);
      }
      return prev;
    }, {});
  }

  function parseArea(o) {
    var geocode = {};
    if (o.geocode) {
      geocode = parseValues(o.geocode);
    }

    return {
      polygons: getVal('polygon', o, []),
      circles: getVal('circle', o, []),
      geocodes: geocode,
      altitude: getVal('altitude', o, 0.0),
      ceiling: getVal('ceiling', o, 0.0),
      areaDesc: getVal('areadesc', o, '')
    };
  }

  function parseInfo(o) {
    var result = {
      language: getVal('language', o, 'en-US'),
      category: getVal('category', o, []),
      event: getVal('event', o, ''),
      responseTypes: getVal('reponsetype', o, [], true),
      urgency: getVal('urgency', o, 'Immediate'),
      severity: getVal('severity', o, 'Extreme'),
      certainty: getVal('certainty', o, 'Observed'),
      audience: getVal('audience', o, ''),
      eventCode: getVal('eventcode', o, '', true),
      effective: getVal('effective', o, ''),
      onset: getVal('onset', o, ''),
      expires: getVal('expires', o, ''),
      senderName: getVal('sendername', o, '', true),
      headline: getVal('headline', o, ''),
      description: getVal('description', o, ''),
      instruction: getVal('instruction', o, ''),
      web: getVal('web', o, ''),
      contact: getVal('contact', o, ''),
      area: []
    };

    var area = (o.area)? (!Array.isArray(o.area)? [o.area]: o.area): [];
    result.area = area.map(parseArea);

    result.parameters = parseValues(o.parameter || {});

    return result;
  }

  function parseAlert(o, xmlns) {
    var result = {
      xmlns: xmlns,
      identifier: getVal('identifier', o, ''),
      sender: getVal('sender', o, ''),
      sent: getVal('sent', o, ''),
      status: getVal('status', o, 'Actual'),
      msgType: getVal('msgtype', o, 'Alert', true),
      source: getVal('source', o, ''),
      scope: getVal('scope', o, 'Public'),
      restriction: getVal('restriction', o, ''),
      code: getVal('code', o, ''),
      note: getVal('note', o, '')
    };

    var info = o.info;
    if (!Array.isArray(info)) {
      info = [info];
    }
    result.info = info.map(parseInfo);
    return result;

  }

  return function(o, xmlns) {
    //console.log(JSON.stringify(o, null, 2));

    return parseAlert(o, xmlns);
  };

}());

FeedEntry.prototype.getAlertData = function() {
  var data;

  var content = this.entry['atom:content'];
  if (content && content.alert) {
    data = this.prepareAlertData(content.alert, content.alert['@'].xmlns);
    return data;
  }

  throw new Error('Feed does not embed alert section');
};

FeedEntry.prototype.getAlert = function() {
  return new Alert(this.getAlertData());
};

FeedEntry.prototype.getNamespaceData = function(ns) {
  ns = ns.replace('xmlns:', '') + ':';
  var result = {};

  var entry = this.entry;
  for(var key in entry) {
    var newKey = key.replace(ns, '');
    if (newKey !== key) {
      result[newKey] = entry[key];
    }
  }
  return result;
};

FeedEntry.prototype.getNamespaces = function() {
  return this.entry.meta['atom:@'];
};



module.exports = FeedEntry;