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
}

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
        replacement : joi.object().optional().keys({
          ean     : joi.string().required().trim().empty().min(13).max(13),
          puvttc  : joi.number().required().min(0).precision(2)
        })
      })),
      vouchers  : joi.array().optional().items(joi.object().required().keys({
        ean         : joi.string().required().trim().empty().min(13).max(13),
        typ         : joi.number().required().valid([ 0, 1 ])
      })),
      netttc    : joi.number().required().positive().precision(2),
      payments  : joi.array().required().items(joi.object().required().keys({
        idreg   : joi.number().required().min(1),
        mntttc  : joi.number().required().min(0).precision(2)
      }))
    },
    response  : {
      status    : joi.number().required().valid([ 0, 1 ]),
      retour    : joi.number().required().valid([ 0, 1, 2 ]),
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
        puvttc  : joi.number().required().min(0).precision(2),
        netttc  : joi.number().required().min(0).precision(2),
        netht   : joi.number().required().min(0).precision(2),
        mntavg  : joi.number().required().min(0).precision(2)
      })),
      lots      : joi.array().optional().items(joi.object().required().keys({
        idlot     : joi.string().required().trim().empty(),
        articles  : joi.array().required().items(joi.object().required().keys({
          ean : joi.string().required().trim().empty().min(13).max(13),
          qte : joi.number().required().min(0)
        }))
      }))
    },
    rules     : {
      order   : {
        request   : [ 'idm', 'dt', 'idtrs', 'idcli', 'items', 'vouchers' ],
        response  : [ 'status', 'idm', 'dt', 'idtrs', 'idcli',
                      'idtkt', 'netttc', 'netht', 'mntavg', 'items', 'lots' ]
      },
      prepare : {
        request   : [ 'idm', 'dt', 'idtrs', 'idcli', 'idtkt', 'items', 'vouchers' ],
        response  : [ 'status', 'idm', 'dt', 'idtrs', 'idcli',
                      'idtkt', 'netttc', 'mntavg', 'items' ]
      },
      paid    : {
        request   : [ 'idm', 'dt', 'idtrs', 'idtkt', 'netttc', 'payments' ],
        response  : [ 'status', 'retour' ]
      },
      cancel  : {
        request   : [ 'idm', 'dt', 'idtrs', 'idcli', 'idtkt' ],
        response  : [ 'status', 'retour' ]
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

  // has key so process next process
  var schema = {
    request   : _.pick(schemas.request, schemas.rules[name].request),
    response  : _.pick(schemas.response, schemas.rules[name].response)
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
