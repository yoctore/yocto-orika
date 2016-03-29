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
      label : 'Must be found / an object / have resquest & response property',
      value : [ 'order', 'prepare', 'paid', 'cancel' ]
    },
    invalid : {
      label : 'Must be not found and return false statement',
      value : utils.unit.generateTypeForUnitTests(null, 1)
    },
    reqschema : {
      label : 'Must contains keys gived on initial CIT (Request only)',
      value : [ 'order', 'prepare', 'paid', 'cancel' ],
      items : {
        order   : [ 'idm', 'dt', 'idtrs', 'idcli', 'items', 'vouchers' ],
        prepare : [ 'idm', 'dt', 'idtrs', 'idcli', 'idtkt', 'items', 'vouchers', 'puvttc' ],
        paid    : [ 'idm', 'dt', 'idtrs', 'idtkt', 'netttc', 'payments' ],
        cancel  : [ 'idm', 'dt', 'idtrs', 'idcli', 'idtkt' ]
      }
    },
    resschema : {
      label : 'Must contains keys gived on initial CIT (Response only)',
      value : [ 'order', 'prepare', 'paid', 'cancel' ],
      items : {
        order   : [ 'status', 'idm', 'dt', 'idtrs', 'idcli', 'idtkt', 'netttc', 'netht', 'mntavg', 'items', 'lots' ],
        prepare : [ 'status', 'idm', 'dt', 'idtrs', 'idcli', 'idtkt', 'netttc', 'mntavg', 'items' ],
        paid    : [ 'status', 'retour' ],
        cancel  : [ 'status', 'retour' ]
      }
    }
  }
};

// process schema
describe('Schema ->', function() {
  // parse each module
  _.forOwn(modules, function (ms, keys) {

    _.forOwn(ms, function (m, key) {
      // describe build module
      describe([ [ _.capitalize(keys), '->', _.capitalize(key), '->' ].join(' '),
                   m.label
                 ].join(' '), function() {
        // require module
        var r = require([ '../src/api/modules', keys.toLowerCase(), 'schema' ].join('/'))(logger);
        // parse method
        modules[keys][key].value.forEach(function(m) {
          it([ 'For method :', utils.obj.inspect(m) ].join(' ') , function() { 
            // get valid schema
            var result = r.get(m);
            // is for key === valid ?
            if (key === 'valid') {
              // assertion test
              expect(result).to.be.not.boolean;
              chai.typeOf(result, 'object');
              expect(result).to.be.not.empty;
              expect(result).to.have.property('request');
              expect(result).to.have.property('response');
            }
            // is for key === invalid ?
            if (key === 'invalid') {
              expect(result).to.be.boolean;
              expect(result).to.equal(false);
            }
            // is for key === schema ?
            if (key === 'reqschema' || key === 'resschema') {
              // internal test key
              var ckey = (key === 'reqschema' ? 'request' : 'response');
              // assertion test
              expect(result).to.be.not.boolean;
              chai.typeOf(result, 'object');
              expect(result).to.be.not.empty;
              expect(result).to.have.property('request');
              expect(result).to.have.property('response');

              // request test
              _.each(modules[keys][key].items[m], function (i) {
                expect(result[ckey]).to.have.property(i);
                expect(Object.keys(result[ckey]))
                  .to.have.length(modules[keys][key].items[m].length);
              })
            }
          });
        });
      });
    });
  });
});