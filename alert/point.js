'use strict';
var parseFloatIfNeed = require('./utils').parseFloatIfNeed;

function Point(x, y) {
  if (y === undefined) {
    if (typeof x === 'string') {
      return Point.fromString(x);
    }

    if (x && typeof x === 'object') {
      y = x.y;
      x = x.x;
    }
  }

  this.x = parseFloatIfNeed(x);
  this.y = parseFloatIfNeed(y);
}

var allDoubleRegExp = /[+-]?\d+(\.\d+)?/g;

Point.prototype.isEqual = function(point) {
  return (point.getX() === this.getX() && point.getY() === this.getY());
};

Point.fromString = function(str){
  var result = str.match(allDoubleRegExp);
  return new Point(parseFloat(result[1]), parseFloat(result[0]));
};

Point.toPoints = function(points) {
  return points.map(function(i) {
    return Point.toPoint(i);
  });
};

Point.prototype.clone = function() {
  return new Point(this.x, this.y);
};

Point.prototype.getX = function() {
  return this.x;
};

Point.prototype.getY = function() {
  return this.y;
};

Point.toPoint = function() {
  var args = Array.prototype.slice.call(arguments);
  if (args.length === 2) {
    return new Point(args[0], args[1]);
  }

  if (Array.isArray(args[0])) {
    args = args[0];
    return new Point(args[0], args[1]);
  }

  if (args[0] instanceof Point) {
    return args[0];
  }

  if (typeof args[0] === 'string') {
    return Point.fromString(args[0]);
  }

  if (args.length === 1 && typeof args[0] === 'object') {
    return new Point(args[0]);
  }

  throw new Error('Invalid arguments');
};

module.exports = Point;