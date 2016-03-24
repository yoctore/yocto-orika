'use strict';

var logger    = require('yocto-logger');
var _         = require('lodash');
var joi       = require('joi');
var Q         = require('q');
var utils     = require('yocto-utils');

/**
 * Default Orkia API core module - Provide required data to any orika request
 */
function OrikaCore (l) {
  /**
   * Default logger instance
   */
  this.logger   = l;

  /**
   * Default host to give request process
   *
   * @type {String}
   */
  this.host     = '';

  /**
   * Default required params to include on request
   *
   * @type {Object}
   */
  this.required = {};

  /**
   * Default module state
   *
   * @type {Boolean}
   */
  this.state    = false;

  /**
   * Default core request to send api
   */
  this.request    = require('../core/request')(l);
}

/**
 * Default init method to init orkaisse module
 *
 * @param {Object} config default config object to use on current api
 * @return {Boolean} true if all is ok false otherwise
 */
OrikaCore.prototype.init = function (config) {
  // validation schema
  var schema = joi.object().keys({
    host  : joi.string().required().empty(),
    port  : joi.number().required(),
    user  : joi.string().required().empty(),
    pwd   : joi.string().required().empty()
  }).allow([ 'host', 'port', 'user', 'pwd' ]);

  // validate currenr schema
  var validate = joi.validate(config, schema, { abortEarly : false });

  // has error ?
  if (!_.isEmpty(validate.error)) {
    // log error message
    this.logger.error([ '[ YoctoOrika.OrikaCore.init ] - Invalid config given :',
                         validate.error ].join(' '));
    // invalid statement
    return false;
  }

  // assign given host
  this.host     = validate.value.host;
  // remove host
  delete validate.value.host;
  // remove port
  delete validate.value.port;

  // assign given required params
  this.required = validate.value;

  // default statement
  return true;
};

/**
 * Give currnet module state
 *
 * @return {Boolean} true if module is ready to use false otherwise
 */
OrikaCore.prototype.isReady = function () {
  // default statement
  return this.state;
};

/**
 * Default process method
 *
 * @param {Object} schema default schema to use on request
 * @param {String} action action default action to use on core process
 * @param {String} endpoint endpoint to use on request
 * @param {Object} data data to use on given request
 * @return {Object} default promise to catch
 */
OrikaCore.prototype.process = function (schema, action, endpoint, data) {
  // create defer process
  var deferred = Q.defer();

  // is a valid schema ?
  if (schema) {
    // validate givent data
    var validate = joi.validate(data, schema.request, { abortEarly : false });
    // no error ?
    if (!validate.error) {
      // process core request
      this.request.process(this.host, endpoint, action,
                           this.required, validate.value).then(function (success) {
        // validate current schema
        validate = joi.validate(success, schema.response, { abortEarly : false });

        // has no error on response (structure only) ?
        if (!validate.error) {
          // check if status === 0 (no errors)
          if (validate.value.status === 0) {
            // resolve with success response
            deferred.resolve(validate.value);
          } else {
            // log error
            this.logger.error([ '[ YoctoOrika.OrikaCore.process ] -',
                                'Remove api return an invalid status  : ',
                                utils.obj.inspect(validate.value.errors)
                              ]);
            // reject
            deferred.reject(validate.value.errors || []);
          }
        } else {
          // error message
          this.logger.error([ '[ YoctoOrika.OrikaCore.process ] -',
                              'Invalid reponse givent from action :',
                              action, ':', validate.error ].join(' '));
          // reject with error message
          deferred.reject(validate.error);
        }
      }.bind(this)).catch(function (error) {
        // log error
        this.logger.error([ '[ YoctoOrika.OrikaCore.process ] - Cannot process',
                            action, 'request with given data.' ].join(' '));
        // reject with error
        deferred.reject(error);
      }.bind(this));
    } else {
      // error message
      this.logger.error([ '[ YoctoOrika.OrikaCore.process ] - Cannot process',
                            action, ':', validate.error ].join(' '));
      // reject with error
      deferred.reject(validate.error);
    }
  } else {
    // reject from given action
    this.logger.error([ '[ YoctoOrika.OrikaCore.process ] - Cannot get schema for',
                      action, 'method' ].join());
    // reject
    deferred.reject();
  }

  // default statement
  return deferred.promise;
};

// Default export
module.exports = function (l) {
  // is a valid logger ?
  if (_.isUndefined(l) || _.isNull(l)) {
    // warning message
    logger.warning([ '[ YoctoOrika.OrikaCore.constructor ] -',
                     'Invalid logger given. Use internal logger' ].join(' '));
    // assign
    l = logger;
  }

  // default statement
  return new (OrikaCore)(l);
};
