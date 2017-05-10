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

var fs = require('fs');

/**
 * @type {{development: string, production: string, test: string}}
 * @private
 */
var _map = {
  development: 'dev',
  production: 'prod',
  test: 'test'
};

var _env = process.env.NODE_ENV ? process.env.NODE_ENV : 'development';
const _regEx = /^%(\w+)%$/;

/**
 * @param  {Object} env - environment variables
 * @param  {Object|Array} root - root object
 */
const _recurseVars = (env, root) => {
  for (let variable in root) {
    if (root[variable] instanceof Object) {
      _recurseVars(env, root[variable]);
    } else if (root[variable] instanceof Array) {
      _recurseVars(env, root[variable]);
    } else if (typeof root[variable] === "string") {
      const match = _regEx.exec(root[variable]);
      if (match) {
        root[variable] = env[match[1]];
      }
    }
  }
};

/**
 * @class Config
 *
 */
class Config {
  constructor() {
    this._settings = this._loadSettings();
    this._settings.env = _map[this._settings.env];
  }

  get settings() {
    return this._settings;
  }

  _loadSettings() {
    var json = fs.readFileSync('./config.json');
    var settings = JSON.parse(json);

    var variable;
    for (variable in settings.environment) {
      if (!process.env[variable] && !settings.environment[variable]) {
        throw new Error(`You must specify the ${variable} environment variable`);
      }
      if (process.env[variable]) {
        settings.environment[variable] = process.env[variable];
      }
    }

    var local = settings.local[process.env.RHIZOME_SERVER_ID];
    for (variable in local) {
      if (local[variable] instanceof Object && local[variable][_map[_env]]) {
        local[variable] = local[variable][_map[_env]];
      }
    }

    _recurseVars(settings.environment, settings.global);
    _recurseVars(settings.environment, local);

    return Object.assign(settings.global, settings.local.environment, local);
  }
}

module.exports = (new Config()).settings;
