'use strict';

/**
 * Rhizome Admin - Administration tool for Rhizome
 *
 * @file helpers.js
 * @description Helpers
 * @module System
 * @author Chris Bates-Keegan
 *
 */

module.exports.Promise = {
  prop: prop => (val => val[prop]),
  func: func => (val => val[func]()),
  nop: () => (() => null),
  inject: value => (() => value)
};

