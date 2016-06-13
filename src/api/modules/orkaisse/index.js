'use strict';

var logger    = require('yocto-logger');
var _         = require('lodash');
var Q         = require('q');

/**
 * Default orkaisse module - Provide request to orkaisse endpoint
 */
function Orkaisse (l) {
  /**
   * Default logger instance
   */
  this.logger   = l;

  /**
   * Default module version
   *
   * @type {String}
   */
  this.version  = '1.0.10';

  /**
   * Default endpoint
   *
   * @type {String}
   */
  this.endpoint = 'orkaisse/drive/api';

  /**
   * Default module state
   *
   * @type {Boolean}
   */
  this.state    = false;

  /**
   * Default core request to send api
   */
  this.core    = require('../core')(l);
  /**
   * Default orkaisse schema
   */
  this.schema  = require('./schema')(l);
  /**
   * Default okaisse factory schema
   */
  this.factory  = require('./factory')(l);
}

/**
 * Default init method to init orkaisse module
 *
 * @param {Object} config default config object to use on current api
 * @return {Boolean} true if all is ok false otherwise
 */
Orkaisse.prototype.init = function (config) {
  // default statement
  return this.core.init(config);
};

/**
 * Give currnet module state
 *
 * @return {Boolean} true if module is ready to use false otherwise
 */
Orkaisse.prototype.isReady = function () {
  // default statement
  return this.state;
};

/**
 * Create / Update an order
 *
 * @param {Object} data default data to send to api
 * @return {Object} default promise (success or error)
 */
Orkaisse.prototype.order = function (data) {
  // default statement
  return this.process('order', null, data);
};

/**
 * Set ticket to prepare but no paid
 *
 * @param {Object} data default data to send to api
 * @return {Object} default promise (success or error)
 */
Orkaisse.prototype.prepare = function (data) {
  // default statement
  return this.process('prepare', 'sale', data);
};

/**
 * Set receipt to paid but and retrived by client
 *
 * @param {Object} data default data to send to api
 * @return {Object} default promise (success or error)
 */
Orkaisse.prototype.paid = function (data) {
  // default statement
  return this.process('paid', 'sale', data);
};

/**
 * Cancel a receipt
 *
 * @param {Object} data default data to send to api
 * @return {Object} default promise (success or error)
 */
Orkaisse.prototype.cancel = function (data) {
  // default statement
  return this.process('cancel', 'sale', data);
};

/**
 * Default method to build an object from okaisse factory
 *
 * @param {String} action action to use for building
 * @param {Object} data data to use for building
 * @return {Boolean|Object} false if an error occured, otherwise builded object
 */
Orkaisse.prototype.build = function (action, data) {
  // has given action ? and is a function ?
  if (_.isFunction(this.factory[action])) {
    // valid statement
    return this.factory[action](data);
  }
  // invalid statement
  return false;
};

/**
 * Default process method
 *
 * @param {String} action action default action to use on core process
 * @param {String} pre if we must provide an a prefix on action
 * @param {Object} data data to use on given request
 * @return {Object} default promise to catch
 */
Orkaisse.prototype.process = function (action, pre, data) {
  // create a deferred process
  var deferred = Q.defer();
  // default statement
  this.core.process(this.schema.get(action),
    pre ? [ pre, action ].join('/') : action, this.endpoint, data).then(function (success) {
    // has error ?
    if (_.includes(this.schema.getStatusCodes(true), success.status) && success.status !== 0) {
      // log message
      this.logger.error([ '[ Orkaisse.process ] - An error occured :',
                          this.schema.getStatusCodesMessage(success.status) ].join(' '));
    }
    // resolve response
    deferred.resolve(success);
  }.bind(this)).catch(function (error) {
    // reject process
    deferred.reject(error);
  });

  // default promise
  return deferred.promise;
};

// Default export
module.exports = function (l) {
  // is a valid logger ?
  if (_.isUndefined(l) || _.isNull(l)) {
    // warning message
    logger.warning([ '[ YoctoOrika.Orkaisse.constructor ] -',
                     'Invalid logger given. Use internal logger' ].join(' '));
    // assign
    l = logger;
  }

  // default statement
  return new (Orkaisse)(l);
};
