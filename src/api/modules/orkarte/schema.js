'use strict';

var logger    = require('yocto-logger');
var _         = require('lodash');
var joi       = require('joi');

var REGEXP_DATE = /^(\d{4})\-([0][1-9]|[1][0-2])\-([0][1-9]|[1-2][0-9]|[3][0-1])$/;
var REGEXP_DATETIME = /^(\d{4})\-([0][1-9]|[1][0-2])\-([0][1-9]|[1-2][0-9]|[3][0-1]) ([0-1][0-9]|[2][0-3])\:([0-5][0-9])\:([0-5][0-9])$/;

/**
 * Default Orkarte module - Provide request to Orkarte endpoint
 */
function OrkarteSchema (l) {
  /**
   * Default logger instance
   */
  this.logger   = l;
  /**
   * List of status codes
   */
  this.statusCodes  = [ {
    code      : 0,
    message   : 'Ok'
  }, {
    code      : 1,
    message   : 'Erreur inconnue / interne'
  }];
}

/**
 * An utlity method to get only message from a status code number
 *
 * @param {Number} code current code to use to retreive default message
 * @return {String} retreive message
 */
OrkarteSchema.prototype.getStatusCodesMessage = function (code) {
  // default statement
  return _.get(_.find(this.statusCodes, function (s) {
    // is wanted code ?
    return s.code === code;
  }), 'message') || [ 'Unkown message with given code :', code ].join(' ');
};
/**
 * An utility method to get current defined status code on yocto orikaisse
 *
 * @param {Boolean} list if true return complete list
 * @return {Array} list of status codes or only code is list
 */
OrkarteSchema.prototype.getStatusCodes = function (list) {
  // whant only list
  if (list) {
    // default statement for list request
    return _.map(this.statusCodes, function (s) {
      // return only code
      return s.code;
    });
  }
  // default statement
  return this.statusCodes;
};

/**
 * Default method to retrieve validation schema
 *
 * @param {String} name default name to use to get wanted schema
 * @return {Object|Boolean} valid object founded
 */
