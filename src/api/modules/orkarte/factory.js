'use strict';

var logger    = require('yocto-logger');
var _         = require('lodash');

/**
 * Default Orkart factory module  - build data for current
 */
function OrkarteFactory (l) {
  /**
   * Default logger instance
   */
  this.logger   = l;
}

/**
 * Default factory method to build an order project
 *
 * @param {String} client client identifier to use on current object
 * @return {Object} order object to use on request
 */
OrkarteFactory.prototype.getClient = function (client) {
  // default object to build
  return {
    idcli     : client || ''
  };
};

// Default export
module.exports = function (l) {
  // is a valid logger ?
  if (_.isUndefined(l) || _.isNull(l)) {
    // warning message
    logger.warning([ '[ YoctoOrika.OrkarteFactory.constructor ] -',
                     'Invalid logger given. Use internal logger' ].join(' '));
    // assign
    l = logger;
  }

  // default statement
  return new (OrkarteFactory)(l);
};
