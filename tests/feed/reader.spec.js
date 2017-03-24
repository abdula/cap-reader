/*global describe, it, before, beforeEach, after, afterEach */

var should = require('should'),
  assert = require('assert'),
  express = require('express'),
  path = require('path'),
  domain = require('domain'),
  request = require('request'),
  Alert  = require('../../alert'),
  readfeeds = require('../../feed/reader');

var port = process.env.PORT || 3000;

describe('Feed reader', function() {
  this.timeout(10000);

  var app, server;
  var url = 'http://localhost:' + port;

  before(function(done) {
    app = express();
    app.set('port', port);
    app.set('env', 'test');
    app.use(express.static(path.join(__dirname, 'files')));

    server = app.listen(app.get('port'), function() {
      console.log('Express server listening on port %d in %s mode', app.get('port'), app.get('env'));
      done();
    });
  });

  it('should be a function', function() {
    assert.ok(typeof readfeeds === 'function');
  });


  it('should parse nws', function(done) {
   var d = domain.create();
   d.on('error', function(err) {
     done(err);
   });
  
   var list = [];
  
   d.run(function() {
     readfeeds(url + '/nws.xml')
       .on('data', function(data) {
         assert.ok(data instanceof Alert);
         list.push(data);
       })
       .on('error', function(err) {
         done(err);
       })
       .on('end', function() {
         assert.equal(list.length, 5);
         done();
       });
   });
  });

  it('should parse feed with embed alert', function(done) {
    var d = domain.create();
    d.on('error', function(err) {
      console.log(err);
      done(err);
    });

    var list = [];

    d.run(function() {
      readfeeds(url + '/earthquake.xml')
        .on('data', function(data) {
          list.push(data);
        })
        .on('error', function(err) {
          done(err);
        })
        .on('end', function() {
          assert.equal(list.length, 1);
          /**
           *  @type {Alert}
           */
          var alert = list[0];
          assert.ok(alert instanceof Alert);

          assert.equal(alert.get('identifier'), 'TRI13970876.1');
          done();
        });
    });
  });

  it('should parse https://alerts.weather.gov/cap/us.php?x=0', function(done) {
    var d = domain.create();
    d.on('error', function(err) {
      console.log(err);
      done(err);
    });

    var list = [];

    d.run(function() {
      readfeeds('https://alerts.weather.gov/cap/us.php?x=0')
        .on('data', function(data) {
          list.push(data);
        })
        .on('error', function(err) {
          done(err);
        })
        .on('end', function() {
          /**
           *  @type {Alert}
           */
          var alert = list[0];
          assert.ok(alert instanceof Alert);
          done();
        });
    });
  });

  it('should parse https://api.weather.gov/alerts/active?region_type=land', function(done) {
    var d = domain.create();
    d.on('error', function(err) {
      console.log(err);
      done(err);
    });

    var list = [];

    d.run(function() {
      readfeeds('https://api.weather.gov/alerts/active?region_type=land')
        .on('data', function(data) {
          list.push(data);
        })
        .on('error', function(err) {
          done(err);
        })
        .on('end', function() {
          /**
           *  @type {Alert}
           */
          var alert = list[0];
          assert.ok(alert instanceof Alert);
          done();
        });
    });
  });



  after(function(fn) {
    server.close(fn);
  });

});

