'use strict';

var Point = require('./point');
var parseFloatIfNeed = require('./utils').parseFloatIfNeed;


function Circle(x, y, radius) {
  if (y === undefined && radius === undefined) {
    var obj = arguments[0];
    if (typeof obj === 'string') {
      return Circle.fromString(obj);
    }
    x = obj.x;
    y = obj.y;
    radius = obj.radius;
  }

  this.x = parseFloatIfNeed(x);
  this.y = parseFloatIfNeed(y);
  this.radius = parseFloatIfNeed(radius);
}

Circle.prototype.getRadius = function() {
  return this.radius;
};

//32.9525,-115.5527 0
Circle.fromString = function(str) {
  var arr = str.match(/[+-]?\d+(\.\d+)?/g);
  return new Circle(parseFloat(arr[1]), parseFloat(arr[0]), parseFloat(arr[2]));
};

Circle.prototype.getX = function() {
  return this.x;
};

Circle.prototype.getY = function() {
  return this.y;
};

Circle.prototype.clone = function() {
  return new Circle(this.x, this.y, this.radius);
};

Circle.prototype.getCenter = function() {
  return new Point(this.x, this.y);
};

module.exports = Circle;