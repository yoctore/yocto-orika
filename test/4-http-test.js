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
          items : [ { ean : '1234567894561', qte : 5, puvttc : 1.40 } ]
        }
      },
      response : {
        status  : 200,
        body    : {
         "status": 0,
         "data": {
           "idtkt": "904140506383357026a5e98c",
           "lots": [
             {
               "qte": 4,
               "idlot": "4001181500003",
               "ean": "1013790000005"
             },
             {
               "qte": 2,
               "idlot": "4001181500003",
               "ean": "1035370000007"
             }
           ],
           "items": [
             {
               "qte": 4,
               "netttc": 140,
               "ean": "1013790000005",
               "netht": 75.88,
               "mntavg": 46.67,
               "puvttc": 35,
               "txtva": 0.085,
               "mnttva": 0.84
             },
             {
               "qte": 2,
               "netttc": 70,
               "ean": "1035370000007",
               "netht": 37.94,
               "mntavg": 23.33,
               "puvttc": 35,
               "txtva": 0.085,
               "mnttva": 0.84
             },
             {
               "qte": 2,
               "netttc": 60,
               "ean": "1036550000008",
               "netht": 48.78,
               "mntavg": 0,
               "puvttc": 30,
               "txtva": 0.085,
               "mnttva": 0.84
             }
           ],
           "idtrs": "57026a5e98c00a8c15282571",
           "idcli": "1231231231230",
           "idm": 70,
           "mntavg": 70,
           "netht": 162.6,
           "dt": "2016-04-14",
           "netttc": 200,
           "tva": [
            {
              "totalTTC": "5.00",
              "taux": "8.50",
              "totalHT": "4.61",
              "montant": "0.39"
            }],
            "vouchers" : [
              {
                ean : "1234567891234",
                typ : 1,
                mnt : 659
              }
            ]
         }
        }
      }
    },
    prepare : {
      label   : 'Must be valid for a prepare request',
      method  : 'prepare',
      sub     : 'sale',
      url     : '/orkaisse/drive/api',
      request : {
        method : 'POST',
        body : {
          idm   : 1,
          dt    : moment().format('YYYY-MM-DD'),
          idtrs : '123132',
          idcli : '1234567894561',
          items : [ { ean : '1234567894561', qte : 5, puvttc : 1.40 } ]
        }
      },
      response : {
        status  : 200,
        body    : {
          "status": 0,
          "data": {
            "idtkt": "904150100074957026a5e98c",
            "lots": [
              {
                "qte": 3,
                "idlot": "1000910017-2",
                "ean": "3168930000679"
              },
              {
                "qte": 1,
                "idlot": "1000910017-2",
                "ean": "7613032702410"
              }
            ],
            "items": [
              {
                "qte": 1,
                "netttc": 2.65,
                "ean": "7613032702410",
                "netht": 2.6,
                "mntavg": 0,
                "puvttc": 2.65,
                "txtva": 0.085,
                "mnttva": 0.84
              },
              {
                "qte": 3,
                "netttc": 4.98,
                "ean": "3168930000679",
                "netht": 4.88,
                "mntavg": 0,
                "puvttc": 1.66,
                "txtva": 0.085,
                "mnttva": 0.84
              },
              {
                "qte": -3,
                "netttc": -4.98,
                "ean": "3168930000679",
                "netht": -4.88,
                "mntavg": 0,
                "puvttc": 1.66,
                "txtva": 0.085,
                "mnttva": 0.84
              },
              {
                "qte": 3,
                "netttc": 31.2,
                "ean": "3168930000679",
                "netht": 30.56,
                "mntavg": 0,
                "puvttc": 10.4,
                "txtva": 0.085,
                "mnttva": 0.84
              }
            ],
            "idtrs": "57026a5e98c00a8c15282572",
            "idcli": "1231231231230",
            "idm": 901,
            "mntavg": 0,
            "netht": 33.16,
            "dt": "2016-04-15",
            "netttc": 33.85,
            "tva": [
            {
              "totalTTC": "5.00",
              "taux": "8.50",
              "totalHT": "4.61",
              "montant": "0.39"
            }],
            "vouchers" : [
              {
                ean : "1234567891234",
                typ : 1,
                mnt : 659
              }
            ]
          }
        }
      }
    },
    paid : {
      label   : 'Must be valid for a paid request',
      method  : 'paid',
      sub     : 'sale',
      url     : '/orkaisse/drive/api',
      request : {
        method : 'POST',
        body : {
          idm   : 1,
          dt    : moment().format('YYYY-MM-DD'),
          idtrs : '123132',
          idtkt : '111111111111111111111111',
          netttc  : 8.89,
          payments : [ { idreg : 8, mntttc : 3.78 }]
        }
      },
      response : {
        status  : 200,
        body    : {
          status  : 0
        }
      }
    },
    cancel : {
      label   : 'Must be valid for a cancel request',
      method  : 'cancel',
      sub     : 'sale',
      url     : '/orkaisse/drive/api',
      request : {
        method : 'POST',
        body : {
          idm   : 1,
          dt    : moment().format('YYYY-MM-DD'),
          idtrs : '123132',
          idcli   : '1234567894561',
          idtkt : '111111111111111111111111'
        }
      },
      response : {
        status  : 200,
        body    : {
          status  : 105
        }
      }
    }
  },
  orkarte : {
    getClient : {
      label   : 'Must be valid for an order request',
      method  : 'getClient',
      url     : '/orkarte/api',
      request : {
        method : 'POST',
        body : {
          idcli : '1234567894561'
        }
      },
      response : {
        status  : 200,
          body    : {
          "status": 0,
          "data": {
          idcli      : "123456123456",
          etat       : 1,
          idm        : 11,
          idtcrt     : 1,
          dtdist     : '2016-04-08',
          nom        : 'toto',
          prenom     : 'tata',
          cin        : '495635465',
          civ        : 0,
          dtnai      : '2016-04-08',
          nenf       : 0,
          test       : 0,
          tel        : '0',
          tel2       : '1',
          gsm        : '11',
          fax        : '11',
          email      : 'aaa@aa.fr',
          adr1       : '',
          adr2       : '',
          adr3       : '',
          cp         : '',
          ville      : 'tptp',
          pays       : 'France',
          seg        : 9,
          phoning    : 1,
          phoning2   : 1,
          emailing   : 1,
          emailing2  : 1,
          crtenv     : 1,
          pbadr      : 1,
          dblfam     : 1,
          envsms     : 1,
          envemail   : 1,
          sitfam     : 1,
          com        : 'aa',
          dtcre      : '2016-04-08 11:11:11',
          dtmod      : '2016-04-08 11:11:11',
          catsoc     : 4,
          texting    : 0,
          texting2   : 1,
          soldem     : 5,
          soldep     : 11,
          dtsolde    : '2016-04-08 11:11:11',
          enfs       : [],
          nfoyer     : 1,
          idmvis     : 1,
          tcpt       : 1,
          dcgne      : 1,
          pwd        : 'aaaaa'
         }
        }
      }
    },
    updateClient : {
      label   : 'Must be valid for an order request',
      method  : 'updateClient',
      url     : '/orkarte/api',
      request : {
        method : 'POST',
        body : {
          idcli   : '1234567894561',
          nom     : 'toto',
          prenom  : 'tata',
          idtcrt  : 1,
          idm     : 1,
          email   : 'aaa@aaa.fr'
        }
      },
      response : {
        status    : 200,
        body    : {
          status  : 0,
          data    : {}
        }
      }
    }
  }
};

// process config before
var req = nock('http://'+host+':6660');

_.forOwn(modules, function (value, key) {
  _.forOwn(value, function (m, k) {
    req.intercept(_.compact([ m.url, m.sub || false, m.method ]).join('/'), m.request.method).reply(m.response.status, m.response.body);
  });
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
            _.compact([ m.url, m.sub || false, m.method ]).join('/'),
            'must have a valid key for request and response and succeed to validator rules'
           ].join(' '), function(done) {
          // setup modules
          var mms = api[keys]();

          mms[m.method](m.request.body).then(function (success) {
            expect(success).to.be.a('object');
            done();
          }).catch(function (error) {
            console.log(error);
          });
        });
      });
    });
  });
});
