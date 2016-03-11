/**
 * Unit tests
 */
var chai    = require('chai').assert;
var expect  = require('chai').expect;
var should  = require('chai').should();
var _       = require('lodash');
var utils   = require('yocto-utils');
var logger  = require('yocto-logger');
var nock    = require('nock');
var moment  = require('moment');
var api     = require('../src')(logger);

// disable console
logger.disableConsole();


var host      = 'www.example.com';
var user      = 'user';
var password  = 'password';

/**
 * Define shema module here
 */
var modules = {
  orkaisse : {
    order : {
      label   : 'Must be valid for an order request',
      method  : 'order',
      url     : '/orkaisse/drive/api',
      request : {
        method : 'POST',
        body : {
          idm   : 1,
          idtrs : '123132',
          idcli : '1234567894561',
          items : [ { ean : '1234567894561', qte : 5, typ : 1 } ]
        }
      },
      response : {
        status  : 200,
        body    : {
          idm     : 1,
          dt      : moment().format('YYYY-MM-DD'),
          idtrs   : '123132',
          idcli   : '1234567894561',
          idtkt   : '111111111111111111111111',
          netttc  : 8.89,
          mntavg  : 2.36,
          items   : [ { ean : '1234567894561', qte : 5, typ : 1, puvttc : 4.33, netttc : 1, mntavg : 3 } ],
          lots    : [ { idlot : "3", articles : [ { ean : '1234567894561', qte : 1 } ] }  ]
        }
      },
      keys   : [ 'idm', 'dt', 'idtrs', 'idcli', 'items', 'vouchers' ]
    }
  }
};

// process config before
var req = nock('http://'+host);

_.forOwn(modules, function (value, key) {
  _.forOwn(value, function (m, k) {
    req.intercept([ m.url, m.method ].join('/'), m.request.method).reply(m.response.status, m.response.body);
  })
});

// process schema
describe('Http ->', function() {
  describe('Setup ->', function () {
    it('Init expect to be valid before requests', function() {
      var res = api.init(user, password, host);
      expect(res).to.be.a('boolean');
      expect(res).equal(true);
    });
  
    it('Expect app is ready before requests', function() {
      var res = api.isReady();
      expect(res).to.be.a('boolean');
      expect(res).equal(true);
    });
  });

  describe('Requests ->', function () {
    // parse each module
    _.forOwn(modules, function (ms, keys) {
      _.forOwn(ms, function (m, k) {
        it([ _.capitalize(keys), '->', k, ': Process a [', m.request.method, '] request on',
            [ m.url, m.method ].join('/'),
            'must have a valid key for request and response and succeed to validator rules'
           ].join(' '), function(done) {
          // setup modules
          var mms = api[keys]();

          mms[m.method](m.request.body).then(function (success) {
            expect(success).to.be.a('object');
            done();
          });
        });
      });
    });
  });
});
