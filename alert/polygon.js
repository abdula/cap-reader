'use strict';

var Point = require('./point');

function Polygon(points) {
  this.points = [];

  if (points && typeof points === 'object') {
    if (points.hasOwnProperty('points')) {
      points = points.points || [];
    }
  }

  if (Array.isArray(points)) {
    this.points = Point.toPoints(points);
    this.normalizeRing();
  }

  if (typeof points === 'string') {
    if (!points.length){
      throw new Error('List of points is empty');
    }
    return Polygon.fromString(points);
  }

  if (points instanceof Polygon) {
    return points.clone();
  }

}

Polygon.prototype.normalizeRing = function() {
  var num = this.points.length;
  if (!num) {
    return;
  }

  if (this.points[0].isEqual(this.points[num - 1])) {
    this.points.push(this.points[0].clone());
  }
};

//32.31,-88.03 32.32,-87.91 31.78,-88.09 31.6,-88.06 31.6,-88.1 31.78,-88.22 32.31,-88.03
Polygon.fromString = function(string) {
  return new Polygon(string.split(' ').map(Point.fromString));
};

Polygon.prototype.clone = function() {
  return new Polygon(this.points);
};

Polygon.prototype.getCountPoints = function( ){
  return this.points.length;
};

Polygon.prototype.getPoint = function(index) {
  return this.points[index];
};

Polygon.prototype.getPoints = function() {
  return this.points;
};

module.exports = Polygon;