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
    valid   : {
      label : 'Must be found / an object',
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
  },
  orkarte : {
    valid   : {
      label : 'Must be found / an object',
      value : [ 'getClient' ]
    },
    objformat : {
      label : 'Must contains keys given on initial CIT (Request only)',
      value : [ 'getClient' ],
      items : {
        getClient   : [ 'idcli' ]
      }
    }
  }
};

// process schema
describe('Factory ->', function() {
  // parse each module
  _.forOwn(modules, function (ms, keys) {
    _.forOwn(ms, function (m, key) {
      // describe build module
      describe([ [ _.capitalize(keys), '->', _.capitalize(key), '->' ].join(' '),
                   m.label
                 ].join(' '), function() {
        // require module
        var r = require([ '../src/api/modules', keys.toLowerCase(), 'factory' ].join('/'))(logger);
        // parse method
        modules[keys][key].value.forEach(function(m) {
          it([ 'For method :', utils.obj.inspect(m) ].join(' ') , function() {
            // function must exist
            expect(r[m]).to.be.a.function;
            // get valid schema
            var result = r[m]();

            // is for key === valid ?
            if (key === 'valid') {
              // assertion test
              expect(result).to.be.not.boolean;
              chai.typeOf(result, 'object');
              expect(result).to.be.not.empty;
            }
            // is for key === invalid ?
            if (key === 'invalid') {
              expect(result).to.not.boolean;
              chai.typeOf(result, 'object');
              expect(result).to.be.empty;
            }

            if (key === 'objformat') {
              expect(result).to.be.not.boolean;
              chai.typeOf(result, 'object');
              expect(result).to.be.not.empty;

              // request test
              _.each(modules[keys][key].items[m], function (i) {
                expect(result).to.have.property(i);
                expect(Object.keys(result))
                  .to.have.length(modules[keys][key].items[m].length);
              })
            }
          });
        });
      });
    });
  });
});
