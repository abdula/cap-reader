/*global describe, it, before, beforeEach, after, afterEach */

var should = require('should'),
  assert = require('assert'),
  fs = require('fs'),
  Alert = require('../../alert/index'),
  Area = Alert.Area;

describe('Area', function() {
  it('should initialize', function() {
    var area = Alert.area({
      geocode: {
        "FIPS6": '001023 001025 001129'
      },
      polygon: ['32.31,-88.03 32.32,-87.91 31.78,-88.09 31.6,-88.06 31.6,-88.1 31.78,-88.22 32.31,-88.03'],
      circles: '32.9525,-115.5527 0',
      areaDesc: 'the Imperial Fault'
    });

    assert.ok(area instanceof Alert.Area);
    assert.ok(Array.isArray(area.circles));
    assert.equal(area.getCountPolygons(), 1);
    assert.equal(area.getCountCircles(), 1);

    assert.equal(area.getAreaDesc(), 'the Imperial Fault');

    assert.ok(area.getCircle(0) instanceof Alert.Area.Circle);
    assert.equal(area.getCircle(0).getX(), -115.5527);
    assert.equal(area.getCircle(0).getY(), 32.9525);
    assert.equal(area.getCircle(0).getRadius(), 0);

    assert.ok(area.getPolygon(0) instanceof Alert.Area.Polygon);
    assert.equal(area.getPolygon(0).getCountPoints(), 8);
    var point = area.getPolygon(0).getPoint(0);

    assert.ok(point instanceof Alert.Area.Point);
    assert.equal(point.getX(), -88.03);
    assert.equal(point.getY(), 32.31);

    assert.equal(area.getGeocodeValue("FIPS6"), '001023 001025 001129');
  });

  describe('Polygon', function() {
    var points = [[-105.665,39.640],[-105.898727,39.64000],[-105.8987,39.460097],[-105.66540,39.4600],[-105.66,39.6400]];
    var polygon = Area.polygon(points);
    assert.ok(polygon instanceof Area.Polygon);

    var area = Alert.Info.area({
      polygon:{ points: [[-105.665,39.640],[-105.898727,39.64000],[-105.8987,39.460097],[-105.66540,39.4600],[-105.66,39.6400]]}
    });

    assert.equal(area.getCountPolygons(), 1);
  });
});


