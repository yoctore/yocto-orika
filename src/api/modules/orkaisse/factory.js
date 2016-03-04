'use strict';

var logger    = require('yocto-logger');
var _         = require('lodash');
var moment    = require('moment');

/**
 * Default orkaisse factory module  - build data for current
 */
function OrkaisseFactory (l) {
  /**
   * Default logger instance
   */
  this.logger   = l;
}

/**
 * Default factory method to build an order project
 *
 * @param {Integer} shop shop to use
 * @param {String} transaction transaction identifier to use on current object
 * @param {String} client client identifier to use on current object
 * @param {Array} items list of items to use on current object
 * @param {Array} vouchers list of vouchers to use on current object
 * @return {Object} order object to use on request
 */
OrkaisseFactory.prototype.order = function (shop, transaction, client, items, vouchers) {
  // default object to build
  return {
    idm       : shop || 0,
    dt        : moment().format('YYYY-MM-DD'),
    idtrs     : transaction || '',
    idcli     : client || '',
    items     : items || [],
    vouchers  : vouchers || []
  };
};

/**
 * Default factory method to build a prepare object
 *
 * @param {Integer} shop shop to use
 * @param {String} transaction transaction identifier to use on current object
 * @param {String} client client identifier to use on current object
 * @param {String} receipt receipt identifier to use on current object
 * @param {Array} items list of items to use on current object
 * @param {Array} vouchers list of vouchers to use on current object
 * @return {Object} order object to use on request
 */
OrkaisseFactory.prototype.prepare = function (shop, transaction, client, receipt, items, vouchers) {
  // default statement an merge action
  return _.merge({ idtkt : receipt || '' }, this.order(shop, transaction, client, items, vouchers));
};

/**
 * Default factory method to build a paid object
 *
 * @param {Integer} shop shop to use
 * @param {String} transaction transaction identifier to use on current object
 * @param {String} receipt receipt identifier to use on current object
 * @param {Integer} ttc ttc value to use on current object
 * @param {Interger} payments payment method identifier to use on current object
 * @return {Object} order object to use on request
 */
OrkaisseFactory.prototype.paid = function (shop, transaction, receipt, ttc, payments) {
  // default statement
  return _.merge({
    netttc    : ttc || 0,
    payments  : payments || 0
  }, _.pick(this.prepare(shop, transaction, null, receipt), [ 'idm', 'dt', 'idtrs', 'idtkt' ]));
};

/**
 * Default factory method to build a cancel object
 *
 * @param {Integer} shop shop to use
 * @param {String} transaction transaction identifier to use on current object
 * @param {String} client client identifier to use on current object
 * @param {String} receipt receipt identifier to use on current object
 * @return {Object} order object to use on request
 */
OrkaisseFactory.prototype.cancel = function (shop, transaction, client, receipt) {
  // default statement
  return _.pick(this.prepare(shop, transaction, client, receipt), [
    'idm', 'dt', 'idtrs', 'idcli', 'idtkt'
  ]);
};

// Default export
module.exports = function (l) {
  // is a valid logger ?
  if (_.isUndefined(l) || _.isNull(l)) {
    // warning message
    logger.warning([ '[ YoctoOrika.OrkaisseFactory.constructor ] -',
                     'Invalid logger given. Use internal logger' ].join(' '));
    // assign
    l = logger;
  }

  // default statement
  return new (OrkaisseFactory)(l);
};
