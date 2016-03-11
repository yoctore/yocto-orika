'use strict';

var logger    = require('yocto-logger');
var _         = require('lodash');
var joi       = require('joi');
var utils     = require('yocto-utils');

function YoctoOrika (l) {
  /**
   * Default logger instance
   */
  this.logger = l;

  /**
   * Default config object
   */
  this.config = {
    https   : false,
    host    : '',
    port    : 80,
    user    : '',
    pwd     : ''
  };

  /**
   * @type String
   *
   * Current version of api
   */
  this.version = '1.0.3';

  /**
   * Default included modules
   */
  this.modules = {
    orkaisse : require('./api/modules/orkaisse/')(logger)
  };
}

/**
 * Default method to display current api versions
 *
 * @param {String} inspect set to true to display versions as a node inspect value
 * @return {String|Object} current versions
 */
YoctoOrika.prototype.versions = function (inspect) {
  // normalize toObject properties
  inspect = _.isBoolean(inspect) ? inspect : false;
  // default version object
  var versions = {
    api : this.version
  };

  // init module
  _.forOwn(this.modules, function (value, key) {
    // setup each module to use current config
    _.merge(versions, _.set({}, key, this.modules[key].version));
  }.bind(this));

  // default statement
  return inspect ? utils.obj.inspect(versions) : versions;
};

/**
 * Default init method to setup api
 *
 * @param {String} user default user to use
 * @param {String} password default password to use
 * @param {String} host default host to use
 * @param {Number} port default port to use
 * @param {Boolean} https set to true to use an https request
 * @return {Boolean} true if all is ok false otherwise
 */
YoctoOrika.prototype.init = function (user, password, host, port, https) {
  // default config object to validate
  var config = _.merge(_.clone(this.config), {
    user  : user,
    pwd   : password,
    host  : host,
    port  : port,
    https : https
  });

  // validation schema
  var schema = joi.object().keys({
    https : joi.boolean().required(),
    host  : joi.string().required().empty(),
    port  : joi.alternatives().when('https', {
      is        : true,
      then      : 443,
      otherwise : 80
    }),
    user  : joi.string().required().empty(),
    pwd   : joi.string().required().empty()
  }).allow([ 'https', 'host', 'port', 'user', 'pwd' ]);

  // validate currenr schema
  var validate = joi.validate(config, schema, { abortEarly : false });

  // has error ?
  if (!_.isEmpty(validate.error)) {

    // log error message
    this.logger.error([ '[ YoctoOrika.init ] - Cannot validate config :',
                        validate.error ].join(' '));
    // invalid statement
    return false;
  }

  // override host value
  validate.value.host = [ (validate.value.https ? 'https' : 'http'),
                          '://', validate.value.host, ':', validate.value.port ].join('');

  // remove unused property
  delete validate.value.https;

  // change config value
  this.config = validate.value;

  // init module
  _.forOwn(this.modules, function (value, key) {
    // setup each module to use current config
    this.modules[key].init(this.config);
  }.bind(this));

  // log version info
  this.logger.debug([ '[ YoctoOrika.init ] - available module are :',
                      this.versions(true) ].join(' '));

  // default & valid statement
  return true;
};

/**
 * Default method to check if API is Ready
 *
 * @return {Boolean} true if all is ok false otherwise
 */
YoctoOrika.prototype.isReady = function () {
  // validation schema
  var schema = joi.object().keys({
    host  : joi.string().required().empty(),
    port  : joi.number().required(),
    user  : joi.string().required().empty(),
    pwd   : joi.string().required().empty()
  }).allow([ 'host', 'port', 'user', 'pwd' ]);

  // validate currenr schema
  var validate = joi.validate(this.config, schema, { abortEarly : false });

  // has error ?
  if (!_.isEmpty(validate.error)) {
    // log error message
    this.logger.error([ '[ YoctoOrika.isReady ] - API is not ready, use init method first :',
                         validate.error ].join(' '));
    // invalid statement
    return false;
  }

  // default statement
  return true;
};

/**
 * Default orkaisse accessor
 *
 * @return {Object} current orkaisse object
 */
YoctoOrika.prototype.orkaisse = function () {
  // default statement
  return this.modules.orkaisse;
};

// Default export
module.exports = function (l) {
  // is a valid logger ?
  if (_.isUndefined(l) || _.isNull(l)) {
    // warning message
    logger.warning('[ YoctoOrika.constructor ] - Invalid logger given. Use internal logger');
    // assign
    l = logger;
  }

  // default statement
  return new (YoctoOrika)(l);
};
