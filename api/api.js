var express = require('express');
var MongoClient = require('mongodb').MongoClient;
var _ = require('lodash');
var NodeCache = require( "node-cache" );
var cors = require('cors');
var fs = require('fs');
var app = express();
var async = require('async');



// CORS
app.use(cors());
app.options('*', cors());

// Config variables
var MONGO_URL = 'mongodb://localhost:27017/libscore';

// In memory cache
var localCache = new NodeCache();



MongoClient.connect(MONGO_URL, function(err, db) {
  console.log("Connected correctly to server");
  var libraryUsageCollection = db.collection('libraryUsage');
  var scriptUsageCollection = db.collection('scriptUsage');
  var sitesCollection = db.collection('sites');

  // We will use v1, and switch to v2 when breaking changes.
  // We will just duplicate the code and put it another file

  app.get('/v1/libraries/:library', function(req, res){

    // Query parameters
    var limit = req.query.limit || 500;
    var library = req.params.library;

    getUtilizingSites('library', library, req.headers.host, limit, function(err, results) {
      if (err) console.error('Error /v1/libraries/' + library, err);
      res.send(results);
    });
  });


  app.get('/badge/:library.svg', function(req, res){

    // Query parameters
    var library = req.params.library;

    libraryUsageCollection.findOne({library: library}, { sort: [['crawlTime', 'desc']]}, function(err, lib) {
      console.log(lib);
      res.redirect(301, 'http://img.shields.io/badge/libscore-' + lib.count + '-brightgreen.svg?style=flat-square');
    });
  });


  app.get('/v1/libraries', function(req, res){

    // Query parameters
    var limit = req.query.limit || 500;

    getResources('library', req.headers.host, limit, function(err, result) {
      if (err) console.error('Error /v1/libraries', err);
      res.send(result);
    });
  });

  app.get('/v1/scripts/:script', function(req, res){

    // Query parameters
    var limit = req.query.limit || 500;
    var script = req.params.script;

    getUtilizingSites('script', script, req.headers.host, limit, function(err, results) {
      if (err) console.error('Error /v1/scripts/' + script, err);
      res.send(results);
    });
  });

  app.get('/v1/scripts', function(req, res){

    // Query parameters
    var limit = req.query.limit || 500;

    getResources('script', req.headers.host, limit, function(err, result) {
      if (err) console.error('Error /v1/scripts', err);
      res.send(result);
    });
  });

  app.get('/v1/sites/:site', function(req, res){

    // Query parameters
    var skip = req.query.skip || 0;
    var limit = req.query.limit || 500;
    var site = req.params.site;

    getMostRecentCrawls(function(err, crawls) {

      var mostRecentCrawlTime = crawls[0].crawlTime;

      // Find some documents
      sitesCollection.findOne({url: site, crawlTime: mostRecentCrawlTime}, {limit: 1, skip: skip, sort: [['rank', 'asc']]}, function(err, site) {
        var desktop = _.filter(site.libraries, function(lib){ return lib.type === 'desktop'; });
        var mobile = _.filter(site.libraries, function(lib){ return lib.type === 'mobile'; });
        var libs = desktop.concat(mobile);
        var scriptsDesktop = _.filter(site.scripts, function(script){ return script.type === 'desktop'; });
        var scriptsMobile = _.filter(site.scripts, function(script){ return script.type === 'mobile'; });
        var scripts = scriptsDesktop.concat(scriptsMobile);
        res.send({
          url: site.url,
          rank: site.rank,
          libraries: libs,
          scripts: scripts,
          total: site.total,
          meta: {
            crawl: {
              crawlTime: mostRecentCrawlTime
            }
          }
        });

      });
    });
  });

  app.get('/v1/sites', function(req, res){

    // Query parameters
    var skip = req.query.skip || 0;
    var limit = req.query.limit || 500;
    getMostRecentCrawls(function(err, crawls) {

      var mostRecentCrawlTime = crawls[0].crawlTime;

      // Find some documents
      sitesCollection.find({crawlTime: mostRecentCrawlTime}, {limit: limit, skip: skip, sort: [['rank', 'asc']]}).toArray(function(err, sites) {
        sites = _.map(sites, function (site) {
          return {
            url: site.url,
            rank: site.rank,
            resource: 'http://' + req.headers.host + '/v1/sites/' + site.url
          };
        });
        sites = _.uniq(sites, function (site){ return site.url });
        res.send({
          results: sites,
          meta: {
            crawl: {
              crawlTime: mostRecentCrawlTime
            }
          }
        });

      });
    });
  });

  app.get('/v1/search/:query', function(req, res) {
    // http://stackoverflow.com/questions/3561493/is-there-a-regexp-escape-function-in-javascript
    var query = (function(s) {
      return s.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
    })(req.params.query);
    var regex = new RegExp(query, 'i');
    getMostRecentCrawls(function(err, crawls) {
      var mostRecentCrawlTime = crawls[0].crawlTime;
      async.parallel({
        libraries: function(callback) {
          libraryUsageCollection.find({ library: regex, crawlTime: mostRecentCrawlTime }, { sort: { count: -1 }, limit: 25 }).toArray(callback);
        },
        scripts: function(callback) {
          scriptUsageCollection.find({ script: regex, crawlTime: mostRecentCrawlTime }, { sort: { count: -1 }, limit: 25 }).toArray(callback);
        }
      }, function(err, result) {
        if (err) console.error('Error /v1/search/' + req.params.query, err);
        res.send({
          libraries: _.map(result.libraries, function(library) {
            return { name: library.library, count: library.count };
          }),
          scripts: _.map(result.scripts, function(script) {
            return { name: script.script, count: script.count };
          })
        });
      });
    });
  });

  app.get('/libraries.txt', function(req, res){
    res.sendfile('DUMP.txt', {root: __dirname+"../../../"})
  });

  // Get the most crawl and store the details in cache for 30 minutes at a time
  var getMostRecentCrawls = function (callback) {
    localCache.get('recentCrawls', function(err, value) {
      if(typeof value.recentCrawls === 'undefined') {
        db.collection('crawls').find({}, {limit: 2, sort: [['crawlTime', 'desc']]}).toArray(function(err, crawls) {
          callback(err, crawls);
          localCache.set('recentCrawls', crawls, 10, function (err, success) {
            if (err) {
              console.error('Cache save error', err);
            }
          });
        });
      } else {
        callback(null, value.recentCrawls);
      }
    });
  };

  function getUtilizingSites(type, name, host, limit, callback) {
    getMostRecentCrawls(function(err, crawls) {
      var collection = (type === 'library') ? libraryUsageCollection : scriptUsageCollection;

      var mostRecentCrawlTime = crawls[0].crawlTime;

      async.parallel({
        count: function(callback) {
          var query = {};
          query[type] = name;
          collection.find(query, { limit: crawls.length, sort: [['crawlTime', 'desc']] }).toArray(function(err, results) {
            callback(err, _.pluck(results, 'count'));
          });
        },
        sites: function(callback) {
          var key = (type === 'library') ? 'libraries.name' : 'scripts.name';
          var query = { crawlTime: mostRecentCrawlTime };
          query[key] = name;
          sitesCollection.find(query, {limit: limit, sort: [['rank', 'asc']]}).toArray(function(err, sites) {
            var sites = _.map(sites, function (site) {
              return {
                url: site.url,
                rank: site.rank,
                resource: 'http://' + host + '/v1/sites/' + site.url
              };
            });
            callback(err, sites);
          });
        }
      }, function(err, results) {
        callback(err, {
          count: results.count,
          sites: results.sites,
          github: '',
          meta: {
            crawl: {
              crawlTime: mostRecentCrawlTime
            }
          }
        });
      });
    });
  }

  function getResources(type, host, limit, callback) {

    var collection = (type === 'library') ? libraryUsageCollection : scriptUsageCollection;

    getMostRecentCrawls(function(err, crawls) {
      async.parallel({
        resources: function(callback) {
          collection.find({ crawlTime: crawls[0].crawlTime }, { limit: limit, sort: [['count', 'desc']] })
                    .toArray(callback);
        },
        prevCount: function(callback) {
          collection.find({ crawlTime: crawls[1].crawlTime }, { limit: limit, sort: [['count', 'desc']] }).toArray(function(err, resources) {
            callback(err, _.pluck(resources, 'count'));
          });
        }
      }, function(err, results) {
        var resources = _.map(results.resources, function (resource, i) {
          var plural = (type === 'library') ? 'libraries' : 'scripts';
          var result = {
            count: [resource.count, results.prevCount[i]],
            resource: 'http://' + host + '/v1/' + plural + '/' + resource[type]
          };
          if (type === 'library') {
            result.github = '';
          }
          result[type] = resource[type];
          return result;
        });
        callback(err, {
          results: resources,
          meta: {
            crawl: {
              crawlTime: crawls[0].crawlTime
            }
          }
        });
      });
    });
  }

  app.listen(3000);

});
