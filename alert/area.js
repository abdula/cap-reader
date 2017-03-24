'use strict';

var builder = require('../model-builder');
var Polygon = require('./polygon');
var Point = require('./point');
var Circle = require('./circle');

function Area(obj) {
  if (obj.polygon) {
    obj.polygons = obj.polygon;
  }

  if (obj.circle) {
    obj.circles = obj.circle;
  }

  if (obj.geocode) {
    obj.geocodes = obj.geocode;
  }

  this.init(obj);
}

builder.build(Area, {
  areaDesc: {
    default: ''
  },
  polygons: {
    default: [],
    setter: function(polygon) {
      this._set('polygons', []);
      if (!polygon) {
        return;
      }
      if (!Array.isArray(polygon)) {
        polygon = [polygon];
      }

      polygon.forEach(function(item) {
        this.addPolygon(item);
      }, this);
    }
  },
  circles: {
    default: [],
    setter: function(circle) {
      this._set('circles', []);
      if (!circle) {
        return;
      }
      if (!Array.isArray(circle)) {
        circle = [circle];
      }

      circle.forEach(function(item) {
        this.addCircle(item);
      }, this);
    }
  },
  geocodes: {
    default: {}
  },
  altitude: {
    default: 0.0
  },
  ceiling: {
    default: 0.0
  }
});


(function() {
  this.getGeocodeValue = function(name) {
    var geocode = this.get('geocodes');
    if (geocode) {
      return geocode[name];
    }
    return null;
  };

  this.addCircle = function(circle) {
    if (!(circle instanceof Circle)) {
      this.circles.push(Area.circle(circle));
    }
    return this;
  };


  this.getCircle = function(index) {
    return this.circles[index];
  };

  this.addPolygon = function(polygon) {
    if (!(polygon instanceof Polygon)) {
      this.polygons.push(Area.polygon(polygon));
    }
    return this;
  };

  /**
   *
   * @param {integer} index
   * @returns {Polygon}
   */
  this.getPolygon = function(index) {
    return this.polygons[index];
  };

  this.getPolygons = function() {
    return this.polygons;
  };

  this.getCircles = function() {
    return this.circles;
  };

  this.getCountPolygons = function() {
    return this.polygons.length;
  };

  this.getCountCircles = function() {
    return this.circles.length;
  };
}.call(Area.prototype));


Area.Point   = Point;
Area.Polygon = Polygon;
Area.Circle  = Circle;

Area.polygon = function(data) {
  return new Polygon(data);
};

Area.point = function(x, y) {
  return new Point(x, y);
};

Area.circle = function(x, y, radius) {
  return new Circle(x, y, radius);
};

module.exports = Area;