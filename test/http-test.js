/**
 * Unit tests
 */
var chai    = require('chai').assert;
var expect  = require('chai').expect;
var _       = require('lodash');
var utils   = require('yocto-utils');
var logger  = require('yocto-logger');

// disable console
logger.disableConsole();

/**
 * Define shema module here
 */
var modules = {
  orkaisse : {
    invalid   : {
      label : 'Must reject all request',
      value : [ 'order', 'prepare', 'paid', 'cancel' ]
    },
    objformat : {
      label : 'Must contains keys given on initial CIT (Request only)',
      value : [ 'order', 'prepare', 'paid', 'cancel' ],
      items : {
        order   : [ 'idm', 'dt', 'idtrs', 'idcli', 'items', 'vouchers' ],
        prepare : [ 'idm', 'dt', 'idtrs', 'idcli', 'idtkt', 'items', 'vouchers' ],
        paid    : [ 'idm', 'dt', 'idtrs', 'idtkt', 'netttc', 'payments' ],
        cancel  : [ 'idm', 'dt', 'idtrs', 'idcli', 'idtkt' ]
      }
    }
  }
};

// process schema
describe('Http ->', function() {

  

  // parse each module
  _.forOwn(modules, function (ms, keys) {
    _.forOwn(ms, function (m, key) {
      // describe build module
      describe([ [ _.capitalize(keys), '->', _.capitalize(key), '->' ].join(' '),
                   m.label
                 ].join(' '), function() {

        // parse method
        modules[keys][key].value.forEach(function(m) {
          it([ 'For method :', utils.obj.inspect(m) ].join(' ') , function() { 

          });
        });
      });
    });
  });
});