OrkarteSchema.prototype.get = function (name) {
  // list of complete schema
  var schemas = {
    request   : {
      idcli       : joi.string().required().empty(),
      etat        : joi.number().integer().optional().min(0).max(1),
      idtcrt      : joi.number().integer().required().min(0),
      idm         : joi.number().required().min(1),
      dtdist      : joi.string().regex(REGEXP_DATE).optional(),
      nom         : joi.string().required().empty(),
      prenom      : joi.string().required().empty(),
      cin         : joi.string().optional().empty(),
      civ         : joi.number().integer().optional().min(0).max(2),
      dtnai       : joi.string().regex(REGEXP_DATE).optional(),
      nenf        : joi.number().integer().optional().min(0),
      test        : joi.number().integer().optional().min(0).max(1),
      tel         : joi.string().optional().empty(),
      tel2        : joi.string().optional().empty(),
      gsm         : joi.string().optional().empty(),
      fax         : joi.string().optional().empty(),
      email       : joi.string().email().optional().empty(),
      adr1        : joi.string().optional().empty(),
      adr2        : joi.string().optional().empty(),
      adr3        : joi.string().optional().empty(),
      cp          : joi.string().optional().empty(),
      ville       : joi.string().optional().empty(),
      pays        : joi.string().optional().empty(),
      seg         : joi.number().integer().optional(),
      phoning     : joi.number().integer().optional().min(0).max(1),
      phoning2    : joi.number().integer().optional().min(0).max(1),
      emailing    : joi.number().integer().optional().min(0).max(1),
      emailing2   : joi.number().integer().optional().min(0).max(1),
      crtenv      : joi.number().integer().optional(),
      pbadr       : joi.number().integer().optional(),
      dblfam      : joi.number().integer().optional(),
      envsms      : joi.number().integer().optional(),
      envemail    : joi.number().integer().optional(),
      sitfam      : joi.number().integer().optional().min(0).max(2),
      com         : joi.string().optional().empty(),
      dtcre       : joi.string().regex(REGEXP_DATETIME).optional(),
      dtmod       : joi.string().regex(REGEXP_DATETIME).optional(),
      catsoc      : joi.number().integer().optional(),
      texting     : joi.number().integer().optional().min(0).max(1),
      texting2    : joi.number().integer().optional().min(0).max(1),
      soldem      : joi.number().integer().optional(),
      soldep      : joi.number().integer().optional(),
      dtsolde     : joi.string().regex(REGEXP_DATETIME).optional(),
      enfs        : joi.array().items(
        joi.object().keys({
          sexe  : joi.number().integer().optional().min(1).max(2),
          dtnai : joi.string().regex(REGEXP_DATE).optional()
        })
      ).optional(),
      nfoyer      : joi.number().integer().optional(),
      idmvis      : joi.number().integer().optional(),
      tcpt        : joi.number().integer().optional().min(0).max(2),
      dcgne       : joi.number().integer().optional().min(0).max(1),
      pwd         : joi.string().optional().empty(),
      // set any because the name of keys is dynamic
      cards       : joi.any()
    },
    response  : {
      status      : joi.number().required().valid(this.getStatusCodes(true)),
      idcli       : joi.string().required().empty(''),
      etat        : joi.number().integer().required().min(0).max(1).allow(null),
      idtcrt      : joi.number().integer().required().min(0).allow(null),
      idm         : joi.number().required().min(1).allow(null),
      dtdist      : joi.date().format('YYYY-MM-DD').required().allow(null),
      nom         : joi.string().required().empty('').allow(null),
      prenom      : joi.string().required().empty('').allow(null),
      cin         : joi.string().required().empty('').allow(null),
      civ         : joi.number().integer().required().min(0).max(2).allow(null),
      dtnai       : joi.date().format('YYYY-MM-DD').required().allow(null),
      nenf        : joi.number().integer().required().min(0).allow(null),
      test        : joi.number().integer().required().min(0).max(1).allow(null),
      tel         : joi.string().required().empty('').allow(null),
      tel2        : joi.string().required().empty('').allow(null),
      gsm         : joi.string().required().empty('').allow(null),
      fax         : joi.string().required().empty('').allow(null),
      email       : joi.string().email().required().empty('').allow(null),
      adr1        : joi.string().optional().empty('').allow(null).default(''),
      adr2        : joi.string().optional().empty('').allow(null).default(''),
      adr3        : joi.string().optional().empty('').allow(null).default(''),
      cp          : joi.string().optional().empty('').allow(null).default(''),
      ville       : joi.string().required().empty('').allow(null),
      pays        : joi.string().required().empty('').allow(null),
      seg         : joi.number().integer().required().allow(null),
      phoning     : joi.number().integer().required().min(0).max(1).allow(null),
      phoning2    : joi.number().integer().required().min(0).max(1).allow(null),
      emailing    : joi.number().integer().required().min(0).max(1).allow(null),
      emailing2   : joi.number().integer().required().min(0).max(1).allow(null),
      crtenv      : joi.number().integer().required().allow(null),
      pbadr       : joi.number().integer().required().allow(null),
      dblfam      : joi.number().integer().required().allow(null),
      envsms      : joi.number().integer().required().allow(null),
      envemail    : joi.number().integer().required().allow(null),
      sitfam      : joi.number().integer().required().min(0).max(2).allow(null),
      com         : joi.string().required().empty('').allow(null),
      dtcre       : joi.date().format('YYYY-MM-DD HH:mm:ss').required().allow(null),
      dtmod       : joi.date().format('YYYY-MM-DD HH:mm:ss').required().allow(null),
      catsoc      : joi.number().integer().required().allow(null),
      texting     : joi.number().integer().required().min(0).max(1).allow(null),
      texting2    : joi.number().integer().required().min(0).max(1).allow(null),
      soldem      : joi.number().integer().required().allow(null),
      soldep      : joi.number().integer().required().allow(null),
      dtsolde     : joi.date().format('YYYY-MM-DD HH:mm:ss').required().allow(null),
      enfs        : joi.array().items(
        joi.object().keys({
          sexe  : joi.number().integer().required().min(1).max(2).allow(null),
          dtnai : joi.date().format('YYYY-MM-DD').required().allow(null)
        })
      ).required().allow(null),
      nfoyer      : joi.number().integer().required().allow(null),
      idmvis      : joi.number().integer().required().allow(null),
      tcpt        : joi.number().integer().required().min(0).max(2).allow(null),
      dcgne       : joi.number().integer().required().min(0).max(1).allow(null),
      pwd         : joi.string().required().empty('').allow(null),
      // set any because the name of keys is dynamic
      cards       : joi.any().allow(null)
    },
    rules     : {
      getClient     : {
        request  : [ 'idcli' ],
        response : [ 'idcli', 'etat', 'idm', 'dtdist', 'nom', 'prenom', 'cin', 'civ', 'dtnai',
                      'nenf', 'test', 'tel', 'tel2', 'gsm', 'fax', 'email', 'adr1', 'adr2',
                      'adr3', 'cp', 'ville', 'pays', 'seg', 'phoning', 'phoning2', 'emailing',
                      'emailing2', 'crtenv', 'pbadr', 'dblfam', 'envsms', 'envemail', 'sitfam',
                      'com', 'dtcre', 'dtmod', 'catsoc', 'texting', 'texting2', 'soldem', 'soldep',
                      'dtsolde', 'enfs', 'nfoyer', 'idmvis', 'tcpt', 'dcgne', 'pwd', 'cards',
                      'status', 'idtcrt' ]
      },
      updateClient  : {
        request   : [ 'idcli', 'etat', 'idm', 'dtdist', 'nom', 'prenom', 'cin', 'civ', 'dtnai',
                      'nenf', 'test', 'tel', 'tel2', 'gsm', 'fax', 'email', 'adr1', 'adr2',
                      'adr3', 'cp', 'ville', 'pays', 'seg', 'phoning', 'phoning2', 'emailing',
                      'emailing2', 'crtenv', 'pbadr', 'dblfam', 'envsms', 'envemail', 'sitfam',
                      'com', 'dtcre', 'dtmod', 'catsoc', 'texting', 'texting2', 'soldem', 'soldep',
                      'dtsolde', 'enfs', 'nfoyer', 'idmvis', 'tcpt', 'dcgne', 'pwd', 'cards',
                      'idtcrt' ],
        response  : [ 'status' ],
      }
    }
  };

  // optionnal list rules for item
  this.optionnalSchema = {
    response : {
    }
  };

  // now find correct schema and build data
  if (!_.has(schemas.rules, name)) {
    // error message
    this.logger.error([ '[ YoctoOrika.OrkarteSchema.get ] - cannot find schema rules for ',
                        name || '"an empty name"', 'please provide a valid name' ].join(''));
    // invalid statement
    return false;
  }

  // default object
  var obj = {
    data   : joi.object().required().keys(
      _.pick(schemas.response, _.difference(_.values(schemas.rules[name].response), [ 'status' ])))
  };

  // we need to do this to override default schema with optionnal schema for a specific name rules
  if (this.optionnalSchema.response[name]) {
    // get picked
    var picked = _.pick(schemas.response,
                  _.difference(_.values(schemas.rules[name].response), [ 'status' ]));
    // Merge picked data
    _.merge(picked, this.optionnalSchema.response[name]);
    // change object
    obj.data = joi.object().required().keys(picked);
  }

  // extend correct object
  _.extend(obj, _.pick(schemas.response,
                _.intersection(schemas.rules[name].response, [ 'status' ])));

  // has key so process next process
  var schema = {
    request   : _.pick(schemas.request, schemas.rules[name].request),
    response  : joi.object().required().keys(obj)
  };

  // default statement
  return schema;
};

// Default export
module.exports = function (l) {
  // is a valid logger ?
  if (_.isUndefined(l) || _.isNull(l)) {
    // warning message
    logger.warning([ '[ YoctoOrika.OrkarteSchema.constructor ] -',
                     'Invalid logger given. Use internal logger' ].join(' '));
    // assign
    l = logger;
  }

  // default statement
  return new (OrkarteSchema)(l);
};
