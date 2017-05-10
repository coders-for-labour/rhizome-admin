'use strict';

/**
 * Rhizome - The API that feeds grassroots movements
 *
 * @file index.js
 * @description Route management
 * @module Route
 * @author Chris Bates-Keegan
 *
 */

var fs = require('fs');
var path = require('path');
var Route = require('./route');
var Logging = require('../logging');
// var Model = require('../model');

/**
 * @param {Object} app - express app object
 * @param {Object} Route - route object
 * @private
 */
function _initRoute(app, Route) {
  var route = new Route();
  app[route.verb](`/api/v1/${route.path}`, (req, res) => {
    route
      .exec(req, res)
      .then(result => res.json(result))
      .catch(err => {
        Logging.log(err, Logging.Constants.LogLevel.ERR);
        res.status(err.statusCode ? err.statusCode : 500).json({message: err.message});
      });
  });
}

// var _apps = [];

/**
 *
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 * @param {Function} next - next handler function
 * @private
 */
function _configCrossDomain(req, res, next) {
  res.header('Access-Control-Allow-Origin', `http://localhost`);
  res.header('Access-Control-Allow-Methods', 'POST,OPTIONS');

  if (req.method === 'OPTIONS') {
    res.sendStatus(200);
    return;
  }
  next();
}

/**
 *
 * @param {Object} app - express app object
 */
exports.init = app => {
  Route.app = app;

  app.get('/favicon.ico', (req, res, next) => res.sendStatus(404));
  app.get('/index.html', (req, res, next) => res.send('<html><head><title>Rhizome Admin</title></head></html>'));

  app.use(_configCrossDomain);

  var providers = _getRouteProviders();
  for (var x = 0; x < providers.length; x++) {
    var routes = providers[x];
    for (var y = 0; y < routes.length; y++) {
      var route = routes[y];
      _initRoute(app, route);
    }
  }
};

/**
 * @return {Array} - returns an array of Route handlers
 * @private
 */
function _getRouteProviders() {
  var filenames = fs.readdirSync(`${__dirname}/api`);

  var files = [];
  for (var x = 0; x < filenames.length; x++) {
    var file = filenames[x];
    if (path.extname(file) === '.js') {
      files.push(require(`./api/${path.basename(file, '.js')}`));
    }
  }

  return files;
}
