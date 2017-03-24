'use strict';

var Builder = require('../model-builder');
var Area = require('./area');

function Info(obj) {
  if (obj) {
    if (obj.parameter) {
      obj.parameters = obj.parameter;
    }

    if (obj.area) {
      obj.areas = obj.area;
    }
  }


  this.init(obj);
}

Builder.build(Info, {
  language: {default: 'en-US'},
  category: {default: []},
  event: {default: ''},
  responseTypes: {default: []},
  urgency: {default: 'Immediate'},
  severity: {default: 'Extreme'},
  certainty: {default: 'Observed'},
  audience: {default: ''},
  eventCode: {default: ''},
  effective: {default: ''},
  onset: {default: ''},
  expires: {default: ''},
  senderName: {default: ''},
  headline: {default: ''},
  description: {default: ''},
  instruction: {default: ''},
  web: {default: ''},
  contact: {default: ''},
  parameters: {default: {}},
  areas: {
    default: [],
    setter: function(val) {
      this._set('areas', []);
      if (!val) {
        return;
      }
      if (val && !Array.isArray(val)) {
        val = [val];
      }
      val.forEach(this.addArea.bind(this));
      return this;
    }
  }
});

Info.prototype.getParameterValue = function(name) {
  var params = this._get('parameters');
  if (params) {
    return params[name];
  }
  return undefined;
};

Info.prototype.getAreas = function() {
  return this._get('areas');
};

/**
 *
 * @param {integer} index
 * @returns {Area}
 */
Info.prototype.getArea = function(index) {
  return this.areas[index];
};

Info.prototype.addArea = function(area) {
  if (!(area instanceof Area)) {
    area = new Area(area);
  }
  this.areas.push(area);
};

Info.prototype.getCountAreas = function( ){
  return this.areas.length;
};

Info.area = function(obj) {
  return new Area(obj);
};

module.exports = Info;
