'use strict';

var joi     = require('joi');
var logger  = require('yocto-logger');
var _       = require('lodash');
var Q       = require('q');
var utils   = require('yocto-utils');
var request = require('request');

/**
 * Default core class. Prepare / process & send request with given data
 */
function ApiRequest (l) {
  /**
   * Default logger instance
   */
  this.logger   = l;
}

/**
 * Default method to prepare request before orika api call
 *
 * @param {String} host host to call
 * @param {Object} data default data to use on request
 * @return {Boolean} true if all is ok false otherwise
 */
ApiRequest.prototype.prepare = function (host, data) {
  // default validation schema
  var schema = joi.object().keys({
    user    : joi.string().required().empty(),
    pwd     : joi.string().required().empty(),
    data    : joi.object().required().min(1),
    // Used only for orkarte
    action  : joi.string().optional().empty()
  }).allow([ 'user', 'pwd', 'data' ]);

  // validate currenr schema
  var validate = joi.validate(data, schema, { abortEarly : false });

  // has error ?
  if (!_.isEmpty(validate.error) || !_.isString(host) || _.isEmpty(host)) {
    // log error message
    this.logger.error([ '[ YoctoOrika.ApiRequest.prepare ] - Invalid data given :',
                         validate.error || 'host is invalid' ].join(' '));
    // invalid statement
    return false;
  }

  // default statement
  return true;
};

/**
 * Default method to process a request on end api
 *
 * @param {String} host given host to use
 * @param {String} endpoint given endpoint to use
 * @param {String} method given method to use
 * @param {Object} required config params given by config class
 * @param {Object} data data to send on request
 * @return {Object} default promise to use on the end of request
 */
ApiRequest.prototype.process = function (host, endpoint, method, required, data) {
  // create async process
  var deferred = Q.defer();

  // normalize host
  host = [ host, endpoint, method ].join('/');
  // default merged data to use
  data = _.merge(_.clone(required), { data : data });
  // prepare request
  if (this.prepare(host, data)) {
    // debug message
    this.logger.debug([ '[ YoctoOrika.ApiRequest.process ] - Processing a POST request to :',
                         host, 'with data below :', utils.obj.inspect(data) ].join(' '));
    // process request
    request({
      json    : true,
      method  : 'POST',
      uri     : host,
      body    : data
    }, function (error, response, body) {
      // log response before validation
      this.logger.debug([ '[ YoctoOrika.ApiRequest.process ] -',
                          'Receiving response with data below :',
                          utils.obj.inspect(body) ].join(' '));
      // add test to check if all is ok for next process
      if (!error && response && _.has(response, 'statusCode') && response.statusCode === 200) {
        // return with correct data
        deferred.resolve(body);
      } else {
        // normalize error
        error = error || [
          response.statusCode     || 'Cannot find request status message',
          response.statusMessage  || 'Cannot find request message'
        ].join(' ');

        // log message
        this.logger.error([ '[ YoctoOrika.ApiRequest.process ] - Http request error :',
                            error ].join(' '));
        // reject with data
        deferred.reject(error);
      }
    }.bind(this));
  } else {
    // log error
    this.logger.error([ '[ YoctoOrika.ApiRequest.process ] - Cannot process request for', method,
                        'method.', 'Cannot prepare data with given value :',
                        utils.obj.inspect(_.values(arguments))
                      ].join(' '));
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
    logger.warning([ '[ YoctoOrika.ApiRequest.constructor ] -',
                     'Invalid logger given. Use internal logger' ].join(' '));
    // assign
    l = logger;
  }

  // default statement
  return new (ApiRequest)(l);
};
