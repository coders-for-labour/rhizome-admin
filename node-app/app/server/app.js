'use strict';

/**
 * Rhizome Admin - Administration tool for Rhizome
 *
 * @file app.js
 * @description
 * @module System
 * @author Chris Bates-Keegan
 *
 */

const express = require('express');
const session = require('express-session');
const LevelStore = require('level-session-store')(session);
const methodOverride = require('method-override');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const Bootstrap = require('./bootstrap');
const Config = require('./config');
const Logging = require('./logging');
const passport = require('passport');

/**
 * Express
 */
var app = module.exports = express();

/**
 * Configuration
 */
var configureDevelopment = () => {
  Config.env = 'dev';
  app.use(morgan('short'));
  app.set('port', Config.listenPort);
};

var configureProduction = () => {
  Config.env = 'prod';
  app.use(morgan('short'));
  app.set('port', Config.listenPort);
};

var configureTest = () => {
  Config.env = 'test';
  app.use(morgan('short'));
  app.set('port', Config.listenPort);
};

var configureApp = env => {
  app.enable('trust proxy', 1);
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({extended: true}));
  app.use(methodOverride());

  app.use(session({
    saveUninitialized: false,
    resave: false,
    secret: Config.auth.sessionSecret,
    store: new LevelStore(`${Config.appDataPath}/sessions`)
  }));

  app.use(express.static(`${Config.appDataPath}/static`));
  app.use(passport.initialize());
  app.use(passport.session());

  switch (env) {
    default:
    case 'development':
      configureDevelopment();
      break;
    case 'production':
      configureProduction();
      break;
    case 'test':
      configureTest();
      break;
  }
};

configureApp(app.get('env'));

/**
 *
 */
Bootstrap
  .app(app)
  .then(() => {
    Logging.log(`${Config.app.title} v${Config.app.version} listening on port ` +
      `${app.get('port')} in ${app.settings.env} mode.`, Logging.Constants.LogLevel.INFO);
    app.server = app.listen(app.set('port'));
  })
  .catch(Logging.Promise.logError());
