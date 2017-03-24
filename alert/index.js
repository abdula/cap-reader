'use strict';

var ModelBuilder = require('../model-builder');
var Info = require('./info');
var Area = require('./area');
var xml2js = require('xml2js');


/**
 * @function getIdentifier
 *
 * @param obj
 * @constructor
 */
function Alert(obj) {
  if (obj) {
    if (obj.info) {
      obj.infos = obj.info;
    }
  }
  this.init(obj);
}

ModelBuilder.build(Alert, {
  xmlns: {default: ''},
  identifier: {default: ''},
  sender: {default: ''},
  sent: {default: ''},
  status: {default: 'Actual'},
  msgType: {default: 'Alert'},
  source: {default: ''},
  scope: {default: 'Public'},
  restriction: {default: ''},
  code: {
    default: '',
    setter: function(val) {
      if (val && !Array.isArray(val)) {
        val = [val];
      }
      return this._set('code', val);
    }
  },
  note: {default: ''},
  infos: {
    default: [],
    setter: function(val) {
      this._set('infos', []);
      if (!val) {
        return;
      }
      if (val && !Array.isArray(val)) {
        val = [val];
      }
      val.forEach(function(item) {
        this.addInfo(item);
      }, this);
      return this;
    }
  }
});

Alert.prototype.getCountInfos = function() {
  return this.infos.length;
};

Alert.prototype.addInfo = function(info) {
  if (false === (info instanceof Info)) {
    info = Alert.info(info);
  }
  this.infos.push(info);
  return this;
};

/**
 *
 * @param {integer} index
 * @returns {Info}
 */
Alert.prototype.getInfo = function(index) {
  return this.infos[index];
};


Alert.Info = Info;
Alert.Area = Area;

Alert.info = function(obj) {
  return new Info(obj);
};

Alert.area = function(obj) {
  return new Area(obj);
};


Alert.parseXML = (function() {
  function first(o, key, def) {
    if (o.hasOwnProperty(key)) {
      return o[key][0];
    }
    return def;
  }

  function parseArea(o) {
    return new Area({
      areaDesc: first(o, 'areaDesc', ''),
      polygon: (o.polygon || []).filter(function(i) {
        return i && i.length > 0;
      }),
      circle: (o.circle || []).filter(function(i) {
        return i && i.length > 0;
      }),
      geocode: parseValues(o.geocode || []),
      altitude: first(o, 'altitude', 0.0),
      ceiling: first(o, 'ceiling', 0.0)
    });
  }

  function parseValues(values) {
    if (!Array.isArray(values)) {
      return {};
    }

    return values.reduce(function(prev, item) {
      var key = item.valueName[0];
      var val = item.value[0];
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

  function parseInfo(o) {
    return new Info({
      language: first(o, 'language', 'en-US'),
      category: first(o, 'category', 'Met'),
      event: first(o, 'event'),
      responseTypes: o.responseTypes || [],
      urgency: first(o, 'urgency', 'Immediate'),
      severity: first(o, 'severity', 'Extreme'),
      certainty: first(o, 'certainty', 'Observed'),
      audience: first(o, 'audience'),
      effective: first(o, 'effective'),
      onset: first(o, 'onset'),
      expires: first(o, 'expires'),
      senderName: first(o, 'senderName'),
      headline: first(o, 'headline'),
      description: first(o, 'description'),
      instruction: first(o, 'instruction'),
      web: first(o, 'web'),
      contact: first(o, 'contact'),
      eventCode: parseValues(o.eventCode || []),
      parameters: parseValues(o.parameter || []),
      area: (o.area || []).map(parseArea)
    });
  }

  function parseAlert(o) {
    return new Alert({
      xmlns: o.$.xmlns,
      identifier: first(o, 'identifier'),
      sender: first(o, 'sender'),
      sent: first(o, 'sent'),
      status: first(o, 'status'),
      msgType: first(o, 'msgType', 'Alert'),
      source: first(o, 'source'),
      scope: first(o, 'scope', 'Public'),
      restriction: first(o, 'restriction', ''),
      code: o.code || [],
      note: first(o, 'note', ''),
      info: o.info.map(parseInfo)
    });
  }


  var stripTagExp = /(?!xmlns)^.*:/;

  return function(xml, cb) {
    xml2js.parseString(xml, {
      trim:true,
      tagNameProcessors: [function(name) {
        return name.replace(stripTagExp, '');
      }]
    }, function(err, o) {
      if (err) {
        return cb(err);
      }
      if (!o.alert) {
        return cb(new Error('Invalid alert format'));
      }

      o = o.alert;
      try {
        cb(null, parseAlert(o));
      } catch(e) {
        cb(e);
      }
    });
  };

}());


module.exports = Alert;


