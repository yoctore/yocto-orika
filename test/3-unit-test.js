/**
 * Unit tests
 */

var chai    = require('chai').assert;
var expect  = require('chai').expect;
var _       = require('lodash');
var utils   = require('yocto-utils');
var logger  = require('yocto-logger');
var orika   = require('../src')(logger);

// disable console
logger.disableConsole();

// list of method config

var methods = {
  versions : [ {
    label   : 'Must return an Object',
    value   : utils.unit.generateTypeForUnitTests(null, 1),
    types   : [ 'object' ],
    nempty  : true
  }],
  init : [ {
    label   : 'Must return a Boolean and equal to false',
    value   : utils.unit.generateTypeForUnitTests(null, 4),
    types   : [ 'boolean' ],
    equals  : [ false ],
    nempty  : false
  }],
  isReady : [ {
    label   : 'Must be a boolean',
    value   : [ false, true ],
    types   : [ 'boolean' ],
    equals  : [ ],
    nempty  : false
  }]
};

// process schema
describe('Unit ->', function() {
  // parse each module
  _.forOwn(methods, function (ms, keys) {
    describe([ _.capitalize(keys), '-> Must be ok with given values' ].join(' '), function() {
      _.each(ms, function (m) {
        _.each(m.value, function (v) {
          it([ m.label, 'with data :', utils.obj.inspect(v) ].join(' '), function () {
            // get result
            var result = orika[keys](v);

            if (m.nempty) {
              expect(result).to.be.not.empty;
            }
            // process types
            _.each(m.types, function (t) {
              chai.typeOf(result, t);
            });
            // equals tests
            _.each(m.equals, function (e) {
              expect(result).to.equal(e);
            });
          })
        });
      })
    });
  });
});
