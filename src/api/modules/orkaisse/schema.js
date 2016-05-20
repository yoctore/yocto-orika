'use strict';

var logger    = require('yocto-logger');
var _         = require('lodash');
var joi       = require('joi');
var moment    = require('moment');

/**
 * Default orkaisse module - Provide request to orkaisse endpoint
 */
function OrkaisseSchema (l) {
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
  }, {
    code      : 100,
    message   : 'Les formats des données reçues en entrée n\'est pas celui attendu.'
  }, {
    code      : 101,
    message   : 'Article inconnu'
  }, {
    code      : 102,
    message   : 'Numéro de client inconnu'
  }, {
    code      : 103,
    message   : 'Coupon inconnu'
  }, {
    code      : 104,
    message   : 'Code ticket inconnu'
  }, {
    code      : 105,
    message   : [ 'Problème de montant, le montant reçu ne correspond',
                              'pas à celui attendu pour le ticket' ].join(' ')
  } ];
}

/**
 * An utlity method to get only message from a status code number
 *
 * @param {Number} code current code to use to retreive default message
 * @return {String} retreive message
 */
OrkaisseSchema.prototype.getStatusCodesMessage = function (code) {
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
OrkaisseSchema.prototype.getStatusCodes = function (list) {
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
OrkaisseSchema.prototype.get = function (name) {
  // list of complete schema
  var schemas = {
    request   : {
      idm       : joi.number().required().min(1),
      dt        : joi.date().default(moment().format('YYYY-MM-DD')),
      idtrs     : joi.string().required().trim().empty(),
      idcli     : joi.string().required().trim().empty().min(13).max(13),
      idtkt     : joi.string().required().trim().empty().min(24).max(24),
      items     : joi.array().required().items(joi.object().required().keys({
        ean         : joi.string().required().trim().empty().min(13).max(13),
        qte         : joi.number().required().min(0),
        replacement : joi.array().min(1).items(joi.object().optional().keys({
          ean     : joi.string().required().trim().empty().min(13).max(13),
          puvttc  : joi.number().optional().min(0).precision(2),
          qte     : joi.number().required().min(0)
        })),
        puvttc      : joi.number().optional().min(0).precision(2)
      })),
      vouchers  : joi.array().optional().items(joi.object().required().keys({
        ean         : joi.string().required().trim().empty().min(13).max(13),
        typ         : joi.number().required().valid([ 0, 1 ])
      })),
      netttc    : joi.number().required().positive().precision(2),
      payments  : joi.array().required().items(joi.object().required().keys({
        idreg   : joi.number().required().min(1),
        mntttc  : joi.number().required().min(0).precision(2)
      })),
      itemscond : joi.array().optional().items(
        joi.object().required().keys({
          ean     : joi.string().required().trim().empty().min(13).max(13),
          qte     : joi.number().required().min(0),
          cond    : joi.string().required().empty(),
          mntcond : joi.number().optional().min(0).precision(2)
        })
      )
    },
    response  : {
      status    : joi.number().required().valid(this.getStatusCodes(true)),
      idm       : joi.number().required().min(1),
      dt        : joi.date().required().format('YYYY-MM-DD'),
      idtrs     : joi.string().required().trim().empty(),
      idcli     : joi.string().required().trim().empty().min(13).max(13),
      idtkt     : joi.string().required().trim().empty().min(24).max(24),
      netttc    : joi.number().required().min(0).precision(2),
      netht     : joi.number().required().min(0).precision(2),
      mntavg    : joi.number().required().min(0).precision(2),
      items     : joi.array().required().items(joi.object().required().keys({
        ean     : joi.string().required().trim().empty().min(13).max(13),
        qte     : joi.number().required().min(0),
        puvttc  : joi.number().optional().min(0).precision(2),
        netttc  : joi.number().required().min(0).precision(2),
        netht   : joi.number().required().min(0).precision(2),
        mntavg  : joi.number().required().min(0).precision(2)
      })),
      lots      : joi.array().optional().items(joi.object().required().keys({
        idlot   : joi.string().required().trim().empty(),
        ean     : joi.string().required().trim().empty().min(13).max(13),
        qte     : joi.number().required().min(0)
      }))
    },
    rules     : {
      order   : {
        request   : [ 'idm', 'dt', 'idtrs', 'idcli', 'items', 'vouchers', 'itemscond' ],
        response  : [ 'status', 'idm', 'dt', 'idtrs', 'idcli',
                      'idtkt', 'netttc', 'netht', 'mntavg', 'items', 'lots', 'vouchers',
                      'itemscond' ]
      },
      prepare : {
        request   : [ 'idm', 'dt', 'idtrs', 'idcli', 'items', 'vouchers' ],
        response  : [ 'status', 'idm', 'dt', 'idtrs', 'idcli',
                      'idtkt', 'netttc', 'netht', 'mntavg', 'items', 'lots', 'vouchers' ]
      },
      paid    : {
        request   : [ 'idm', 'dt', 'idtrs', 'idtkt', 'netttc', 'payments' ],
        response  : [ 'status' ]
      },
      cancel  : {
        request   : [ 'idm', 'dt', 'idtrs', 'idcli', 'idtkt' ],
        response  : [ 'status' ]
      }
    }
  };

  // optionnal list rules for item
  this.optionnalSchema = {
    response : {
      prepare : {
        items     : joi.array().required().items(joi.object().required().keys({
          ean     : joi.string().required().trim().empty().min(13).max(13),
          qte     : joi.number().required(),
          puvttc  : joi.number().optional().min(0).precision(2),
          netttc  : joi.number().required().precision(2),
          netht   : joi.number().required().precision(2),
          mntavg  : joi.number().required().min(0).precision(2)
        }))
      }
    }
  };

  // now find correct schema and build data
  if (!_.has(schemas.rules, name)) {
    // error message
    this.logger.error([ '[ YoctoOrika.OrkaisseSchema.get ] - cannot find schema rules for ',
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

  // is for cancel and paid request
  if (name === 'cancel' || name === 'paid') {
    // remove unused object
    delete obj.data;
  }

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
    logger.warning([ '[ YoctoOrika.OrkaisseSchema.constructor ] -',
                     'Invalid logger given. Use internal logger' ].join(' '));
    // assign
    l = logger;
  }

  // default statement
  return new (OrkaisseSchema)(l);
};
