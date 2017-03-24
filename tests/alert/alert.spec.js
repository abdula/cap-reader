/*global describe, it, before, beforeEach, after, afterEach */

var should = require('should'),
  assert = require('assert'),
  fs = require('fs'),
  Alert = require('../../alert/index');

describe('Alert', function() {

  it('should set xmlns', function() {
    var alert = new Alert({});
    assert.equal(alert.hasProp('xmlns'), true);
    assert.equal(alert.set('xmlns', "urn:oasis:names:tc:emergency:cap:1.1"), alert);
    assert.equal(alert.get('xmlns'), "urn:oasis:names:tc:emergency:cap:1.1");
  });

  it('should call setter', function() {
    var alert = new Alert({
      code: 12
    });
    assert.deepEqual(alert.get('code'), [12]);
  });

  it('should initialize', function() {
    var obj = {
      xmlns: "urn:oasis:names:tc:emergency:cap:1.1",
      identifier: 1,
      sender: "sender",
      sent: "2003-06-11T20:56:00-07:00",
      msgType: "Alert",
      scope: "Restricted",
      restriction: "restriction",
      code: [12],
      note: "note"
    };
    var alert = new Alert(obj);

    Object.keys(obj).forEach(function(key) {
      assert.deepEqual(alert.get(key), obj[key], key);
    });

    assert.equal(alert.get("status"), "Actual");
  });


  it('should parse xml', function(done) {
    assert.ok(typeof Alert.parseXML === 'function');

    fs.readFile(__dirname + '/files/nws-alert.xml', function(err, result) {
      if (err) return done(err);

      Alert.parseXML(result, function(err, res) {
        done(err, res);
      });
    });
  });

  it('should parse xml with namespace', function(done) {
    assert.ok(typeof Alert.parseXML === 'function');

    fs.readFile(__dirname + '/files/airnow.xml', function(err, result) {
      if (err) return done(err);

      Alert.parseXML(result, function(err, res) {
        console.log(JSON.stringify(res, null, 2));
        done(err, res);
      });
    });
  });

  describe('Info', function() {
    it('should initialize', function() {
      var props = {
        language: "ru-RU",
        category: "Met",
        event: "Flood Warning",
        responseTypes: ['type'],
        urgency: "Expected",
        severity: "Moderate",
        certainty: "Likely",
        audience: "audience",
        eventCode: "3001",
        effective: "2016-04-14T10:39:00-05:00",
        onset: "2016-04-15T10:39:00-05:00",
        expires: "2016-04-15T10:39:00-05:00",
        parameter: {
          "VTEC": "/O.EXT.KMOB.FL.W.0047.000000T0000Z-160419T0000Z/\n/CLDA1.1.ER.160414T1621Z.160416T1200Z.160418T1800Z.NO/"
        },
        area: {
          polygon: '32.31,-88.03 32.32,-87.91 31.78,-88.09 31.6,-88.06 31.6,-88.1 31.78,-88.22 32.31,-88.03',
          circles: '32.9525,-115.5527 0',
          areaDesc: 'the Imperial Fault'
        }
      };

      var info = Alert.info(props);
      assert.ok(info instanceof Alert.Info);

      assert.equal(info.getCountAreas(), 1);
      assert.ok(info.getArea(0) instanceof Alert.Area);

      var area = info.getArea(0);
      assert.equal(area.getCountPolygons(), 1);
      assert.equal(area.getCountCircles(), 1);

     // assert.equal(info.getParameterValue(), );
    });
  });



});

