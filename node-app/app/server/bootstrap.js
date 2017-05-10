'use strict';

/**
 * Rhizome Admin - Administration tool for Rhizome
 *
 * @file config.js
 * @description
 * @module Config
 * @author Chris Bates-Keegan
 *
 */

// var path = require('path');
// var fs = require('fs');
const Config = require('./config');
// var Model = require('./model');
// var Routes = require('./routes');
// var Logging = require('./logging');
const Rhizome = require('rhizome-api-js');
const Auth = require('./auth');

var _installApp = app => {
  Rhizome.init({
    rhizomeUrl: Config.auth.rhizome.url,
    appToken: Config.auth.rhizome.appToken
  });
  Auth.init(app);
  // Model.init(app);
  // Routes.init(app);

  return Promise.resolve(true);
};

module.exports = {
  app: _installApp
};
