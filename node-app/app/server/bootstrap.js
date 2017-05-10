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

const Config = require('./config');
// var Logging = require('./logging');
const Rhizome = require('rhizome-api-js');
const Auth = require('./auth');
const Cache = require('./cache');
const Users = require('./users');

var _installApp = app => {
  Rhizome.init({
    rhizomeUrl: Config.auth.rhizome.url,
    appToken: Config.auth.rhizome.appToken
  });

  Cache.Manager.create(Cache.Constants.Type.TEAM);
  Auth.init(app);
  Users.init(app);

  return Promise.resolve(true);
};

module.exports = {
  app: _installApp
};
